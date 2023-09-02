import React from 'react';
import {Content} from "antd/es/layout/layout";
import OpenWebView from "../components/OpenWebView";
import Monitor from "../components/monitor/Monitor";
import WebViewLayoutSetting from "../components/webviewLayoutSetting/WebViewLayoutSetting";
import Update from "@/components/update/Update";

const HomePage = () => {
    return (
        <Content style={{padding: 20}}>
            <OpenWebView/>
            <div style={{marginTop: 10}}>
                <WebViewLayoutSetting/>
                <Update/>
            </div>
            <Monitor/>
        </Content>
    );
};

export default HomePage;