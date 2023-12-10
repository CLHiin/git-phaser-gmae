document.getElementById('system-tab').addEventListener('click', () => {
    showSelectedTab('system-messages');
});

document.getElementById('server-tab').addEventListener('click', () => {
    showSelectedTab('server-messages');
});

document.getElementById('battle-tab').addEventListener('click', () => {
    showSelectedTab('battle-messages');
});

// 函數用於顯示選定的分頁及對應的對話列表，並隱藏其他對話列表
function showSelectedTab(tabId) {
    const messageLists = document.querySelectorAll('.message-list');
    messageLists.forEach(list => {
        if (list.id === tabId) {
            list.style.display = 'block';
        } else {
            list.style.display = 'none';
        }
    });
}