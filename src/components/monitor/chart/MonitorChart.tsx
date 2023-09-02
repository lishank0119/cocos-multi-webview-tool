import React from 'react';
import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Typography} from "antd";
import {ProfileRecord} from "../../../../common/webview";

export  type MonitorChartProp = {
    data: ProfileRecord[]
    title: string
    stroke: string
    fill: string
}


const MonitorChart: React.FC<MonitorChartProp> = (props) => {

    return (
        <div style={{height: 300, marginTop: 10}}>
            <Typography.Title
                level={5}
            >
                {props.title}
            </Typography.Title>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    width={500}
                    height={400}
                    data={props.data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid/>
                    <XAxis name={"時間"} dataKey="time"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Area
                        name={props.title}
                        type="monotone"
                        dataKey="value"
                        stackId="1"
                        stroke={props.stroke}
                        fill={props.fill}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonitorChart;