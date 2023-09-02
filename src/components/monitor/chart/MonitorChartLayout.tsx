import React from 'react';
import MonitorChart from "./MonitorChart";
import {AppMetricsType} from "../../../../common/webview";

const MonitorChartLayout: React.FC<AppMetricsType> = (props) => {
    return (
        <>
            <MonitorChart
                data={props.cpuUsage!.list}
                title="CPU 使用率"
                stroke={"#0ED9D9FF"}
                fill={"#0ED9D9FF"}
            />

            <MonitorChart
                data={props.memoryUsage!.list}
                title="記憶體 使用率(MB)"
                stroke={"#35A2EBFF"}
                fill={"#35A2EBFF"}
            />

            <MonitorChart
                data={props.gameMonitor!.stats.fps.list}
                title="FPS"
                stroke={"#24c903"}
                fill={"#24c903"}
            />

            <MonitorChart
                data={props.gameMonitor!.stats.frame.list}
                title="Frame time (ms)"
                stroke={"#CBD90EFF"}
                fill={"#CBD90EFF"}
            />

            <MonitorChart
                data={props.gameMonitor!.stats.logic.list}
                title="Game Logic (ms)"
                stroke={"#CB0ED9FF"}
                fill={"#CB0ED9FF"}
            />

            <MonitorChart
                data={props.gameMonitor!.stats.render.list}
                title="Renderer (ms)"
                stroke={"#C94F03FF"}
                fill={"#C94F03FF"}
            />

            <MonitorChart
                data={props.gameMonitor!.stats.physics.list}
                title="Physics (ms)"
                stroke={"#76E7B0FF"}
                fill={"#76E7B0FF"}
            />
        </>
    );
};

export default MonitorChartLayout;