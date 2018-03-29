import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Dropdown, Avatar, message, Button } from 'antd';
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import { base } from '../../services/base'
import './index.less'
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
      u.avatar = "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png";
      base.currentUser = u;
      Promise.all([base.getUserTenants(u.id), base.getEnvironments()]).then(response => {
        let tenantsData = response[0];
        let environments = response[1];
        let currentEnvironment;
        if (tenantsData === undefined || environments === undefined) return;

        environments.forEach(e => {
          if (e.isMain) currentEnvironment = e;
        })
        base.currentEnvironment = currentEnvironment;
        base.environments = environments;
        //租户数据处理
        let tenants = [];
        tenantsData.forEach(t => {
          if (t.tenant_type && t.tenant_type.indexOf('PAAS') !== -1 && t.tenant_code) {
            tenants.push({ name: t.name, code: t.tenant_code, id: t.id });
          }
        })
        if (tenants && tenants.length > 0) {
          let currentTenant = tenants[0];
          base.tenant = currentTenant.code;
          //设置好当前租户和环境之后再设置全局登录状态
          this.props.tenantChange(currentTenant.code);
          this.props.environmentChange(currentEnvironment.id);
          this.props.loginStateChange();
          this.setState({ currentUser: u, tenants, currentTenant, environments, currentEnvironment });
        } else {
          message.error("没有找到当前用户下的租户");
        }
      })
    }).catch(e => {
      message.error("获取当前用户信息失败");
    })
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
        //设置全局环境
        base.currentEnvironment = ce;
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
    } else {
      window.location.href = '#/apps';
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
        <div className="right">
          <HeaderSearch
            className="action search"
            placeholder="站内搜索"
          />
          <NoticeIcon count={5} className="action" />
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
