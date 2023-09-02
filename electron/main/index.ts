import {app, BrowserWindow, dialog, MessageBoxOptions, Tray} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'
import {update} from './update'
import Common from "../common";
import WebviewWindow from "./WebviewWindow";
import Monitor from "./Monitor";
import process from "process";
import {Channel} from "../../common";


process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}


let mainWindow: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const webviewPreload = join(__dirname, '../webviewPreload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        height: 720,
        width: 1280,
        icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
            webSecurity: false,
            allowRunningInsecureContent: true,
            nodeIntegrationInWorker: true,
            contextIsolation: true,
            nodeIntegration: true,
            sandbox: true,
            preload
        },
    });

    mainWindow = win;

    // and load the index.html of the app.
    if (url) { // electron-vite-vue#298
        win.loadURL(url + "#/")
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml, {hash: "/"})
    }

    if (!app.isPackaged) {
        // Open the DevTools.
        win.webContents.openDevTools({mode: "detach"});
    }

    win.webContents.on("did-finish-load", () => {
        win.setTitle(Common.getWindowTitle());
        Common.mainWindowPid = win.webContents.getOSProcessId();
    });

    win.on("close", (event) => {
        event.preventDefault();
        const dialogOpts: MessageBoxOptions = {
            type: "warning",
            buttons: ["否", "是"],
            title: win.getTitle(),
            message: "是否要關閉?",
        };

        dialog.showMessageBox(dialogOpts)
            .then((returnValue) => {
                if (returnValue.response === 1) {
                    win?.destroy();
                    mainWindow = null;
                }
            });
    });

    update(mainWindow);
}

app.whenReady().then(async () => {
    await createWindow();
    new WebviewWindow(url!, indexHtml, preload, webviewPreload);
    new Monitor();
    createTray();
})

app.on('window-all-closed', () => {
    mainWindow = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (mainWindow) {
        // Focus on the main window if the user tried to open another
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

function createTray() {
    const image = join(process.env.VITE_PUBLIC, 'icon.png');

    const tray = new Tray(image);
    tray.setTitle(app.getName());
    tray.setToolTip(Common.getWindowTitle());
    if (process.platform === 'win32') {
        tray.on('click', () => {
            if (mainWindow) {
                mainWindow.show();
            } else {
                createWindow();
            }
        })
    }
}