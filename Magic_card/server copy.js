// 導入所需模組
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { user_data } = require('./User_list.js');
const { send } = require('process');

// 建立 Express 應用程式
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// 資料區
var portrait_name = ['dust_face','water_face','fire_face','wind_face'];
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.gameData = {       // 初始化遊戲相關資料
            attributes: 0,      // 屬性
            point_max: 0,       // 最大血量
            point: 0,           // 血量
            role: '',           // 角色名稱
            handContainer: [],  // 手牌
            fieldContainer: [], // 場地
            deckContainer: [],  // 牌組
        };
    }
}
const players = {};
const waitList = {};
const battleList = {};
let battle = 0;

app.use(express.static(path.join(__dirname, 'game')));
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'game/login_page.html')); // 將 index.html 發送到瀏覽器
});

io.on('connection', (socket) => {
    let userId = null;
    let battleId = 0;

    socket.on('login', ({ playerName, gameCode }) => {
        let foundAccount = user_data.find(account => account.name === playerName && account.code === gameCode);
        let token = 0;
        if (foundAccount) {
            token = foundAccount.Permissions;
            web_id = socket.id;
            players[web_id]   = new Player(web_id  , playerName);   // 創建角色
            players[web_id+1] = new Player(web_id+1, 'NPC');        // 創建NPC的角色
            io.emit('chat message', playerName + '加入了遊戲');
            console.log(web_id    + playerName + '加入了遊戲');
        }
        io.emit('login', token);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', (players[userId] ? players[userId].name : '未知用戶') + ': ' + msg);
        console.log(userId    + (players[userId] ? players[userId].name : '未知用戶') + ': ' + msg);
    });


    socket.on('get id', (_id) => userId = _id );
    socket.on('update data', () => io.emit('update data',battleList[battleId]));

    socket.on('computer battle', () => {
        console.log('computer battle');
        // 創建自己和電腦的資料
        players[userId] = createGameData(userId);
        players[userId + 1] = createGameData(userId + 1);

        // 將兩個玩家放入對戰列表，並以 battleId 作為鍵值存儲
        battleId = ++battle;
        battleList[battleId] = { player1: players[userId], player2: players[userId + 1],id: battleId};
    
        // 發送對戰列表給客戶端，讓客戶端進行選擇對手
        io.emit('start anime', battleList[battleId]);
    })


    // socket.on('start anime ends', () => {   //動畫結束，要發牌了!
    //     for (let i = 0; i < 5; i++) {       // 發卡牌
    //         scene.time.delayedCall(i * 500, sendcard,[battleList[battleId].player1]);
    //         scene.time.delayedCall(i * 500, sendcard,[battleList[battleId].player2]);
    //     }
    // });
    // function sendcard(player){
    //     if (player) {
    //         if(player.handContainer >= 10) io.emit('destory card', player.handContainer.shift(), player.id);
    //         if(player.deckContainer.length > 0){
    //             const cardIndex = Phaser.Math.Between(0, player.deckContainer.length - 1);
    //             const cardData = player.deckContainer.splice(cardIndex, 1)[0];
    //             player.handContainer.push(cardData);
    //             io.emit('send card', cardData, player.id);
    //         } 
    //     }
    // }
    // function createGameData(id_){
    //     const point_max = (Math.floor(Math.random() * 2) + 11) * 3; // 隨機生成 point_max (11~13)
    //     const attributes = Math.floor(Math.random() * 3);           // 隨機生成 attributes (0~3)
    //     const gameData = {
    //         attributes: attributes,
    //         point_max: point_max,
    //         point: point_max,
    //         role: `${portrait_name[attributes]}${point_max / 3 - 10}`,
    //         handContainer: [],
    //         fieldContainer: [],
    //         deckContainer: Array.from({ length: 54 }, (_, index) => index + 1)
    //             .filter(num => num !== (attributes * 13 + point_max / 3)),
    //     };
    //     if (players[id_]) return gameData;
    //     else return null;
    // }



});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});