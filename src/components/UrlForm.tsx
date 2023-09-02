import React from 'react';
import {Button, Form, Input} from "antd";
import {FormLayout} from "antd/es/form/Form";

export type UrlFormProp = {
    inputStyle?: React.CSSProperties
    layout?: FormLayout;
    formName: string
    onOk: (cocosUrl: string) => void
}

type OpenWebviewFromType = {
    cocosUrl: string
}

const UrlForm: React.FC<UrlFormProp> = (props) => {
    const defaultURLValue = localStorage.getItem("cocos-url") || "";

    const onFinish = (values: OpenWebviewFromType) => {
        const url = values.cocosUrl.trim();
        localStorage.setItem("cocos-url", url);
        props.onOk(url);
    };

    return (
        <Form
            name={props.formName}
            layout={props.layout}
            initialValues={{cocosUrl: defaultURLValue}}
            onFinish={onFinish}
        >
            <Form.Item<OpenWebviewFromType>
                name="cocosUrl"
                label="Cocos Url"
                rules={[{required: true, message: '請輸入URL'}]}
            >
                <Input
                    type="text"
                    style={props.inputStyle}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    開啟網頁
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UrlForm;