const id = socket.id;
alert(id);

//頂部UI
const X1 = 50, Y1 = 50, X2 = 750, Y2 = 550, radius = 50;
const Width = 48,Height = 72;

//遊戲數據區
function initializeGameData() {
    return {                // 初始化遊戲相關資料
        attributes: 0,      // 屬性
        point_max: 0,       // 最大血量
        point: 0,           // 血量
        role: '',           // 角色名稱
        handContainer: [],  // 手牌
        fieldContainer: [], // 場地
        deckContainer: [],  // 牌組
    };
}
function initializeContainer() {
    return {                // 初始化遊戲相關資料
        handContainer: [],  // 手牌
        deckContainer: [],  // 牌組
    };
}
let gameData_E = initializeGameData();
let gameData_P = initializeGameData();
let containerE = initializeContainer();
let containerP = initializeContainer();

let battleId = null;
//let scene;
const portrait_name = ['dust_face','water_face','fire_face','wind_face'];
const card_name = ['dust','water','fire','wind'];
let circleContainer;
var focus_card = null;
var put_card_frequency = 3;
var round = 0;
const round_mind = ["我方\n回合","我方\n反擊","敵方\n回合","敵方\n反擊"];


var config = {              // 物件屬性
    type: Phaser.AUTO,      // 自動選擇為最好的渲染方式
    width: 800,             // 寬高設定
    height: 600,
    parent: 'game-container',
    scene: {                
        preload: preload,   // 加載資料
        create: create,     // 創建畫面
        update: update      // 刷新畫面
    }
};
var game = new Phaser.Game(config); // 開始一個新的 Phaser 遊戲

function preload(){
    this.load.image('front_cover','assets/front_cover.png');
    this.load.image('teach_cat','assets/teach_cat.png');
    this.load.image('cardback','assets/cardback.png');

    this.load.image('defense','assets/defense.png');
    this.load.image('attack','assets/attack.png');
    this.load.image('effect','assets/effect.png');

    this.load.image('light??','assets/light??.png');
    this.load.image('dark??','assets/dark??.png');
    for(let i=0;i<=3;i++){
        for(let j=1;j<= 3;j++)this.load.image(`${portrait_name[i]}${j}`,`assets/${portrait_name[i]}${j}.png`);
        for(let j=1;j<=13;j++)this.load.image(`${card_name[i]}${j}`,`assets/${card_name[i]}-${j}.png`);
    }
}
function create(){
    const x = 300, y = 200, width = 200, height = 50, radius = 20;
    const textData = ['電腦對戰','多人對戰','教程模式'];
    scene = this;
    this.add.image(400 , 300 , 'front_cover' );                                                                             // 背景
    this.add.graphics().fillStyle(0xc8bfe7).fillRoundedRect( 100, 50, 600, 500, 20);                                        // 介面
    this.add.text( x + width / 2, (y + height) / 2, '魔法撲克', {font: 'bold 50px Arial', fill: '#FF0000'}).setOrigin(0.5); // 標題

    for (let i = 0; i < 3; i++) {
        const _y = y + i * 100;
        const button = this.add.graphics();                                                                         // 創建按鈕的物理
        const xywhr = { x, _y, width, height, radius };                                                             // 定義基本變數
        button.fillStyle(0xFFFF00).fillRoundedRect(...Object.values(xywhr));                                        // 繪製黃色按鈕
        button.setInteractive(new Phaser.Geom.Rectangle(...Object.values(xywhr)), Phaser.Geom.Rectangle.Contains);  // 設定交互
        button.on('pointerover', () => button.fillStyle(0x0000FF, 1).fillRoundedRect(...Object.values(xywhr)));     // 移入時藍色
        button.on('pointerout' , () => button.fillStyle(0xFFFF00, 1).fillRoundedRect(...Object.values(xywhr)));     // 移出時黃色
        button.on('pointerdown', () => {                                                                            // 按鈕點擊
            for (let j = 0; j < this.children.length; j++)this.children.list[j].visible = false;                    // 將 phaser 當前所有元素隱藏
                 if (i === 0) socket.emit('computer battle');
            else if (i === 1) socket.emit('Multiplayer battle');
            else if (i === 2) socket.emit('Tutorial mode');
        });
        this.add.text(x + width / 2, _y + height / 2, textData[i], { font: 'bold 30px Arial', fill: '#000000' }).setOrigin(0.5);// 繪製文字
    }
}

function update(){
    if(battleId !== null) {
        socket.emit('update data');
        
    }
}

function drawzone(){   // 繪製場地

    
}

function createPlayerUI() {

    createUI(X1, Y1, gameData_E, false);   // 敵人
    createUI(X2, Y2, gameData_P , true);   // 玩家
    function createUI(x, y,role, is_player) {
        // 參數
        const width = 250, height = 30, interval = 5, R = 10;
        const xOff = 2 * is_player - 1;   // 1 or -1
        const X = x - width * is_player     + xOff * (interval * 2 - radius ) ;
        const Y = y + height*(is_player - 1)+ xOff * (interval * 2);
        const barX = X + interval / 2;
        const barY = Y + interval / 2;
        const barWidth = width - interval;
        const barHeight= height- interval;
        const ratio = role.gameData.point/ role.gameData.point_max;
        const text = `HP: ${role.gameData.point}/${role.gameData.point_max}`;
        const redWidth = barWidth * ratio;
        const xOffset  = barWidth * is_player * ( 1 - ratio );
        // 頭像
        const mask = scene.add.graphics().fillCircle(x, y, radius).fillRect(x - radius, y + (is_player - 1) * radius , 2 * radius, radius);
        scene.add.image(x, y, role.gameData.role).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setDepth(1).setMask(mask.createGeometryMask());
        //外框
        const bar = scene.add.graphics();
        bar.fillStyle(0xffffff, 1).fillRoundedRect(X + is_player * width / 2, Y - xOff * (height - interval), width / 2, height   , R);  // 姓名欄
        bar.fillStyle(0xffffff, 1).fillRoundedRect(X                     , Y                             , width    , height   , R);  // 外框
        bar.fillStyle(0x000000, 1).fillRoundedRect(barX                  , barY                          , barWidth , barHeight, R);   // 內部
        bar.fillStyle(0xff0000, 1).fillRoundedRect(barX + xOffset        , barY                          , redWidth , barHeight, R);   // 血條
        //文字
        const style1 = { font: '18px Arial', fill: '#ffffff' };
        const style2 = { font: '18px Arial', fill: '#CC0000' };
        scene.add.text(X + width / 2, Y + height / 2 + interval * 2, text, style1).setOrigin(0.5, 1);
        scene.add.text(X + ( 2 + xOff ) * width / 4, Y + height / 2 + interval * 2 - xOff * (height - interval), role.name, style2).setOrigin(0.5, 1);
    }
}
function create_card(x, y, cardData,is_player) {

    function createIcon(role, x) {
        let background=scene.add.graphics()
            .fillStyle(0xFF7744)
            .fillCircle(x, Height / 2, 7.5)
            .setVisible(false)
            .setInteractive(new Phaser.Geom.Circle(x, Height / 2, 7.5), Phaser.Geom.Circle.Contains);
        let icon = scene.add.image(x, Height / 2, role)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(20, 20)
            .setVisible(false);

        background.on('pointerover', () => background.fillStyle(0xCC0000).fillCircle(x, Height / 2, 7.5) ); // 移入時變為懸停顏色
        background.on('pointerout' , () => background.fillStyle(0xFF7744).fillCircle(x, Height / 2, 7.5) ); // 移出時恢復預設顏色
        background.on('pointerdown', () => {
            circleContainer = scene.add.container(); // 创建一个容器用于存放小圆圈

            if(role === 'attack') {
                focus_card = container;
                
                [0,1,2,3,4].forEach( index => {
                    if ( !containerP.fieldContainer[index] && put_card_frequency && container.getData('cardType')=='hand') {
                        const x = 163 + index * 100 + Width / 2;
                        const y = 306 + Height / 2;
                        let circle = scene.add.graphics().fillStyle(0x0000FF).fillCircle(x, y, 10);
                        circleContainer.add(circle);
                        focus_card = container;
                    }
                    reversedata = gameData===gameData_P?gameData_E:gameData_P;
                    if ( !reversedata.fieldContainer[index] && container.getData('attack') && container.getData('cardType')=='field') {
                        const x = 163 + index * 100 + Width / 2;
                        const y = 150 + Height / 2;
                        let circle = scene.add.graphics().fillStyle(0x0000FF).fillCircle(x, y, 10);
                        circleContainer.add(circle);
                    }
                });
                
            }
            else if(role === 'defense'){

            }
            else {

            }
        });
        return { icon: icon, background: background };
    }

    const cardImage  = scene.add.image(0, 0, 'cardback').setDisplaySize(Width, Height).setFlipX(true);
    const cardBorder = scene.add.graphics().lineStyle(2, 0xff0000).strokeRect(-Width / 2, -Height / 2, Width, Height).setVisible(false);
    const attack = createIcon('attack' , Width / 2 - 5);
    const effect = createIcon('effect' ,             0);
    const defense= createIcon('defense',-Width / 2 + 5);

    const container  = scene.add.container(x + Width / 2, y + Height / 2).setSize(Width, Height).setInteractive();
    container.add([cardImage, cardBorder, attack.background, attack.icon, effect.background, effect.icon, defense.background, defense.icon]);

    container.setData('cardData' , cardData);
    container.setData('cardType' , 'hand');
    container.setData('cardowner', is_player);
    container.setData('attack'   , 1);

    container.on('pointerover', () => drawcardform(container.getData('cardData')));
    container.on('pointerdown', () => {
        if(is_player === 1){

            containerP.handContainer.forEach(Item => {
                Item.list[1].visible = (Item === container);  // 邊框
                if (database[Item.getData('cardData')].once)           //如果是一次性卡牌
                          [4, 5].forEach(index => Item.list[index].visible = (Item === container));   // 效果
                else[2, 3, 6, 7].forEach(index => Item.list[index].visible = (Item === container));   // 攻擊、防禦
            });

            containerP.fieldContainer.forEach(Item =>{
                Item.list[1].visible = (Item === container);  // 邊框
                if (database[Item.getData('cardData')].skill)          // 如果有技能
                      [4, 5].forEach(index => Item.list[index].visible = (Item === container));   // 效果
                [2, 3, 6, 7].forEach(index => Item.list[index].visible = (Item === container));   // 攻擊、防禦
            });
        }
    });
    return container;
}
function put_card(row,col,x,y) {
    let gameData = row ? gameData_P : gameData_E;
    gameData.fieldContainer[col] = focus_card;
    focus_card.setData('cardType', 'field').list[1].visible = false;
    scene.tweens.add({
        targets: focus_card,
        x: x + Width / 2,
        y: y + Height/ 2,
        duration: 500,
    });
    const cardIndex = gameData.handContainer.findIndex((handCard) => handCard === focus_card);
    if (cardIndex !== -1) gameData.handContainer.splice(cardIndex, 1);
    Arrange_cards(scene,gameData);
    put_card_frequency--;
    focus_card = null;
    circleContainer.removeAll(true); // 点击任何位置都会清除容器内的小圆圈
}

function drawcardform(cardData){
    var imageContent = document.getElementById('image-content');
    var existingImage = imageContent.querySelector('img');
    if (existingImage) existingImage.remove();

    var img = document.createElement('img')
    img.width = 196;
    img.height= 294;
    img.src = `assets/${database[cardData].attributes}-${database[cardData].cardlevel}.png`;
    imageContent.appendChild(img);

    var fileContentElement = document.getElementById('file-content');
    fileContentElement.innerHTML = `
        <strong>名稱: </strong><p>             &nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].name}</p>
        <strong>描述: </strong><p id='content'>&nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].content}</p>
        <strong>卡牌: </strong><p>             &nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].attributes} - ${database[cardData].cardlevel}</p>`;
}
function update_data(area) {
    if (battleId === area.id ){
        gameData_P = area ? (area.player1.id === id ? area.player1 : area.player2) : null;  // 將玩家與敵人資料更新
        gameData_E = area ? (area.player1.id !== id ? area.player1 : area.player2) : null;    
    }
}   // OK
function check_id(id_) {
    if(id_ === gameData_E.id)return 2;  // 是敵人
    if(id_ === gameData_P.id)return 1;  // 是玩家
    return 0;                           // 無關係
}   // OK







socket.on('chat message', (msg) => {                            // 收到伺服器的 chat message 後執行
    const messagesList = document.getElementById('messages');
    const messageItem = document.createElement('li');           // 創建一個li的物件
    messageItem.textContent = msg;                              // 物件的文字為從伺服器那收到的 msg
    messagesList.appendChild(messageItem);                      // 將物件放置到聊天區中
    messagesList.scrollTop = messagesList.scrollHeight;         // 調用滾動到底部的函式
    while (messagesList.children.length > 20) {                 // 當聊天區超過20個訊息時
        messagesList.removeChild(messagesList.firstChild);      // 刪除掉最開始(上面)的文件
    }
});
socket.on('update data',(area)=>update_data(area));
socket.on('error',(text)=>alert(text));

socket.on('start anime', (area) => {
    if( battleId === null && (area.player1.id === id || area.player2.id === id )){ // 如果還沒有對戰房間，且裡面其中一名玩家id是自己。
        battleId = area.id; // 分配房間id
        update_data(area);  //更新資料

        const x1 = 200, y1 = 300, x2 = 600, y2 = 300, frames = [];
        for(let i = 0; i < 4; i++)for(let j = 1; j <= 3 ; j++)frames.push(`${ portrait_name[i]}${j}`);

        scene.add.graphics().fillStyle(0x222222).fillRect(0, 0, config.width, 600); // 填滿畫面
        CreateIconAnime(x1, y1, X1, Y1, gameData_E.gameData.role);                  // 創建角色ICON動畫
        CreateIconAnime(x2, y2, X2, Y2, gameData_P.gameData.role);

        scene.time.delayedCall(3000,() => socket.emit('start anime end'));   // 待動畫完成後，呼叫事件。

        function CreateIconAnime(x, y, X, Y, role){ // ICON動畫
            let mask = scene.add.graphics().fillCircle(x, y, radius);   // 遮罩
            let icon = scene.add.image(x, y, frames[0]).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setMask(mask.createGeometryMask());
            scene.tweens.add({
                targets: icon,
                duration: 200,
                repeat: 5,
                callback: () =>icon.setTexture(frames[Phaser.Math.Between(0, frames.length - 1)]),  //隨機更換圖片
                onComplete: ()=>{
                    icon.setTexture(role);
                    scene.time.delayedCall(500,()=>{
                        scene.tweens.add({
                            targets: icon,
                            x: X,
                            y: Y,
                            duration: 1000,
                            onUpdate: (tween, target) => mask.clear().fillCircle(target.x, target.y, radius),
                        });
                    });
                },
            });
        };
    }
}); // OK
socket.on('draw zone',()=>{
    // roundIndicator = scene.add.graphics().fillStyle(0x00AA00).fillCircle(700, 200, 60);
    // round_text = scene.add.text(400, 400, round_mind[round], {fontSize: '25px',fill: '#ffffff',align: 'center'} ).setOrigin(0.5);

    scene.add.graphics().fillStyle(0x444444).fillRect(0, 0, config.width, config.height);   // 填滿畫面
    scene.add.image(63 , 150, 'cardback').setDisplaySize(Width, Height).setOrigin(0,0);     // 繪製牌組
    scene.add.image(663, 306, 'cardback').setDisplaySize(Width, Height).setOrigin(0,0);
    for (var row = 0; row < 2; row++) for (var col = 0; col < 5; col++) draw_card_zone(row, col);
    function draw_card_zone(row, col) {
        const hoverColor = row ? 0x00ffff : 0x7A0099;   // 懸停顏色：在上方為紫色，在下方為淺藍色
        const defaultColor = 0xffffff;                  // 預設顏色：白色
        const x = 163 + col * 100, y = 150 + row * 156; // 基本座標

        let zone = scene.add.graphics().lineStyle(2,  defaultColor).strokeRect(x, y, Width, Height);        // 繪製圖形
        zone.setInteractive(new Phaser.Geom.Rectangle(x, y, Width, Height), Phaser.Geom.Rectangle.Contains);// 設定交互
        zone.on('pointerover', () => zone.lineStyle(2,  hoverColor  ).strokeRect(x, y, Width, Height) );    // 移入時變為懸停顏色
        zone.on('pointerout' , () => zone.lineStyle(2,  defaultColor).strokeRect(x, y, Width, Height) );    // 移出時恢復預設顏色
        zone.on('pointerdown', () => {  // 點擊後觸發
            if(row){//我方區域
                if((round == 0 ||round == 1)&& put_card_frequency && focus_card.getData('cardType') == 'hand'){//我方回合、有放置次數、來自手牌
                    put_card(scene,row, col,x,y);
                }
            }
            else {
                if((round == 0 ||round == 1)&& focus_card.getData('attack') && focus_card.getData('cardType') == 'field'){
                    card_attack();
                }
            }

        });
    };
    createPlayerUI();

});
socket.on('send card',(cardData, id_) => {
    const is_player = check_id(id_);    // 確定是誰的發牌。
    let playerData = [];
    if (is_player === 1) {
        playerData = [663, 306, 40 + (Width + 10) * gameData_P.gameData.handContainer.length, 500]; // 玩家 1 的数据
    }
    else if (is_player === 2) {
        playerData = [63, 150, 760 - (Width + 10) * gameData_E.gameData.handContainer.length, 100]; // 玩家 2 的数据
    }
    else {
        console.log('無關係的ID');
        console.log(gameData_E, gameData_P);
        return ;    // 斷開程式
    }
    const container = create_card(playerData[0], playerData[1], cardData, is_player);
    scene.tweens.add({
        targets: container,
        x: playerData[2],
        y: playerData[3],
        scaleX: container.scaleX * -1,
        duration: 500,
        onUpdate: (tween, target) => {
            if (tween.progress >= 0.5 && is_player === 1) {
                container.list[0].setTexture(`${database[cardData].attributes}${database[cardData].cardlevel}`);
            }
        },
    });
    (is_player === 1 ? containerP:containerE).handContainer.push(container);
}); // OK
socket.on('destroy card',(player,cardData)=>{
    const is_player = check_id(player.id);
    if (is_player === 1) {
        removedCardObject = containerP;
    }
    else if (is_player === 2) {
        removedCardObject = containerE;
    }
    else {
        console.log('無關係的ID');
        console.log(gameData_E, gameData_P);
        return ;
    }
    findAndDestroyCard(cardData, removedCardObject.handContainer);
    findAndDestroyCard(cardData, removedCardObject.deckContainer);

    function findAndDestroyCard(cardData, container) {
        container.forEach((card, index) => {
            if (card.getData('cardData') === cardData) {
                scene.tweens.killTweensOf(card);// 停下物件動畫
                card.destroy();                 // 破壞物件
                container.splice(index, 1);
            }
        });
    }
}); // OK
socket.on('arrange card',(player)=>{
    const is_player = check_id(player.id);
    let playercontainer, x_, y_;
    let interval = (Width + 10) * (2 * is_player - 3);
    if(is_player === 1){
        x_ =  40, y_ = 500, playercontainer = containerP.handContainer;
    }
    else if(is_player === 2){
        x_ = 760, y_ = 100, playercontainer = containerE.handContainer;
    }
    else {
        console.log('無關係的ID');
        console.log(gameData_E, gameData_P);
        return ;    // 斷開程式
    }
    for (let i = 0; i < playercontainer.length; i++) {
        scene.tweens.add({
            targets: playercontainer[i],
            x: x_ - i * interval,
            y: y_,
            duration: 500,
        });
    }
}); // OK








window.addEventListener('unload', () => { //玩家失去連線
    socket.emit('logout',id);
});
window.addEventListener('beforeunload', (event) => {
    // 阻止默认行为以弹出确认提示
    event.preventDefault();

    // 发送退出请求给服务器
    socket.emit('logout');
    
    // Chrome 需要返回一个值以显示确认提示
    event.returnValue = '';
});