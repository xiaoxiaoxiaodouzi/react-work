import React from 'react';
import { Button, Input, Col, Card, Row, Table, Form, Icon, Divider, message, Alert, Modal, Popconfirm, Affix } from 'antd';
// import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import _ from 'lodash';
import constants from '../../services/constants'
import TreeHelp from '../../utils/TreeHelp'
import './NavigationList.css';
import FunctionalSelectedDrawer from './FunctionalSelectedDrawer';
import CreatorNavigationModal from './CreatorNavigationModal';
import { postNavigation, getNavigations, addNavigationsFunctions, deleteNavigation, deleteNavigationFunction, navigationsSort } from './../../services/navigation'
import { RoleResourceModal } from '../../components/BasicData/Functional/RoleResourceModal';
import { getResourceRole } from '../../services/functional';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'
import FunctionalUsersDrawer from './FunctionalUsersDrawer';
import { base } from '../../services/base';
import Link from 'react-router-dom/Link';
import RenderAuthorized from 'ant-design-pro/lib/Authorized';

const FormItem = Form.Item;

let defaultAlert = '单击行选择指定菜单';
//递归清空选中项
const cleanTreeNodeActive = (nodes) => {
  nodes.forEach(node => {
    node.active = false;
    if (node.children) cleanTreeNodeActive(node.children);
  })
}
//数组位置替换
const arraySort = (array, sourcePosition, targetPosition) => {
  const sortNode = array[sourcePosition];
  array.splice(sourcePosition, 1);
  if (targetPosition === 0) array.unshift(sortNode);
  else if (sourcePosition > targetPosition) {
    array.splice(targetPosition, 0, sortNode);
  } else if (sourcePosition < targetPosition) {
    array.splice(targetPosition, 0, sortNode);
  }
}

class NavigationManage extends React.PureComponent {
  state = {
    treeData: [],//列表数据
    allFuncationalNodes: [],//所有的功能节点
    funNodes: [],//选中目录下的功能节点
    activeNode: {},//选中的节点
    tableLoading: false,
    drawerButtonDisabled: false,
    sortDisabled: true,
    drawerVisible: false,
    rolesDrawerVisible: false,
    menuModelVisible: false,
    tableAlert: defaultAlert,
    expandedRowKeys: [],
    authorizedFunction: {},
  }

  constructor() {
    super();

    this.loadData();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.environment !== this.props.environment) {
      this.loadData();
    }
  }
  loadData = (search) => {
    this.setState({ tableLoading: true })
    let params = {};
    if (base.isAdmin) params.withOutAuthorize = true;
    search = Object.assign({}, search, params);
    getNavigations(search).then(data => {
      let allFuncationalNodes = data.filter(d => d.type === constants.NAVIGATION_TYPE.function);
      let expandedRowKeys = data.filter(d => d.type === constants.NAVIGATION_TYPE.catalog).map(d => d.id);
      let treeData = TreeHelp.toChildrenStruct(data);
      this.setState({ treeData, allFuncationalNodes, tableLoading: false, expandedRowKeys, activeNode: {} });
    })
  }

  //行点击事件，每次只能选中一行数据；再次点击取消选中
  tableOnRow = (record) => {
    return {
      onClick: () => {
        if (record.active) {
          record.active = false;
        } else {
          cleanTreeNodeActive(this.state.treeData);
          record.active = true;
        }
        const tableAlert = record.active ? <span>选择了{record.type === constants.NAVIGATION_TYPE.catalog ? '目录菜单' : '功能菜单'}【{record.name}】</span> : defaultAlert;
        const sortDisabled = !record.active;
        let funNodes = record.active && record.type === constants.NAVIGATION_TYPE.catalog && record.children ? record.children.filter(s => s.type === constants.NAVIGATION_TYPE.function) : [];
        this.setState({ treeData: [...this.state.treeData], activeNode: record.active ? record : {}, tableAlert, funNodes, sortDisabled });
      }
    }
  }

  expandChange = (expanded, record) => {
    this.setState({ expandedRowKeys: expanded });
  }

  menuModelHandle = (navigation) => {
    postNavigation(navigation, navigation.id).then(data => {
      this.setState({ menuModelVisible: false });
      this.loadData();
    })
  }
  openDrawer = (e) => {
    if (this.state.activeNode.type === constants.NAVIGATION_TYPE.function) {
      const drawerTitle = `查看功能【${this.state.activeNode.name}】的授权角色和用户`;
      this.setState({ rolesDrawerTitle: drawerTitle, rolesDrawerVisible: true });
    } else {
      const menuName = this.state.activeNode.name ? '目录【' + this.state.activeNode.name + '】' : '【根目录】';
      const drawerTitle = `选择功能导入到导航${menuName}`;
      this.setState({ drawerVisible: !this.state.drawerVisible, drawerTitle });
    }
  }
  drawerHandle = (funIds, funs) => {
    if (funIds.length === 0) {
      message.warning('还没有选择任何功能');
      return;
    }

    if (!this.state.activeNode.type) {
      const funNames = funs.map(f => { return f.name });
      let text = <span>是否将功能:<br />{funNames.join(',')}<br />导入到根目录</span>
      Modal.confirm({
        title: '确认将功能导入到根菜单',
        content: text,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.addMenuFunctional(funIds);
        }
      });
      return;
    }
    if (this.state.activeNode.type === constants.NAVIGATION_TYPE.function) {
      message.warning('不能导入到功能菜单上，请选择菜单目录');
      return;
    }
    this.addMenuFunctional(funIds);
  }

  addMenuFunctional = (funIds) => {
    addNavigationsFunctions(this.state.activeNode ? this.state.activeNode.id : '0', funIds).then(data => {
      message.success('操作成功');
      this.setState({ drawerVisible: false });
      this.loadData();
    })
  }
  menuEditClick = (e, record) => {
    e.stopPropagation();//阻止选中行事件
    this.setState({ menuModelVisible: true, menuModelTitle: '编辑菜单目录', menuModelData: record });
  }
  openAuthFunctionModal = (e, record) => {
    e.stopPropagation();//阻止选中行事件
    getResourceRole(record.app.id, record.id).then(data => {
      if (data.length === 0) {
        message.warning('该功能没有授予任何角色，不能够进行授权！');
        return;
      }
      data.forEach(i => {
        i.label = i.name;
        i.value = i.id;
      })
      record.roleList = data;
      this.setState({ authorizedFunction: record, RoleResourceModalTitle: '给功能【' + record.name + '】进行授权', RoleResourceModalVisible: true });
    })
  }
  deleteMenu = (e, record) => {
    if (record.type === constants.NAVIGATION_TYPE.catalog) {
      deleteNavigation(record.id).then(data => {
        message.success('操作成功');
        this.loadData();
      })
    } else {
      deleteNavigationFunction(record.pid, record.id).then(data => {
        message.success('操作成功');
        this.loadData();
      });
    }
  }
  handleSearch = (e) => {
    e.preventDefault();
    const searchParam = { catalogOrResourceName: this.state.searchName, appName: this.state.searchApp };
    this.loadData(searchParam);
  }
  //排序
  pid;
  sortNodes;
  sortDebounce = _.debounce(() => {
    navigationsSort(this.pid, this.sortNodes.map(n => n.id)).then(data => {
      message.success('菜单排序成功');
    });
  }, 1000);

  menuSort = (direction) => {
    let treeData = this.state.treeData;
    let node = this.state.activeNode;
    let targetPosition;
    if (direction === 'up') {
      if (node._index === 0) {
        message.info('已经移到到第一位了');
        return;
      }
      targetPosition = node._index - 1;
    }
    this.sortNodes = [];
    this.pid = node.pid;

    if (node.pid === '0') this.sortNodes = treeData;
    else {
      this.sortNodes = TreeHelp.getTreeNode(treeData, node.pid).children;
    }
    if (direction === 'down') {
      if (node._index === this.sortNodes.length - 1) {
        message.info('已经移到到最后一位了');
        return;
      }
      targetPosition = node._index + 1;
    }
    arraySort(this.sortNodes, node._index, targetPosition);
    //排序后重置_index
    this.sortNodes.forEach((n, i) => n._index = i);

    this.setState({ treeData: [...treeData] });
    this.sortDebounce();
  }

  render() {
    const Authorized = RenderAuthorized(base.allpermissions);
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        render: (text, record) => {
          return (
            <span>
              <Icon type={record.type === constants.NAVIGATION_TYPE.catalog ? 'folder' : 'file'} /> {record.type === constants.NAVIGATION_TYPE.function ?
                <Link to={`/applications/${record.app.id}/functional/${record.id}`}>{text}</Link> : text}
            </span>
          )
        }
      }, {
        title: '图标',
        dataIndex: 'fontIcon',
        render: (text, record) => <Icon type={text} />
      }, {
        title: '所属应用',
        dataIndex: 'type',
        render: (text, record) => {
          return text === constants.NAVIGATION_TYPE.catalog ? '--' : record.app ? record.app.name : '--';
        }
      }, {
        title: '路径',
        dataIndex: 'uri',
        render: (text, record) => {
          return text
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          const title = `确定删除该菜单${record.type === constants.NAVIGATION_TYPE.catalog ? '目录?' : '?'}`;
          return (<span>
            {
              record.type === constants.NAVIGATION_TYPE.catalog ?
                <Authorized authority='edit' noMatch={<a disabled='true' onClick={e => { this.menuEditClick(e, record) }}>编辑</a>}>
                  <a onClick={e => { this.menuEditClick(e, record) }}>编辑</a>
                </Authorized>
                :
                <Authorized authority='authorization' noMatch={<a disabled='true' onClick={e => { this.openAuthFunctionModal(e, record) }}>授权</a>}>
                  <a onClick={e => { this.openAuthFunctionModal(e, record) }}>授权</a>
                </Authorized>
            }
            <Divider type="vertical" />
            <Authorized authority='delete' noMatch={<a disabled='true'>删除</a>}>
              <Popconfirm title={title} onConfirm={e => {
                e.stopPropagation();//阻止选中行事件
                this.deleteMenu(e, record)
              }}>
                <a>删除</a>
              </Popconfirm>
            </Authorized>
          </span>);
        }
      }
    ];
    const rowClassName = (record, i) => {
      return record.active ? 'active' : '';
    }
    const drawerButtonTitle = this.state.activeNode.type === constants.NAVIGATION_TYPE.function ? '查看功能已授权的用户' : '关联功能';

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{ name: '基础数据' }, { name: '全局导航设置' }]} action={<GlobalEnvironmentChange />} />
        <Card bordered={false} style={{ margin: '24px 24px 0' }} >
          <div className="tableList">
            <Form layout="inline" onSubmit={this.handleSearch}>
              <Row gutter={24}>
                <Col md={8} sm={24}>
                  <FormItem label="菜单名称">
                    <Input onChange={e => this.setState({ searchName: e.target.value })} value={this.state.searchName} />
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="应用名称">
                    <Input onChange={e => this.setState({ searchApp: e.target.value })} value={this.state.searchApp} />
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.props.restfields}>重置</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <Affix target={() => document.getElementById('rightSide')}>
            <div style={{ backgroundColor: 'white', paddingBottom: 10 }}>
              <Authorized authority='create_directory' noMatch={null}>
                <Button type="primary" style={{ margin: '24px 5px 16px 0' }} icon="plus" onClick={e => { this.setState({ menuModelVisible: true, menuModelTitle: '创建菜单目录', menuModelData: { pid: this.state.activeNode.id ? this.state.activeNode.id : '0', pname: this.state.activeNode.name ? this.state.activeNode.name : '根目录' } }) }}>创建目录</Button>
              </Authorized>
              <Authorized authority='relation_functional' noMatch={null}>
                <Button type="primary" style={{ margin: '24px 5px 16px 0' }} icon="menu-fold" onClick={this.openDrawer}>{drawerButtonTitle}</Button>
              </Authorized>
              <Authorized authority='move' noMatch={null}>
                <Button type="primary" disabled={this.state.sortDisabled} icon="sort-descending" style={{ margin: '24px 5px 16px 0' }} onClick={e => this.menuSort('up')}>上移</Button>
              </Authorized>
              <Authorized authority='move' noMatch={null}>
                <Button type="primary" disabled={this.state.sortDisabled} icon="sort-ascending" style={{ margin: '24px 5px 16px 0' }} onClick={e => this.menuSort('down')}>下移</Button>
              </Authorized>
              <Alert message={this.state.tableAlert} type="info" showIcon />
            </div>
          </Affix>
          <Table columns={columns} dataSource={this.state.treeData} expandedRowKeys={this.state.expandedRowKeys} onExpandedRowsChange={this.expandChange} loading={this.state.tableLoading} pagination={false} onRow={this.tableOnRow} rowClassName={rowClassName} />
          <FunctionalSelectedDrawer title={this.state.drawerTitle} visible={this.state.drawerVisible} selectedDatas={this.state.funNodes} hiddenDatas={this.state.allFuncationalNodes} onOk={this.drawerHandle} onClose={e => { this.setState({ drawerVisible: false }) }} />
          <FunctionalUsersDrawer appId={this.state.activeNode.app ? this.state.activeNode.app.id : null} functionId={this.state.activeNode.id} title={this.state.rolesDrawerTitle} visible={this.state.rolesDrawerVisible} onClose={e => { this.setState({ rolesDrawerVisible: false }) }} />
          <CreatorNavigationModal title={this.state.menuModelTitle} visible={this.state.menuModelVisible} onCancel={e => { this.setState({ menuModelVisible: false }) }} onOk={this.menuModelHandle} data={this.state.menuModelData} />
          <RoleResourceModal record={this.state.authorizedFunction} visible={this.state.RoleResourceModalVisible} title={this.state.RoleResourceModalTitle} type='addUsers' handleAuthorizeModal={e => this.setState({ RoleResourceModalVisible: false })} />
        </Card>
      </div>
    );
  }
}

export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <NavigationManage {...props} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
)