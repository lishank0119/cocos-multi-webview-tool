import React from 'react';
import {Col, FloatButton} from "antd";
import {WebviewType} from "../../../common/webview";

export interface WebViewComponentProp extends WebviewType {
    span: number
    preloadPath: string
    style: React.CSSProperties
}

const WebViewComponent: React.FC<WebViewComponentProp> = (props) => {

    return (
        <Col span={props.span} style={props.style}>
            <webview
                id={`wv-${props.id}`}
                title={`${props.id}`}
                preload={props.preloadPath}
                partition={`persist:webview-${props.id}`}
                nodeintegration={`true`}
                disablewebsecurity={`true`}
                allowpopups={`true`}
                style={{width: "100%", height: "100%"}}
                src={props.url}
            >
            </webview>

            <FloatButton
                style={{position: "absolute", bottom: 15}}
                shape="square"
                type="primary"
                description={`No:${props.id}`}
            />
        </Col>
    );
};

export default WebViewComponent;