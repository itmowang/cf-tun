"use strict";const{app:n,BrowserWindow:s,ipcMain:r}=require("electron"),t=require("node:path"),{exec:d}=require("child_process");r.handle("check-cloudflared",()=>new Promise(i=>{d("cloudflared --version",(o,e,l)=>{o||l?(console.log("cloudflared CheckError:",l||o.message),i(!1)):(console.log("cloudflared Version:",e.trim()),i(!0))})}));r.on("window-control",(i,o)=>{const e=s.getFocusedWindow();e&&(o==="minimize"?e.minimize():o==="maximize"?e.isMaximized()?e.unmaximize():e.maximize():o==="close"&&e.close())});n.whenReady().then(()=>{const i=new s({title:"Main window",frame:!1,titleBarStyle:"hidden",width:1200,height:800,webPreferences:{preload:t.join(__dirname,"preload.js"),nodeIntegration:!1,contextIsolation:!0}});process.env.VITE_DEV_SERVER_URL?i.loadURL(process.env.VITE_DEV_SERVER_URL):i.loadFile("dist/index.html"),i.webContents.openDevTools()});n.on("window-all-closed",()=>{process.platform!=="darwin"&&n.quit()});
