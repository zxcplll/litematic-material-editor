const { app, BrowserWindow, Menu, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const ICON_PATH = path.join(__dirname, 'assets', 'app-icon.ico');
let mainWindow = null;
let pendingFile = null;

function litematicArgument(args) {
  return args.find((value) => value && !value.startsWith('-') && value.toLowerCase().endsWith('.litematic')) || null;
}

function sendFile(filePath) {
  if (!mainWindow || !filePath || !fs.existsSync(filePath)) return;
  try {
    const buffer = fs.readFileSync(filePath);
    mainWindow.webContents.send('open-litematic', { name: path.basename(filePath), data: Uint8Array.from(buffer) });
  } catch (error) {
    console.error(`读取 litematic 失败: ${error.message}`);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1450,
    height: 920,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0b1012',
    icon: ICON_PATH,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (pendingFile) { sendFile(pendingFile); pendingFile = null; }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    const filePath = litematicArgument(commandLine);
    if (filePath) sendFile(filePath);
    if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }
  });
  app.whenReady().then(() => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: '文件', submenu: [{ role: 'reload', label: '刷新' }, { role: 'toggleDevTools', label: '开发者工具' }, { type: 'separator' }, { role: 'quit', label: '退出' }] }]));
    pendingFile = litematicArgument(process.argv.slice(1));
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}
