const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    resizeWindow: (data) => ipcRenderer.invoke('resize-window', data),
    showControlPanel: () => ipcRenderer.invoke('show-control-panel'),
    adjustOpacity: (delta) => ipcRenderer.invoke('adjust-opacity', delta),
    getCurrentOpacity: () => ipcRenderer.invoke('get-current-opacity'),
    getCurrentColor: () => ipcRenderer.invoke('get-current-color'),
    onStyleUpdate: (callback) => ipcRenderer.on('style-update', callback)
});