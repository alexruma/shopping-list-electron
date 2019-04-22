const electron = require('electron');
const url = require('url');
const path = require('path');


const {app, BrowserWindow, Menu, globalShortcut, ipcMain} = electron;

let mainWindow;
let clearConfirm;
//Listen for app to be ready
app.on('ready', () => {
  console.log('Up and at em')
  //Create new mainWindow
  mainWindow = new BrowserWindow({});
  //Load html into window
  mainWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file',
      slashes: true

    }
  ));
//Quit whole app when main window closes.
mainWindow.on('closed', () => {
  app.quit();
})
  globalShortcut.register('CommandOrControl+Q', () => {
   // Do stuff when Q and either Command/Control is pressed.
   app.quit();
 });
 globalShortcut.register('CommandOrControl+A', () => {
  // Do stuff when Q and either Command/Control is pressed.
  createAddWindow();
});
//Build menu from template

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

//Insert menu
Menu.setApplicationMenu(mainMenu);

});


//Handle create add window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 220,
    title: "Add Shopping List Item"
  });
  //Load html into window
  addWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file',
      slashes: true

    }
  ));
  //Garbage Collection
  addWindow.on('close', function(){
    addWindow =null;
  });
}
//Clear Window Confirm
function createClearConfirm(){
  clearConfirm = new BrowserWindow({
    width: 300,
    height: 220,
    title: "Clear All Items?"
  });
   clearConfirm.loadURL(url.format(
    {
      pathname: path.join(__dirname, 'clearConfirm.html'),
      protocol: 'file',
      slashes: true

    }
  ));
  //Garbage Collection
  clearConfirm.on('close', function(){
    clearConfirm =null;
  });
}
//Clear Window
function createClearedWindow(){
  let clearedWindow = new BrowserWindow({
    width: 300,
    height: 220,
    title: "Cleared"
  });
   clearedWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, 'clearedWindow.html'),
      protocol: 'file',
      slashes: true

    }
  ));
  //Garbage Collection
  clearedWindow.on('close', function(){
    clearedWindow =null;
  });
}
//Catch item:add
ipcMain.on('item:add', (e,item) => {

  mainWindow.webContents.send('item:add', item);
  addWindow.close();

});
//Catch item:clearComplete
ipcMain.on('item:clearComplete', (e) => {
console.log('cleared')
  createClearedWindow();

});
ipcMain.on('item:clearConfirmed', (e, confirmation) => {
if(confirmation==true) {
  mainWindow.webContents.send('item:clear');
  clearConfirm.close();
  console.log(confirmation);
}
else {
  console.log('nope '+confirmation);

  clearConfirm.close();
}
})
//Create menu template
const mainMenuTemplate =[
  {
    label:'File',
    submenu: [
      {
        label: 'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Item',
        click(){
          createClearConfirm();
        }
      },
      {
        label: 'Quit',
        acclerator:
        'Ctrl+Q',
        click(){
           app.quit();
         }
      }
    ]
  }
];
//If OS is Mac
if(process.platform =='darwin'){
  mainMenuTemplate.unshift({})
}

//Add dev tools item if not in production
if(process.env.NODE_ENV != "production"){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
      label: 'Toggle DevTools',
      click(item, focusedWindow){
        focusedWindow.toggleDevTools();
      }
    },
    {
    role: 'reload'
  }
    ]
  })
}
