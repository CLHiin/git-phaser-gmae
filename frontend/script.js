var Game_certification = false;
var computer_battle = false;
var Multiplayer_battle = false;
var Tutorial_mode = false;
const socket = io('http://localhost:3000');
document.addEventListener('DOMContentLoaded', function() {
    // 这里放你的JavaScript代码
    document.getElementById('login-form').onsubmit = function(e) {
        e.preventDefault();
        const playerName = document.getElementById('playerName').value;
        const gameCode = document.getElementById('gameCode').value;
        const requestData = { playerName, gameCode };
        // 发送 POST 请求到服务器
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('登录失败，请检查您的输入。');
            }
        })
        .then((data) => {
            const token = data.token;
            if (token === 1) {
                alert('歡迎加入遊戲');
                // 在这里执行成功登录后的操作，例如跳转到游戏页面
                // window.location.href = '/game'; // 根据你的需求修改跳转地址
            } else if (token === 2) {
                alert('歡迎遊戲製作者');
                // 在这里执行成功登录后的操作
            }
            Game_certification = true;
        })
        .catch((error) => {
            alert('登录时发生错误：' + error.message);
        });
    };
});

//頂部UI
var X1 = 50, Y1 = 50, X2 = 750, Y2 = 550, radius = 50;
var other_Attributes= 0;//屬性
var self_Attributes = 0;
var other_point_max= 0; //生命點數
var self_point_max = 0;
var other_point= 0;
var self_point = 0;
var other_role='fire_face2';
var self_role ='dust_face2';
//遊戲數據區
var portrait_name = ['dust_face','water_face','fire_face','wind_face'];
var card_name = ['dust','water','fire','wind'];
// var card_form = {             //關注的卡片資訊
//     attributes:null,           //卡片屬性 0土、1水、2火、3風
//     cardlevel:null,            //卡片等級 1~13
//     cardname:null,
//     cardmunber:null
// };
var handCardsContainer0 = [];   //敵方手牌
var handCardsContainer1 = [];   //我方手牌
var fieldContainer0 = [];       //敵方場地
var fieldContainer1 = [];       //我方場地
var deckContainer0 = [];        //敵方卡組
var deckContainer1 = [];        //我方卡組

var CardSelected = 0;
var focus_card = null;
var put_card_frequency = 3;
var round = 0;
var round_mind = ["我方\n回合","我方\n反擊","敵方\n回合","敵方\n反擊"];


var config = {              //物件屬性
        type: Phaser.AUTO,      //自動選擇為最好的渲染方式
        width: 800,             //寬高設定
        height: 600,
        parent: 'game-container',
        scene: {                
            preload: preload,   //加載資料
            create: create,     //創建畫面
            update: update      //刷新畫面
        }
    };
var game = new Phaser.Game(config);

function preload(){
    this.load.image('front_cover','assets/front_cover.png');
    this.load.image('teach_cat','assets/teach_cat.png');
    this.load.image('cardback','assets/cardback.png');
    for(let i=0;i<=3;i++){
        for(let j=1;j<= 3;j++)this.load.image(`${portrait_name[i]}${j}`,`assets/${portrait_name[i]}${j}.png`);
        for(let j=1;j<=13;j++)this.load.image(`${card_name[i]}${j}`,`assets/${card_name[i]}-${j}.png`);
    }
}
function create(){
    this.add.image(400 , 300 , 'front_cover' );
    this.add.graphics().fillStyle(0xc8bfe7).fillRoundedRect( 100, 50, 600, 500, 20);
    var x = 300, y = 200, width = 200, height = 50, radius = 20;
    var textData = ['電腦對戰','多人對戰','教程模式'];
    var style = {font: 'bold 50px Arial', fill: '#FF0000',};
    this.add.text( x + width / 2, (y + height) / 2, '魔法撲克', style).setOrigin(0.5);
    for (let i = 0; i < 3; i++) create_button.call(this, i);
    function create_button(i){
        var _y= y + i * 100;
        var button = this.add.graphics().fillStyle(0xFFFF00); 
        button.fillRoundedRect( x, _y, width, height, radius);
        button.setInteractive(new Phaser.Geom.Rectangle( x, _y, width, height), Phaser.Geom.Rectangle.Contains);
        button.on('pointerover', () => button.fillStyle(0x0000FF, 1).fillRoundedRect( x, _y, width, height, radius));
        button.on('pointerout' , () => button.fillStyle(0xFFFF00, 1).fillRoundedRect( x, _y, width, height, radius));
        button.on('pointerdown', () => {
            button.destroy();
            if (i === 0) computer_battle_(this);
            else if (i === 1) Multiplayer_battle = true;
            else if (i === 2) Tutorial_mode      = true;
        });
        var style = {font: 'bold 30px Arial', fill: '#000000',};
        this.add.text( x + width / 2, _y + height / 2, textData[i], style).setOrigin(0.5);
    }
    roundIndicator = null;
}

function update(){
    if(roundIndicator){
        round_text.text = round_mind[round];
    }
}



function drawzone(scene){
    scene.add.graphics().fillStyle(0x444444).fillRect(0, 0, config.width, config.height);

    roundIndicator = scene.add.graphics().fillStyle(0x00AA00).fillCircle(700, 200, 60);
    round_text = scene.add.text(700, 200, round_mind[round], {fontSize: '25px',fill: '#ffffff',align: 'center'} ).setOrigin(0.5);

    var width = 64, height = 96, btn1, btn2;
    for (var row = 0; row < 2; row++) for (var col = 0; col < 5; col++) drawstrokeRoundedRect(row, col);
    
    function drawstrokeRoundedRect(row,col){
        var defaultColor=0xffffff;
        var hoverColor = row ? 0x00ffff : 0x7A0099;
        var x = 163 + col * 100;
        var y = 150 + row * 156;
        var zone = scene.add.graphics().lineStyle(2,  defaultColor).strokeRect(x, y, width, height);
        zone.setInteractive(new Phaser.Geom.Rectangle( x, y, width, height), Phaser.Geom.Rectangle.Contains);
        zone.on('pointerover', () => zone.lineStyle(2,  hoverColor  ).strokeRect(x, y, width, height) );
        zone.on('pointerout' , () => zone.lineStyle(2,  defaultColor).strokeRect(x, y, width, height) );
        zone.on('pointerdown', () => {
            if(row){//我方區域
                if(CardSelected == 1 && (round == 0 ||round == 1)&& put_card_frequency){//來自手牌、我方回合、有放置次數    
                    //handCardsContainer1.slice(handCardsContainer1.findIndex(card => card === focus_card),1);
                    const focusCardIndex = handCardsContainer1.findIndex(card => card === focus_card);
                    if (focusCardIndex !== -1) {
                        handCardsContainer1.splice(focusCardIndex, 1);
                    }
                    fieldContainer1[col] = focus_card;
                    focus_card.setData('cardType', 'field');
                    focus_card.list[1].visible = false;
                    Arrange_cards(scene);

                    scene.tweens.add({
                        targets: focus_card,
                        x: x + width / 2,
                        y: y + height/ 2,
                        duration: 500,
                        onComplete: () => {
                            focus_card = null;
                            CardSelected = 0;
                        }
                    });
                }
            }
            else{
                
            }

        });
    }
    scene.add.image(63 , 150, 'cardback').setDisplaySize(width, height).setOrigin(0,0);
    scene.add.image(663, 306, 'cardback').setDisplaySize(width, height).setOrigin(0,0);
}

function createPlayerUI(scene) {
    var width = 250, height = 30, interval = 5;
    //X1 = 50, Y1 = 50, X2 = 750, Y2 = 550;

    createPlayer(X1, Y1, other_role, false);//enemy
    createPlayer(X2, Y2, self_role , true );//self

    X1 = X1 + radius - interval * 2;
    X2 = X2 - radius + interval * 2 - width;
    Y1 = Y1 - 10 - height;
    Y2 = Y2 + 10;

    createBar(X1, Y1, width, height, other_point/ other_point_max, false, `HP: ${other_point}/${other_point_max}`);
    createBar(X2, Y2, width, height, self_point / self_point_max , true , `HP: ${self_point }/${self_point_max }`); 

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
        const barWidth= width - interval;
        const redWidth= reverse ? barWidth - barWidth * (1 - ratio) : barWidth * ratio;
        const xOffset = reverse ? barWidth - redWidth : 0;
        bar.fillStyle(0xff0000, 1).fillRoundedRect(x + interval / 2 + xOffset, y + interval / 2, redWidth, height - interval, 10);
        //文字
        const style = { font: '18px Arial', fill: '#ffffff' };
        scene.add.text(x + width / 2, y + height / 2 + interval * 2, text, style).setOrigin(0.5, 1);
    }
}

function dealing_cards(scene) {
    const Width = 64, Height = 96, Spacing = 74, x = 663 , y = 306 ;
    const container = create_card(scene, x, y, Width, Height);

    if (handCardsContainer1.length >= 10) {// 移除超過手牌數量限制的卡片
        const removedCardObject = handCardsContainer1.shift();
        destroy_cards(scene,removedCardObject);
        Arrange_cards(scene);
    }

    scene.tweens.add({
        targets: container,
        x: 50 + handCardsContainer1.length  * Spacing,
        y: 500,
        scaleX: container.scaleX * -1,
        duration: 500,
        onUpdate: (tween, target) => {
            if (tween.progress >= 0.5) {
                const number = container.getData('cardData');
                container.list[0].setTexture(`${database[number].attributes}${database[number].cardlevel}`);
            }
        },
    });
    handCardsContainer1.push(container);
}
function create_card(scene, x, y, Width, Height) {
    const card_number= Phaser.Math.Between(0, deckContainer1.length - 1);
    const cardData   = deckContainer1.splice(card_number, 1)[0];
    const cardImage  = scene.add.image(0, 0, 'cardback').setDisplaySize(Width, Height).setFlipX(true);
    const cardBorder = scene.add.graphics().lineStyle(2, 0xff0000).strokeRect(-Width / 2, -Height / 2, Width, Height).setVisible(false);
    const container  = scene.add.container(x, y).setSize(Width, Height).add([cardImage, cardBorder]).setInteractive({useHandCursor: true});

    container.setData('cardData', cardData);
    container.setData('cardType', 'hand');

    container.on('pointerover', () => {
        drawcardform(container.getData('cardData'));
    });

    container.on('pointerdown', () => {
        for (let i = 0; i < handCardsContainer1.length; i++) {
            handCardsContainer1[i].list[1].visible = (handCardsContainer1[i] == container)
        }
        for (let i = 0; i < fieldContainer1.length; i++) {
            if(fieldContainer1[i]) fieldContainer1[i].list[1].visible = (fieldContainer1[i] == container)
        }
        if(container.getData('cardType')=='hand'){
            CardSelected = 1;
        }
        if(container.getData('cardType')=='field'){
            CardSelected = 2;
        }
        focus_card = container;
    });
    return container;
}
function destroy_cards(scene,removedCardObject) {
    scene.tweens.killTweensOf(removedCardObject);
    deckContainer1.push(removedCardObject)
    removedCardObject.destroy();
}
function Arrange_cards(scene) {
    const Width = 64, Spacing = 10;
    for (let i = 0; i < handCardsContainer1.length; i++) {
        scene.tweens.add({
            targets: handCardsContainer1[i],
            x: 50 + i * (Width + Spacing),
            y: 500,
            duration: 500,
        });
    }
}
function put_card(scene,row,col) {
    fieldContainer1[col] = focus_card;
    focus_card.setData('cardType', 'field').list[1].visible = false;
    scene.tweens.add({
        targets: focus_card,
        x: x + width / 2,
        y: y + height/ 2,
        duration: 500,
    });
    const cardIndex = handCardsContainer1.findIndex((handCard) => handCard === focus_card);
    if (cardIndex !== -1) handCardsContainer1.splice(cardIndex, 1);
    Arrange_cards(scene);
    put_card_frequency--;
    CardSelected = 0;
    focus_card = null;   
}

function drawcardform(cardData){
    var imageContent = document.getElementById('image-content');
    var existingImage = imageContent.querySelector('img');
    if (existingImage) existingImage.remove();

    // card_form.cardlevel = parseInt(cardData.match(/\d+/));
    // card_form.cardname = cardData.replace(/\d+/, '').toLowerCase();
    // card_form.attributes = card_name.indexOf(card_form.cardname);
    // card_form.cardmunber = card_form.cardlevel + card_form.attributes*13;

    var img = document.createElement('img')
    img.width = 196;
    img.height= 294;
    img.src = `assets/${database[cardData].attributes}-${database[cardData].cardlevel}.png`;
    imageContent.appendChild(img);

    var fileContentElement = document.getElementById('file-content');
    fileContentElement.innerHTML = `
        <strong>名稱: </strong><p>&nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].name}</p>
        <strong>描述: </strong><p id='content'>&nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].content}</p>
        <strong>卡牌: </strong><p>&nbsp;&nbsp;&nbsp;&nbsp;${database[cardData].attributes} - ${database[cardData].cardlevel}</p>`;

}

function computer_battle_(scene) {
    var x1 = 200, y1 = 300, x2 = 600, y2 = 300, frames = [];

    other_Attributes= Phaser.Math.Between(0, 3);
    self_Attributes = Phaser.Math.Between(0, 3);

    other_point= other_point_max= Phaser.Math.Between(11, 13) * 3;
    self_point = self_point_max = Phaser.Math.Between(11, 13) * 3;

    other_role= `${portrait_name[other_Attributes]}${other_point_max/ 3 - 10}`;
    self_role = `${portrait_name[self_Attributes ]}${self_point_max / 3 - 10}`;

    for(let i = 0; i < 4; i++) {
        for(let j = 1; j <= 13; j++){
            deckContainer0.push( i * 13 + j );
            deckContainer1.push( i * 13 + j );
        }
        for(let j = 1; j <= 3 ; j++)frames.push(`${ portrait_name[i]}${j}`);
    }
    var cardToRemove0 = other_Attributes* 13 + other_point_max/ 3;
    var cardToRemove1 = self_Attributes * 13 + self_point_max / 3;
    deckContainer0.splice(deckContainer0.indexOf(cardToRemove0), 1);
    deckContainer1.splice(deckContainer1.indexOf(cardToRemove1), 1);

    scene.add.graphics().fillStyle(0x222222).fillRect(0, 0, config.width, 600);
    
    createIcon(x1, y1, X1, Y1, other_role);
    createIcon(x2, y2, X2, Y2, self_role );

    scene.time.delayedCall(3000,() => {
        drawzone(scene);
        createPlayerUI(scene);
        for (let i = 0; i < 5; i++) scene.time.delayedCall(i * 500, dealing_cards, [scene]);
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
     
function computer_battle_(scene) {
    var x1 = 200, y1 = 300, x2 = 600, y2 = 300, frames = [];
    for(let i = 0; i < 4; i++) for(let j = 1; j <= 3; j++) frames.push(`${ portrait_name[i]}${j}`);
    scene.add.graphics({ fillStyle: { color: 0x222222 } }).fillRect(0, 0, config.width, 600);
    var mask1 = scene.add.graphics().fillCircle(x1, y1,  radius);
    var mask2 = scene.add.graphics().fillCircle(x2, y2,  radius);
    var Icon1 = scene.add.image(x1, y1, frames[0]).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setMask(mask1.createGeometryMask());
    var Icon2 = scene.add.image(x2, y2, frames[0]).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setMask(mask2.createGeometryMask());
    scene.tweens.add({
        targets: Icon1,
        duration: 200,
        repeat: 5,
        callback: () => {
            Icon1.setTexture(frames[Phaser.Math.Between(0, frames.length - 1)]);
            Icon2.setTexture(frames[Phaser.Math.Between(0, frames.length - 1)]);
        },
        onComplete: ()=>{
            other_Attributes= Phaser.Math.Between(0, 3);
            self_Attributes = Phaser.Math.Between(0, 3);
            other_point_max = Phaser.Math.Between(11, 13) * 3;
            self_point_max  = Phaser.Math.Between(11, 13) * 3;
            self_point =  self_point_max;
            other_point=  other_point_max;
            other_role= `${portrait_name[other_Attributes]}${[other_point_max/ 3 - 10]}`;
            self_role = `${portrait_name[self_Attributes ]}${[self_point_max / 3 - 10]}`;
            Icon1.setTexture(other_role);
            Icon2.setTexture(self_role );

            for(let i=0;i<=3;i++) for(let j=1;j<=13;j++) deckContainer.push(`${card_name[i]}${j}`);
            var cardToRemove = `${card_name[ self_Attributes]}${self_point_max / 3 }`;
            deckContainer.splice(deckContainer.indexOf(cardToRemove), 1);
            scene.time.delayedCall(500, moveicon, [], this);
        }
    });
    function moveicon(){
        var Icon1_ = scene.tweens.add({
            targets: Icon1,
            x:  X1,
            y:  Y1,
            duration: 2000,
            ease: 'Power2',
            onUpdate:  (tween, target) => mask1.clear().fillCircle(target.x, target.y,  radius),
        });
        var Icon2_ =scene.tweens.add({
            targets: Icon2,
            x:X2,
            y:Y2,
            duration: 2000,
            ease: 'Power2',
            onUpdate:  (tween, target) => mask2.clear().fillCircle(target.x, target.y,  radius),
            onComplete:()=>{
                drawzone(scene);
                createPlayerUI(scene);
                for (let i = 0; i < 15; i++)scene.time.delayedCall(i * 500, dealing_cards, [scene]);
                drawcardform();
            }
        });
    }
}
     
function creatTeaching_area(scene){
    const tx = 300, tx2 = 200, ty = 450, cx = 650, cy = 150, radius = 20;
    var mask = scene.add.graphics();  //teach貓的遮罩
    mask.fillRoundedRect(  550, 350, 150, 150, 20);
    var teach_cat = scene.add.image( 625, 425 , 'teach_cat' );          //teach貓的圖片
    teach_cat.displayWidth = 150;
    teach_cat.displayHeight= 150;
    teach_cat.setMask(mask.createGeometryMask());
    var teach_schedule = 0;
    var Tcontent = [
        '在你登录前，\n由我来教导你这个游戏的玩法吧！\n什麼，你問我叫什麼？\n嗯...就叫我教學貓吧?別在意那種小事。',
        '總之，讓我們開始吧！！\n我們的遊戲需要由2名玩家進行，\n......',
        '........'
    ];
    var style1 = {font: '30px Arial',fill: '#888888',wordWrap: { width: 300 },};
    var style2 = {font: 'bold 30px Arial',fill: '#000000',};
    var style3 = {font: '20px Arial',fill: '#000000',};
    var Text1 = scene.add.text(150, 150, Tcontent[teach_schedule], style1);
    var Text2 = scene.add.text( (tx+tx2) / 2 , ty+15, '', style3).setOrigin(0.5);
    var Text3 = scene.add.text(cx + 1, cy + 1, '✖', style2).setOrigin(0.5).setDepth(1);
    button1.on( 'pointerover',() => button1.clear().fillStyle(0x0000FF, 1).fillTriangleShape(triangle1));
    button2.on( 'pointerover',() => button2.clear().fillStyle(0x0000FF, 1).fillTriangleShape(triangle2));
    button3.on( 'pointerover',() => button3.clear().fillStyle(0xFF0000, 1).fillCircle  (cx, cy, radius));
    Text2.setText(`(${teach_schedule + 1}/${Tcontent.length})`);
    //下一頁按鈕
    var button1 = scene.add.graphics({fillStyle: { color : 0xFFFF00 } });
    var button2 = scene.add.graphics({fillStyle: { color : 0xFFFF00 } });
    var button3 = scene.add.graphics({fillStyle: { color : 0xFF3333 } });
    var triangle1 = new Phaser.Geom.Triangle(tx , ty, tx , ty + 30, tx  + 30, ty + 15);
    var triangle2 = new Phaser.Geom.Triangle(tx2, ty, tx2, ty + 30, tx2 - 30, ty + 15);
    var circle1   = new Phaser.Geom.Circle(cx, cy, radius);
    // 初始样式
    button1.fillTriangleShape(triangle1);
    button2.fillTriangleShape(triangle2);
    button3.fillCircle(cx, cy, radius);
    button1.setInteractive(triangle1, Phaser.Geom.Triangle.Contains);
    button2.setInteractive(triangle2, Phaser.Geom.Triangle.Contains);
    button3.setInteractive(circle1, Phaser.Geom.Circle.Contains); 
    // 指定 pointerover 滑鼠移入 事件
    button1.on( 'pointerover',() => button1.clear().fillStyle(0x0000FF, 1).fillTriangleShape(triangle1));
    button2.on( 'pointerover',() => button2.clear().fillStyle(0x0000FF, 1).fillTriangleShape(triangle2));
    button3.on( 'pointerover',() => button3.clear().fillStyle(0xFF0000, 1).fillCircle  (cx, cy, radius));
    // 指定 pointerout 滑鼠移出 事件
    button1.on( 'pointerout' ,() => button1.clear().fillStyle(0xFFFF00, 1).fillTriangleShape(triangle1));
    button2.on( 'pointerout' ,() => button2.clear().fillStyle(0xFFFF00, 1).fillTriangleShape(triangle2));
    button3.on( 'pointerout' ,() => button3.clear().fillStyle(0xFF3333, 1).fillCircle  (cx, cy, radius));
    //指定 pointerdown 滑鼠點擊 事件
    
    button1.on( 'pointerdown' ,handleButtonClick( 1,teach_schedule, Tcontent, Text1, Text2));
    button2.on( 'pointerdown' ,handleButtonClick(-1,teach_schedule, Tcontent, Text1, Text2));
    button3.on( 'pointerdown' ,()=>teach_ = false);

    function handleButtonClick(increment){
        return ()=>{
            teach_schedule = (teach_schedule + increment + Tcontent.length) % Tcontent.length;
            Text1.setText(Tcontent[ teach_schedule]);
            Text2.setText(`(${teach_schedule + 1}/${Tcontent.length})`);
        }
    }
}
