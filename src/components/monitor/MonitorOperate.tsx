import React from 'react';
import {Button, Dropdown, MenuProps, Space} from "antd";
import {AreaChartOutlined, BugOutlined, DownOutlined, GlobalOutlined} from '@ant-design/icons';
import {AppMetricsType} from "../../../common/webview";
import {Channel} from "../../../common";

export interface MonitorOperateProp extends AppMetricsType {
    onChangeUrl: (props: AppMetricsType) => void;
    onOpenMonitor: (props: AppMetricsType) => void;
}

const MonitorOperate: React.FC<MonitorOperateProp> = (props) => {
    const handleOpenDevTool = () => {
        window.electron.ipc.send(Channel.OPEN_WEBVIEW_DEV_TOOLS, props.webviewId);
    }

    const handleChangeUrl = () => {
        props.onChangeUrl(props)
    }

    const handleOpenMonitor = () => {
        props.onOpenMonitor(props)
    }


    const items: MenuProps['items'] = [
        {
            key: '1',
            icon: <AreaChartOutlined/>,
            label: (
                <a
                    onClick={handleOpenMonitor}
                    type="link"
                >
                    效能監控
                </a>
            ),
        },
        {
            key: '2',
            icon: <BugOutlined/>,
            label: (
                <a
                    onClick={handleOpenDevTool}
                    type="link"
                >
                    DevTool
                </a>
            ),
        },
        {
            key: '3',
            icon: <GlobalOutlined/>,
            label: (
                <a
                    onClick={handleChangeUrl}
                    type="link"
                >
                    更換URL
                </a>
            ),
        },
    ];

    if (!props.webviewId) {
        return <></>
    }


    return (
        <Space>
            <Dropdown
                menu={{items}}
                placement="bottomLeft"
                arrow={{pointAtCenter: true}}
            >
                <Button type="primary">
                    <Space>
                        操作
                        <DownOutlined/>
                    </Space>
                </Button>
            </Dropdown>
        </Space>
    );
};

export default MonitorOperate;