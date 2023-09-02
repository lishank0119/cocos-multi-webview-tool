import React, {useEffect, useState} from 'react';
import {Modal} from "antd";
import UrlForm from "../UrlForm";
import {useSelector} from "react-redux";
import {StoreType} from "@/redux/defined";
import {AppMetricsType} from "../../../common/webview";

export type MonitorChangeUrlModalProp = {
    webviewId: number
    open: boolean
    handleOk: (cocosUrl: string) => void
    handleCancel: () => void
}

const MonitorChangeUrlModal: React.FC<MonitorChangeUrlModalProp> = (props) => {
    const monitorState = useSelector((state: StoreType) => state.monitorState)
    const initialState = {
        cpuUsage: undefined,
        creationTime: "",
        gameMonitor: undefined,
        key: "",
        memoryUsage: undefined,
        name: "",
        percentCPUUsage: "",
        percentMemoryUsage: "",
        pid: 0,
        processType: "",
        webviewId: -1
    };

    const [monitor, setMonitor] = useState<AppMetricsType>(initialState);

    useEffect(() => {
        if (props.webviewId > -1) {
            for (let i = 0; i < monitorState.list.length; i++) {
                if (props.webviewId === monitorState.list[i].webviewId) {
                    setMonitor(monitorState.list[i])
                    return;
                }
            }
        } else {
            setMonitor(initialState);
        }
    }, [props.webviewId]);

    const handleOk = (cocosUrl: string) => {
        props.handleOk(cocosUrl)
    }

    return (
        <Modal
            title={`更換${monitor.name}的Cocos Url`}
            closable={true}
            open={props.open}
            onCancel={props.handleCancel}
            footer={(<></>)}
        >
            <UrlForm
                onOk={handleOk}
                formName="change-webview-url-form"
            />
        </Modal>
    );
};

export default MonitorChangeUrlModal;