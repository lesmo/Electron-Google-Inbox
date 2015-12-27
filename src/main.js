'use strict';
process.env.ELECTRON_HIDE_INTERNAL_MODULES = 'true';

var electron = require('electron');
var app = electron.app;

app.on('window-all-closed', function() {
    if ( process.platform !== 'darwin' )
        app.quit();
});

var BrowserWindow = electron.BrowserWindow;
var shell = require('shell');
var file = require('fs');
var sessionWindows = [];
var inboxInject = {
    js: '(' + require(__dirname + '/inbox.js').toString() + ')(window);',
    css: file.readFileSync(__dirname + '/inbox.css', 'utf8')
};
var startupOpts = {
    useContentSize: true,
    width: 940,
    height: 720,
    center: true,
    resizable: true,
    alwaysOnTop: false,
    fullscreen: false,
    skipTaskbar: false,
    kiosk: false,
    title: 'Inbox',
    icon: null,
    show: false,
    frame: true,
    disableAutoHideCursor: false,
    titleBarStyle: 'default',
    directWrite: true,
    preload: 'inbox.js',
    nodeIntegration: false // for security reasons
};

function openWindow(url, openDevTools) {
    var window = sessionWindows[sessionWindows.length] = new BrowserWindow(startupOpts);
    
    window.setMenuBarVisibility(false);
    window.loadURL(url);
    
    window.on('page-title-updated', function() {
        var titleEmailMatch = this.getTitle().match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
        
        window.email = titleEmailMatch
            ? titleEmailMatch[0].toLowerCase()
            : null;
    });
    
    window.on('closed', function() {
        var i = sessionWindows.indexOf(window);
        sessionWindows.splice(i, 1);
    });
    
    window.webContents.on('dom-ready', function() {
        window.webContents.executeJavaScript(inboxInject.js);
        window.webContents.insertCSS(inboxInject.css);
    });
    
    window.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        
        // Don't open new Inbox windows on browser
        if ( url.match(/https?:\/\/(accounts|inbox)\.google\.com|inbox/i) )
            openWindow(url);
        else
            shell.openExternal(url);
    });
    
    window.show();
    return window;
}

app.on('ready', function() {
    openWindow('https://inbox.google.com');
});
