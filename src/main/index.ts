import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'

// 添加这行来强制在开发环境中检查更新
autoUpdater.forceDevUpdateConfig = true;
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log('dev' + process.env['ELECTRON_RENDERER_URL']);
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    console.log('prod');
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 处理更新事件
autoUpdater.on('update-available', () => {
  // 弹出确认对话框
  dialog.showMessageBox({
    type: 'question',
    buttons: ['下载', '取消'],
    title: '更新可用',
    message: '新版本已发布，是否下载更新？',
  }).then((result) => {
    if (result.response === 0) { // 用户选择“下载”
      autoUpdater.downloadUpdate();
    } else {
      console.log('用户取消了更新下载');
    }
  });
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: '更新下载完成',
    message: '请重启应用以应用更新。',
  }).then(() => {
    autoUpdater.quitAndInstall();
  });
});



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  createWindow()
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('check-for-updates', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
  autoUpdater.checkForUpdatesAndNotify();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
