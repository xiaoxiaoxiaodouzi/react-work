import React, { Fragment,Component } from 'react';
import {Table,Row, Col, Form, Input,  Button, Divider ,Card} from 'antd';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import { getRoutersList, getupstream} from '../../services/domainList'
import moment from 'moment'


const FormItem = Form.Item;
const breadcrumbList = [{
  title: '高级设置',
  href: '/#/setting',
}, {
  title: '域名管理'
}];
class DomainListForm extends Component{
  state={
    loading:false,
    data:[],
  }
  componentDidMount(){
    getRoutersList().then(data=>{
      let array = [];
      data.forEach(items=>{
        let tr = {};
        tr.createdAt = items.createdAt;
        if(items.hosts&&items.hosts.length>0){
          tr.host = items.hosts[0];
            getupstream(items.name).then(datas=>{
              if(Array.isArray(datas)){
                //遍历集群获取应用名称 以及IP
                let str='';
                datas.forEach(i=>{
                  str+=i+','
                })
                tr.ip = str.substring(0, str.length - 1);
                tr.name=datas.name;
              }
            })
        }
        array.push(tr);
      })
      this.setState({
        data: array
      })
    })
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
        dataIndex: 'host',
        width: '16%',
      },
      {
        title: '应用',
        dataIndex: 'name',
        width: '16%',
      },
      {
        title: '应用地址',
        dataIndex: 'ip',
        width: '16%',
      },
      {
        title:'创建时间',
        dataIndex:'createdAt',
        width:'16%',
        render:(text,record)=>{
          if(text){
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        }
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
    <Card>
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
        </div>
        <Table
        rowKey={record => record.key}
        columns={columns}
        dataSource={this.state.data}
        loading={this.state.loading}
        />       
      </div>
    </Card>
   )
  }

  

  render(){
    return(
      <PageHeaderLayout
        title="域名列表"
        content=""
        breadcrumbList={breadcrumbList}>
          {this.renderOpen()}
      </PageHeaderLayout>
    )
  }
}

const DomainList=Form.create()(DomainListForm)
export default DomainList;