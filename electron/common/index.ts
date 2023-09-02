import {app} from "electron";
import {WebviewType} from "../../common/webview";

export type CommonToolType = {
    mainWindowPid: number,
    webviewWindowPid: number,
    webviewList: WebviewType[],
    getWindowTitle: () => string
    getWebviewWindowTitle: () => string
}

const Index: CommonToolType = {
    mainWindowPid: -1,
    webviewWindowPid: -1,
    webviewList: [],
    getWindowTitle: (): string => {
        return `Cocos 多開工具 ${app.getVersion()}`;
    },
    getWebviewWindowTitle(): string {
        return `Cocos 多開 ${app.getVersion()}`;
    },
};

export default Index