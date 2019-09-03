import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux'
import store from './Store'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');

ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <App/>
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
