const { ipcRenderer } = require('electron')

const windowLoaded = new Promise((relose)=> {
    window.onload = relose
})

ipcRenderer.on('port', async (event) => {
    await windowLoaded() // 等待页面加载完成
    window.postMessage('channel-port', '*', event.ports)
})