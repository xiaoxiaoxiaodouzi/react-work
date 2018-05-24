import React from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { LocaleProvider, Layout } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { enquireScreen } from 'enquire-js';
import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式
import './index.css';

import ResourceDashboard from './routes/Dashboard/Resource'
import ApiDashboard from './routes/Dashboard/Api'
import Dashboard from './routes/Dashboard/Dashboard'
import Detail from './routes/Application/Detail'
import AppList from './routes/Application/List'
import ApiList from './routes/Api/List'
import ApiDetail from './routes/Api/Detail'
import SiderMenu from './components/SiderMenu'
import AddApp from './routes/Application/AddApp'
import GlobalFooter from './components/GlobalFooter/C2GlobalFooter'
import GlobalHeader from './components/GlobalHeader'
import MiddlewareList from './routes/Middleware/List'
import DomainList from './routes/setting/DomainList'
import Cluster from './routes/setting/Cluster'
import SystemSetting from './routes/setting/SystemSetting'
import Storage from './routes/setting/Storage'
import LicenseMessage from './routes/setting/LicenseMessage'
import Images from './routes/setting/Images'
import ImageDetails from './components/Setting/Images/ImageDetails'
import {getConfigs} from './services/setting'
import constants from './services/constants'
import Tenants from './routes/Tenants/TenantList'
import TenantDetail from './routes/Tenants/TenantDetail'
const { Content } = Layout;


// Reducer
//全局登录状态
function todos(state = { login: false,collapsed: false,globalRouterEnable:false }, action) {
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
    case 'setCollapsed':
      return Object.assign({}, state, {
        collapsed: action.payload
      });
    case 'setGlobalRouter':
      return Object.assign({},state,{
        globalRouterEnable:action.payload
      })
    default:
      return state
  }
}

// Store
const store = createStore(todos);
// let reduxState = store.getState();
//判断是否移动端浏览器
let isMobile;
enquireScreen((b) => {
  isMobile = b;
  store.dispatch({ type: 'setCollapsed', payload: true });
});
//检查是否开启全局路由
getConfigs().then(config=>{
  store.dispatch({ type: 'setGlobalRouter', payload: config[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE] === '1' });
})

const render = () => {
  let {login,tenant,environment,collapsed,globalRouterEnable} = store.getState();

  return ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <SiderMenu isMobile={isMobile} globalRouterEnable={globalRouterEnable} collapsed={collapsed} onCollapse={collapsed=>store.dispatch({ type: 'setCollapsed', payload: collapsed })}/>
          <Layout style={{ height: '100vh' }}>
            <GlobalHeader isMobile={isMobile} collapsed={collapsed} onCollapse={collapsed=>store.dispatch({ type: 'setCollapsed', payload: collapsed })} loginStateChange={() => store.dispatch({ type: 'login' })} tenantChange={(tenant) => store.dispatch({ type: 'setTenant', payload: tenant })} environmentChange={(environmentId) => store.dispatch({ type: 'setEnvironment', payload: environmentId })} />
            <Content style={{ margin: '24px 24px 0' }}>
              {
                login ?
                  <Switch>
                    {/* <Route path="/" component={ApiDashboard} exact/> */}
                    <Redirect from='/' to='/apps' exact push={false} />
                    <Route path="/dashboard/admin" component={Dashboard} />
                    <Route path="/dashboard/resource" component={ResourceDashboard} />
                    <Route path="/dashboard/api" component={ApiDashboard} />
                    <Route path="/apps" render={() => <AppList tenant={tenant} environment={environment} />} exact />
                    <Route path="/addapp" component={AddApp} />
                    <Route path="/apps/:appId/apis/:apiId" component={ApiDetail} />
                    <Route path="/apps/:id" component={Detail} />
                    <Route path="/middlewares" render={() => <MiddlewareList tenant={tenant} environment={environment} />} exact />
                    <Route path="/middlewares/:id" component={Detail} />
                    <Route path="/apis" component={ApiList} exact/>
                    <Route path="/tenants" component={Tenants} exact/>
                    <Route path="/tenants/:id" component={TenantDetail} />

                    <Route path="/setting/domain" component={DomainList} />
                    <Route path="/setting/cluster" component={Cluster} />
                    <Route path="/setting/license" component={LicenseMessage} />
                    <Route path="/setting/storage" component={Storage} />
                    <Route path="/setting/syssetting" render={()=><SystemSetting globalRouterChange={enable=>{store.dispatch({type:'setGlobalRouter',payload:enable})}}/>} />
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
}

render();
store.subscribe(render);