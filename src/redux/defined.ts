import {AppMetricsType, WebviewType} from "../../common/webview";
import {Action} from "redux";

export interface CustomActionType<T, P> extends Action<T> {
    preload: P
}

export type StoreType = {
    webviewState: WebviewState
    monitorState: MonitorState

}

export type WebviewState = {
    preloadPath: string
    height: string
    list: WebviewType[]
}

export enum WebviewActionEnum {
    ADD
}

export type  WebviewActionType = CustomActionType<WebviewActionEnum, WebviewType[]>

export type MonitorState = {
    list: AppMetricsType[]
}

export enum MonitorActionEnum {
    REFRESH
}

export type  MonitorActionType = CustomActionType<MonitorActionEnum, AppMetricsType[]>
