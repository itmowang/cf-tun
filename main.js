const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');  // 用于执行命令
const configStore = require('../store/configStore');


ipcMain.handle('get-config', () => {
  return configStore.getConfig();
});

ipcMain.handle('save-config', (event, data) => {
  return configStore.saveConfig(data);
});

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

// 启动隧道逻辑
ipcMain.handle('start-tunnel', (event, tunnelToken) => {
  return new Promise((resolve, reject) => {
    const command = `cloudflared tunnel run --token ${tunnelToken}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(`Failed to start tunnel: ${stderr}`);
      } else {
        console.log(`Success: ${stdout}`);
        resolve(`Tunnel started successfully: ${stdout}`);
      }
    });
  });
});

// 关闭隧道逻辑
ipcMain.handle('stop-tunnel', (event,tunnelToken) => {
  return new Promise((resolve, reject) => {
    // Windows 使用 taskkill，其他平台使用 pkill
    const command = process.platform === 'win32' ? 'taskkill /F /IM cloudflared.exe' : 'pkill cloudflared';
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error stopping tunnel: ${stderr}`);
        reject(`Failed to stop tunnel: ${stderr}`);
      } else {
        console.log(`Tunnel stopped successfully: ${stdout}`);
        resolve(`Tunnel stopped successfully: ${stdout}`);
      }
    });
  });
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
