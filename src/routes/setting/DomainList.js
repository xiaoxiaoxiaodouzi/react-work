import React, { Fragment,Component } from 'react';
import {Table,Row, Col, Form, Input,  Button, Divider ,Card,Popconfirm, Checkbox,Modal,Select,message} from 'antd';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import { getRoutersList,deleteRouters,getRouter,updateRouters } from '../../services/domainList'
import moment from 'moment'

const Option = Select.Option;
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
    visibleModal:false,
  }
  tempId = ''
  componentDidMount(){
    this.loadData();
  }

  handleSearch=(e)=>{
    
  }
  handleFormReset=()=>{
   
  }
  handleDelete=(id)=>{
    deleteRouters(id).then(()=>{
      message.success('域名删除成功');
      this.loadData();
    })
  }
  handleEdit=(record)=>{
    console.log('record',record);
    const { setFieldsValue } = this.props.form;
    this.tempId = record.name;
    setFieldsValue({
      httpsOnly:record.httpsOnly,
      host:record.host,
      stripUri:record.stripUri
    })
    this.setState({ visibleModal:true });
  }

  loadData=()=>{
    getRoutersList().then(data=>{
      let array = [];
      data.forEach(items=>{
        let tr = {};
        let upstreamUrl =items.upstreamUrl.indexOf('://') > 0 ? items.upstreamUrl.slice(items.upstreamUrl.lastIndexOf('://')+3):items.upstreamUrl;
        tr.createdAt = items.createdAt;
        if(items.hosts&&items.hosts.length>0){
          tr.id = items.id;
          tr.host = items.hosts[0];
          tr.stripUri = items.stripUri;
          tr.httpsOnly = items.httpsOnly;
          getRouter(upstreamUrl).then(datas=>{
            if(Array.isArray(datas)){
              //遍历集群获取应用名称 以及IP
              let str='';
              datas.forEach(i=>{
                str+=i+','
              })
              //tr.appId = datas.id;
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

  addHost=()=>{
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    let params = {
      hosts:[ values.host ],
      https_only:values.httpsOnly,
      name:this.tempId, //appid
      stripUri:values.stripUri,
      upstreamUrl:'http://'+values.host,
      uris:['/']
    }
    console.log('values',params);
    updateRouters(this.tempId,params).then(()=>{   // 第一个参数是域名 name
      message.success('修改域名成功')
    })  
    this.setState({visibleModal:false});
  }


  renderOpen=()=>{
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title:"域名",
        dataIndex: 'host',
        width: '20%',
      },
      {
        title: '裁剪上下文',
        dataIndex: 'stripUri',
        width: '15%',
        render:(value) => value ? '是' : '否'
      },
      {
        title: '应用',
        dataIndex: 'name',
        width: '15%',
      },
      {
        title: '应用地址',
        dataIndex: 'ip',
        width: '15%',
      },
      {
        title:'创建时间',
        dataIndex:'createdAt',
        width:'20%',
        render:(text,record)=>{
          if(text){
            return moment(text).format('YYYY-MM-DD HH:mm')
          }
        }
      },
      {
        title: '操作',
        width: '15%',
        render: (text,record) => {
          return(
            <Fragment>
                <a onClick={ ()=>{this.handleEdit(record)}}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要移除此镜像？" onConfirm={() => this.handleDelete(record.id)}>
                  <a>移除</a>
                </Popconfirm>
            </Fragment>
          )
        }
      }
    ];
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
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
          {/*<Button type='primary'>新建</Button>*/}
        </div>
        <Table
        rowKey={record => record.key}
        columns={columns}
        dataSource={this.state.data}
        loading={this.state.loading}
        />  
        <Modal 
          title={"修改域名信息"}
          visible={this.state.visibleModal}
          onOk={this.addHost} 
          onCancel={()=>{ this.setState({ visibleModal:false }) }}>
          <Form>
            <FormItem {...formItemLayout} 
              label="协议">
              {getFieldDecorator('httpsOnly')(
                <Select>
                  <Option value={false}>http</Option>
                  <Option value={true}>https</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} 
              label="域名">
              {getFieldDecorator('host')(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} 
              label="裁剪上下文">
              {getFieldDecorator('stripUri', { valuePropName: 'checked' })(
                <Checkbox />
              )}
            </FormItem>
          </Form>
        </Modal>     
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