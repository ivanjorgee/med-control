
import { app, BrowserWindow, Menu, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import url from 'url';

let mainWindow: BrowserWindow | null;

// Configurar auto-updater
autoUpdater.checkForUpdatesAndNotify();

// Log de debug para updates
autoUpdater.logger = console;

// Eventos do auto-updater
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível:', info);
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Atualização Disponível',
    message: 'Uma nova versão está disponível. Será baixada em segundo plano.',
    buttons: ['OK']
  });
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Nenhuma atualização disponível:', info);
});

autoUpdater.on('error', (err) => {
  console.error('Erro no auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Velocidade de download: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Baixado ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Atualização baixada:', info);
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Atualização Pronta',
    message: 'A atualização foi baixada. Será instalada ao reiniciar a aplicação.',
    buttons: ['Reiniciar Agora', 'Mais Tarde']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../public/lovable-uploads/12c04d39-ea85-4e5b-8cfa-8563284f1ed5.png')
  });

  // Set app name
  app.setName('Cura Saúde Central');

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(startUrl);

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Create application menu
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Verificar Atualizações',
          click: () => {
            autoUpdater.checkForUpdatesAndNotify();
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Sair' }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'togglefullscreen', label: 'Tela Cheia' }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            const aboutWindow = new BrowserWindow({
              width: 400,
              height: 300,
              resizable: false,
              minimizable: false,
              maximizable: false,
              parent: mainWindow || undefined,
              modal: true,
              webPreferences: {
                nodeIntegration: true
              }
            });
            
            aboutWindow.setMenu(null);
            aboutWindow.loadURL(
              process.env.NODE_ENV === 'development'
                ? `${process.env.ELECTRON_START_URL}#/about`
                : `file://${path.join(__dirname, '../dist/index.html#/about')}`
            );
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  createWindow();
  
  // Verificar atualizações 5 segundos após iniciar
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 5000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
