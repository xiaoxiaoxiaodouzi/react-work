import React, { Fragment,Component } from 'react';
import {Table,Row, Col, Form, Input, Select,  Button, Divider, message ,Card,Switch,Modal} from 'antd';
import PageHeaderLayout from './layouts/PageHeaderLayout';


const FormItem = Form.Item;
const { Option } = Select;
const breadcrumbList = [{
  title: '高级设置',
  href: '/#/setting',
}, {
  title: '域名管理'
}];
class DomainListForm extends Component{
  state={
    loading:false,
    isOpen:false,
    visible:false,  ///打开路由配置模态框
    visibleClose:false,     //关闭路由模态框状态
  }
  componentDidMount(){
    
  }

  handleSearch=(e)=>{
    
  }
  handleFormReset=()=>{
   
  }
  formParams=()=>{
   
  }
  handleDelete=(id)=>{
    
  }

  loadData=(appid,queryParams)=>{
   
  }

  addUsers=(users)=>{
    
  }


  renderOpen=()=>{
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title:"域名",
        dataIndex: 'userName',
        width: '16%',
      },
      {
        title: '应用',
        dataIndex: 'orgName',
        width: '16%',
      },
      {
        title: '应用地址',
        dataIndex: 'role',
        width: '16%',
      },
      {
        title: '应用标签',
        dataIndex: 'status',
        width: '16%',
      },
      {
        title:'创建时间',
        dataIndex:'time',
        width:'16%'
      },
      {
        title: '操作',
        width: '15%',
        render: (text,record) => {
          return(
            <Fragment>
                <a onClick={e=>{this.handleDelete(record.userId)}}>编辑</a>
                <Divider type="vertical" />
								<a onClick={e=>{this.handleDelete(record.userId)}}>移除</a>
            </Fragment>
          )
        }
      }
    ];
    return (
    <Card type='inner'>
      <div className='tableList'>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row  style={{ marginBottom: 24 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="域名">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="应用">
                {getFieldDecorator('role')(
                  <Input placeholder='请输入'/>
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
      <div>
        <div style={{marginBottom:24}}>
          <Button type='primary'>新建</Button>
          <Button>批量删除</Button>
        </div>
        <Table
        rowKey={record => record.key}
        columns={columns}
        dataSource={this.state.whiteUsers}
        loading={this.state.loading}
        />       
      </div>
    </Card>
   )
  }

  //switch 更改状态
  handleClick=(check)=>{
    //打开路由配置
    if(check){
      this.setState({
        visible:true,
      })
    }else{
      this.setState({
        visibleClose:true,
      })
    }
  }

  //路由配置打开模态框
  handleOpen=()=>{
    this.setState({
      isOpen:true,
      visible:false
    })
  }

  handleCancle=()=>{
    this.setState({
      visible:false,
      visibleClose:false,
    })
  }

// 关闭路由配置
  handleClose=()=>{
    this.setState({
      isOpen:false,
      visibleClose:false,
    })
  }

  render(){
    const title =(
      <Fragment>
        <span style={{marginRight:24}}>全局动态路由配置</span>
        <Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.isOpen} onClick={this.handleClick}/>
      </Fragment>
    )
    return(
      <PageHeaderLayout
        title="域名列表"
        content=""
        breadcrumbList={breadcrumbList}>
        <Card title={title} >
          {this.state.isOpen?this.renderOpen():<span>温馨提示：如需使用统一域名管理，请先启用动态路由配置。</span>}
       </Card>
       <Modal
       title='全局动态路由配置'
       visible={this.state.visible}
       onOk={this.handleOpen}
       onCancel={this.handleCancle}
       >
       </Modal>

       <Modal
        title='关闭路由配置？'
        visible={this.state.visibleClose}
        onOk={this.handleClose}
        onCancle={this.handleCancle}
       >
       </Modal>
      </PageHeaderLayout>
    )
  }
}

const DomainList=Form.create()(DomainListForm)
export default DomainList;