import {WebviewActionEnum, WebviewActionType, WebviewState} from "../defined";
import Channel from "../../../common/Channel";
import {WebviewType} from "../../../common/webview";


const initialState: WebviewState = {
    height: "100vh",
    preloadPath: window.electron.ipc.sendSync(Channel.GET_WEBVIEW_PRELOAD_PATH),
    list: []
}

export default function webviewReducer(state: WebviewState = initialState, action: WebviewActionType): WebviewState {
    if (action.type === WebviewActionEnum.ADD) {
        const list: WebviewType[] = [];
        action.preload.forEach(webview => {
            const index = state.list.findIndex(w => w.id === webview.id);
            if (index < 0) {
                list.push(webview);
            }
        })

        return {
            ...state,
            list: [
                ...state.list,
                ...list
            ]
        }
    }

    return state
}