import React, {useState} from 'react';
import {SyncOutlined} from "@ant-design/icons";
import {Button} from "antd";
import UpdateModal from "@/components/update/UpdateModal";

const Update = () => {
    const [open, setOpen] = useState<boolean>(false)

    const handleModalOpen = () => {
        setOpen(true);
    }

    const handleModalClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Button
                style={{marginLeft: 5}}
                type="default"
                onClick={handleModalOpen}
            >
                <SyncOutlined/>
                更新APP
            </Button>

            <UpdateModal open={open} onClose={handleModalClose}/>
        </>
    );
};

export default Update;