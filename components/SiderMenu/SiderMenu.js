import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assets/c2.svg';
import './index.less';
import constants from '../../services/constants'
const { Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderMenu extends React.PureComponent {
  state = {
    menus: [],
    menuSelectedKeys: [],
    menuOpenKeys: []
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.menus !== nextProps.menus) {
      this.menuInit(nextProps.menus);
    }

  }
  //菜单展开选中初始化
  menuInit = (menus) => {
    const path = window.location.hash.substring(1);
    this.setState({ menus: menus })
    menus.forEach(m => {
      if (path.startsWith(m.code ? m.code : m.link)) {
        if (m.children) {
          this.setState({ menuOpenKeys: [m.id] });
          m.children.forEach(sm => {
            if (path.startsWith(sm.link)) {
              this.setState({ menuSelectedKeys: [sm.id] });
            }
          })
        } else {
          this.setState({ menuSelectedKeys: [m.id] });
        }
      }
    })
  }

  menuSelect = ({ item, key, selectedKeys }) => {
    this.setState({ menuSelectedKeys: selectedKeys });
  }
  menuOpen = (openKeys) => {
    //只能展开一个菜单
    const latestOpenKey = openKeys.find(key => this.state.menuOpenKeys.indexOf(key) === -1);
    this.setState({ menuOpenKeys: latestOpenKey ? [latestOpenKey] : [] });
  }
  menuCollapsed = (collapsed) => {
    this.props.onCollapse(collapsed);
    this.setState({ menuOpenKeys: [] });
  }
  render() {
    const { menus } = this.state;
    const siderTrigger = (
      <Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
      />
    )
    return (
      <Sider
        trigger={this.props.isMobile ? null : siderTrigger}
        collapsible
        collapsed={this.props.collapsed}
        onCollapse={this.menuCollapsed}
        width={256}
        className='sider'
      >
        <div className='logo' key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{constants.PROJECT_TITLE}</h1>
          </Link>
        </div>
        <Menu theme="dark" mode="inline" openKeys={this.state.menuOpenKeys} selectedKeys={this.state.menuSelectedKeys} onSelect={this.menuSelect} onOpenChange={this.menuOpen}>
          {menus.map(menu => menu.children ?
            <SubMenu key={menu.id} title={<span><Icon type={menu.icon} /><span>{menu.name}</span></span>}>
              {menu.children.map(submenu =>
                   (!this.props.globalRouterEnable && submenu.id === '61') ? '' :
                   <Menu.Item title={submenu.disabled ? '到系统设置中开启全局动态路由之后启用' : ''} disabled={submenu.disabled} key={submenu.id}><Link to={submenu.link}>{submenu.name}</Link></Menu.Item>
              )}
            </SubMenu> :
            <Menu.Item key={menu.id} disabled={menu.disabled}>
              <Link to={menu.link}><Icon type={menu.icon} /><span>{menu.name}</span></Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
    );
  }
}
