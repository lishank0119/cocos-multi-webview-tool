import {IpcRendererEvent} from "electron";
import React from 'react';
import IpcRenderer = Electron.IpcRenderer;


export interface IElectronAPI {
    on(channel: string, listener: (event: IpcRendererEvent, ...args: never[]) => void)

    once(channel: string, listener: (event: IpcRendererEvent, ...args: never[]) => void)

    removeAllListeners(channel: string)

    registerWebviewIDInfo(webViewId: number, webContentsId: number)

    ipc: IpcRenderer
}

declare global {
    interface Window {
        electron: IElectronAPI
    }
}

declare module 'react' {
    namespace JSX {
        type Webview =
            Electron.WebviewTag
            | React.DetailedHTMLProps<React.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;

        type Created = {
            allowpopups: string
            disablewebsecurity: string
            nodeintegration: string
        };

        interface IntrinsicElements {
            webview: Omit<Webview, "allowpopups" | "disablewebsecurity" | "nodeintegration"> & Created
        }
    }
}