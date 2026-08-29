const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopBridge', {
  onOpenFile(callback) {
    ipcRenderer.on('open-litematic', (_event, payload) => callback(payload));
  }
});
