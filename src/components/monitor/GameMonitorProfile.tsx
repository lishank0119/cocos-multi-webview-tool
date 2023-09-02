import React from 'react';

import {Card, Space, Typography} from 'antd';
import {AppMetricsType} from "../../../common/webview";

const {Text} = Typography;


const GameMonitorProfile: React.FC<AppMetricsType> = (props) => {
    const avgStyle: React.CSSProperties = {
        marginLeft: "10px",
        color: "peru"
    };

    return (
        <Card style={{marginRight: 30}}>
            <Space
                size="small"
                direction="vertical"
            >
                <Text type="success">
                    CPU使用率 : {props.percentCPUUsage}%
                </Text>

                <Text type="success">
                    記憶體使用率 : {props.percentMemoryUsage}MB
                </Text>

                <Text type="success">
                    裝置 : {props.gameMonitor?.stats.renderer}
                </Text>

                <Text type="success">
                    <span>FPS : {props.gameMonitor?.stats.fps.value} </span>
                    <span style={avgStyle}>AVG FPS : {props.gameMonitor?.stats.fps.avg.toFixed(2)} </span>
                </Text>

                <Text type="success">
                    Draw Call : {props.gameMonitor?.stats.draws}
                </Text>

                <Text type="success">
                    <span>Frame time (ms) : {props.gameMonitor?.stats.frame.value.toFixed(2)} </span>
                    <span style={avgStyle}>AVG Frame time (ms) : {props.gameMonitor?.stats.frame.avg.toFixed(2)} </span>
                </Text>

                <Text type="success">
                    Instance Count : {props.gameMonitor?.stats.instances}
                </Text>

                <Text type="success">
                    Triangle: {props.gameMonitor?.stats.triCount}
                </Text>

                <Text type="success">
                    <span>Game Logic (ms) : {props.gameMonitor?.stats.logic.value.toFixed(2)} </span>
                    <span style={avgStyle}>AVG Game Logic (ms) : {props.gameMonitor?.stats.logic.avg.toFixed(2)} </span>
                </Text>

                <Text type="success">
                    <span>Physics (ms) : {props.gameMonitor?.stats.physics.value.toFixed(2)} </span>
                    <span style={avgStyle}>AVG Physics (ms) : {props.gameMonitor?.stats.physics.avg.toFixed(2)} </span>
                </Text>

                <Text type="success">
                    <span>Renderer (ms) : {props.gameMonitor?.stats.render.value.toFixed(2)} </span>
                    <span style={avgStyle}>AVG Renderer (ms) : {props.gameMonitor?.stats.render.avg.toFixed(2)} </span>
                </Text>

                <Text type="success">
                    GFX Texture Mem(M) : {props.gameMonitor?.stats.textureMemory.toFixed(2)}
                </Text>

                <Text type="success">
                    GFX Buffer Mem(M) : {props.gameMonitor?.stats.bufferMemory.toFixed(2)}
                </Text>
            </Space>
        </Card>
    );
};

export default GameMonitorProfile;