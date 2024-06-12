const { app, BrowserWindow, ipcMain, dialog } = require('electron');

// Fix for Windows with DPI that is not set to 100% (mainly laptops, etc.)
app.commandLine.appendSwitch('force-device-scale-factor', 1.0);

let mainWindow = null;
app.on('ready', () => {

  let fs = require('fs');
  let path = __dirname + '/package.json';
  let map_package = JSON.parse(fs.readFileSync(path));
  let map_window = map_package["window"];

  let width = parseInt(map_window["width"]);
  let height = parseInt(map_window["height"]);
  let resize = map_window["resize"];

  //windows微調整
  if (process.platform == "win32") {

    if (resize == false) {
      height = height + 20;
    }
  }

  // mainWindowを作成（windowの大きさや、Kioskモードにするかどうかなどもここで定義できる）
  mainWindow = new BrowserWindow({
    "width": width,
    "height": height,
    "resizable": resize,
    "useContentSize": true,
    "show": false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  // 判定用ユーザーエージェント追加
  mainWindow.webContents.setUserAgent(mainWindow.webContents.getUserAgent() + " TyranoErectron");
  // Electronに表示するhtmlを絶対パスで指定（相対パスだと動かない）
  mainWindow.loadFile('index.html');

  // ChromiumのDevツールを開く
  // mainWindow.webContents.openDevTools();


  if (map_window["devtools"] == true) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("ready-to-show", () => {

    mainWindow.show();

  });

//  mainWindow.removeMenu();
//  mainWindow.setMenu(null);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.on('darwin-select-app-sync', (event, arg) => {
    const filenames = dialog.showOpenDialogSync(null, {
      properties: ['openFile'],
      // title: "パッチを適応するゲームの実行ファイル（app）を選択してください。",
      title: "Select the location of the game executable (.app) to which you want to apply the patch.",
      filters: [
        { name: '', extensions: ["app"] }
      ]
    });
    event.returnValue = filenames;
  })

});

/*
var log = require('electron-log');

process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

*/

