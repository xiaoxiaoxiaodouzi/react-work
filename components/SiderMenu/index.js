import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assets/c2.svg';
import './index.less';
import constants from '../../services/constants'

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderMenu extends React.Component {
  state = {
    collapsed: false,
    openKeys: [],
  }
  render(){
    const menus = constants.MENUS;
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={collapsed=>this.setState({ collapsed })}
        width={256}
        className='sider'
      >
        <div className='logo' key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{constants.PROJECT_TITLE}</h1>
          </Link>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {menus.map(menu=>menu.children?
            <SubMenu key={menu.id} title={<span><Icon type={menu.icon} /><span>{menu.name}</span></span>}>
              {menu.children.map(submenu=><Menu.Item key={submenu.id}><Link to={submenu.link}>{submenu.name}</Link></Menu.Item>)}
            </SubMenu>:
            <Menu.Item key={menu.id}>
              <Link to={menu.link}><Icon type={menu.icon} /><span>{menu.name}</span></Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
    );
  }
}
