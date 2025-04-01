import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import windowStateKeeper from 'electron-window-state'

let mainWindow

function createWindow() {
  // Recupera el estado previo de la ventana (posición, tamaño, maximizado, pantalla completa)
  const state = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })

  mainWindow = new BrowserWindow({
    show: false,
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    resizable: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Se encarga de actualizar el estado de la ventana al cerrarse o cambiar tamaño
  state.manage(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Evita múltiples instancias
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Si se intenta abrir una segunda instancia, se enfoca o restaura la ventana existente
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    // Establece el App User Model ID en Windows
    electronApp.setAppUserModelId('com.electron')

    // Configura los atajos de teclado (por ejemplo, F12 para DevTools en desarrollo)
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', () => {
      // En macOS se suele re-crear la ventana si no hay ninguna abierta al hacer clic en el icono del Dock
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
