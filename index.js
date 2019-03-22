import React from 'react'
import { HashRouter as Router,Route,Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式
import './index.less';
import App from './App'
import LoginForm from './login';
import {AmpDoc} from './common/SimpleComponents';

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
  <Router>
    <Switch>
      <Route path="/login" exact component={LoginForm} />
      <Route path="/doc" exact component={AmpDoc} />
      <Route path='/' component={App} />
    </Switch>
  </Router>
  </LocaleProvider>,
  document.getElementById("root")
);