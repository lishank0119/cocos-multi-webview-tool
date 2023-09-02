import React from 'react';
import {Row} from "antd";
import useWebview from "../hooks/useWebview";
import WebViewComponent from "../components/webview/WebViewComponent";
import {StoreType, WebviewState} from "@/redux/defined";
import {useSelector} from "react-redux";

const WebViewPage = () => {
    const webviewState: WebviewState = useSelector((state: StoreType) => state.webviewState);
    const {style, span} = useWebview();

    return (
        <Row
            style={{height: webviewState.height, width: "100vw", overflow: "auto"}}
        >
            {
                webviewState.list.map(webview => (
                    <WebViewComponent
                        key={`${webview.id}`}
                        preloadPath={webviewState.preloadPath}
                        style={style}
                        span={span}
                        {...webview}
                    />
                ))
            }
        </Row>
    );
};

export default WebViewPage;