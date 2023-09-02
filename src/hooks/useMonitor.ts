import {useDispatch} from "react-redux";
import {useEffect, useRef} from "react";
import {AddMonitor} from "@/redux/actions/monitorAction";
import {Channel} from "../../common";
import {AppMetricsType} from "../../common/webview";

const useMonitor = () => {
    const dispatch = useDispatch();
    const mounted = useRef<boolean>();

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            window.electron.on(Channel.UPDATE_MONITOR, (_, list: AppMetricsType[]) => {
                dispatch(AddMonitor(list))
            });
        }

        return () => {
            window.electron.removeAllListeners(Channel.UPDATE_MONITOR);
        }

    }, []);
}

export default useMonitor