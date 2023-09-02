import {CustomActionType, WebviewActionEnum} from "../defined";
import {WebviewType} from "../../../common/webview";

export function AddWebview(webviewList: WebviewType[]): CustomActionType<WebviewActionEnum, WebviewType[]> {
    return {
        type: WebviewActionEnum.ADD,
        preload: webviewList
    }
}