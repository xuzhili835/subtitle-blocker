const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    updateBlockerStyle: (data) => ipcRenderer.invoke('update-blocker-style', data),
    showControlPanel: () => ipcRenderer.invoke('show-control-panel'),
    quitApp: () => ipcRenderer.invoke('quit-app'),
    onOpacityUpdate: (callback) => ipcRenderer.on('opacity-update', callback),
    getSettings: () => ipcRenderer.invoke('get-settings')
});