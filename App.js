import React from 'react'
import { Switch, Route, Redirect} from 'react-router-dom';
import InterceptedRoute from './common/InterceptedRoute'
import { Layout,message,Card } from 'antd';
import { enquireScreen } from 'enquire-js';
// import Exception from 'ant-design-pro/lib/Exception';
import AppDetail from './routes/Application/Detail'
import ApiDetail from './routes/Api/Detail'
import SiderMenu from './components/SiderMenu'
import AddApp from './routes/Application/AddApp'
import GlobalFooter from './components/GlobalFooter/C2GlobalFooter'
import GlobalHeader from './components/GlobalHeader'
import ImageDetails from './components/Setting/Images/ImageDetails'
import TenantDetail from './routes/Tenants/TenantDetail'
import { GlobalHeaderContext } from './context/GlobalHeaderContext'
import { base } from './services/base';
import loginService from './services/login';
import FunctionalObjectDetail from './routes/BasicData/Functional/ObjectDetail'
import FunctionalRoleDetail from './routes/BasicData/Functional/RoleDetail'

import {OrgDetail,UserDetail,GroupDetail,JobDetail} from 'c2-orguser';

import SafeAppDetail from './safemode/CceAppDetail';
const { Content } = Layout;

//全局消息设置
message.config({
  top: 24,
  duration: 2,
  maxCount: 1
});

class App extends React.Component {
  /**
   * 初始化环境，分三步，后一步一定依赖前一步请求的完成才能继续
   * 1. 获取用户和租户；
   * 2. 根据权限获取菜单
   * 3. 初始化环境数据和全局数据
   */
  constructor(props){
    super(props);

    let state = {
      tenant: '',//租户code
      environment: '1',//环境ID
      collapsed: false,//菜单是否折叠
      loading: true,
      isMobile: false,
      safeMode: false,
      menus:[],
      routers:[],
      messages:[],
      changeEnvironment: (env) => {
        base.currentEnvironment = env;
        base.environment = env.id;
        window.localStorage.localEnvironmentId = env.id;
        this.setState({ environment: env.id });
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
      },
      addMessage:(info)=>{
        this.state.messages.push(info);
        this.setState({messages:[...this.state.messages]});
      },
      cleanMessage:()=>{
        this.setState({messages:[]});
      }
    }
    if(window.localStorage.ampSafeMode)base.safeMode = true;
    this.initData();
    base.addMessage = state.addMessage;

    this.state = state;
  }
  
  initData = ()=>{
    //用户信息（租户）
    let tenantCode;
    loginService.login().then(({currentUser,tenants})=>{
      if(tenants.length === 0){
        message.error("没有找到当前用户下的PAAS租户");
      }else{
        let currentTenant = loginService.getCurrentTenant(tenants);
        base.tenant = currentTenant.code;
        tenantCode = currentTenant.code;
      }
      this.setState({currentUser,tenants,tenant:tenantCode});

      //菜单
      loginService.anthAndMenus(currentUser).then(menus=>{
        let routers = [];
        menus.forEach(m=>{
          if(m.component)routers.push(m);
          if(m.children){
            m.children.forEach(sm=>{
              if(sm.component)routers.push(sm);
            })
          }
        })
        // routers = routers.concat(DetailRouters.filter(r=>!r.resourceId || base.allpermissions.includes(r.resourceId)));
        this.setState({menus,routers});
        //环境和全局配置
        loginService.readyGlobalData().then(({configs,currentEnvironment})=>{
          //检查是否开启全局路由
          let environment = currentEnvironment?currentEnvironment.id:null;
          this.setState({environment,loading:false});
        }).catch(()=>{
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
    let { isMobile, collapsed, loading,routers } = this.state;
    const defaultRootRouterLink = routers.length>0?routers[0].link:'';

    //非菜单页面路由
    const DetailRouters = [
      { link: '/apps/:id', resourceId: 'apps',component: AppDetail },
      { link: '/addapp', component: AddApp },
      { link: '/middlewares/:id', resourceId: 'middlewares', component: AppDetail},
      { link: '/apis/:apiId', resourceId: 'apis', component: ApiDetail },
      { link: '/applications/:appid/functional/:id',  component: FunctionalObjectDetail},
      { link: '/applications/:appid/functionalroles/:id',  component: FunctionalRoleDetail},
      { link: '/users/:id', resourceId: 'users', component: UserDetail ,exact:true,props:{ampEnvId:base.environment ,permissions:base.isAdmin?null:base.allpermissions}},
      { link: '/orgs/:id', resourceId: 'orgs', component: OrgDetail ,exact:true,props:{ampEnvId:base.environment ,permissions:base.isAdmin?null:base.allpermissions}},
      { link: '/jobs/:id', resourceId: 'org_jobTab', component: JobDetail ,props:{ampEnvId:base.environment ,permissions:base.isAdmin?null:base.allpermissions}},
      { link: '/groups/:id', resourceId: 'groups', component: GroupDetail ,props:{ampEnvId:base.environment ,permissions:base.isAdmin?null:base.allpermissions}},
      { link: '/tenants/:id', resourceId: 'tenants', component: TenantDetail },
      { link: '/setting/images/:name', resourceId: 'setting_images', component: ImageDetails },
      { link: '/safeapps/:id',component: SafeAppDetail}
    ].filter(r=>!r.resourceId || base.allpermissions.includes(r.resourceId));
    routers = routers.concat(DetailRouters);

    // const NoMatch = <Exception type="404" />;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SiderMenu isMobile={isMobile} collapsed={collapsed} onCollapse={collapsed => this.setState({ collapsed })} menus={this.state.menus}/>
        <Layout id='rightSide'>
          <GlobalHeader isMobile={isMobile} collapsed={collapsed} onCollapse={collapsed => this.setState({ collapsed })} 
          user={this.state.currentUser} tenants={this.state.tenants} tenantCode={this.state.tenant} tenantChange={this.state.tenantChange} 
          messages={this.state.messages} cleanMessage={this.state.cleanMessage}
          />
          {!loading ?
            <div>
              <Content style={{ margin: '24px 24px 0' }}>
                <Switch>
                  <GlobalHeaderContext.Provider value={this.state} >
                    <Route exact path="/" render={() => (
                      <Redirect to={defaultRootRouterLink} />
                    )}/>
                    {routers.map(r=>{
                      return <InterceptedRoute key={r.link} link={r.link} component={r.component} exact={r.exact} params={r.props}/>
                    })}
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