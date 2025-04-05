const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');  // 用于执行命令
const configStore = require('../configStore');


// 检查 cloudflared 是否安装，如果未安装则启动安装
ipcMain.handle('check-cloudflared', () => {
  return new Promise((resolve, reject) => {
    exec('cloudflared --version', (error, stdout, stderr) => {
      if (error || stderr) {
        console.log('cloudflared not found, starting installation...');
        // 如果未安装，启动安装过程
        exec('winget install --id  Cloudflare.cloudflared', (installError, installStdout, installStderr) => {
          if (installError || installStderr) {
            console.log('Error installing cloudflared:', installStderr || installError.message);
            reject('Installation failed');
          } else {
            console.log('cloudflared installation successful');
            // 安装完成后重启应用
            app.relaunch();
            app.exit();
            resolve('cloudflared installed and app restarted');
          }
        });
      } else {
        console.log('cloudflared Version:', stdout.trim());
        resolve('cloudflared is already installed');
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


ipcMain.handle('get-config', () => {
  return configStore.getConfig();
});

ipcMain.handle('save-config', (event, data) => {
  return configStore.saveConfig(data);
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
