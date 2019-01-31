import React, { Fragment,Component } from 'react';
import { Table,Row, Col, Form, Input, Select, Icon, Button,  Divider,  message,Modal,Tree} from 'antd';
import {roleTree,addUser,deleteUser,getUsers,getRoles,updateRoleTree} from '../../../services/aip'
import './User.css'
import TreeHelp from '../../../utils/TreeHelp'



const FormItem = Form.Item;
const { Option } = Select;

const TreeNode = Tree.TreeNode;
class UserForm extends Component{
  state={
    visible:false,      //授权窗口
    expandForm: false,    //搜索展开与否
    users:[],         //用户总数
    roles:[],         //应用角色列表
    userId:'',
    loading:false,
    currentPage:1,
    pageSize:10,
    total:'',
    checkedKeys:[],       //被选中的角色
    roleTree:[],
    orgs:[],
  }
  componentDidMount(){
    const appid=this.props.appid
    getUsers(appid).then(data=>{
      this.setState({
        users:data.contents,
        total:data.total,
        currentPage:this.state.currentPage,
        pageSize:10
      })
    })
    getRoles(appid).then(data=>{
      this.setState({
        roles:data
      })
    })
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(this.props.orgs)!==JSON.stringify(nextProps.orgs)){
      const appid = this.props.appid
      getUsers(appid).then(data => {
        this.setState({
          orgs:nextProps.orgs,
          users: data.contents,
          total: data.total,
          currentPage: this.state.currentPage,
          pageSize: 10
        })
      })
    }
  }

  toggleForm=()=>{
    this.setState({
      expandForm:!this.state.expandForm
    })
  }
  //查询搜若
  handleSearch=(e)=>{
    this.setState({
      loading:true
    })
    const appid=this.props.appid
    e.preventDefault();
    let queryParams=this.formParams();
    this.loadData(appid,queryParams);
  }
  //页面跳转
  handleData=(current,pageSize)=>{
    this.setState({
      loading:true
    })
    const appid=this.props.appid;
    let queryParams= this.formParams();
    queryParams.page=current;
    queryParams.rows=pageSize;
    this.loadData(appid,queryParams)
  }

  //查询数据
  loadData=(appid,queryParams)=>{
    getUsers(appid,queryParams).then(data=>{
      this.setState({
        users:data.contents,
        pageSize:data.pageSize,
        currentPage:data.pageIndex,
        total:data.total,
        loading:false
      })
    })
  }

  handleFormReset=()=>{
    const appid=this.props.appid;
    const { form } = this.props;
    form.resetFields();
    this.loadData(appid)
  }
  //获取表格数据 并且处理数据
  formParams=()=>{
    var queryParams={
      name:'',
      roleId:'',
      status:'',
      orgIds:[]
    }

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      //如果选择所有 则将父组件的所有机构ID传入进去
      if(values.orgIds!=='all'){
        var orgs=this.props.orgs;
        //遍历所有机构判断选择的机构是分类机构还是机构
        orgs.forEach(element => {
          if(values.orgIds===element.orgId){
            if(element.orgId===element.categoryOrgId){
              queryParams.orgIds.push(element.orgId)
            }else{
              queryParams.orgIds.push(element.categoryOrgId+'-'+element.orgId)
            }
          }
        });
      }
      if(values.name){
        queryParams.name=values.name
      }
      if(values.role){
        if(values.role!=='all'){
          queryParams.roleId=values.role
        }
      }
      if(values.status){
        if(values.status==='open'){
          queryParams.status="启用"
        }
        if(values.status==='close'){
          queryParams.status="禁用"
        }
      }
    })
    return queryParams;
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="tableList">
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="姓名">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="可使用机构">
                {getFieldDecorator('orgIds')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {this.props.orgs.map(item=>
                    <Option key={item.id} value={item.orgId}>{item.name}</Option>
                    )}
                    <Option key="all">所有</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span >
                <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
      
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="tableList">
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="姓名">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="可使用机构">
                {getFieldDecorator('orgIds')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {this.props.orgs.map(item=>
                    <Option key={item.id} value={item.orgId}>{item.name}</Option>
                    )}
                    <Option value="all">所有</Option>
                  </Select>
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
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="状态">
                {getFieldDecorator('status',{initialValue:'all'})(
                  <Select  style={{ width: '100%' }}>
                    <Option value="open">开启</Option>
                    <Option value="close">禁用</Option>
                    <Option value="all" >所有</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary"  htmlType="submit" onClick={this.handleSearch}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </div>
        </Form>
      </div>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleAddUser=(id) => {
    const appid=this.props.appid;
    let queryParams={
      userIds:id
    }
    //queryParams.userIds.push(id);
    addUser(appid,queryParams).then(data=>{
      let queryParams=this.formParams();
      this.loadData(appid,queryParams);
      message.success('启用成功');
    })
  } 

  handleDeleteUser=(id) => {
    const appid=this.props.appid;
    deleteUser(appid,id).then(data=>{
      let queryParams=this.formParams();
      this.loadData(appid,queryParams);
      message.success('禁用成功')
    })
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
      let queryParams=this.formParams();
      this.loadData(appid,queryParams);
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
    const columns = [
      {
        title: '名称',
        dataIndex: 'userName',
        width: '15%',
      },
      {
        title: '所属机构',
        dataIndex: 'orgName',
        width: '40%',
        render:(text,record)=>{
          if(Array.isArray(text) && text.length>0){ 
            return text.join(',')
          }
          return ''
        }
      },
      {
        title: '角色',
        dataIndex: 'role',
        width: '15%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '15%',
      },
      {
        title: '操作',
        width: '15%',
        render: (text,record) => {
          if(record.status==='启用'){
            return(
              <Fragment>
                <a onClick={e=>this.handleClick(e,record.userId)}>授权</a>
                <Divider type="vertical" />
                <a onClick={e=>{this.handleDeleteUser(record.userId)}}>禁用</a>
              </Fragment>
            )
          }else{
            return (
              <Fragment>
                <a onClick={e=>{this.handleAddUser(record.userId)}}>启用</a>
              </Fragment>
            )
          }
        }
      }
    ];
    const paginationProps={
      current:this.state.currentPage,
      pageSize:this.state.pageSize,
      total:this.state.total,
      onChange:(current,pageSize) => {
        this.handleData(current,pageSize)
      }  
    } 
    return(
      <div>
          <div style={{marginBottom:24}}>
            {this.renderForm()}
          </div>
        <div>
          <Table
            rowKey={record => record.key}
            columns={columns}
            dataSource={this.state.users}
            loading={this.state.loading}
            pagination={paginationProps}
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
      </div>
    )
  }
}

const OldUser=Form.create()(UserForm)
export default OldUser;