switch (token) {
    case 3:socket.emit('chat message','歡迎作者加入'  ,'system-message');break;
    case 2:socket.emit('chat message','歡迎管理員加入','system-message');break;
    case 1:socket.emit('chat message','歡迎玩家加入'  ,'system-message');break;
}

const id = socket.id;

// 遊戲數據區
function initializeGameData() { // 初始化遊戲相關資料
    return {               
        id: null,
        name: null,
        gameData:{
            attributes: 0,      // 屬性
            point_max: 0,       // 最大血量
            point: 0,           // 血量
            role: '',           // 角色名稱
            handContainer: [],  // 手牌
            fieldContainer: [], // 場地
            deckContainer: [],  // 牌組
            PutCardFrequency: 0,// 放置卡牌次數
            player_number: 0,   // 玩家先手判定
        },
    };
}
function initializeContainer() { // 初始化遊戲相關容器
    return {                
        handContainer: [],  // 手牌
        fieldContainer: [],  // 場地
    };
}
let gameData_E = initializeGameData();
let gameData_P = initializeGameData();
let containerE = initializeContainer();
let containerP = initializeContainer();

const X1 = 50, Y1 = 50, X2 = 750, Y2 = 550, radius = 50;    // 頂部UI
const Width = 48,Height = 72;   // 卡片大小

const portrait_name = ['dust_face','water_face','fire_face','wind_face'];
const card_name = ['dust','water','fire','wind','dark','light'];

let focus_ =null
let round = 0;
let battleId = null;
const round_mind = ["1方\n回合","1方\n反擊","2方\n回合","2方\n反擊"];


let config = {              // 物件屬性
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

let game = new Phaser.Game(config); // 開始一個新的 Phaser 遊戲

function preload(){
    this.load.image('front_cover','assets/front_cover.png');
    this.load.image('teach_cat','assets/teach_cat.png');
    this.load.image('cardback','assets/cardback.png');

    this.load.image('defense','assets/defense.png');
    this.load.image('attack','assets/attack.png');
    this.load.image('effect','assets/effect.png');

    for(let i=0;i<=3;i++){
        for(let j=1;j<= 3;j++)this.load.image(`${portrait_name[i]}${j}`,`assets/${portrait_name[i]}${j}.png`);
        for(let j=1;j<=13;j++)this.load.image(`${card_name[i]}${j}`,`assets/${card_name[i]}-${j}.png`);
    }
    this.load.image('light??','assets/light??.png');
    this.load.image('dark??','assets/dark??.png');

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
        display_point();
    }
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
        bar.fillStyle(0xffffff, 1).fillRoundedRect(X + is_player * width / 2, Y - xOff * (height - interval), width / 2, height   , R); // 姓名欄
        bar.fillStyle(0xffffff, 1).fillRoundedRect(X                        , Y                             , width    , height   , R); // 外框
        bar.fillStyle(0x000000, 1).fillRoundedRect(barX                     , barY                          , barWidth , barHeight, R); // 內部
        bar.fillStyle(0xff0000, 1).fillRoundedRect(barX + xOffset           , barY                          , redWidth , barHeight, R); // 血條
        //文字
        const style1 = { font: '18px Arial', fill: '#ffffff' };
        const style2 = { font: '18px Arial', fill: '#CC0000' };
        scene.add.text(X + width / 2, Y + height / 2 + interval * 2, text, style1).setOrigin(0.5, 1);
        scene.add.text(X + ( 2 + xOff ) * width / 4, Y + height / 2 + interval * 2 - xOff * (height - interval), role.name, style2).setOrigin(0.5, 1);
    }
}   // OK
function create_card(x, y, cardData,is_player) {
    const cardImage  = scene.add.image(0, 0, 'cardback').setDisplaySize(Width, Height).setFlipX(true);
    const cardBorder = scene.add.graphics().lineStyle(2, 0xff0000).strokeRect(-Width / 2, -Height / 2, Width, Height).setVisible(false);
    const attack = createIcon ( Width / 2 -5, Height / 2,7.5, 'attack' );
    const effect = createIcon (            0, Height / 2,7.5, 'effect' );
    const defense= createIcon (-Width / 2 +5, Height / 2,7.5, 'defense');
    const point  = createPoint( Width / 2   ,-Height / 2, 15           );
    const mode   = createMode (-Width / 2   ,-Height / 2, 15, 'attack' );

    const container  = scene.add.container(x + Width / 2, y + Height / 2).setSize(Width, Height)
    container.add([cardImage, cardBorder, attack, effect, defense , point, mode]);

    container.setData('cardData'  , cardData);  // 卡片數值
    container.setData('cardType'  , 'hand');    // 卡片在哪
    container.setData('frequency' , 1);         // 攻擊次數
    container.setData('cardMode'  , 'attack');  // 卡牌狀態
    container.setData('cardfreeze', 0);         // 卡牌冰凍

    if( token !== 1)container.setInteractive();
    else if(is_player === 1)container.setInteractive();
    container.on('pointerover', () => drawcardform(cardData));
    container.on('pointerdown', () => {
        if(is_player_turn()){
            if(focus_){
                const focuscardData = focus_.card.getData('cardData');
                switch (focus_.card.getData('cardType')) {
                    case 'effect':
                        // database[focuscardData].effect(is_player,);
                    break;
                    case 'attack':
                        if (is_player === 2 && container.getData('cardType') === 'field'){
                            socket.emit('attack',focuscardData,cardData);
                        }
                        break;
                }
            }
            containerP.handContainer.forEach(Item => 
                database[Item.getData('cardData')].handslect.forEach(index => 
                    Item.list[index].visible = (Item === container)
                )
            );
            containerP.fieldContainer.forEach(Item =>
                database[Item.getData('cardData')].fieldslect.forEach(index =>
                    Item.list[index].visible = (Item === container)
                )
            );
        }

        else socket.emit('chat message', '現在不是你的回合','system-message');
    });
    
    function createIcon(x, y, r, role) {
        let background=scene.add.graphics()
            .fillStyle(0xFF7744)
            .fillCircle(x, y, r)
            .setInteractive(new Phaser.Geom.Circle(x, y, r), Phaser.Geom.Circle.Contains);
        let icon = scene.add.image(x, y, role).setDisplaySize(20, 20);
        background.on('pointerover', () => background.fillStyle(0xCC0000).fillCircle(x, y, r) ); // 移入時變為懸停顏色
        background.on('pointerout' , () => background.fillStyle(0xFF7744).fillCircle(x, y, r) ); // 移出時恢復預設顏色
        background.on('pointerdown', () => {
            switch (container.getData('cardType')) {
                case 'hand':
                    if(gameData_P.gameData.PutCardFrequency > 0)focus_ = {card: container,mode: role};
                    else socket.emit('chat message', '本回合已沒有放卡的機會','system-message');    
                break;
                case 'field':
                    if(container.getData('frequency') > 0)focus_ = {card: container,mode: role};
                    else socket.emit('chat message', '此卡牌沒有行動的機會','system-message');    
                break;
            }
        });
        return scene.add.container().add([background, icon]).setVisible(false);
    }
    function createPoint(x, y, r){
        let background=scene.add.graphics().fillStyle(0x00FFCC).fillCircle(x, y, r)
        let text = scene.add.text(x, y, '0', { fontFamily: 'Arial', fontSize: '16px', fill: '#000' })
            .setOrigin(0.5,0.5).setFlipX(true);
        return scene.add.container().add([background, text]).setVisible(false);
    }
    function createMode(x, y, r, role){
        let background=scene.add.graphics().fillStyle(0x00FFCC).fillCircle(x, y, r)
        let icon = scene.add.image(x, y, role).setDisplaySize(30, 30);
        return scene.add.container().add([background, icon]).setVisible(false);
    }
    return container;
}

function display_point() {
    for (let i = 0; i < 5; i++) {
        const fieldContainerData = gameData_P.gameData.fieldContainer[i];
        const containerField = containerP.fieldContainer[i];
        if (containerField && fieldContainerData) {
            const point = fieldContainerData.point;
            containerField.setData('lifepoint', point);
            containerField.list[5]?.list[1]?.setText(point);
            containerField.list[6]?.list[1]?.setTexture(fieldContainerData.mode);
        }
    }
}
function drawcardform(cardData){
    let imageContent = document.getElementById('image-content');
    let existingImage = imageContent.querySelector('img');
    if (existingImage) existingImage.remove();

    let img = document.createElement('img')
    img.width = 196;
    img.height= 294;
    img.src = `assets/${database[cardData].attributes}-${database[cardData].cardlevel}.png`;
    imageContent.appendChild(img);

    let fileContentElement = document.getElementById('file-content');
    fileContentElement.innerHTML = `
        <strong>名稱: </strong><p>             &nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].name}</p>
        <strong>描述: </strong><p id='content'>&nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].content}</p>
        <strong>卡牌: </strong><p>             &nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].attributes} - ${database[cardData].cardlevel}</p>`;
}   // OK
function update_data(area) {
    if (battleId === area.id ){
        gameData_P = area ? (area.player1.id === id ? area.player1 : area.player2) : null;  // 將玩家與敵人資料更新
        gameData_E = area ? (area.player1.id !== id ? area.player1 : area.player2) : null;  
        round = area.turn;
    }
}   // OK
function check_id(id_) {
    if(id_ === gameData_E.id)return 2;  // 是敵人
    if(id_ === gameData_P.id)return 1;  // 是玩家
    return 0;                           // 無關係
}   // OK
function is_player_turn() {
    const p_n = gameData_P.gameData.player_number;
    return (round < 2) ? (p_n === 1):(p_n === 2);
}   // OK




socket.on('chat message', (msg, type) => {
    const messagesList = document.getElementById(`${type}`);
    const messageItem = document.createElement('li');
    messageItem.textContent = msg;
    messagesList.appendChild(messageItem);
    messagesList.scrollTop = messagesList.scrollHeight;
    while (messagesList.children.length > 20) messagesList.removeChild(messagesList.firstChild);

    const pureButtonType = type.slice(0, -9);
    if (!(inputMessage.dataset.target === type) && ['system','public','battle'].includes(pureButtonType)) {
        const button = document.getElementById(pureButtonType + '-tab');
        let count = 0;
        const flashing = setInterval(() => {
            button.classList.toggle('flash'); // 切換 'flash' class
            count++;
            if (count >= 5*2 ) {
                clearInterval(flashing);
                button.classList.remove('flash'); // 移除 'flash' class
            }
        }, 500);
    }
});
socket.on('update data',(area)=>update_data(area));             // 更新資料
socket.on('error',(text)=>alert(text));                         // 回報錯誤

socket.on('start anime', (area) => {                            // 初始動畫
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
    for (let row = 0; row < 2; row++) for (let col = 0; col < 5; col++) draw_card_zone(row, col);
    function draw_card_zone(row, col) {
        const hoverColor = row ? 0x00ffff : 0x7A0099;   // 懸停顏色：在上方為紫色，在下方為淺藍色
        const defaultColor = 0xffffff;                  // 預設顏色：白色
        const x = 163 + col * 100, y = 150 + row * 156; // 基本座標

        let zone = scene.add.graphics().lineStyle(2,  defaultColor).strokeRect(x, y, Width, Height);        // 繪製圖形
        zone.setInteractive(new Phaser.Geom.Rectangle(x, y, Width, Height), Phaser.Geom.Rectangle.Contains);// 設定交互
        zone.on('pointerover', () => zone.lineStyle(2,  hoverColor  ).strokeRect(x, y, Width, Height) );    // 移入時變為懸停顏色
        zone.on('pointerout' , () => zone.lineStyle(2,  defaultColor).strokeRect(x, y, Width, Height) );    // 移出時恢復預設顏色
        zone.on('pointerdown', () => {  // 點擊後觸發
            if(is_player_turn()){
                if(focus_!= null){
                    if(row == 0){   // 攻擊或效果
                        socket.emit('use card', col, focus_.mode, focus_.card.getData('cardData'));
                    }
                    else {          // 放置卡牌
                        socket.emit('put card', col, focus_.mode, focus_.card.getData('cardData'));
                    }
                }
                else socket.emit('chat message','請選擇好卡片的行為','system-message');

            }
            else socket.emit('chat message','現在不是你的回合','system-message');
        });
    };
    createPlayerUI();

});
socket.on('send card',(id_,cardData) => {
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
socket.on('destroy card',(id_,cardData)=>{
    const is_player = check_id(id_);
    if (is_player === 1) {
        removedCardObject = containerP;
    }
    else if (is_player === 2) {
        removedCardObject = containerE;
    }
    else {
        console.log('無關係的ID');
        return ;
    }
    findAndDestroyCard(cardData, removedCardObject.handContainer);
    findAndDestroyCard(cardData, removedCardObject.fieldContainer);

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
socket.on('arrange card',(id_)=>{
    const is_player = check_id(id_);
    let p_container, x_, y_;
    let interval = (Width + 10) * (2 * is_player - 3);
    if(is_player === 1){
        x_ =  40, y_ = 500, p_container = containerP.handContainer;
    }
    else if(is_player === 2){
        x_ = 760, y_ = 100, p_container = containerE.handContainer;
    }
    else {
        console.log('無關係的ID');
        return ;    // 斷開程式
    }

    for (let i = 0; i < p_container.length; i++) {
        scene.tweens.add({
            targets: p_container[i],
            x: x_ - i * interval,
            y: y_,
            duration: 500,
        });
    }
}); // OK
socket.on('put card',(col,id_)=>{
    const is_player = check_id(id_);
    const x = 163 + col * 100;
    let container_, y;
    if (is_player === 1) {
        container_ = containerP;
        y = 306;
    }
    else if (is_player === 2) {
        container_ = containerE;
        y = 150;
    }
    else {
        console.log('無關係的ID');
        return ;    // 斷開程式
    }
    database[focus_.card.getData('cardData')].handslect.forEach(index => focus_.card.list[index].visible = false);
    focus_.card.setData('cardType', 'field').setData('cardMode', focus_.mode);
    container_.handContainer.splice(container_.handContainer.indexOf(focus_.card), 1);
    container_.fieldContainer[col] = focus_.card;
    
    scene.tweens.add({
        targets: focus_.card,
        x: x + Width / 2,
        y: y + Height/ 2,
        duration: 500,
        onComplete: ()=>{
            focus_.card.list[5].setVisible(true);
            focus_.card.list[6].setVisible(true);
            focus_ = null;
        },
    });
});