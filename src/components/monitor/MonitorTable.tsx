import React, {useState} from 'react';
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import {useSelector} from "react-redux";
import {StoreType} from "@/redux/defined";
import MonitorOperate from "./MonitorOperate";
import MonitorChangeUrlModal from "./MonitorChangeUrlModal";
import MonitorWebviewModal from "./MonitorWebviewModal";
import {AppMetricsType} from "../../../common/webview";
import {Channel} from "../../../common";


const MonitorTable = () => {
    const monitorState = useSelector((state: StoreType) => state.monitorState)
    const [changeUrlModalOpen, setChangeUrlModalOpen] = useState(false);
    const [monitorModalOpen, setMonitorModalOpen] = useState(false);
    const [webviewId, setWebviewId] = useState<number>(-1)

    const handleChangeUrl = (props: AppMetricsType) => {
        setWebviewId(props.webviewId!)
        setChangeUrlModalOpen(true);
    }

    const handleChangeUrlModalOk = (cocosUrl: string) => {
        setChangeUrlModalOpen(false);
        window.electron.ipc.send(Channel.CHANGE_WEBVIEW_URL, cocosUrl, null, webviewId);
    }

    const handleChangeUrlModalCancel = () => {
        setChangeUrlModalOpen(false);
    }

    const handleOpenMonitor = (props: AppMetricsType) => {
        setWebviewId(props.webviewId!);
        setMonitorModalOpen(true);
    }

    const handleMonitorModalCancel = () => {
        setMonitorModalOpen(false);
        setWebviewId(-1);
    }

    const columns: ColumnsType<AppMetricsType> = [
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'pid',
            dataIndex: 'pid',
            key: 'pid',
            align: "end",
        },
        {
            title: 'process type',
            dataIndex: 'processType',
            key: 'processType',
        },
        {
            title: 'CPU使用率',
            dataIndex: 'percentCPUUsage',
            key: 'percentCPUUsage',
            align: "end",
            render: (value: number) => (
                <>
                    {value}%
                </>
            ),
        },
        {
            title: '記憶體使用率',
            dataIndex: 'percentMemoryUsage',
            key: 'percentMemoryUsage',
            align: "end",
            render: (value: number) => (
                <>
                    {value} MB
                </>
            ),
        },
        {
            title: '建立時間',
            dataIndex: 'creationTime',
            key: 'creationTime',
        },
        {
            title: '',
            key: 'operate',
            render: (_, record) => (
                <MonitorOperate
                    onOpenMonitor={handleOpenMonitor}
                    onChangeUrl={handleChangeUrl}
                    {...record}
                />
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={monitorState.list}
                pagination={{pageSize: 10, showSizeChanger: true}}
            />

            <MonitorChangeUrlModal
                webviewId={webviewId}
                open={changeUrlModalOpen}
                handleOk={handleChangeUrlModalOk}
                handleCancel={handleChangeUrlModalCancel}
            />

            <MonitorWebviewModal
                webviewId={webviewId}
                open={monitorModalOpen}
                handleCancel={handleMonitorModalCancel}
            />
        </>
    );
};

export default MonitorTable;