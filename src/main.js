'use strict';
process.env.ELECTRON_HIDE_INTERNAL_MODULES = 'true';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function() {
    if ( process.platform !== 'darwin' )
        app.quit();
});

var startupOpts = {
    useContentSize: true,
    width: 940,
    height: 720,
    center: true,
    resizable: true,
    alwaysOnTop: false,
    fullscreen: false,
    skipTaskbar: true,
    kiosk: false,
    title: 'Inbox',
    icon: null,
    show: false,
    frame: true,
    disableAutoHideCursor: false,
    autoHideMenuBar: false,
    titleBarStyle: 'default'
};

app.on('ready', function() {
    mainWindow = new BrowserWindow(startupOpts);
    
    mainWindow.loadURL('https://inbox.google.com');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    
    mainWindow.show();
});
