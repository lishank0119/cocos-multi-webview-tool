import {configureStore} from '@reduxjs/toolkit'
import webviewReducer from "./reducers/webviewReducer";
import {CustomActionType, StoreType} from "./defined";
import monitorReducer from "@/redux/reducers/monitorReducer";


export default configureStore<StoreType, CustomActionType<any, any>>({
    reducer: {
        webviewState: webviewReducer,
        monitorState: monitorReducer
    }
})