const { BrowserWindow, app, MessageChannelMain } = require('electron')

app.whenReady().then(async () => {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: true, // Electron 12.0.0 及以上版本默认启用
      preload: 'preloadMain.js'
    }
  })
  mainWindow.loadFile('index.html')

  const secondaryWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: 'preloadSecondary.js'
    }
  })

  // 建立通道
  const { port1, port2 } = new MessageChannelMain()

  // webContents准备就绪后，使用postMessage向每个webContents发送一个端口。
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })
})