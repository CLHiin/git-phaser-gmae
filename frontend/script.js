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
                window.location.href = '/game'; // 根据你的需求修改跳转地址
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

var defaultColor=0xffffff;
var hoverColor = 0x00ffff;
var color = 0xffffff;
//頂部UI
var other_Attributes=2;//屬性
var self_Attributes =0;

var other_point_max=36; //生命點數
var self_point_max =36;
var other_point=36;
var self_point =36;

var other_role='fire_face2';
var self_role ='dust_face2';

var X1 = 50, Y1 = 50, X2 = 750, Y2 = 550, radius = 50;
//遊戲數據區
var portrait_name=['dust_face','water_face','fire_face','wind_face'];
var card_name=['dust','water','fire','wind'];
var card_form={             //關注的卡片資訊
    attributes:null,           //卡片屬性 0土、1水、2火、3風
    cardlevel:null,            //卡片等級 1~13
    cardname:null,
    cardmunber:null
};
var deckContainer = [];     //卡組
var handCardsContainer = [];//手牌


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
    this.add.graphics({ fillStyle: { color : 0xc8bfe7 } }).fillRoundedRect( 100, 50, 600, 500, 20);
    var x = 300, y = 200, width = 200, height = 50, radius = 20;
    var textData = ['電腦對戰','多人對戰','教程模式'];
    var style = {font: 'bold 50px Arial',fill: '#FF0000',};
    var Text0 = this.add.text( x + width / 2, (y + height) / 2, '魔法撲克', style).setOrigin(0.5);
    for (let i = 0; i < 3; i++) create_button.call(this, i);
    function create_button(i){
        var button = this.add.graphics({fillStyle: { color : 0xFFFF00 } }); 
        button.fillRoundedRect( x, y + i * 100, width, height, radius);
        button.setInteractive(new Phaser.Geom.Rectangle( x, y + i * 100, width, height), Phaser.Geom.Rectangle.Contains);
        button.on('pointerover', () => button.clear().fillStyle(0x0000FF, 1).fillRoundedRect( x, y + i * 100, width, height, radius));
        button.on('pointerout' , () => button.clear().fillStyle(0xFFFF00, 1).fillRoundedRect( x, y + i * 100, width, height, radius));
        button.on('pointerdown', () => {
            button.destroy();
            if (i === 0) computer_battle_(this);
            else if (i === 1) Multiplayer_battle = true;
            else if (i === 2) Tutorial_mode      = true;
        });
        var style = {font: `bold 30px Arial`,fill: `#000000 }`,};
        var text = this.add.text( x + width / 2, y + i * 100 + height / 2, textData[i], style).setOrigin(0.5);
    }
}

function update(){

}



function drawzone(scene){
    scene.add.graphics({ fillStyle: { color: 0x444444 } }).fillRect(0, 0, config.width, config.height);
    var width = 64, height = 96, zradius = 20;
    for (var row = 0; row < 2; row++) for (var col = 0; col < 5; col++) drawstrokeRoundedRect(row, col);
    function drawstrokeRoundedRect(row,col){
        var x = 163 + col * 100;
        var y = 150 + row * 156;
        var zone = scene.add.graphics().lineStyle(2,  defaultColor).strokeRoundedRect(x, y, width, height, zradius);
        zone.setInteractive(new Phaser.Geom.Rectangle( x, y, width, height), Phaser.Geom.Rectangle.Contains);
        zone.on('pointerover', () => zone.lineStyle(2,  hoverColor  ).strokeRoundedRect(x, y, width, height, zradius) );
        zone.on('pointerout' , () => zone.lineStyle(2,  defaultColor).strokeRoundedRect(x, y, width, height, zradius) );
        zone.on('pointerdown', () => {

        });
    }
    scene.add.image(63 , 150, 'cardback').setDisplaySize(width, height).setOrigin(0,0);
    scene.add.image(663, 306, 'cardback').setDisplaySize(width, height).setOrigin(0,0);
}

function createPlayerUI(scene) {
    var width = 250, height = 30, interval = 5;
    var mask1 = scene.add.graphics().fillCircle(X1, Y1, radius).fillRect( X1 - radius, Y1 - radius, 2 * radius, radius);
    var mask2 = scene.add.graphics().fillCircle(X2, Y2, radius).fillRect( X2 - radius, Y2         , 2 * radius, radius);
    var enemy= scene.add.image(X1, Y1, other_role).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setDepth(1).setMask(mask1.createGeometryMask());
    var self = scene.add.image(X2, Y2, self_role ).setOrigin(0.5, 0.5).setDisplaySize(100, 100).setDepth(1).setMask(mask2.createGeometryMask());
    X1 = X1 + radius - interval * 2;
    X2 = X2 - radius + interval * 2 - width;
    Y1 = Y1 - 10 - height;
    Y2 = Y2 + 10;
    var barHP1 = createBar(X1, Y1, width, height);
    var barHP2 = createBar(X2, Y2, width, height);
    var redHP1 = createRedBar(X1, Y1, width, height, other_point/ other_point_max,false);
    var redHP2 = createRedBar(X2, Y2, width, height, self_point / self_point_max ,true);
    var enemyHPText= createHPText(X1 + width / 2, Y1 + height / 2 + interval * 2, `HP: ${other_point}/${other_point_max}`);
    var selfHPText = createHPText(X2 + width / 2, Y2 + height / 2 + interval * 2, `HP: ${self_point }/${self_point_max }`);
    function createBar(x, y, width, height) {
        var bar = scene.add.graphics();
        bar.fillStyle(0xFFFFFF, 1).fillRoundedRect(x, y, width, height, 10);
        bar.fillStyle(0x000000, 1).fillRoundedRect(x + interval / 2, y + interval / 2, width - interval, height - interval, 10);
        return bar;
    }
    function createRedBar(x, y, width, height, ratio, reverse) {
        var redBar = scene.add.graphics({ fillStyle: { color : 0xff0000 } });
        var barWidth = width - interval;
        var redWidth = reverse ? barWidth - barWidth * (1 - ratio) : barWidth * ratio;
        var xOffset  = reverse ? barWidth - redWidth : 0; 
        redBar.fillRoundedRect(x + interval / 2 + xOffset, y + interval / 2, redWidth, height - interval, 10);
        return redBar;
    }
    function createHPText(x, y, text) {
        var style = {font: '18px Arial',fill: '#ffffff'};
        var hpText = scene.add.text(x, y, text, style).setOrigin(0.5, 1);
        return hpText;
    }
}

function dealing_cards(scene) {
    const Width = 64, Height = 96, Spacing = 10, x = 663, y = 306;

    // 移除超過手牌數量限制的卡片
    if (handCardsContainer.length >= 10) {
        const removedCardObject = handCardsContainer.shift();
        scene.tweens.killTweensOf(removedCardObject.cardImage);
        removedCardObject.cardImage.destroy();
        Arrange_cards(scene, Width, Spacing);
    }

    // 創建新卡片
    const card_number = Phaser.Math.Between(0, deckContainer.length - 1);
    const cardData = deckContainer.splice(card_number, 1)[0];

    const cardImage = scene.add.image(x, y, 'cardback')
        .setDisplaySize(Width, Height)
        .setOrigin(0, 0)
        .setFlipX(true)
        .setInteractive();

    const cardObject = {
        cardImage,
        cardData,
    };

    // 移動新卡片的 Tween 動畫
    scene.tweens.add({
        targets: cardImage,
        x: Spacing + (handCardsContainer.length + 1) * (Width + Spacing),
        y: 450,
        scaleX: cardImage.scaleX * -1,
        duration: 500,
        onUpdate: (tween, target) => {
            if (tween.progress >= 0.5) cardImage.setTexture(cardData);
        }
    });

    handCardsContainer.push(cardObject);

    cardImage.on('pointerover', function () {
        drawcardform(cardData);
    });

    cardImage.on('pointerdown', function () {
        card_Border = scene.add.graphics().lineStyle(2,0xff0000).strokeRect(cardImage.x - Width, cardImage.y, Width, Height);
    });
}
function Arrange_cards(scene, Width, Spacing){
    for (let i = 0; i < handCardsContainer.length; i++) {
        const cardObject = handCardsContainer[i];
        scene.tweens.add({
            targets: cardObject.cardImage,
            x: Spacing + (i + 1) * (Width + Spacing),
            y: 450,
            duration: 500,
        });
    }
}

function drawcardform(cardData){
    var imageContent = document.getElementById('image-content');
    var existingImage = imageContent.querySelector('img');
    if (existingImage) existingImage.remove();
    var img = document.createElement('img')
    img.width = 196;
    img.height = 294;
    if(cardData){
        card_form.cardlevel = parseInt(cardData.match(/\d+/));
        card_form.cardname = cardData.replace(/\d+/, '').toLowerCase();
        card_form.attributes = card_name.indexOf(card_form.cardname);
        card_form.cardmunber = card_form.cardlevel + card_form.attributes*13;
        img.src = `assets/${card_form.cardname}-${card_form.cardlevel}.png`;
        imageContent.appendChild(img);
        var fileContentElement = document.getElementById('file-content');
            fileContentElement.innerHTML = `
            <strong>名稱: </strong><p>&nbsp;&nbsp;&nbsp;&nbsp;${database[card_form.cardmunber].name}</p>
            <strong>描述: </strong><p id='content'>&nbsp;&nbsp;&nbsp;&nbsp;${database[card_form.cardmunber].content}</p>
            <strong>卡牌: </strong><p>&nbsp;&nbsp;&nbsp;&nbsp;${database[card_form.cardmunber].attributes} - ${card_form.cardlevel}</p>
            `;
    }    
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
