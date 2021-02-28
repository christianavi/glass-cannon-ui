require('update-electron-app')({
  logger: require('electron-log')
})

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 440,
    height: 558,
    // minWidth: 440,
    // minHeight: 558,
    icon: "src/assets/icons/icon.ico",
    maximizable: false,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

