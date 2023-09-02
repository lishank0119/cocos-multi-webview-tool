import React from 'react';
import {ConfigProvider, Layout, theme} from 'antd';
import {Provider} from "react-redux";
import store from "./redux/store";
import {createHashRouter, RouterProvider} from "react-router-dom";
import WebViewPage from "@/pages/WebViewPage";
import HomePage from "@/pages/HomePage";

const router = createHashRouter([
    {
        path: "/",
        element: <HomePage/>,
    },
    {
        path: "/webview",
        element: <WebViewPage/>,
    },
]);

const App: React.FC = () => (
    <Provider store={store}>
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
            <Layout
                style={{height: "100vh", width: "100vw", overflow: "auto"}}
            >
                <RouterProvider router={router}/>
            </Layout>
        </ConfigProvider>
    </Provider>
);

export default App;