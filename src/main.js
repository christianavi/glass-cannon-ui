require('update-electron-app')({
  logger: require('electron-log')
})

const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
if (require('electron-squirrel-startup')) {
  app.quit();
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  function createWindow() {
    const mainWindow = new BrowserWindow({
      width: 440,
      height: 558,
      // minWidth: 440,
      // minHeight: 558,
      icon: path.join(__dirname, "assets", "icons", "icon.ico"),
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
    console.log("Start tray")
    let tray = null
    app.whenReady().then(() => {
      tray = new Tray(path.join(__dirname, "assets", "icons", "icon.ico"))
      const contextMenu = Menu.buildFromTemplate([{
          label: 'Glass Cannon',
          click: async () => {
            mainWindow.show()
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          click: async () => {
            app.quit()
          }
        }
      ])
      tray.setToolTip('Glass Cannon')
      tray.setContextMenu(contextMenu)
      
      tray.on('click', (event) => {
        mainWindow.show()
      })
    })

    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  
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

}