import React, {useEffect, useState} from 'react';
import {Button, Card, Modal, Space, Typography} from "antd";
import GameMonitorProfile from "./GameMonitorProfile";
import MonitorChartLayout from "./chart/MonitorChartLayout";
import {AppMetricsType, CleanGameMonitorEnum} from "../../../common/webview";
import {Channel} from "../../../common";
import {useSelector} from "react-redux";
import {StoreType} from "@/redux/defined";

export interface MonitorWebviewModalProp {
    webviewId: number
    open: boolean
    handleCancel: () => void
}

const MonitorWebviewModal: React.FC<MonitorWebviewModalProp> = (props) => {
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
    }, [props.webviewId, monitorState]);


    const handleCleanGameMonitor = (type: CleanGameMonitorEnum) => {
        window.electron.ipc.send(Channel.CLEAN_GAME_MONITOR, props.webviewId, type);
    }

    return (
        <Modal
            title={`${monitor.name} 每秒刷新`}
            closable={true}
            open={props.open}
            onCancel={props.handleCancel}
            footer={(<></>)}
            width="95vw"
            centered={true}
        >
            <div
                style={{maxHeight: "80vh", overflow: "auto"}}
            >
                <GameMonitorProfile {...monitor}/>

                {monitor.webviewId! > -1 && (
                    <>
                        <MonitorChartLayout {...monitor}/>

                        <Typography.Title
                            level={5}
                        >
                            低於FPS 20 :
                            <Button
                                style={{marginLeft: 5}}
                                type="primary"
                                htmlType="submit"
                                danger
                                onClick={() => handleCleanGameMonitor(CleanGameMonitorEnum.lowFpsList)}
                            >
                                清除
                            </Button>
                        </Typography.Title>

                        <Card style={{marginRight: 30, maxHeight: "20vh", overflow: "auto"}}>
                            <Space
                                style={{gap: 0}}
                                size="small"
                                direction="vertical"
                            >
                                {
                                    monitor.gameMonitor!.stats.fps.lowFpsList.map(fps => (
                                        <Typography.Text>
                                            fps: {fps.value} time: {fps.time}
                                        </Typography.Text>
                                    ))
                                }
                            </Space>
                        </Card>

                        <Typography.Title
                            level={5}
                        >
                            訊息 :
                            <Button
                                style={{marginLeft: 5}}
                                type="primary"
                                htmlType="submit"
                                danger
                                onClick={() => handleCleanGameMonitor(CleanGameMonitorEnum.messageList)}
                            >
                                清除
                            </Button>
                        </Typography.Title>

                        <Card style={{marginRight: 30, maxHeight: "20vh", overflow: "auto"}}>
                            <Space
                                style={{gap: 0}}
                                size="small"
                                direction="vertical"
                            >
                                {
                                    monitor.gameMonitor!.messageList.map(str => (
                                        <Typography.Text>
                                            {str}
                                        </Typography.Text>
                                    ))
                                }
                            </Space>
                        </Card>
                    </>
                )}

            </div>
        </Modal>
    );
};

export default MonitorWebviewModal;