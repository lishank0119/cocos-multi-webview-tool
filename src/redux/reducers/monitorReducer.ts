import {MonitorActionEnum, MonitorActionType, MonitorState} from "../defined";


const initialState: MonitorState = {
    list: []
}

export default function monitorReducer(state = initialState, action: MonitorActionType): MonitorState {
    if (action.type === MonitorActionEnum.REFRESH) {
        return {
            list: [...action.preload]
        }
    }

    return state
}