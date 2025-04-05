const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, process.versions[type]);
    }

});



// 这里可以暴露检查 cloudflared 是否安装的功能
// contextBridge.exposeInMainWorld('electron', {
//     checkCloudflared: () => ipcRenderer.invoke('check-cloudflared')
// });

contextBridge.exposeInMainWorld('electron', {
    checkCloudflared: () => ipcRenderer.invoke('check-cloudflared'),
    windowControl: (action) => {
        ipcRenderer.send('window-control', action);
    }
});

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    saveConfig: (data) => ipcRenderer.invoke('save-config', data),
    startTunnel: (tunnelToken) => ipcRenderer.invoke('start-tunnel', tunnelToken),
  });