import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Dropdown, Avatar, message } from 'antd';
import userIcon from '../../assets/defaultUser.png';
import { base } from '../../services/base'
import {getConfigs} from '../../services/setting'
import constants from '../../services/constants'
import './index.less'
import {GlobalHeaderContext} from '../../context/GlobalHeaderContext'


const { Header } = Layout;
const { SubMenu } = Menu;

export default class GlobalHeader extends PureComponent {
  state = {
    currentUser: {},
    currentTenant: {},
    currentEnvironment: {},
    tenants: [],
    environments: []
  }
  constructor() {
    super();
    base.getCurrentUser().then(u => {
      u.avatar = userIcon;
      base.currentUser = u;
      if(window.location.hash === '#/'){
        if(u.id === 'admin')window.location.href = '#/dashboard/admin';
        else window.location.href = '#/dashboard/resource';
      }
      this.setState({ currentUser: u});

      //环境
      base.getEnvironments().then(environments=>{
        let currentEnvironment;
        environments.forEach(e => {
          if(window.localStorage.localEnvironmentId === e.id)currentEnvironment = e;
          if (e.isMain && currentEnvironment === undefined) currentEnvironment = e;
        })
        base.currentEnvironment = currentEnvironment;
        base.environments = environments;
        constants.MENUS[4].disabled = !currentEnvironment.isMain;

        this.setState({ environments, currentEnvironment });

        this.props.environmentChange(currentEnvironment.id);
      });

      //租户
      base.getUserTenants(u.id).then(tenantsData=>{
        let tenants = [];
        tenantsData.forEach(t => {
          if (t.tenant_type && t.tenant_type.indexOf('PAAS') !== -1 && t.tenant_code) {
            tenants.push({ name: t.name, code: t.tenant_code, id: t.id });
          }
        })
        if (tenants && tenants.length > 0) {
          //从浏览器存储中获取默认租户
          let currentTenant;
          if(window.localStorage.localTenantCode){
            tenants.forEach(t=>{
              if(t.code === window.localStorage.localTenantCode){
                currentTenant = t;
              }
            })
          }
          if(!currentTenant){
            let currentTenant = tenants[0];
            window.localStorage.localTenantCode = currentTenant.code;
          }else{
            base.tenant = currentTenant.code;
            base.currentTenantInfo = currentTenant;
            //设置好当前租户和环境之后再设置全局登录状态
            this.props.tenantChange(currentTenant.code);
            this.props.loginStateChange();
            this.setState({ tenants, currentTenant });
          }
        } else {
          message.error("没有找到当前用户下的PAAS租户");
        }
      });

      getConfigs().then(data=>{
        base.configs = data;
      });
    })
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    // this.triggerResizeEvent();
  }

  menuClick = ({ item, key, keyPath }) => {
    if (key === 'logout') {//登出，跳转到登录页面
      base.loginOut().then(data => {
        window.location.href = data.result;
      })
    } else if (key.startsWith('tenant_')) {//切换租户
      let tenantId = key.substring(7);
      let ct;
      this.state.tenants.forEach(t => {
        if (t.id === tenantId) ct = t;
      })
      if (ct) {
        this.setState({ currentTenant: ct });
        //设置全局租户
        base.tenant = ct.code;
        base.currentTenantInfo = ct;
        window.localStorage.localTenantCode = ct.code;
        this.props.tenantChange(ct.code);
        message.success('切换到租户：' + ct.name);
        this.pageRedirect();
      }
    } else if (key.startsWith('environment_')) {//切换环境
      let environmentId = key.substring(12);
      let ce;
      this.state.environments.forEach(e => {
        if (e.id === environmentId) ce = e;
      })
      if (ce) {
        this.setState({ currentEnvironment: ce });
        constants.MENUS[4].disabled = !ce.isMain;
        //设置全局环境
        base.currentEnvironment = ce;
        window.localStorage.localEnvironmentId = ce.id;
        this.props.environmentChange(ce.id);
        message.success('切换到环境：' + ce.name);
        this.pageRedirect();
      }
    }
  }

  //除了中间件列表和服务列表，切换租户和环境之后都跳转到应用列表
  pageRedirect() {
    let hash = window.location.hash;
    if (hash.startsWith('#/middlewares')) {
      if (hash.length > 13) window.location.href = '#/middlewares';
    } else if(hash.startsWith('#/apps')){
      if (hash.length > 7) window.location.href = '#/apps';
    } else if(hash.indexOf('#/apis')!==-1){
      if(hash.length>7) window.location.href = '#/apis';
    } else if(hash.indexOf('#/tenants')!==-1){
      window.location.href = '#/apps';
    }else if(!(hash.startsWith('#/dashboard/admin') || hash.startsWith('#/setting/license') || hash.startsWith('#/setting/syssetting'))){
      window.location.reload();
    }
  }

  render() {
    let { currentUser, currentTenant, currentEnvironment } = this.state;
    const menu = (
      <Menu className='menu' selectedKeys={[]} onClick={this.menuClick}>
        <SubMenu title={<span><Icon type="user" />切换租户</span>}>
          {this.state.tenants.map(t => <Menu.Item key={'tenant_' + t.id} disabled={currentTenant.id === t.id}>{t.name}</Menu.Item>)}
        </SubMenu>
        <SubMenu title={<span><Icon type="laptop" />切换环境</span>}>
          {this.state.environments.map(e => <Menu.Item key={'environment_' + e.id} disabled={currentEnvironment.id === e.id}>{e.name}</Menu.Item>)}
        </SubMenu>
        <Menu.Divider />
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Item key="logout"><span><Icon type="logout" />退出登录</span></Menu.Item>
      </Menu>
    );
    return (
        <Header className="gloabl-header header" >
          {this.props.isMobile && (
            <Icon
              className='trigger'
              type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          )}
          <div className="right">
            {/* <HeaderSearch
              className="action search"
              placeholder="站内搜索"  
            /> */}
            {/* <NoticeIcon count={5} className="action" /> */}
            {currentUser ? (
              <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
                <span className="action account">
                  <Avatar size="small" className="avatar" src={currentUser.avatar} icon="user" />
                  <span className="name"> {currentUser.realname} | {currentTenant.name} | {currentEnvironment.name} </span>
                </span>
              </Dropdown>
            ) : <Spin size="small" style={{ marginLeft: 8, marginRight: 200 }} />}
          </div>
        </Header>
    );
  }
}
