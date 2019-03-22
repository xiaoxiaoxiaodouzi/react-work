import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import InterceptedRoute from './common/InterceptedRoute'
import { Layout, message, Card } from 'antd';
import { enquireScreen } from 'enquire-js';
import AppDetail from './routes/Application/Detail'
import ApiDetail from './routes/Api/Detail'
import SiderMenu from './components/SiderMenu'
import AddApp from './routes/Application/AddApp'
import GlobalFooter from './components/GlobalFooter/C2GlobalFooter'
import GlobalHeader from './components/GlobalHeader'
import ImageDetails from './components/Setting/Images/ImageDetails'
import TenantDetail from './routes/Tenants/TenantDetailNew'
import { GlobalHeaderContext } from './context/GlobalHeaderContext'
import { base } from './services/base';
import FunctionalObjectDetail from './routes/BasicData/Functional/ObjectDetail'
import FunctionalRoleDetail from './routes/BasicData/Functional/RoleDetail'

import { OrgDetail, UserDetail, GroupDetail, JobDetail } from 'c2-orguser';

import SafeAppDetail from './safemode/CceAppDetail';
import ClusterDetail from './components/Setting/ClusterDetail';

import LoginInterceptor from './utils/LoginInterceptor'
import SysAppRoute from './routes/sysApp/SysAppRoute';
import { getEnvironmentsByTenant } from './services/amp';
import Exception from 'ant-design-pro/lib/Exception';

const { Content } = Layout;

// function NoMatch({ location }) {
//   return <Exception />;
// }

//全局消息设置
message.config({
  top: 24,
  duration: 2,
  maxCount: 1
});

class App extends React.Component {

  constructor(props) {
    super(props);

    let state = {
      currentUser: {},
      tenant: '',//租户code
      tenants: [],
      environment: '1',//环境ID
      collapsed: false,//菜单是否折叠
      loading: true,
      isMobile: false,
      safeMode: false,
      menus: [],
      routers: [],
      messages: [],
      changeEnvironment: (env) => {
        base.currentEnvironment = env;
        base.environment = env.id;
        window.localStorage.localEnvironmentId = env.id;
        this.setState({ environment: env.id });
      },
      tenantChange: (tenant) => {
        base.tenant = tenant;
        window.localStorage.localTenantCode = tenant;
        getEnvironmentsByTenant(tenant).then(data => {
          base.environments = data;
          let currentEnv = base.getCurrentEnvironment(data);
          base.currentEnvironment = currentEnv;
          this.setState({ tenant });
        })
      },
      environmentsChange: (environments) => {
        this.setState({ environments })
      },
      addMessage: (info) => {
        this.state.messages.push(info);
        this.setState({ messages: [...this.state.messages] });
      },
      cleanMessage: () => {
        this.setState({ messages: [] });
      }
    }
    if (window.localStorage.ampSafeMode) base.safeMode = true;

    this.initData();
    base.addMessage = state.addMessage;

    this.state = state;
  }

  initData = () => {
    LoginInterceptor(this.props.history).then(() => {
      let routers = [];
      base.menus.forEach(m => {
        if (m.component) routers.push(m);
        if (m.children) {
          m.children.forEach(sm => {
            if (sm.component) routers.push(sm);
          })
        }
      });
      let defaultRouterLink = routers.length > 0 ? routers[0].link : '';
      if (base.environments.length === 0) defaultRouterLink = '/setting/syssetting/env';
      this.setState({
        currentUser: base.currentUser,
        tenants: base.tenants,
        tenant: base.tenant,
        menus: base.menus,
        environment: base.environment,
        loading: false,
        routers, defaultRouterLink
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
    let { isMobile, collapsed, loading, routers } = this.state;


    //非菜单页面路由
    let DetailRouters = [
      { link: '/apps/:id', resourceId: 'apps', component: AppDetail },
      { link: '/addapp', component: AddApp },
      { link: '/middlewares/:id', resourceId: 'middlewares', component: AppDetail },
      { link: '/applications/:appid/functional/:id', component: FunctionalObjectDetail },
      { link: '/applications/:appid/functionalroles/:id', component: FunctionalRoleDetail },
      { link: '/functions/apps/:id', component: AppDetail },
      { link: '/functions/applications/:appid/roles/:id', component: FunctionalRoleDetail, exact: true },
      { link: '/functions/applications/:appid/functional/:id', component: FunctionalRoleDetail, exact: true },
      { link: '/applications/:appid/apis/:apiId', resourceId: 'apis', component: ApiDetail },
      { link: '/apis/:apiId', resourceId: 'apis', component: ApiDetail },
      { link: '/users/:id', resourceId: 'users', component: UserDetail, exact: true, props: { ampEnvId: base.environment, permissions: base.isAdmin ? null : base.allpermissions } },
      { link: '/orgs/:id', resourceId: 'orgs', component: OrgDetail, exact: true, props: { ampEnvId: base.environment, permissions: base.isAdmin ? null : base.allpermissions } },
      { link: '/jobs/:id', resourceId: 'org_jobTab', component: JobDetail, props: { ampEnvId: base.environment, permissions: base.isAdmin ? null : base.allpermissions } },
      { link: '/groups/:id', resourceId: 'groups', component: GroupDetail, props: { ampEnvId: base.environment, permissions: base.isAdmin ? null : base.allpermissions } },
      { link: '/tenants/:id', resourceId: 'tenants', component: TenantDetail },
      { link: '/setting/images/:name', resourceId: 'setting_images', component: ImageDetails },
      { link: '/setting/cluster/:id', component: ClusterDetail },
      { link: '/safeapps/:id', component: SafeAppDetail },
      { link: '/setting/systemsetting/env/:env/apps/:code', component: SysAppRoute },
    ];
    if (!base.isAdmin) DetailRouters = DetailRouters.filter(r => !r.resourceId || base.allpermissions.includes(r.resourceId));
    routers = routers.concat(DetailRouters);

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SiderMenu isMobile={isMobile} collapsed={collapsed} onCollapse={collapsed => this.setState({ collapsed })} menus={this.state.menus} />
        <Layout id='rightSide' style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
          <GlobalHeader isMobile={isMobile} collapsed={collapsed} onCollapse={collapsed => this.setState({ collapsed })}
            user={this.state.currentUser} tenants={this.state.tenants} tenantCode={this.state.tenant} tenantChange={this.state.tenantChange}
            messages={this.state.messages} cleanMessage={this.state.cleanMessage}
          />
          {!loading ?
            base.tenants.length === 0 ? <div> <Exception type="403" actions={<div />} desc='当前登录用户不属于任何租户，请联系管理员'/> <GlobalFooter /></div> :
              <div>
                <Content style={{ margin: '24px 24px 0' }}>
                  <Switch>
                    <GlobalHeaderContext.Provider value={this.state} >
                      <Route exact path="/" render={() => (
                        <Redirect to={this.state.defaultRouterLink} />
                      )} />
                      {routers.map(r => {
                        return <InterceptedRoute key={r.link} link={r.link} component={r.component} exact={r.exact} params={r.props} />
                      })}
                      {/* <Route component={NoMatch} /> */}
                    </GlobalHeaderContext.Provider>
                  </Switch>
                </Content>
                <GlobalFooter />
              </div>
            : <Card style={{ width: 'calc(100%-48)', margin: '24px', height: '100%' }} loading={loading} />}
        </Layout>
      </Layout>
    )
  }
}

export default App;