import React from 'react'
import { HashRouter as Switch, Route, } from 'react-router-dom'
import { Layout,message,Card } from 'antd';
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
import constants from './services/constants'
import Tenants from './routes/Tenants/TenantList'
import TenantDetail from './routes/Tenants/TenantDetail'
import { GlobalHeaderContext } from './context/GlobalHeaderContext'
import { base } from './services/base';
import loginService from './services/login';
import FunctionalList from './routes/BasicData/Functional/List'
import FunctionalObjectDetail from './routes/BasicData/Functional/ObjectDetail'
import FunctionalRoleDetail from './routes/BasicData/Functional/RoleDetail'
import NavigationManage from './routes/NavigationManage/NavigationList';
import Orgs from './routes/orguser/Orgs';
import Metadatas from './routes/orguser/Metas';
import Users from './routes/orguser/Users';
import Dicts from './routes/orguser/Dicts';
import Groups from './routes/orguser/Groups';
import {OrgDetail,UserDetail,GroupDetail,JobDetail} from 'c2-orguser';

const { Content } = Layout;

class App extends React.Component {

  state = {
    tenant: '',
    environment: '',
    collapsed: false,
    globalRouterEnable: false,
    loading: true,
    isMobile: false,
    menus:[],
    globalRouterChange: (e) => {
      this.setState({ globalRouterEnable: e })
    },
    changeEnvironment: (env) => {
      base.currentEnvironment = env;
      window.localStorage.localEnvironmentId = env.id;
      this.setState({ environment: env })
    },
    tenantChange: (tenant) => {
      base.tenant = tenant;
      window.localStorage.localTenantCode = tenant;
      base.getEnvironmentsByTenant(tenant).then(data => {
        base.environments = data;
        let currentEnv = base.getCurrentEnvironment(data);
        base.currentEnvironment = currentEnv;
        this.setState({ tenant });
      })
    },
    environmentsChange: (environments) => {
      this.setState({ environments })
    }
  }
  /**
   * 初始化环境，分三步，后一步一定依赖前一步请求的完成才能继续
   * 1. 获取用户和租户；
   * 2. 根据权限获取菜单
   * 3. 初始化环境数据和全局数据
   */
  constructor(props, context){
    super();
    //用户信息（租户）
    loginService.login().then(({currentUser,tenants})=>{
      let tenantCode;
      if(tenants.length === 0){
        message.error("没有找到当前用户下的PAAS租户");
      }else{
        let currentTenant = loginService.getCurrentTenant(tenants);
        base.tenant = currentTenant.code;
        tenantCode = currentTenant.code;
      }
      this.setState({currentUser,tenants,tenant:tenantCode});

      //菜单
      loginService.anthAndMenus(base.isAdmin?['amp_admin']:currentUser.roles).then(menus=>{
        this.setState({menus});
        //环境和全局配置
        loginService.readyGlobalData(base.tenant).then(({configs,currentEnvironment})=>{
          //检查是否开启全局路由
          let globalRouterEnable = configs[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE] === '1';
          this.setState({environment:currentEnvironment,globalRouterEnable});
        }).finally(()=>{
          this.setState({loading:false});
        })
      });
    });
  }

  componentDidMount() {
    //判断是否移动端浏览器
    enquireScreen((b) => {
      this.setState({
        isMobile: b,
        collapsed: true
      })
    });
  }


  render() {
    const { isMobile, globalRouterEnable, collapsed, loading } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SiderMenu isMobile={isMobile} globalRouterEnable={globalRouterEnable} collapsed={collapsed} onCollapse={collapsed => this.setState({ collapsed })} menus={this.state.menus}/>
        <Layout id='rightSide'>
          <GlobalHeader menus={(menus)=>{this.setState({menus})}} isMobile={isMobile} collapsed={collapsed} onCollapse={collapsed => this.setState({ collapsed })} 
          user={this.state.currentUser} tenants={this.state.tenants} tenantCode={this.state.tenant} tenantChange={this.state.tenantChange} 
           />
          {!loading ?
            <div>
              <Content style={{ margin: '24px 24px 0' }}>
                <Switch>
                  {/* <Route path="/" component={ApiDashboard} exact/> */}
                  {/* <Redirect from='/' to='/apps' exact push={false} /> */}
                  <GlobalHeaderContext.Provider value={this.state} >
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/dashboard/admin" component={Dashboard} />
                    <Route path="/dashboard/resource" component={ResourceDashboard} />
                    <Route path="/dashboard/api" component={ApiDashboard} />
                    <Route path="/apps" component={AppList} exact />
                    <Route path="/addapp" component={AddApp} />
                    <Route path="/apps/:id" component={Detail} />
                    <Route path="/middlewares" component={MiddlewareList} exact />
                    <Route path="/middlewares/:id" component={Detail} />
                    <Route path="/apis" component={ApiList} exact />
                    <Route path="/apis/:apiId" component={ApiDetail} />
                    <Route path="/functional" component={FunctionalList} exact />
                    <Route path="/applications/:appid/functional/:id" component={FunctionalObjectDetail} />
                    <Route path="/applications/:appid/functionalroles/:id" component={FunctionalRoleDetail} />
                    <Route path="/orgs"  component={Orgs} exact/>
                    <Route path="/users" component={Users}  exact/>
                    <Route path="/metas" component={Metadatas} exact/>
                    <Route path="/dicts" component={Dicts} exact/>
                    <Route path="/user/:id" component={UserDetail} ampEnvId={base.currentEnvironment.id} permissions={base.allpermissions} exact/>
                    <Route path="/orgs/:id" component={OrgDetail} ampEnvId={base.currentEnvironment.id} permissions={base.allpermissions} exact/>
                    <Route path="/job/:id" component={JobDetail} ampEnvId={base.currentEnvironment.id} permissions={base.allpermissions} />
                    <Route path="/groups" component={Groups} exact/>
                    <Route path="/groups/:id" component={GroupDetail} ampEnvId={base.currentEnvironment.id} permissions={base.allpermissions}/>
                    <Route path="/navigationmanage" component={NavigationManage} />
                    <Route path="/tenants" component={Tenants} exact />
                    <Route path="/tenants/:id" component={TenantDetail} />
                    <Route path="/setting/domain" component={DomainList} />
                    <Route path="/setting/cluster" component={Cluster} />
                    <Route path="/setting/license" component={LicenseMessage} />
                    <Route path="/setting/storage" component={Storage} />
                    <Route path="/setting/syssetting" component={SystemSetting} />
                    <Route path="/setting/images" component={Images} exact />
                    <Route path="/setting/images/:name" component={ImageDetails} />
                  </GlobalHeaderContext.Provider>
                </Switch>
              </Content>
              <GlobalFooter />
            </div>
            : <Card style={{ width: 'calc(100%-48)', margin: '24px',height:'100%'}} loading={loading} /> }
        </Layout>
      </Layout>
    )
  }

}

export default App;