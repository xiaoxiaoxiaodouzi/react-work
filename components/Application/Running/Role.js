import React, { Fragment, Component } from 'react';
import { Table, Form, Button, Modal, message,Upload,Dropdown, Menu ,Icon } from 'antd';
import AuthorizedUserUnion from '../../BasicData/Functional/AuthorizedUserUnion'
import { ObjectDetailContext } from '../../../context/ObjectDetailContext'
import { getRolesByCode,addRole,getRoles,importPreviewRoles,getRoleResources,exportRoles,roleManagerUsers,getRoleUserCollection,updateUserCollection,updateRoleResource, updateRole,getRoleManagerUsers  } from '../../../services/aip'
import PropTypes from 'prop-types'
import BaseTree from '../../../common/BaseTree'
import Link from 'react-router-dom/Link';
import Authorized from '../../../common/Authorized';
import debounce from 'lodash-decorators/debounce';
import ResourcePreviewModal from './ResourcePreviewModal';
import AuthorizeRoleModal from '../../../common/FunctionalSelectModal/AuthorizeRoleModal'
import {DynamicFormEditorModal} from 'c2-antd-plus';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { base } from '../../../services/base';
import constants from '../../../services/constants';
class RoleForm extends Component {
  static propTypes = {
    prop: PropTypes.object,
  }
  constructor(props){
    super(props);
    this.state = {
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
      fileList:[],
      previewData:[],
      previewVisible:false,
      confirmLoading:false,
      title:'',
      type:0
    }
    this.validateParams = this.validateParams.bind(this);
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

  handleModalOk = (values) => {
    // let form = this.props.form;
    // let value = form.getFieldsValue();
    this.setState({confirmLoading:true})
    if (this.state.disabled) {
      updateRole(this.props.appId, this.state.record.id, values).then(data => {
        message.success('修改角色成功');
        this.setState({ disabled: false, visibleModal: false,confirmLoading:false });
        this.loadDatas(1, 10);
      })
    } else {
      let valuesArr = [];
      valuesArr.push(values);
      addRole(this.props.appId, valuesArr).then(data => {
        if (data.length > 0) {
          message.success('新增角色成功');
          this.setState({ visibleModal: false,confirmLoading:false })
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

  //导出角色
  exportRoles = () =>{
    exportRoles(this.props.appId,this.props.appname + "-资源");
  }

  importOk = (flag) => {
    if(flag){
      this.loadDatas(1, 10);
      this.setState({previewVisible:false});
    }
  }

  authorizedUser = (roleId) =>{
    this.setState({roleId:roleId});
    getRoleUserCollection(this.props.appId, roleId,  {}).then(datas=>{
      this.setState({
        selectedKeys: datas,
        authorizeVisible:true,
        title:'将功能角色授权给用户',
        type:0
      });
    })
  }

  authorizedManager = (roleId) =>{
    this.setState({roleId:roleId});
    getRoleManagerUsers(this.props.appId,roleId).then(datas => {
      this.setState({
        selectedKeys: datas,
        authorizeVisible:true,
        title:'设置功能角色管理员',
        type:1
      })
    })
  }

   //处理功能授权modal回调，flag=true为点击确定，返回选择的功能集合数据，flag=false为点击取消，关闭modal
   handleAuthorizeModal = (flag, selectedValues) => {
    if (flag) {
      if(this.state.type){
        roleManagerUsers(this.props.appId, this.state.roleId, selectedValues).then(data => {
          message.success('角色授权管理员用户集合成功')
        })
       }else{
        updateUserCollection(this.props.appId, this.state.roleId, selectedValues).then(data => {
          message.success('修改授权用户集合成功')
        })
       }
    }
    this.setState({ authorizeVisible: false })
  }

  //校验表单数据
  validateParams = debounce(100,function(rule, value, callback){
    if (rule.field === 'name') {
      if (value) {
        let params = {
          name: value,
          mode: 'simple'
        }
        if (value && value !== this.state.record.name) {
          getRoles(this.props.appId, params).then(data => {
            if (data.length > 0) {
              callback('角色名称已存在');
            } else {
              callback()
            }
          })
        }else{
          callback();
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
        }else{
          callback();
        }
      } else {
        callback('请输入角色编码');
        return;
      }
    }
  })

  setRole=(role)=>{
    this.role = role;
  }

  menuSelect = (item, key, selectedKeys)=>{
    if(item.key === 'function'){
      this.showFunction(this.role)
    }else if(item.key === 'user'){
      this.authorizedUser(this.role.id);
    }else if(item.key === 'manager'){
      this.authorizedManager(this.role.id);
    }
    this.setState({ selectedKeys: [] })
  }

  render() {
    const props = {
      onRemove: (file) => {
          this.setState({ fileList: [] })
      },
      beforeUpload: (file) => {
          this.setState({ fileList: [file] })
          return false;
      },
      onChange:(info) =>{
          if(info.fileList && info.fileList.length > 0){
              if(info.file.type !== 'text/plain'){
                message.warning('上传格式错误，请上传一个txt格式的文件！');
                this.setState({
                 fileList:[]
                });
                return;
              }
              let filedata = new FormData();
              filedata.append('file', info.fileList[0].originFileObj);
              this.setState({
                    previewVisible:true,
                    previewLoading:true,
                   fileList:[]
              });
              //预览
              importPreviewRoles(this.props.appId,filedata)
                  .then(data => {
                      if(data){
                          this.setState({
                              previewData:data,
                              previewLoading:false
                          });
                      }
              })
          }
        
      },
      fileList: this.state.fileList,
      className: 'upload-list-inline',
  }
    const { current, total, pageSize } = this.state;
    const menu = (
			<Menu onClick={this.menuSelect} selectedKeys={this.state.selectedKeys}>
				<Menu.Item key="function" disabled={base.allpermissions &&base.allpermissions.length > 0 ?!base.allpermissions.includes('app_role_relationFunction'):false}>
					关联功能
				</Menu.Item>
        <Menu.Divider />
				<Menu.Item key="user">
					授权用户
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="manager">
					授权管理员
				</Menu.Item>
			</Menu>
		);
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%',
        render: (record, text) => {
          return (
            <Link to={`/applications/${text.appId}/functionalroles/${text.id}`}>{text.name}</Link>
          )
        }
      }, {
        title: '编码',
        dataIndex: 'code',
        width:'15%',
      },
      {
        title: '描述',
        dataIndex: 'desc',
        render:(text)=>{
          return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
        }
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
        width: '150px',
        render: (text, record) => {
          return (
            <Fragment>
              {/* <Authorized authority='app_role_relationFunction' noMatch={<a disabled='true' onClick={() => { this.showFunction(record) }}>关联功能</a>}>
                <a onClick={() => { this.showFunction(record) }}>关联功能</a>
              </Authorized>
              <Divider type='vertical' /> */}
              <Authorized authority='app_editRole' noMatch={<a disabled="true" onClick={() => { this.EditRole(record) }}>编辑</a>}>
                <a onClick={() => { this.EditRole(record) }}>编辑</a>
              </Authorized>
              {/* <Divider type='vertical' />
              <a onClick={()=>{this.authorizedUser(record.id)}}>授权用户</a>
              <Divider type='vertical' />
              <a onClick={()=>{this.authorizedUser(record.id)}}>授权管理员</a> */}
              <Dropdown overlay={menu} trigger={["click"]} width="220">
                <a style={{ marginLeft: 10 }} className="ant-dropdown-link" onClick={() => this.setRole(record)}>
                  更多 <Icon type="down" />
                </a>
							</Dropdown>
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

    let items = [];
    items.push({label:'名称',name:'name',type:'input',initialValue:this.state.record?this.state.record.name:'',validator: this.validateParams,required:true});
    let codeItem = {label:'编码',name:'code',type:'input',initialValue:this.state.record?this.state.record.code:'',required:true,attribute:{disabled:this.state.disabled}};
    if(!this.state.disabled){
      codeItem.validator = this.validateParams;
    }
    items.push(codeItem);
    items.push({label:'描述',name:'desc',type:'textarea',initialValue:this.state.record?this.state.record.desc:'',attribute:{rows:4}});
    return (
      <div>
        <div style={{ marginBottom: 12 }}>
          <Authorized authority='app_addRole' noMatch={null}>
            <Button type='primary' icon='plus' style={{ marginLeft: '12px' }} onClick={this.handleClick}>新建</Button>
          </Authorized>
          <Button icon="download" style={{ marginLeft: 8 }} onClick={this.exportRoles}>导出</Button>
					<Authorized authority='app_addRole' noMatch={null}>
						<Upload {...props}><Button icon="upload" style={{ marginLeft: 8 }}>导入</Button></Upload>
					</Authorized>	
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
          width='800px' style={{ top: 20 }} bodyStyle={{ maxHeight: constants.MODAL_STYLE.BODY_HEIGHT, overflowY: 'auto' }}
          title='已授权用户集合'
          visible={this.state.visible}
          onOk={() => { this.setState({ visible: false }) }}
          onCancel={this.hanldeCancel}
        >
          <AuthorizedUserUnion size='middle' appId={this.props.appId} roleId={this.state.roleId} />
        </Modal>

        <DynamicFormEditorModal 
        title={this.state.disabled ? '修改角色' : '新增角色'}
        visible={this.state.visibleModal}
        onOk={this.handleModalOk}
        items={items}
        destroyOnClose
        confirmLoading={this.state.confirmLoading}
        onCancel={() => this.setState({ visibleModal: false,disabled:false })}
        />

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

        <ResourcePreviewModal visible={this.state.previewVisible} 
          previewData={this.state.previewData} 
          loading={this.state.previewLoading}
          onCancel={()=>{this.setState({previewVisible:false})}}
          appId = {this.props.appId}
          importOk={this.importOk} 
          />

        <AuthorizeRoleModal 
          visible={this.state.authorizeVisible}
          title={this.state.title} isOffset={true}
          selectedKeys={this.state.selectedKeys}
          // disableSelectedKeys={this.state.selectedKeys}
          handleModal={(flag, data) => this.handleAuthorizeModal(flag, data)}/>
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
