import {BrowserWindow, ipcMain, IpcMainEvent} from "electron";
import Channel from "../../common/Channel";
import WebviewLayoutSetting, {WebviewLayoutSettingType} from "../../common/WebviewLayoutSettingTool";
import Common from "../common";
import {CleanGameMonitorEnum, GameMonitorType} from "../../common/webview";
import Store from "electron-store";


const store = new Store<WebviewLayoutSettingType>();
const key = "webview_setting";


export default class WebviewWindow {
    private webViewId = 0;

    private mainWindow: BrowserWindow | undefined = undefined;

    private readonly url: string
    private readonly indexHtml: string
    private readonly preload: string
    private readonly webviewPreload: string

    constructor(url: string, indexHtml: string, preload: string, webviewPreload: string) {
        this.url = url;
        this.indexHtml = indexHtml;
        this.preload = preload;
        this.webviewPreload = webviewPreload;

        ipcMain.on(Channel.OPEN_WEBVIEW, this.openWebview.bind(this));
        ipcMain.on(Channel.GET_WEBVIEW_LIST, this.getWebviewList.bind(this));
        ipcMain.on(Channel.UPDATE_WEBVIEW_INFO, this.updateWebviewInfo.bind(this));
        ipcMain.on(Channel.REGISTER_WEBVIEW_INFO, this.registerWebviewInfo.bind(this));
        ipcMain.on(Channel.GET_WEBVIEW_PRELOAD_PATH, this.getWebviewPreloadPath.bind(this));
        ipcMain.on(Channel.OPEN_WEBVIEW_DEV_TOOLS, this.openWebviewDevTools.bind(this));
        ipcMain.on(Channel.GAME_MONITOR, this.gameMonitor.bind(this));
        ipcMain.on(Channel.GET_GAME_MONITOR_BY_WEBVIEW, this.getGameMonitorByWebview.bind(this));
        ipcMain.on(Channel.CLEAN_GAME_MONITOR, this.cleanGameMonitor.bind(this));
        ipcMain.on(Channel.CHANGE_WEBVIEW_URL, this.changeWebviewUrl.bind(this));
        ipcMain.on(Channel.GET_WEBVIEW_LAYOUT_SETTING, this.getWebviewLayoutSetting.bind(this));
        ipcMain.on(Channel.UPDATE_WEBVIEW_LAYOUT_SETTING, this.updateWebviewLayoutSetting.bind(this));
    }

    private createWindow() {
        const mainWindow = new BrowserWindow({
            height: 720,
            width: 1280,
            autoHideMenuBar: true,
            webPreferences: {
                preload: this.preload,
                sandbox: true,
                nodeIntegration: true,
                webviewTag: true,
                partition: `persist:webview-windows`
            },
        });

        if (this.url) { // electron-vite-vue#298
            mainWindow.loadURL(this.url + "#/webview")
            // Open devTool if the app is not packaged
            mainWindow.webContents.openDevTools()
        } else {
            mainWindow.loadFile(this.indexHtml, {hash: "/webview"})
        }

        mainWindow.webContents.on("did-attach-webview", (_, contents) => {
            contents.setWindowOpenHandler((details) => {
                mainWindow.webContents.send(Channel.CHANGE_WEBVIEW_URL, details.url, contents.id);
                this.changeWebviewUrl(null, details.url, contents.id)
                return {action: 'deny'}
            })
        });

        mainWindow.webContents.on("did-finish-load", () => {
            mainWindow.setTitle(Common.getWebviewWindowTitle());
        });

        mainWindow.on("close", () => {
            this.mainWindow = undefined;
            this.webViewId = 0;
            Common.webviewList = [];
        });

        mainWindow.webContents.on("did-finish-load", () => {
            Common.webviewWindowPid = mainWindow.webContents.getOSProcessId();
        });

        this.mainWindow = mainWindow;
    }

    private openWebview(_: IpcMainEvent, url: string) {
        this.webViewId++;

        Common.webviewList.push({
            url: url,
            id: this.webViewId,
            cpuUsage: {start: 0, end: 0, value: 0, avg: 0, list: []},
            memoryUsage: {start: 0, end: 0, value: 0, avg: 0, list: []}
        });

        if (this.mainWindow) {
            this.mainWindow.webContents.send(Channel.REFRESH_WEBVIEW_LIST, Common.webviewList);
        } else {
            this.createWindow();
        }
    }

    private changeWebviewUrl(_: IpcMainEvent | null, url: string, webviewContentsId?: number, webviewId?: number) {
        this.mainWindow?.webContents.send(Channel.CHANGE_WEBVIEW_URL, url, webviewContentsId, webviewId);
    }

    private getWebviewList(event: IpcMainEvent) {
        event.returnValue = Common.webviewList;
    }

    private updateWebviewInfo(event: IpcMainEvent, webviewId: number, webContentsId: number, gameMonitor: GameMonitorType) {
        const index = Common.webviewList.findIndex(webview => webview.id === webviewId);
        if (index > -1) {
            Common.webviewList[index].pid = event.sender.getOSProcessId();
            Common.webviewList[index].frameID = event.frameId;
            Common.webviewList[index].webContentID = webContentsId;
            Common.webviewList[index].gameMonitor = gameMonitor;
        }
    }

    private registerWebviewInfo(event: IpcMainEvent) {
        this.mainWindow?.webContents.send(Channel.REGISTER_WEBVIEW_INFO, event.sender.id)
    }

    private getWebviewPreloadPath(event: IpcMainEvent) {
        event.returnValue = this.webviewPreload;
    }

    private gameMonitor(event: IpcMainEvent, gameMonitor: GameMonitorType) {
        const index = Common.webviewList.findIndex(webview => webview.webContentID === event.sender.id);
        if (index > -1) {
            Common.webviewList[index].gameMonitor = gameMonitor;
        }
    }

    private openWebviewDevTools(_: IpcMainEvent, webviewId: number) {
        this.mainWindow?.webContents.send(Channel.OPEN_WEBVIEW_DEV_TOOLS, webviewId);
    }

    private getGameMonitorByWebview(event: IpcMainEvent, webviewId: number) {
        const index = Common.webviewList.findIndex(webview => webview.id === webviewId);
        if (index > -1) {
            event.returnValue.returnValue = Common.webviewList[index];
        } else {
            event.returnValue = null;
        }
    }

    private cleanGameMonitor(_: IpcMainEvent, webviewId: number, type: CleanGameMonitorEnum) {
        this.mainWindow?.webContents.send(Channel.SEND_MESSAGE_TO_WEBVIEW, webviewId, Channel.CLEAN_GAME_MONITOR, [type])
    }

    private getWebviewLayoutSetting(event: IpcMainEvent) {
        event.returnValue = store.get(key) || WebviewLayoutSetting.defaultSetting;
    }

    private updateWebviewLayoutSetting(_: IpcMainEvent, setting: WebviewLayoutSettingType) {
        store.set(key, setting);
        this.mainWindow?.webContents.send(Channel.BROADCAST_WEBVIEW_LAYOUT_SETTING, setting)
    }

}