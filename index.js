import React from 'react'
import { HashRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { LocaleProvider, Layout, Menu, Breadcrumb, Icon, Avatar, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App';
import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式
import './index.css';

import ResourceDashboard from './routes/Dashboard/Resource'
import ApiDashboard from './routes/Dashboard/Api'
import Detail from './routes/Application/Detail'
import AppList from './routes/Application/List'
import ApiList from './routes/Api/List'
import SiderMenu from './components/SiderMenu'
import AddApp from './routes/Application/AddApp'
import GlobalFooter from './components/GlobalFooter/C2GlobalFooter'
import GlobalHeader from './components/GlobalHeader'
import MiddlewareList from './routes/Middleware/List'
import DomainList from './routes/setting/DomainList'
import Cluster from './routes/setting/Cluster'
import SystemSetting from './routes/setting/SystemSetting'
import LicenseMessage from './routes/setting/LicenseMessage'

import Images from './routes/setting/Images'
import ImageDetails from './components/Setting/Images/ImageDetails'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


// Reducer
//全局登录状态
function todos(state = { login: false }, action) {
  switch (action.type) {
    case 'login':
      return Object.assign({}, state, { login: true });
    case 'setTenant':
      return Object.assign({}, state, {
        tenant: action.payload
      });
    case 'setEnvironment':
      return Object.assign({}, state, {
        environment: action.payload
      });
    default:
      return state
  }
}

// Store
const store = createStore(todos);
// let reduxState = store.getState();

const render = () => ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <SiderMenu />
          <Layout>
            <GlobalHeader loginStateChange={() => store.dispatch({ type: 'login' })} tenantChange={(tenant) => store.dispatch({ type: 'setTenant', payload: tenant })} environmentChange={(environmentId) => store.dispatch({ type: 'setEnvironment', payload: environmentId })} />
            <Content style={{ margin: '24px 24px 0' }}>
              {
                store.getState().login ?
                  <Switch>
                    {/* <Route path="/" component={ApiDashboard} exact/> */}
                    <Redirect from='/' to='/apps' exact push={false} />
                    <Route path="/dashboard/resource" component={ResourceDashboard} />
                    <Route path="/dashboard/api" component={ApiDashboard} />
                    <Route path="/apps" render={() => <AppList tenant={store.getState().tenant} environment={store.getState().environment} />} exact />
                    <Route path="/apis" component={ApiList} />
                    <Route path="/apps/:id" component={Detail} />
                    <Route path="/middlewares" render={() => <MiddlewareList tenant={store.getState().tenant} environment={store.getState().environment} />} exact />
                    <Route path="/addapp" component={AddApp} />
                    <Route path="/setting/domain" component={DomainList} />
                    <Route path="/setting/cluster" component={Cluster} />
                    <Route path="/setting/license" component={LicenseMessage} />
                    <Route path="/setting/syssetting" component={SystemSetting} />
                    <Route path="/setting/images" component={Images} exact />
                    <Route path="/setting/images/:name" component={ImageDetails} />
                  </Switch> : ''
              }
            </Content>
            <GlobalFooter />
          </Layout>
        </Layout>
      </Router>
    </Provider>
  </LocaleProvider>,
  document.getElementById('root')
)

render();
store.subscribe(render);