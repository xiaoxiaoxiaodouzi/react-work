import React, { Fragment,Component } from 'react';
import {Table, Form, Input, Button, Modal, message,Tree,Divider } from 'antd';
import {getRoles,addRole,getRolesByCode,deleteRole,updateRole,getResources,getRoleAllResources,updateRoleResources} from '../../../services/running'
import TreeHelp from '../../../utils/TreeHelp'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
class RoleForm extends Component{
  state={
    confirmLoading:false,
    visible:false,   //角色模态框开启关闭状态
    visibleImport:false,    //角色导入模态框开启关闭状态
    visibleAuthorization:false,   //角色授权模态框开启关闭状态 
    visibleRole:false,          //角色删除模态框 
    isUpdate:false,   //模态框是新增还是修改状态
    validateStatusCode:"",   //角色编码输入框状态
    helpCode:"",     //角色编码输入框提示信息
    validateStatusName:"",   //角色名称输入框状态
    helpName:"",     //角色名称输入框提示信息
    code:"",          //角色编码
    name:"",          //角色名称
    desc:"",          //角色描述
    roleID:"",        //角色Id
    roles:[],
    menuTree:[],       //角色菜单树
    checkedKeys:[],
    formData:[]
  }
  componentDidMount(){
    const appid = this.props.appid
    getRoles(appid).then(data => {
      this.setState({
        roles: data
      })
    })
    this.loadData();
  }

  loadData=()=>{
    const appid = this.props.appid
    let queryParams = {
      type: '2'
    }
    //查询表单数据 默认type=2
    getResources(appid, queryParams).then(data => {
      let ary=TreeHelp.toChildrenStruct(data);
      this.setState({
        formData: ary
      })
    })

    //查询菜单数据 默认type=4
    let params={type:'4'};
    getResources(appid, params).then(data => {
      let ary=TreeHelp.toChildrenStruct(data);
      this.setState({
        menuTree: ary
      })
    })
  }

  //新增按钮
  addRole=()=>{
    this.props.form.resetFields();
    this.setState({
      visible:true
    })
  }
  //编辑角色操作
  handleUpdate=(e,record)=>{
    //获取当前行数据
    //this.loadData();
    this.setState({
      roleId:record.id,
      code:record.code,
      name:record.name,
      desc:record.desc,
      visible:true,
      isUpdate:true
    },()=>{
      this.props.form.setFieldsValue({
        code:record.code,
        name:record.name,
        desc:record.desc
      })
    })
  }
  //删除角色操作
  handleDelete=(e,id)=>{
    this.setState({
      roleID:id,
      visibleRole:true
    })
    
  }
  //模态框确认
  handleOk=(e) => {
    this.setState({
      confirmLoading:true,
    })
    const appid=this.props.appid
    //获取当前修改的角色ID
    const id=this.state.roleId;
    this.props.form.validateFields((err, values) => {
      //判断是新增还是修改
      if(this.state.isUpdate){
        //当验证通过的时候才允许修改
        if(!this.state.helpCode && !this.state.helpName){
          updateRole(appid,id,values).then(data=>{
            getRoles(appid).then(datas=>{
              this.setState({
                confirmLoading:false,
                roleID:"",
                code:"",
                name:"",
                desc:"",
                roles:datas,
                visible:false,
                validateStatusCode:"",
                validateStatusName:"",
                helpCode:"",
                helpName:"",
                isUpdate:false
              })
            })
          })
        }
        this.setState({
          confirmLoading:false,
        })
      }else{
        //当验证通过的时候才允许新增
        if(!this.state.helpCode && !this.state.helpName){
          const newRoles=[];
          newRoles.push(values);
          addRole(appid,newRoles).then(data=>{
            this.state.roles.push(data[0]);
            this.setState({
              confirmLoading:false,
              validateStatusCode:"",
              validateStatusName:"",
              helpCode:"",
              helpName:"",
              visible:false
            })
          })
        }else{
          this.setState({
            confirmLoading:false
          })
          message.error(`角色名字或者编码已存在，请重新填写`)
        }
      }
      
    })
  }
  //角色编码输入框失去焦点事件
  codeOnBlur=(e) => {
    const appid=this.props.appid;
    if(e.target.value){
      getRolesByCode(appid,e.target.value).then(data=>{
        if(data){
          this.setState({
            validateStatusCode:"error",
            helpCode:"角色编码已存在"
          })
        }else{
          this.setState({
            validateStatusCode:"success",
            helpCode:""
          })
        }
      })
    }else{
      this.setState({
        validateStatusCode:"error",
        helpCode:"角色编码不能为空"
      })
    }
  }
  //角色名称输入框失去焦点事件(！！！！！！=====需要对名称结果做遍历判断是否相等)
  nameOnBlur=(e) => {
    const appid=this.props.appid;
    const queryParams={
      name:e.target.value
    }
    let isExist=false;
    const name=e.target.value;
    if(name){
      getRoles(appid,queryParams).then(data=>{
        if(data.length>0){
          data.forEach((val,i)=>{
            if(val.name===name){
              isExist=true;
            }
          })
          if(isExist && name!==this.state.name){
            this.setState({
              validateStatusName:"error",
              helpName:"角色名称已存在"
            })
          }else{
            this.setState({
              validateStatusName:"success",
              helpName:""
            })
          }
        }else{
          this.setState({
            validateStatusName:"success",
            helpName:""
          })
        }
      })
    }else{
      this.setState({
        validateStatusName:"error",
        helpName:"角色名称不能为空"
      })
    }
  }
  //模态框取消
  handleCancel=(e) => {
    this.setState({
      roleID:"",
      code:"",
      name:"",
      desc:"",
      visible:false,
      helpCode:"",
      helpName:"",
      validateStatusCode:"",
      validateStatusName:"",
      isUpdate:false
    })
  }
  //角色导入
  roleImport=() => {
    this.setState({
      visibleImport:true
    })
  }
  //导入框确定按钮
  handleImportOk=(e) => {
    this.setState({
      visibleImport:false
    })
  }
  handleImportCancel=(e) => {
    this.setState({
      visibleImport:false
    })
  }
  //角色授权
  roleAuthorization=(e,record) => {
    this.loadData();
    this.setState({
      roleID:record.id,
      visibleAuthorization:true
    })
    const appId=this.props.appid
    //获取用户所有权限资源
    getRoleAllResources(appId,record.code).then(data=>{
      let array=[];
      data.forEach(item=>{
        array.push(item.id)
      })
      this.setState({
        checkedKeys:array
      })
    })
  }
  //授权框确定按钮
  handleAuthorizationOk=(e) => {
    const appid=this.props.appid;
    let queryParams={
      roleId:this.state.roleID
    }
    let menuIds=this.state.checkedKeys;
    updateRoleResources(appid,queryParams,menuIds).then(data=>{
      this.setState({
        roleID:'',
        visibleAuthorization:false
      })
      message.success('授权成功')
    })
  }


  handleAuthorizationCancel=(e) => {
    this.setState({
      visibleAuthorization:false
    })
  }
  //删除角色modal框确认按钮
  handleRoleOk=(e)=>{
    const appid=this.props.appid
    let id=this.state.roleID;
     deleteRole(appid,id).then(data=>{
      message.success("删除成功") 
      getRoles(appid).then(datas=>{
        this.setState({
          roleID:'',
          visibleRole:false,
          roles:datas
        })
      })
    })
  }
  handleRoleCancel=()=>{
    this.setState({
      roleID:'',
      visibleRole:false
    })
  }
  //遍历角色菜单
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.key}  dataRef={item} />;
    });
  }
  // 点击复选框触发事件
  onCheck=(checkedKeys)=>{
    this.setState({
      checkedKeys:checkedKeys
    })
  }

  render(){
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
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%'
      },
      {
        title: '角色编码',
        dataIndex: 'code',
        width:'20%'
      },
      {
        title: '角色说明',
        dataIndex: 'desc',
        width:'40%'
      },
      {
        title: '操作',
        width:'20%',
        render: (text,record) => {
          return(
            <Fragment>
                <a onClick={e=>this.roleAuthorization(e,record)}>授权</a>
                <Divider type="vertical" />
                <a
                onClick={e=>this.handleUpdate(e,record)}>编辑</a>
                <Divider type="vertical" />
								<a onClick={e=>this.handleDelete(e,record.id)}>删除</a>
            </Fragment>
          )
        }
      }
    ];
    return(
      <div>
        <div>
          <div style={{marginBottom:24}}>
						<Button type="primary" onClick={this.addRole}>新增</Button>
						{/* <Button style={{marginLeft:12}} onClick={this.roleImport}>导入</Button>*/}
					</div>

          <Modal 
            title={this.state.isUpdate?"修改角色":"新增角色"}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            confirmLoading={this.state.confirmLoading	}
          >
          <Form>
            <FormItem {...formItemLayout} label="角色编码" 
            validateStatus={this.state.validateStatusCode}
            help={this.state.helpCode}
            >
                {getFieldDecorator('code',{initialValue:this.state.code})(
                    <Input onBlur={this.codeOnBlur} disabled={this.state.isUpdate} />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="角色名称" 
            validateStatus={this.state.validateStatusName}
            help={this.state.helpName}
								>
										{getFieldDecorator('name',{initialValue:this.state.name})(
												<Input onBlur={this.nameOnBlur}  />
										)}
						</FormItem>
            <FormItem {...formItemLayout} label="角色描述"
								>
										{getFieldDecorator('desc',{initialValue:this.state.desc})(
												<TextArea style={{lineHeight:1.5 }} />
										)}
						</FormItem>
          </Form>

          </Modal> 

          <Modal
          title="导入角色"
          visible={this.state.visibleImport}
          onOk={this.handleImportOk}
          onCancel={this.handleImportCancel}>
          <p>这里是导入用户</p>

          </Modal>

          <Modal
          title="是否删除"
          visible={this.state.visibleRole}
          onOk={this.handleRoleOk}
          onCancel={this.handleRoleCancel}>
          <p>已关联的用户和菜单信息将同时被删除，是否确认删除该角色</p>

          </Modal>

          <Modal
          bodyStyle={{height:500,overflow:'auto'}}
          title="授权"
          visible={this.state.visibleAuthorization}
          onOk={this.handleAuthorizationOk}
          onCancel={this.handleAuthorizationCancel}>
            <Tree
            checkable
            checkedKeys={this.state.checkedKeys}
            onCheck={this.onCheck}
            >
            <TreeNode title='菜单' key='0'>
              {this.renderTreeNodes(this.state.menuTree)}
            </TreeNode>

            <TreeNode title='页面' key='form'>
              {this.renderTreeNodes(this.state.formData)}
            </TreeNode>

            <TreeNode title='服务' key='service'>
            </TreeNode>
            </Tree>

          </Modal>

          <Table
          rowKey={record => record.key}
          columns={columns}
          dataSource={this.state.roles}
          />       
        </div>
      </div>
    )
  }
}

const OldRole=Form.create()(RoleForm)
export default OldRole;