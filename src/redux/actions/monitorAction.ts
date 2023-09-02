import {MonitorActionEnum, MonitorActionType} from "../defined";
import {AppMetricsType} from "../../../common/webview";

export function AddMonitor(list: AppMetricsType[]): MonitorActionType {
    return {
        type: MonitorActionEnum.REFRESH,
        preload: list
    }
}