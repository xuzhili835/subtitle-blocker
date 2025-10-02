const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    resizeWindow: (data) => ipcRenderer.invoke('resize-window', data),
    quitApp: () => ipcRenderer.invoke('quit-app')
});