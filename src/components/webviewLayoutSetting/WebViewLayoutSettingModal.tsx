import React, {useState} from 'react';
import {Modal, Slider, Typography} from "antd";
import {SliderMarks} from "antd/es/slider";
import WebviewLayoutSettingTool, {WebviewLayoutSettingType} from "../../../common/WebviewLayoutSettingTool";
import {Channel} from "../../../common";


export type WebViewLayoutSettingModalProp = {
    open: boolean
    handleClose: () => void
}

const colMarks: Record<number, number> = {};
const heightMarks: SliderMarks = {};

WebviewLayoutSettingTool.colsList.forEach((value, i) => {
    colMarks[i] = value;
});

WebviewLayoutSettingTool.heightList.forEach((value, i) => {
    heightMarks[i] = {
        label: <strong>{value}%</strong>,
    };
});

const WebViewLayoutSettingModal: React.FC<WebViewLayoutSettingModalProp> = (props) => {
    const defaultSetting: WebviewLayoutSettingType = window.electron.ipc.sendSync(Channel.GET_WEBVIEW_LAYOUT_SETTING);
    const [colCountKey, setColCountKey] = useState(defaultSetting.colCountKey);
    const [heightKey, setHeightKey] = useState(defaultSetting.heightKey);

    const handleOk = () => {
        const args: WebviewLayoutSettingType = {colCountKey: colCountKey, heightKey: heightKey};
        window.electron.ipc.send(Channel.UPDATE_WEBVIEW_LAYOUT_SETTING, args);
        props.handleClose();
    }

    return (
        <Modal
            title={`設定多開視窗`}
            closable={true}
            open={props.open}
            onCancel={props.handleClose}
            onOk={handleOk}
        >
            <Typography.Title level={5}>欄位數量:</Typography.Title>
            <div style={{width: '50%', marginBottom: 48}}>
                <Slider
                    min={0}
                    max={Object.keys(colMarks).length - 1}
                    value={colCountKey}
                    onChange={setColCountKey}
                    marks={colMarks}
                    step={null}
                    tooltip={{formatter: (value: number | undefined) => colMarks[value!]}}
                />
            </div>

            <Typography.Title level={5}>高度:</Typography.Title>
            <div style={{width: '50%', marginBottom: 48}}>
                <Slider
                    min={0}
                    max={Object.keys(heightMarks).length - 1}
                    value={heightKey}
                    onChange={setHeightKey}
                    marks={heightMarks}
                    step={null}
                    tooltip={{formatter: (value: number | undefined) => WebviewLayoutSettingTool.heightList[value!] + "%"}}
                />
            </div>
        </Modal>
    );
};

export default WebViewLayoutSettingModal;