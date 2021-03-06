import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Dropdown, Avatar, message, Tooltip } from 'antd';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
// import userIcon from '../../assets/defaultUser.png';
import { base } from '../../services/base'
import constants from '../../services/constants'
import './index.less';
import { Link } from 'react-router-dom';
import { safeLogout } from '../../services/amp';

const { Header } = Layout;
const { SubMenu } = Menu;

export default class GlobalHeader extends PureComponent {
  state = {
    currentUser: {},
    currentTenant: {},
    tenants: [],
    errorMessages: [],
    loading: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      // nextProps.user.avatar = userIcon;
      let currentTenant={};
      nextProps.tenants.forEach(t => {
        if (t.code === nextProps.tenantCode) currentTenant = t;
      });
      this.setState({ currentUser: nextProps.user, tenants: nextProps.tenants, currentTenant, loading: false });
    }
    if (nextProps.messages !== this.props.messages) {
      // nextProps.messages.forEach(meg=>{
      //   meg.title = <span><Icon type="close-circle" style={{color:'red',marginRight:10}}/>{meg.title}</span>
      // })
      this.setState({ errorMessages: nextProps.messages });
    }
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    // this.triggerResizeEvent();
  }

  menuClick = ({ item, key, keyPath }) => {
    if (key === 'logout') {//登出，跳转到登录页面
      if (base.safeMode) {
        safeLogout().then(() => {
          base.safeMode = false;
          window.localStorage.removeItem(constants.WINDOW_LOCAL_STORAGE.SAFEMODEL);
          base.loginOut().then(data => {
            window.location.href = data.result;
          }).catch(() => {
            window.location.href = '/';
          })
        });
      } else {
        base.loginOut().then(data => {
          window.location.href = data.result;
        })
      }
    } else if (key.startsWith('tenant_')) {//切换租户
      let tenantId = key.substring(7);
      let ct;
      this.state.tenants.forEach(t => {
        if (t.id === tenantId) ct = t;
      })
      if (ct) {
        this.setState({ currentTenant: ct });
        message.success('切换到租户：' + ct.name);
        this.props.tenantChange(ct.code);
        this.pageRedirect();
      }
    }
  }

  //除了中间件列表和服务列表，切换租户和环境之后都跳转到应用列表
  pageRedirect() {
    let hash = window.location.hash;
    if (hash.startsWith('#/middlewares')) {
      if (hash.length > 13) window.location.href = '#/middlewares';
    } else if (hash.startsWith('#/apps')) {
      if (hash.length > 7) window.location.href = '#/apps';
    } else if (hash.indexOf('#/apis') !== -1) {
      if (hash.length > 7) window.location.href = '#/apis';
    } else if (hash.indexOf('#/tenants') !== -1) {
      window.location.href = '#/apps';
    } else if (hash.indexOf('#/setting/syssetting') !== -1) {
      window.location.href = '#/setting/syssetting';
    }
  }

  render() {
    let { currentUser, currentTenant, loading } = this.state;
    const menu = (
      <Menu className='menu' selectedKeys={[]} onClick={this.menuClick}>
        <SubMenu title={<span><Icon type="user" />切换租户</span>}>
          {this.state.tenants.map(t => <Menu.Item key={'tenant_' + t.id} disabled={currentTenant.id === t.id}>{t.name}</Menu.Item>)}
        </SubMenu>
        <Menu.Divider />
        {/* <Menu.Item disabled><Icon type="setting" />设置</Menu.Item> */}
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
          <Tooltip title='查看文档'>
            <Link to='/doc' className='action' target='_blank'>
              <Icon type="question-circle-o" />
            </Link>
          </Tooltip>
          {base.configs.messageBell &&
            <NoticeIcon count={this.state.errorMessages.length} className="action" onClear={this.props.cleanMessage} clearClose={true}>
              <NoticeIcon.Tab
                title='错误信息'
                emptyText="页面运行良好"
                list={this.state.errorMessages}
              />
              <NoticeIcon.Tab
                title='监控告警'
                emptyText="系统运行良好"
                list={[]}
              />
            </NoticeIcon>
          }
          {loading ?
            <Spin size="small" style={{ marginLeft: 8, marginRight: 200 }} /> :
            (<Dropdown
              overlay={menu}
              trigger={['hover']}
              placement="bottomRight">
              <span className="action account">
                <Avatar size="small" className="avatar" src={currentUser.avatar} icon="user" />
                <span className="name"> {currentUser.realname} | {currentTenant.name} </span>
              </span>
            </Dropdown>
            )}
        </div>
      </Header>
    );
  }
}
