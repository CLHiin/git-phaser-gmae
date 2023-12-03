
const socket = io();

const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
    const playerName = document.getElementById("input1").value;
    const gameCode = document.getElementById("input2").value;
    socket.emit('login', playerName, gameCode );
});
socket.on('login', (token) => {
    if (token > 0){
        alert('登入成功');
        var body = `<div id="zone"><div id="Information"><ul id="messages"></ul><div class="input-container">
            <textarea id="inputMessage" rows="1" style="width: 200px;"></textarea><button id="sendButton">發送</button>
            </div></div><div id="game-container"></div><div id="Information"><table style="color: white;">
            <tbody id="image-content"></tbody><tbody id="file-content"></tbody></table></div></div>`;
        var script = document.createElement('script');
        script.src = 'script2.js';

        document.body.innerHTML = body;
        document.head.appendChild(script);

        const sendMessage = () => {
            const messageInput = document.getElementById('inputMessage');
            let message = messageInput.value.trim();                            // 取得輸入區的資料
            if (message !== '') {                                               // 如果文字不為空
                if (message.length > 60) message = message.slice(0, 60)+'...';  // 當文字超過60字則只保留60字，並在後面加上'...'
                socket.emit('chat message', message);                           // 呼叫 chat message 事件到伺服器，並給予其 message
                messageInput.value = '';                                        // 清空輸入區
            }
        };
        document.getElementById('sendButton').addEventListener('click', sendMessage);   // 點擊輸出按鈕，隨後呼叫函式
        document.getElementById('inputMessage').addEventListener('keypress', (e) => {   // 按下鍵盤
            if (e.key === 'Enter') e.preventDefault(),sendMessage();                    // 如果是 Enter ，則取消默認行為(換行)，並呼喚函式
        });
    }
    else if (token == 0)alert('登入失敗，該帳戶正在被登錄中。');
    else alert('登入失敗，請檢查你的輸入。');
});
