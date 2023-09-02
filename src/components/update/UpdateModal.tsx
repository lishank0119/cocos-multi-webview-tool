import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Progress} from "antd";
import type {ProgressInfo} from 'electron-updater'

export type UpdateModalProp = {
    open: boolean
    onClose: () => void
}

interface VersionInfo {
    update: boolean
    version: string
    newVersion?: string
}

interface ErrorType {
    message: string
    error: Error
}

const UpdateModal: React.FC<UpdateModalProp> = (props) => {
    const [checking, setChecking] = useState(false)
    const [updateAvailable, setUpdateAvailable] = useState(false)
    const [versionInfo, setVersionInfo] = useState<VersionInfo>()
    const [updateError, setUpdateError] = useState<ErrorType>()
    const [progressInfo, setProgressInfo] = useState<Partial<ProgressInfo>>()

    const checkUpdate = async () => {
        setUpdateError(undefined);
        setChecking(true);
        const result = await window.electron.ipc.invoke('check-update');
        setProgressInfo({percent: 0});
        setChecking(false);
        if (result?.error) {
            setUpdateAvailable(false);
            setUpdateError(result?.error);
        }
    }

    const onUpdateCanAvailable = useCallback((_event: Electron.IpcRendererEvent, arg1: VersionInfo) => {
        setVersionInfo(arg1);
        setUpdateError(undefined);
        if (arg1.update) {
            window.electron.ipc.invoke('start-download');
            setUpdateAvailable(true);
        } else {
            setUpdateAvailable(false);
        }
    }, [])

    const onUpdateError = useCallback((_event: Electron.IpcRendererEvent, arg1: ErrorType) => {
        setUpdateAvailable(false);
        setUpdateError(arg1);
    }, [])

    const onDownloadProgress = useCallback((_event: Electron.IpcRendererEvent, arg1: ProgressInfo) => {
        setProgressInfo(arg1);
    }, [])

    const onUpdateDownloaded = useCallback((_event: Electron.IpcRendererEvent, ...args: any[]) => {
        setProgressInfo({percent: 100});
        window.electron.ipc.invoke('quit-and-install');
    }, [])

    useEffect(() => {
        // Get version information and whether to update
        window.electron.on('update-can-available', onUpdateCanAvailable);
        window.electron.on('update-error', onUpdateError);
        window.electron.on('download-progress', onDownloadProgress);
        window.electron.on('update-downloaded', onUpdateDownloaded);

        return () => {
            window.electron.removeAllListeners('update-can-available');
            window.electron.removeAllListeners('update-error');
            window.electron.removeAllListeners('download-progress');
            window.electron.removeAllListeners('update-downloaded');
        }
    }, []);

    useEffect(() => {
        checkUpdate();
    }, [props.open]);

    return (
        <Modal
            title={`檢查更新`}
            closable={true}
            open={props.open}
            onCancel={props.onClose}
            onOk={props.onClose}
            footer={updateAvailable ? <></> : undefined}
        >
            {checking ? 'Checking...' : ''}
            {updateError
                ? (
                    <div className='update-error'>
                        <p>Error downloading the latest version.</p>
                        <p>{updateError.message}</p>
                    </div>
                ) : updateAvailable
                    ? (
                        <div className='can-available'>
                            <div>The last version is: v{versionInfo?.newVersion}</div>
                            <div
                                className='new-version-target'>v{versionInfo?.version} -&gt; v{versionInfo?.newVersion}</div>
                            <div className='update-progress'>
                                <div className='progress-title'>Update progress:</div>
                                <div className='progress-bar'>
                                    <Progress percent={progressInfo?.percent || 0}></Progress>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div className='can-not-available'>{JSON.stringify(versionInfo ?? {}, null, 2)}</div>
                    )}

        </Modal>
    );
};

export default UpdateModal;