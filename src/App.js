import React from 'react'
import { HashRouter as  Switch, Route, } from 'react-router-dom'
import {  Layout } from 'antd';
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
import {GlobalHeaderContext} from './context/GlobalHeaderContext'


const { Content } = Layout;

class App extends React.Component{

  state={
    tenant:'',
    environment:'',
    collapsed:false,
    globalRouterEnable:false,
    login:false,
    isMobile:false,
  }

  componentDidMount(){
    //判断是否移动端浏览器
    enquireScreen((b) => {
      this.setState({
        isMobile:b,
        collapsed:true
      })
    });

    //检查是否开启全局路由
    getConfigs().then(config=>{
      this.setState({
        globalRouterEnable:config[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE] === '1',
      })
    })

  }

  render(){
    const {isMobile,globalRouterEnable,collapsed,tenant,environment,login}=this.state;
    return (
          <Layout style={{ minHeight: '100vh' }}>
            <SiderMenu isMobile={isMobile} globalRouterEnable={globalRouterEnable} collapsed={collapsed} onCollapse={collapsed=>this.setState({collapsed})}/>
            <Layout style={{ height: '100vh' }}>
              <GlobalHeader isMobile={isMobile} collapsed={collapsed} onCollapse={collapsed=>this.setState({collapsed})} loginStateChange={() => this.setState({login:true})} tenantChange={(tenant) => this.setState({tenant})} environmentChange={(environmentId) => this.setState({environment:environmentId})} />
              <Content style={{ margin: '24px 24px 0' }}>
                {
                  login ?
                    <Switch>
                      {/* <Route path="/" component={ApiDashboard} exact/> */}
                      {/* <Redirect from='/' to='/apps' exact push={false} /> */}
                      <GlobalHeaderContext.Provider value={this.state}>
                        <Route path="/dashboard/admin" component={Dashboard} />
                        <Route path="/dashboard/resource" component={ResourceDashboard} />
                        <Route path="/dashboard/api" component={ApiDashboard} />
                        <Route path="/apps" component={AppList} exact/>
                        <Route path="/addapp" component={AddApp} />
                        <Route path="/apps/:appId/apis/:apiId" component={ApiDetail} />
                        <Route path="/apps/:id" component={Detail} />
                        <Route path="/middlewares" component={MiddlewareList} exact/>
                        <Route path="/middlewares/:id" component={Detail} />
                        <Route path="/apis" component={ApiList} exact/>
                        <Route path="/tenants" component={Tenants} exact/>
                        <Route path="/tenants/:id" component={TenantDetail} />
                        <Route path="/setting/domain" component={DomainList} />
                        <Route path="/setting/cluster" component={Cluster} />
                        <Route path="/setting/license" component={LicenseMessage} />
                        <Route path="/setting/storage" component={Storage} />
                        <Route path="/setting/syssetting" component={SystemSetting}  globalRouterChange={enable=>this.setState({globalRouterEnable:enable})} />
                        <Route path="/setting/images" component={Images} exact />
                        <Route path="/setting/images/:name" component={ImageDetails} />
                      </GlobalHeaderContext.Provider>
                    </Switch> : ''
                }
              </Content>
              <GlobalFooter />
            </Layout>
          </Layout>
    )
  }

}

export default App;