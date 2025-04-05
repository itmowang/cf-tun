const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');  // 用于执行命令


// 加载预加载脚本
ipcMain.handle('check-cloudflared', () => {
  return new Promise((resolve) => {
    exec('cloudflared --version', (error, stdout, stderr) => {
      if (error || stderr) {
        console.log('cloudflared CheckError:', stderr || error.message);
        resolve(false);
      } else {
        console.log('cloudflared Version:', stdout.trim());
        resolve(true);
      }
    });
  });
});

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;
  if (action === 'minimize') win.minimize();
  else if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
  else if (action === 'close') win.close();
});

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: 'Main window',
    frame: false, // 关闭默认的标题栏和工具栏
    titleBarStyle: 'hidden', // 隐藏标题栏
    width: 1200,   // 默认宽度
    height: 800,   // 默认高度
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,  // 确保禁用 nodeIntegration
      contextIsolation: true,  // 开启上下文隔离
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
  }

  
  win.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
