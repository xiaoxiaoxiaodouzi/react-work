import React, { Fragment, Component } from 'react';
import { Table, Form, Button, Modal, Input, message, Divider } from 'antd';
import AuthorizedUserUnion from '../../BasicData/Functional/AuthorizedUserUnion'
import { getRoles, addRole, getRolesByCode, updateRole } from '../../../services/running'
import { ObjectDetailContext } from '../../../context/ObjectDetailContext'
import { updateRoleResource, getRoleResources } from '../../../services/functional'
import PropTypes from 'prop-types'
import BaseTree from '../../../common/BaseTree'
import Link from 'react-router-dom/Link';
import { base } from '../../../services/base';
import RenderAuthorized from 'ant-design-pro/lib/Authorized';
class RoleForm extends Component {
  static propTypes = {
    prop: PropTypes.object,

  }
  state = {
    data: [],
    roleName: '',
    visible: false,
    visibleModal: false,
    functionsVisible: false,     //功能授权模态框
    current: 1,
    total: '',
    pageSize: 10,
    roleId: '',
    selectedKeys: [],      //角色下的资源
    treeNode: [],           //所有树节点     
    loading: false,
    disabled: false,     //编码禁用
    record: '',      //选中行数据
  }

  componentDidMount() {
    let queryParams = {
      page: 1,
      rows: 10,
    }
    this.setState({ loading: true })
    getRoles(this.props.appId, queryParams).then(data => {
      this.setState({ data: data.contents, total: data.total, loading: false, record: '' })
      this.props.roleList(data.contents);
    }).catch(err => {
      this.setState({ loading: false, record: '' })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.flag !== this.props.flag) {
      this.loadDatas(1, 10);
    }

    if (nextProps.treeNode !== this.props.treeNode) {
      this.setState({
        treeNode: nextProps.treeNode
      })
    }
  }

  loadDatas = (current, pageSize) => {

    this.setState({ loading: true })
    let queryParams = {
      page: current,
      rows: pageSize,
    }
    getRoles(this.props.appId, queryParams).then(data => {
      this.setState({ data: data.contents, total: data.total, loading: false, record: '' }, () => {
        this.props.roleList(data.contents)
      })
    }).catch(err => {
      this.setState({ loading: false, record: '' })
    })
  }

  showModal = (record) => {
    this.setState({ visible: true, roleName: record.name, roleId: record.id })
  }

  showFunction = (record) => {
    getRoleResources(record.appId, record.id).then(data => {//数据有更新时需重新加载 
      this.setState({ functionsVisible: true, roleName: record.name, roleId: record.id, selectedKeys: data })
    })
  }

  hanldeCancel = () => {
    this.setState({ visible: false })
  }

  handleClick = () => {
    this.setState({ visibleModal: true })
  }

  EditRole = (record) => {
    if (record.code === 'amp_admin' || record.code === 'manager' || record.code === 'amp_roleManager') {
      message.warn('管理员角色不能编辑！')
    } else {
      let form = this.props.form;
      this.setState({ disabled: true, visibleModal: true, record }, () => {
        form.setFieldsValue({ name: record.name, desc: record.desc, code: record.code });
      });
    }
  }
  // 点击复选框触发事件
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys: checkedKeys
    })
  }

  handleModalOk = () => {
    let form = this.props.form;
    let value = form.getFieldsValue();
    if (this.state.disabled) {
      updateRole(this.props.appId, this.state.record.id, value).then(data => {
        message.success('修改角色成功');
        this.setState({ disabled: false, visibleModal: false });
        this.loadDatas(1, 10);
      })
    } else {
      let values = [];
      values.push(value);
      addRole(this.props.appId, values).then(data => {
        if (data.length > 0) {
          message.success('新增角色成功');
          this.setState({ visibleModal: false })
          this.loadDatas(1, 10);
        }
      })
    }
  }

  handleFunctionOk = () => {
    //调用角色授权功能
    let ids = [];
    let keys;
    //这里是为了区别直接点击确定时候拿不到onselectkeys
    if (this.state.onSelectKeys === undefined) {
      keys = this.state.selectedKeys;
    } else {
      keys = this.state.onSelectKeys;
    }
    keys.forEach(i => {
      ids.push(i.id)
    })
    updateRoleResource(this.props.appId, this.state.roleId,ids).then(data => {
      message.success('角色授权功能成功')
      this.setState({ functionsVisible: false })
      this.props.roleList(this.state.data.concat([]))
    })
  }

  onSelectKeys = (selectKeys, selectNodes) => {
    this.setState({ onSelectKeys: selectNodes })
  }

  //校验表单数据
  validateParams = (rule, value, callback) => {
    if (rule.field === 'name') {
      if (value) {
        let params = {
          name: value,
          mode: 'simple'
        }
        if (this.state.record && value !== this.state.record.name) {
          getRoles(this.props.appId, params).then(data => {
            if (data.length > 0) {
              callback('角色名称已存在');
            } else {
              callback()
            }
          })
        }
      } else {
        callback('请输入角色名称')
      }
    }
    if (rule.field === 'code') {
      if (value) {
        if (!this.state.record) {
          getRolesByCode(this.props.appId, value).then(data => {
            if (data) {
              callback('角色编码已存在');
              return;
            } else {
              callback();
            }
          })
        }
      } else {
        callback('请输入角色编码');
        return;
      }
    }
  }

  render() {

    const { current, total, pageSize } = this.state;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '20%',
        render: (record, text) => {
          return (
            <Link to={`/applications/${text.appId}/functionalroles/${text.id}`}>{text.name}</Link>
          )
        }
      }, {
        title: '编码',
        dataIndex: 'code',
        width: '30%',
      },
      {
        title: '描述',
        dataIndex: 'desc',
        width: '30%',
      }, /* {
        title: '功能',
        dataIndex: 'functions',
        width: '20%',
        render: (values, record) => {
          return values.length > 0 ? values.map(element => {
            return <Fragment><Link style={{ whiteSpace: 'nowrap' }} to={`/applications/${element.appId}/functional/${element.id}`}>{element.name}</Link> </Fragment>;
          }) : '--';  
        }
      }, */
      {
        title: '操作',
        width: '20%',
        render: (text, record) => {
          return (
            <Fragment>
              <Authorized authority='app_role_relationFunction' noMatch={<a disabled='true' onClick={() => { this.showFunction(record) }}>关联功能</a>}>
                <a onClick={() => { this.showFunction(record) }}>关联功能</a>
              </Authorized>
              <Divider type='vertical' />
              <Authorized authority='app_editRole' noMatch={<a disabled="true" onClick={() => { this.EditRole(record) }}>编辑</a>}>
                <a onClick={() => { this.EditRole(record) }}>编辑</a>
              </Authorized>
            </Fragment>
          )
        }
      },
    ]

    const pagination =
      {
        total: total,
        current: current,
        pageSize: pageSize,
        showTotal: total => `共有${total}条数据`,
        onChange: (current, pageSize) => {
          this.loadDatas(current, pageSize)
        },
        showQuickJumper: true
      }

    // rowSelection object indicates the need for row selection
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    //   getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //     name: record.name,
    //   }),
    // }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 13 },
      },
    };

    const { getFieldDecorator } = this.props.form;
    //const message = `将功能角色${this.state.roleNmae}授权给用户集合`
    const Authorized = RenderAuthorized(base.allpermissions);
    return (
      <div>
        <div style={{ marginBottom: 12 }}>
          <Authorized authority='app_addRole' noMatch={null}>
            <Button type='primary' style={{ marginLeft: '12px' }} onClick={this.handleClick}>新建</Button>
          </Authorized>
          {/* <Button type='primary' style={{ marginLeft: '12px' }}>导入</Button>
          <Button type='primary' style={{ marginLeft: '12px' }}>导出</Button>
          <Button type='primary' style={{ marginLeft: '12px' }}>刷新</Button> */}
        </div>
        <Table
          /* rowSelection={rowSelection} */
          dataSource={this.state.data}
          columns={columns}
          rowKey={record => record.code}
          pagination={pagination}
          loading={this.state.loading}
        />
        <Modal
          width='800px' style={{ top: 20 }} bodyStyle={{ maxHeight: 600, overflowY: 'auto' }}
          title='已授权用户集合'
          visible={this.state.visible}
          onOk={() => { this.setState({ visible: false }) }}
          onCancel={this.hanldeCancel}
        >
          <AuthorizedUserUnion size='middle' appId={this.props.appId} roleId={this.state.roleId} />
        </Modal>

        <Modal
          title={this.state.disabled ? '修改角色' : '新增角色'}
          visible={this.state.visibleModal}
          onOk={this.handleModalOk}
          destroyOnClose
          onCancel={() => this.setState({ visibleModal: false })}>
          <Form>
            <Form.Item {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  //现在校验接口有问题 先暂时不校验了
                  validator: this.validateParams
                }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="编码">
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  validator: this.validateParams
                }],
              })(
                <Input disabled={this.state.disabled} />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="描述">
              {getFieldDecorator('desc')(
                <Input.TextArea rows={4} />
              )}
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          bodyStyle={{ overflow: 'auto', height: '500px' }}
          title='功能授权'
          width='800px'
          visible={this.state.functionsVisible}
          onOk={this.handleFunctionOk}
          onCancel={() => this.setState({ functionsVisible: false })}
          destroyOnClose
        >
          <BaseTree onSelectKeys={(selectKeys, selectNodes) => this.onSelectKeys(selectKeys, selectNodes)} treeNodes={this.state.treeNode} pidName="parentId" selectedNodes={this.state.selectedKeys} />
        </Modal>
      </div>


    )
  }
}

const Role = Form.create()(RoleForm);
export default props => (
  <ObjectDetailContext.Consumer>
    {context => <Role {...props} context={context} />}
  </ObjectDetailContext.Consumer>
)
