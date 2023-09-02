import {app, BrowserWindow} from "electron";
import {AppMetricsType, WebviewType} from "../../common/webview";
import Channel from "../../common/Channel";
import Common from "../common";


//監控PID CPU 記憶體...等
export default class Monitor {

    constructor() {
        // 每1秒刷新資訊
        setInterval(() => {
            this.updateMonitor();
        }, 1000);
    }

    private updateMonitor() {
        const appMetrics = app.getAppMetrics();
        const list: AppMetricsType[] = [];

        for (const appMetric of appMetrics) {
            const webview = Common.webviewList.find(webview => webview.pid === appMetric.pid);

            const item: AppMetricsType = {
                key: appMetric.pid + "",
                pid: appMetric.pid,
                name: appMetric.name || appMetric.serviceName || "",
                processType: appMetric.type,
                creationTime: new Date(appMetric.creationTime).toLocaleString(),
                percentCPUUsage: Number(appMetric.cpu.percentCPUUsage).toFixed(2),
                percentMemoryUsage: Number(appMetric.memory.workingSetSize / 1024).toFixed(2)
            }

            if (webview) {
                this.getWebviewMonitor(item, webview);
            } else if (item.pid === Common.webviewWindowPid) {
                item.name = Common.getWebviewWindowTitle();
            } else if (item.pid === Common.mainWindowPid) {
                item.name = Common.getWindowTitle();
            } else if (item.name.length == 0) {
                continue;
            }

            list.push(item);
        }


        BrowserWindow.getAllWindows().forEach(window => {
            window.webContents.send(Channel.UPDATE_MONITOR, list);
        });
    }

    private getWebviewMonitor(item: AppMetricsType, webview: WebviewType) {
        if (webview.cpuUsage.list.length >= 60) {
            webview.cpuUsage.list.shift();
        }

        if (webview.memoryUsage.list.length >= 60) {
            webview.memoryUsage.list.shift();
        }

        const date = new Date();
        const minutes = (date.getMinutes() + "").padStart(2, "0");
        const seconds = (date.getSeconds() + "").padStart(2, "0");

        webview.cpuUsage.list.push({
            value: Number(item.percentCPUUsage),
            time: `${date.getHours()}:${minutes}:${seconds}`
        });

        webview.memoryUsage.list.push({
            value: Number(item.percentMemoryUsage),
            time: `${date.getHours()}:${minutes}:${seconds}`
        });

        item.name = `NO: ${webview.id}`;
        item.webviewId = webview.id;
        item.gameMonitor = webview.gameMonitor;
        item.cpuUsage = webview.cpuUsage;
        item.memoryUsage = webview.memoryUsage;

        return item;
    }
}