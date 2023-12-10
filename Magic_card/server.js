// 導入所需模組
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { user_data } = require('./User_list.js');
const { send } = require('process');
const { type } = require('os');

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
            PutCardFrequency: 0,// 放置卡牌次數
            player_number: null,// 回合
        };
    }
}
const players = {};
const battleList = {};
let battle = 0;

app.use(express.static(path.join(__dirname, 'game')));
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/game/game.html')); // 將 index.html 發送到瀏覽器
});
io.on('connection', (socket) => {
    let userId = socket.id;
    let battleId = 0;
    let gamemode = 0;
    let id_1 = null;
    let id_2 = null;

    socket.on('login', (playerName, gameCode) => {
        let foundAccount = user_data.find(account => account.name === playerName && account.code === gameCode);
        let playerAlreadyExists = Object.values(players).some(player => player && player.name === playerName);
        let token = -1;
        if(playerAlreadyExists) token = 0;
        else if (foundAccount) {
            token = foundAccount.Permissions;
            players[userId]   = new Player(userId  , playerName);   // 創建角色
            players[userId+1] = new Player(userId+1, 'NPC');        // 創建NPC的角色
            io.emit('chat message','玩家' + playerName + '加入了遊戲','public-message');
        }
        io.to(userId).emit('login', token);
    }); // OK
    socket.on('chat message', ( msg , type ) => {
        switch (type) {
            case 'system-message':
                io.to(userId).emit('chat message', '系統通知：'+ msg , type);
                break;
            case 'public-message':
                io.emit('chat message', (players[userId] ? players[userId].name : '未知用戶') + '：' + msg , type);
                break;
            case 'battle-message':
                io.to(id_1,id_2).emit('chat message', (players[userId] ? players[userId].name : '未知用戶') + '：' + msg , type);
                break;
        }
    }); // OK
    socket.on('update data', () => {
        if(battleId !== 0) io.to(userId).emit('update data',battleList[battleId]);
    });
    socket.on('computer battle', () => {
        if(players[userId]){
            battleId = ++battle;
            // 創建自己和電腦的資料
            players[userId]  .gameData = createGameData(1,userId  );
            players[userId+1].gameData = createGameData(2,userId+1);
            players[userId]  .gameData.PutCardFrequency = 1;
            // 將兩個玩家放入對戰列表，並以 battleId 作為鍵值存儲
            gamemode = 1;
            battleList[battleId] = {
                player1: players[userId],
                player2: players[userId+1],
                id: battleId,
                turn: 0,
            };
            id_1 = battleList[battleId].player1.id
            id_2 = battleList[battleId].player2.id;
            // 發送對戰列表給客戶端，讓客戶端確認自己的房間ID
            io.to(userId).emit('start anime', battleList[battleId]);
        }
        else io.to(userId).emit('error','沒有找到玩家資料，請嘗試重新登入。');
    })  // OK
    socket.on('start anime end', () => {
        io.to(userId).emit('draw zone');
        const repetitions = 15; // 計時器重複次數
        let count = 0;
        const timer = setInterval(() => {
            if (count++ < repetitions) {
                sendcard(players[userId]);
                if(gamemode === 1) sendcard(players[userId+1]);
            }
            else clearInterval(timer);
        }, 500);
    }); // OK
    socket.on('put card',(col,mode,cardData) => {
        let gameData = players[userId].gameData;
        if((mode === 'attack'||mode === 'defense') && players[userId].gameData.PutCardFrequency){
            gameData.handContainer.splice(gameData.handContainer.findIndex(obj => obj.cardData === cardData), 1);
            players[userId].gameData.fieldContainer[col] = {
                cardData: cardData,
                O_point: (cardData - 1 ) % 13 + 1,
                point: (cardData - 1 ) % 13 + 1,
                attributes: cardData > 52 ? cardData - 49 : Math.floor((cardData - 1) / 13),
                mode: mode,
            };
            console.log(players[userId].gameData)
            players[userId].gameData.PutCardFrequency--;
            io.to(id_1,id_2).emit('put card',col,userId);
            io.to(id_1,id_2).emit('arrange card',userId);
        }
        else io.to(userId).emit('chat message','無法將卡牌放至場上','system-message');
    });




    socket.on('disconnect', () => {
        console.log('客户端已斷開連結');

        if (players[userId]) {
            const playerName = players[userId].name;

            delete players[userId];
            delete players[userId+1];

            io.emit('chat message', playerName, '離開了遊戲');
            console.log(userId+' ', playerName, '離開了遊戲');
        } else {
            console.log('玩家未找到或未登入');
        }

    });

    function sendcard(player){
        if (player) {
            hand_container = player.gameData.handContainer;
            deck_Container = player.gameData.deckContainer;
            if(deck_Container.length > 0){
                const cardIndex = Math.round(Math.random() * (deck_Container.length - 1)); 
                const cardData = deck_Container.splice(cardIndex, 1)[0];
                let item = {
                    cardData: cardData,
                    O_point: (cardData - 1 ) % 13 + 1,
                    point: (cardData - 1 ) % 13 + 1,
                    attributes: cardData > 52 ? cardData - 52 : Math.floor((cardData - 1) / 13),
                    mode: 'attack',
                };
                hand_container.push(item);
                io.to(id_1,id_2).emit('send card', player.id, cardData);
            }
            if(hand_container.length > 10) {
                const cardData = hand_container.shift();   // 刪除最前面的手牌
                deck_Container.push(cardData.cardData);
                io.to(id_1,id_2).emit('destroy card', player.id,cardData.cardData);
                io.to(id_1,id_2).emit('arrange card', player.id);
            }
        }
    }   // OK
    function createGameData(numble,id_){
        const point_max = (Math.round(Math.random() * 2) + 11) * 3; // 隨機生成 point_max (11~13)
        const attributes = Math.round(Math.random() * 3);           // 隨機生成 attributes (0~3)
        const gameData = {
            attributes: attributes,
            point_max: point_max,
            point: point_max,
            role: `${portrait_name[attributes]}${point_max / 3 - 10}`,
            handContainer: [],
            fieldContainer: [],
            deckContainer: Array.from( {length: 54}, (_, index) => index + 1)
                .filter(num => num !== (attributes * 13 + point_max / 3)),
            PutCardFrequency: 0,
            player_number: numble,
        };
        if (players[id_]) return gameData;
        else return null;
    }   // OK
});
server.listen(PORT, () => {
    console.log(`服務器端口： ${PORT}`);
});