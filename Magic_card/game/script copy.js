const socket = io();

const sendMessage = () => {
    const messageInput = document.getElementById('inputMessage');
    let message = messageInput.value.trim();                            // 取得輸入區的資料
    if (message !== '') {                                               // 如果文字不為空
        if (message.length > 60) message = message.slice(0, 60)+'...';  // 當文字超過60字則只保留60字，並在後面加上'...'
        socket.emit('chat message', message);                           // 呼叫 chat message 事件到伺服器，並給予其 message
        messageInput.value = '';                                        // 清空輸入區
    }
};
document.addEventListener('DOMContentLoaded', () => {                               // 等待HTML物件加載完成
    document.getElementById('sendButton').addEventListener('click', sendMessage);   // 點擊輸出按鈕，隨後呼叫函式
    document.getElementById('inputMessage').addEventListener('keypress', (e) => {   // 按下鍵盤
        if (e.key === 'Enter') e.preventDefault(),sendMessage();                    // 如果是 Enter ，則取消默認行為(換行)，並呼喚函式
    } );
});

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

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');  // 將 name 中的方括號轉義
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');      // 使用正則表達式建立一個尋找 name 參數的 RegExp 物件
    var results = regex.exec(location.href);                    // 執行正則表達式，從目前網址中搜尋匹配 name 參數的值
    // 如果結果為 null ，返回空字符串，否則解碼結果並替換加號成空格
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));  
}

const id = getUrlParameter('id');   // 從網址獲取 id 參數
socket.emit('get id', id);          // 將 id 送到伺服器


// // 監聽重新連接事件
// socket.on('reconnect', () => {
//     console.log('重新連接成功');
//     socket.emit('reconnect_', id);


//     // 在重新連接成功後，執行你的處理邏輯
//     // 例如重新訂閱頻道、恢復丟失的狀態等
// });

// // 當斷開連接時
// socket.on('disconnect', () => {
//     console.log('與服務器斷開連接');
//     socket.emit('disconnect_', id);

//     // 在斷開連接時執行相應的處理邏輯
// });





//頂部UI
let X1 = 50, Y1 = 50, X2 = 750, Y2 = 550, radius = 50;
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
let gameData_E = initializeGameData();
let gameData_P = initializeGameData();


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
                 if (i === 0) computer_battle_(this);
            // else if (i === 1) Multiplayer_battle = true;
            // else if (i === 2) Tutorial_mode = true;
        });
        this.add.text(x + width / 2, _y + height / 2, textData[i], { font: 'bold 30px Arial', fill: '#000000' }).setOrigin(0.5);// 繪製文字
    }
}

function update(){

}


function drawzone(scene){   // 繪製場地

    roundIndicator = scene.add.graphics().fillStyle(0x00AA00).fillCircle(700, 200, 60);
    round_text = scene.add.text(400, 400, round_mind[round], {fontSize: '25px',fill: '#ffffff',align: 'center'} ).setOrigin(0.5);

    scene.add.graphics().fillStyle(0x444444).fillRect(0, 0, config.width, config.height);   // 填滿畫面
    scene.add.image(63 , 150, 'cardback').setDisplaySize(Width, Height).setOrigin(0,0);     // 繪製牌組
    scene.add.image(663, 306, 'cardback').setDisplaySize(Width, Height).setOrigin(0,0);
    createPlayerUI(scene);
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
}

function createPlayerUI(scene) {
    const width = 250, height = 30, interval = 5;
    //X1 = 50, Y1 = 50, X2 = 750, Y2 = 550;

    createPlayer(X1, Y1, gameData_E.role, false);   // 敵人頭像
    createPlayer(X2, Y2, gameData_P.role , true);   // 玩家頭像

    X1 = X1 + radius - interval * 2;
    X2 = X2 - radius + interval * 2 - width;
    Y1 = Y1 - 10 - height;
    Y2 = Y2 + 10;

    createBar(X1, Y1, width, height, gameData_E.point/ gameData_E.point_max, false, `HP: ${gameData_E.point}/${gameData_E.point_max}`);
    createBar(X2, Y2, width, height, gameData_P.point/ gameData_P.point_max, true , `HP: ${gameData_P.point }/${gameData_P.point_max }`); 

    function createPlayer(x, y, role, self) {
        let mask = scene.add.graphics().fillCircle(x, y, radius).fillRect(x - radius, self ? y : y - radius , 2 * radius, radius);
        scene.add.image(x, y, role).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setDepth(1).setMask(mask.createGeometryMask());
    }

    function createBar(x, y, width, height, ratio, reverse, text) {
        const bar = scene.add.graphics();
        //外框
        bar.fillStyle(0xffffff, 1).fillRoundedRect(x, y, width, height, 10);
        bar.fillStyle(0x000000, 1).fillRoundedRect(x + interval / 2, y + interval / 2, width - interval, height - interval, 10);
        //血條
        const barWidth = width - interval;
        const redWidth = reverse ? barWidth - barWidth * (1 - ratio) : barWidth * ratio;
        const xOffset  = reverse ? barWidth - redWidth : 0;
        bar.fillStyle(0xff0000, 1).fillRoundedRect(x + interval / 2 + xOffset, y + interval / 2, redWidth, height - interval, 10);
        //文字
        const style = { font: '18px Arial', fill: '#ffffff' };
        scene.add.text(x + width / 2, y + height / 2 + interval * 2, text, style).setOrigin(0.5, 1);
    }
}
function dealing_cards(scene, gameData) {
    let Spacing = 10, x , y , x_, y_;

    if(gameData === gameData_P) x = 663, y = 306, x_= 50 , y_= 500;
    else                        x = 63 , y = 150, x_= 750, y_= 100;

    if (gameData.handContainer.length >= 10) {                      // 移除超過手牌數量限制的卡片
        const removedCardObject = gameData.handContainer.shift();   // 刪除最前面的手牌
        destroy_cards(scene, gameData, removedCardObject);          // 破壞該卡牌的物件
        Arrange_cards(scene, gameData);                             // 重新排序所有手牌
    }

    const container = create_card(scene, x, y, gameData);
    const interval = gameData.handContainer.length * (Width + Spacing);
    scene.tweens.add({
        targets: container,
        x: gameData === gameData_P ? x_ + interval : x_ - interval,
        y: y_,
        scaleX: container.scaleX * -1,
        duration: 500,
        onUpdate: (tween, target) => {
            if (tween.progress >= 0.5 && gameData === gameData_P) {
                const number = container.getData('cardData');
                container.list[0].setTexture(`${database[number].attributes}${database[number].cardlevel}`);
            }
        },
    });
    gameData.handContainer.push(container);
}
function create_card(scene, x, y, gameData) {

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
                [0,1,2,3,4].forEach( index => {
                    if ( !gameData.fieldContainer[index] && put_card_frequency && container.getData('cardType')=='hand') {
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
                        focus_card = container;
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
    const card_number= Phaser.Math.Between(0, gameData.deckContainer.length - 1);
    const cardData   = gameData.deckContainer.splice(card_number, 1)[0];

    const cardImage  = scene.add.image(0, 0, 'cardback').setDisplaySize(Width, Height).setFlipX(true);
    const cardBorder = scene.add.graphics().lineStyle(2, 0xff0000).strokeRect(-Width / 2, -Height / 2, Width, Height).setVisible(false);
    const attack = createIcon('attack' , Width / 2 - 5);
    const effect = createIcon('effect' ,             0);
    const defense= createIcon('defense',-Width / 2 + 5);

    const container  = scene.add.container(x + Width / 2, y + Height / 2).setSize(Width, Height).setInteractive();
    container.add([cardImage, cardBorder, attack.background, attack.icon, effect.background, effect.icon, defense.background, defense.icon]);

    

    container.setData('cardData', cardData);
    container.setData('cardType', 'hand');
    container.setData('attack'  , 1);

    container.on('pointerover', () => drawcardform(container.getData('cardData')));
    container.on('pointerdown', () => {
        if(gameData === gameData_P){
            gameData.handContainer.forEach(containerItem => {
                containerItem.list[1].visible = (containerItem === container);
                if (database[containerItem.getData('cardData')].once) 
                          [4, 5].forEach(index => containerItem.list[index].visible = (containerItem === container));
                else[2, 3, 6, 7].forEach(index => containerItem.list[index].visible = (containerItem === container));
            });
            gameData.fieldContainer.forEach(containerItem =>{
                containerItem.list[1].visible = (containerItem == container);
                if (database[containerItem.getData('cardData')].skill) 
                      [4, 5].forEach(index => containerItem.list[index].visible = (containerItem === container));
                [2, 3, 6, 7].forEach(index => containerItem.list[index].visible = (containerItem === container));
            });

        }
    });
    return container;
}
function destroy_cards(scene, gameData, removedCardObject) {
    gameData.deckContainer.push(removedCardObject.getData('cardData')); // 把卡片的數值放回去牌組
    scene.tweens.killTweensOf(removedCardObject);   // 停下物件動畫
    removedCardObject.destroy();                    // 破壞物件
}
function Arrange_cards(scene, gameData) {
    let x_ = gameData === gameData_P? 50 : 750;
    let y_ = gameData === gameData_P? 500: 100;
    let interval = Width + 10;
    for (let i = 0; i < gameData.handContainer.length; i++) {
        scene.tweens.add({
            targets: gameData.handContainer[i],
            x: gameData === gameData_P ? x_ + i * interval : x_ - i * interval,
            y: y_,
            duration: 500,
        });
    }
}
function put_card(scene,row,col,x,y) {
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

function computer_battle_(scene) {  //電腦對戰
    const x1 = 200, y1 = 300, x2 = 600, y2 = 300, frames = [];
    for(let i = 0; i < 4; i++)for(let j = 1; j <= 3 ; j++)frames.push(`${ portrait_name[i]}${j}`);
    // socket.emit('creat gameData');                          // 創造資料
    // socket.on  ('creat gameData',(gameData1,gameData2) => { // 同步資料
    //     gameData_P = gameData1;
    //     gameData_E = gameData2;
    //     createIcon(x1, y1, X1, Y1, gameData_E.role);// 創建角色ICON動畫
    //     createIcon(x2, y2, X2, Y2, gameData_P.role);
    // });
    function creategameData(){
        const point_max = (Math.floor(Math.random() * 2) + 11) * 3; // 隨機生成 point_max (11~13)
        const attributes = Math.floor(Math.random() * 3);           // 隨機生成 attributes (0~3)
        const gameData = {
            attributes: attributes,
            point_max: point_max,
            point: point_max,
            role: `${portrait_name[attributes]}${point_max / 3 - 10}`,
            handContainer: [],
            fieldContainer: [],
            deckContainer: Array.from({ length: 54 }, (_, index) => index + 1)
                .filter(num => num !== (attributes * 13 + point_max / 3)),
        };
        return gameData;
    }
    scene.add.graphics().fillStyle(0x222222).fillRect(0, 0, config.width, 600); // 填滿畫面
    gameData_P = creategameData();
    gameData_E = creategameData();
    createIcon(x1, y1, X1, Y1, gameData_E.role);// 創建角色ICON動畫
    createIcon(x2, y2, X2, Y2, gameData_P.role);

    scene.time.delayedCall(3000,() => { // 待動畫完成後，創建遊戲。
        drawzone(scene);                // 繪製場地
        for (let i = 0; i < 5; i++) {   // 發卡牌
            scene.time.delayedCall(i * 500, dealing_cards, [scene, gameData_P]);
            scene.time.delayedCall(i * 500, dealing_cards, [scene, gameData_E]);
        }
    })
    
    function createIcon(x, y, X, Y, role){
        var mask = scene.add.graphics().fillCircle(x, y, radius);
        var icon = scene.add.image(x, y, frames[0]).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setMask(mask.createGeometryMask());
        scene.tweens.add({
            targets: icon,
            duration: 200,
            repeat: 5,
            callback: () =>icon.setTexture(frames[Phaser.Math.Between(0, frames.length - 1)]),
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