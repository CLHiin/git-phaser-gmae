const socket = io();

const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
    const playerName = document.getElementById("input1").value;
    const gameCode = document.getElementById("input2").value;
    socket.emit('login', playerName, gameCode );
});
let token = -1;
socket.on('login', (t) => {
    token = t;
    if (token > 0){
        alert('登入成功');
        var body =
    `<div id="zone">
        <div id="Information">
            <div class="tabs">
                <button id="system-tab">系統通知</button>
                <button id="public-tab">公開對話</button>
                <button id="battle-tab">對戰對話</button>
            </div>

            <div class="list">
                <ul id="system-message" class="message-list" style="display:block;"></ul>
                <ul id="public-message" class="message-list" style="display: none;"></ul>
                <ul id="battle-message" class="message-list" style="display: none;"></ul>
            </div>

            <div class="input-container">
                <textarea id="inputMessage" rows="1" data-target="system-message"></textarea>
                <button id="sendButton">發送</button>
            </div>
        </div>

        <div id="game-container"></div>

        <div id="Information">
            <table style="color: white;">
                <tbody id="image-content"></tbody>
                <tbody id="file-content"></tbody>
            </table>
        </div>
    </div>`;
        var script = document.createElement('script');
        script.src = 'script2.js';
        function sendMessage (){
            const messageInput = document.getElementById('inputMessage');
            const currentTab = messageInput.dataset.target; // 獲取當前對話框屬性
            let message = messageInput.value.trim();
            if(message !== '') {
                if(message.length > 60) message = message.slice(0, 60) + '...';
                if(currentTab !== 'system-message')socket.emit('chat message', message, currentTab); // 傳送訊息及當前對話框屬性給伺服器
                messageInput.value = '';
            }
        };
        function showSelectedTab(tabId) {
            const inputMessage = document.getElementById('inputMessage');
            const messageLists = document.querySelectorAll('.message-list');
            inputMessage.dataset.target = tabId; // 設置當前對話框的屬性
            messageLists.forEach(list=>list.style.display= list.id===tabId?'block':'none');
        }
        document.body.innerHTML = body;
        document.head.appendChild(script);

        document.getElementById('system-tab').addEventListener('click', () => showSelectedTab('system-message'));
        document.getElementById('public-tab').addEventListener('click', () => showSelectedTab('public-message'));
        document.getElementById('battle-tab').addEventListener('click', () => showSelectedTab('battle-message'));

        document.getElementById('sendButton').addEventListener('click', sendMessage);   // 點擊輸出按鈕，隨後呼叫函式
        document.getElementById('inputMessage').addEventListener('keypress', (e) => {   // 按下鍵盤
            if(e.key === 'Enter') e.preventDefault(),sendMessage();                     // 如果是 Enter ，則取消默認行為(換行)，並呼喚函式
        });
    }
    else if (token == 0)alert('登入失敗，該帳戶正在被登錄中。');
    else alert('登入失敗，請檢查你的輸入。');
});
