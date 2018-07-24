import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { LocaleProvider, Layout } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式
import './index.css';

import App from './App'

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
  <Router>
    <App />
  </Router>
  </LocaleProvider>,
  document.getElementById("root")
);