import React, { Fragment,Component } from 'react';
import {Table,Row, Col, Form, Input, Select,  Button, message ,Modal,Tree,Divider} from 'antd';
import {getWhiteUsers, getRoles,deleteWhiteUsers,addWhiteUsers,roleTree,updateRoleTree} from '../../../services/running'
import './User.css'
import UserSelectModal from '../../../common/UserSelectModal'
import TreeHelp from '../../../utils/TreeHelp'

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
class WhiteUsersForm extends Component{
  state={
    visible:false,      //授权窗口
    whiteUsers:[],
    roles:[],
    loading:false,
    checkedKeys:[],       //被选中的角色
    roleTree:[],
  }
  componentDidMount(){
    const appid=this.props.appid
    getWhiteUsers(appid).then(data=>{
      this.setState({
        whiteUsers:data
      })
    })
    getRoles(appid).then(data=>{
      this.setState({
        roles:data
      })
    })
  }

  handleSearch=(e)=>{
    this.setState({
      loading:true
    })
    const appid=this.props.appid
    e.preventDefault();
    let queryParams=this.formParams();
    this.loadData(appid,queryParams);
  }
  handleFormReset=()=>{
    const appid=this.props.appid;
    const { form } = this.props;
    form.resetFields();
    this.loadData(appid)
  }
  formParams=()=>{
    var queryParams={
      name:'',
      roleId:''
    }
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if(values.name){
        queryParams.name=values.name
      }
      if(values.role){
        if(values.role!=='all'){
          queryParams.roleId=values.role
        }
      }
    })
    return queryParams;
  }
  handleDelete=(id)=>{
    const appid=this.props.appid;
    deleteWhiteUsers(appid,id).then(data=>{
      message.success('移除成功');
      this.loadData(appid);
    })
  }

  loadData=(appid,queryParams)=>{
    getWhiteUsers(appid,queryParams).then(data=>{
      this.setState({
        whiteUsers:data,
        loading:false
      })
    })
  }

  addUsers(users){
    const appid=this.props.appid;
    let userIds=[];
    users.forEach(item=>{
      userIds.push(item.userId)
    })
    if(userIds.length>0){
      addWhiteUsers(appid,{userIds:userIds}).then(data=>{
        if(data){
          message.success('新增成功')
          getWhiteUsers(appid).then(data=>{
            this.setState({
              whiteUsers:data,
            })
          })
        }
      })
    }
  }

  //用户角色授权按钮
  handleClick=(e,id)=>{
    const appid=this.props.appid;
    roleTree(appid,id).then(data=>{
      let childArray=TreeHelp.toChildrenStruct(data)
      let checkedKeys=[];
      childArray.forEach(item=>{
        if(item.checked){
          checkedKeys.push(item.key)
        }
      })
      this.setState({
        checkedKeys:checkedKeys,
        roleTree:childArray,
        visible:true,
        userId:id
      })
    })
  }

  //用户角色授权树
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

  //用户角色模态框确认
  onOk=()=>{
    const appid=this.props.appid;
    let userid=this.state.userId;
    let queryParams=this.state.checkedKeys;
    updateRoleTree(appid,userid,{roleIds:queryParams}).then(data=>{
      this.loadData(appid);
      this.setState({
        id:'',
        visible:false
      })
      message.success('授权成功')
      
    })
  }

  // 点击复选框触发事件
  onCheck=(checkedKeys)=>{
    this.setState({
      checkedKeys:checkedKeys
    })
  }

  onCancel=()=>{
    this.setState({
      visible:false,
      id:''
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title:"名称",
        dataIndex: 'userName',
        width: '15%',
      },
      {
        title: '所属机构',
        dataIndex: 'orgName',
        width: '35%',
        render:(value) => value.join(',')
      },
      {
        title: '角色',
        dataIndex: 'role',
        width: '25%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
      },
      {
        title: '操作',
        width: '15%',
        render: (text,record) => {
          return(
            <Fragment>
              <a onClick={e=>{this.handleClick(e,record.userId)}}>授权</a>
              <Divider type="vertical" />
							<a onClick={e=>{this.handleDelete(record.userId)}}>移除</a>
            </Fragment>
          )
        }
      }
    ];
    
    return(
      <div>
          <div className='tableList'>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row  style={{ marginBottom: 24 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="姓名">
                    {getFieldDecorator('name')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="角色">
                    {getFieldDecorator('role',{initialValue:'all'})(
                      <Select style={{ width: '100%' }} >
                      {this.state.roles.map(item=>
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                      )}
                      <Option value="all">所有</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                <span>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </span>
                </Col>
              </Row>
            </Form>
          </div>
          <div style={{marginBottom:24}}>
          <UserSelectModal 
          mark='白名单用户'
          title='新增白名单用户'
          description='白名单用户也可以访问应用下的机构' 
          selectedUsers={this.state.whiteUsers}
          dataIndex={{dataIdIndex:"userId",dataNameIndex:"userName"}} 
          disableUsers={this.state.whiteUsers} onOk={(users) => { this.addUsers(users)}} 
          renderButton={()=>{return <Button type="primary" >
          新增
          </Button>}}/>
					</div>
          <Table
          rowKey={record => record.key}
          columns={columns}
          dataSource={this.state.whiteUsers}
          loading={this.state.loading}
          />  
          <Modal
              title='用户角色授权'
              visible={this.state.visible}
              onCancel={this.onCancel}
              onOk={this.onOk}
            >
            <Tree
              checkable
              checkedKeys={this.state.checkedKeys}
              onCheck={this.onCheck}
            >
            {this.renderTreeNodes(this.state.roleTree)}
            </Tree>
            
            </Modal>    
      </div>
    )
  }
}

const WhiteUser=Form.create()(WhiteUsersForm)
export default WhiteUser;