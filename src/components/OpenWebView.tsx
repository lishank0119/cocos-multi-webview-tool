import React from 'react';
import UrlForm from "./UrlForm";
import {Channel} from "../../common";


const OpenWebView = () => {
    const onOk = (cocosUrl: string) => {
        window.electron.ipc.send(Channel.OPEN_WEBVIEW, cocosUrl);
    }

    return (
        <UrlForm
            inputStyle={{width: "50vw"}}
            onOk={onOk}
            layout="inline"
            formName="open-web-view-form"
        />
    );
};

export default OpenWebView;