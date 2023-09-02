import React from 'react';
import MonitorTable from "./MonitorTable";
import useMonitor from "../../hooks/useMonitor";

const Monitor = () => {
    useMonitor();

    return (
        <div style={{marginTop: 10}}>
            <MonitorTable/>
        </div>
    );
};

export default Monitor;