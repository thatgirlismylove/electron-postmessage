const { BrowserWindow, app, MessageChannelMain } = require('electron')
const path = require('node:path')

app.whenReady().then(async () => {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: true, // Electron 12.0.0 及以上版本默认启用
      preload: path.join(__dirname, 'preloadMain.js')
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()

  const secondaryWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preloadSecondary.js')
    }
  })
  secondaryWindow.loadFile('second.html')
  secondaryWindow.webContents.openDevTools()

  // 建立通道
  const { port1, port2 } = new MessageChannelMain()

  // webContents准备就绪后，使用postMessage向每个webContents发送一个端口。
  mainWindow.once('ready-to-show', () => {
    // 通知渲染进程，这里有一个 port 方法，可以与另外一个窗口通信
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})