import React, {useState} from 'react';
import WebViewLayoutSettingModal from "./WebViewLayoutSettingModal";
import {SettingFilled} from '@ant-design/icons';
import {Button} from "antd";


const WebViewLayoutSetting = () => {
    const [openModal, setOpenModal] = useState(false)

    const handleModalOpen = () => {
        setOpenModal(true);
    }

    const handleModalClose = () => {
        setOpenModal(false);
    }

    return (
        <>
            <Button
                type="default"
                onClick={handleModalOpen}
            >
                <SettingFilled/>
                設定
            </Button>
            <WebViewLayoutSettingModal
                open={openModal}
                handleClose={handleModalClose}
            />
        </>
    );
};

export default WebViewLayoutSetting;