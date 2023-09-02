import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {AddWebview} from "@/redux/actions/webviewAction";
import {WebViewExecute} from "@/utils/webViewExecute";
import Channel from "../../common/Channel";
import {CleanGameMonitorEnum, WebviewType} from "../../common/webview";
import WebviewLayoutSettingTool, {WebviewLayoutSettingType} from "../../common/WebviewLayoutSettingTool";


export type UseWebviewReturn = {
    style: React.CSSProperties
    span: number
}

const getSpan = (colKey: number) => {
    return 24 / WebviewLayoutSettingTool.colsList[colKey];
}

const getHeight = (heightKey: number) => {
    return WebviewLayoutSettingTool.heightList[heightKey] + "vh";
}

const useWebview = (): UseWebviewReturn => {
    const defaultStyle: React.CSSProperties = {width: "100%", height: "100%", minHeight: "50vh"};
    const [style, setStyle] = useState(defaultStyle);
    const defaultSetting: WebviewLayoutSettingType = window.electron.ipc.sendSync(Channel.GET_WEBVIEW_LAYOUT_SETTING);
    const [layoutSetting, setLayoutSetting] = useState<WebviewLayoutSettingType>(defaultSetting);
    const [span, setSpan] = useState<number>(getSpan(defaultSetting.colCountKey));
    const dispatch = useDispatch();


    useEffect(() => {
        setSpan(getSpan(layoutSetting.colCountKey));

        setStyle({
            width: "100%",
            height: getHeight(layoutSetting.heightKey),
        });
    }, [layoutSetting])

    const mounted = useRef<boolean>();

    useEffect(() => {
        // 防止一開始二次觸發
        if (!mounted.current) {
            mounted.current = true;
            window.electron.on(Channel.REFRESH_WEBVIEW_LIST, (_, webviewList) => {
                refreshWebviewList(webviewList);
            });

            window.electron.on(Channel.CHANGE_WEBVIEW_URL, (_, url, webContentId, webviewId) => {
                changeWebviewUrl(url, webContentId, webviewId);
            });

            window.electron.on(Channel.OPEN_WEBVIEW_DEV_TOOLS, (_, webviewId) => {
                openWebviewDevTools(webviewId);
            });

            window.electron.on(Channel.CLEAN_GAME_MONITOR, (_, webviewId, type) => {
                cleanGameMonitorByWebview(webviewId, type);
            });

            window.electron.on(Channel.SEND_MESSAGE_TO_WEBVIEW, (_, webviewId, channel, args) => {
                sendMessageToWebview(webviewId, channel, args);
            });

            window.electron.on(Channel.REGISTER_WEBVIEW_INFO, (_, webContentId) => {
                registerWebviewInfo(webContentId);
            });

            window.electron.on(Channel.BROADCAST_WEBVIEW_LAYOUT_SETTING, (_, setting: WebviewLayoutSettingType) => {
                setLayoutSetting(setting);
            });

            refreshWebviewList(window.electron.ipc.sendSync(Channel.GET_WEBVIEW_LIST));
        }

        return () => {
            // 關閉視窗要移除事件
            window.electron.removeAllListeners(Channel.REFRESH_WEBVIEW_LIST);
            window.electron.removeAllListeners(Channel.CHANGE_WEBVIEW_URL);
            window.electron.removeAllListeners(Channel.OPEN_WEBVIEW_DEV_TOOLS);
            window.electron.removeAllListeners(Channel.CLEAN_GAME_MONITOR);
            window.electron.removeAllListeners(Channel.SEND_MESSAGE_TO_WEBVIEW);
        }

    }, []);

    function registerWebviewInfo(webContentId: number) {
        const webviewList: NodeListOf<Electron.WebviewTag> = document.querySelectorAll("webview");
        webviewList.forEach(async (webview) => {
            if (webview.getWebContentsId() === webContentId) {
                const split = webview.id.split("-");
                await webview.send(Channel.REGISTER_WEBVIEW_INFO, Number(split[1]), webContentId);
                await webview.executeJavaScript(WebViewExecute());
                return;
            }
        })
    }

    function sendMessageToWebview(webviewId: number, channel: string, args: unknown[]) {
        const element: Electron.WebviewTag = document.getElementById(getElementId(webviewId)) as Electron.WebviewTag;
        if (element) {
            element.send(channel, ...args);
        }
    }

    function cleanGameMonitorByWebview(webviewId: number, type: CleanGameMonitorEnum) {
        const element: Electron.WebviewTag = document.getElementById(getElementId(webviewId)) as Electron.WebviewTag;
        if (element) {
            element.send(Channel.CLEAN_GAME_MONITOR, webviewId, type);
        }
    }

    function openWebviewDevTools(webviewId: number) {
        const element: Electron.WebviewTag = document.getElementById(getElementId(webviewId)) as Electron.WebviewTag;
        if (element) {
            element.openDevTools();
        }
    }

    const refreshWebviewList = (webviewList: WebviewType[]) => {
        dispatch(AddWebview(webviewList));
    };

    function changeWebviewUrl(url: string, webContentId: number, webviewId: number) {
        let webview: Electron.WebviewTag | null = null;

        if (webContentId) {
            const webviewList = document.querySelectorAll("webview");
            for (let i = 0; i < webviewList.length; i++) {
                const element: Electron.WebviewTag = webviewList[i] as Electron.WebviewTag;
                if (element.getWebContentsId() === webContentId) {
                    webview = element;
                    break;
                }
            }
        } else if (webviewId) {
            webview = document.getElementById(getElementId(webviewId)) as Electron.WebviewTag;
        }

        if (webview) {
            webview.loadURL(url)
            // webview.src = url;
        }
    }

    function getElementId(id: number) {
        return `wv-${id}`;
    }

    return {style, span}
}

export default useWebview