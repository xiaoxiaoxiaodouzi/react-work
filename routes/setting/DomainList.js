import React, { Fragment,Component } from 'react';
import {Table,Row, Col, Form, Input,  Button, Divider ,Card,Popconfirm, Checkbox,Modal,Select,message,Breadcrumb} from 'antd';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import { getRoutersList,deleteRouters,getRouter,updateRouters } from '../../services/domainList'
import moment from 'moment'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext';
import { base } from '../../services/base';
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';

const Option = Select.Option;
const FormItem = Form.Item;
const breadcrumbList = <Breadcrumb>
  <Breadcrumb.Item>
    <Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/>
    高级设置
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    域名管理
  </Breadcrumb.Item>
</Breadcrumb>;
class DomainListForm extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:false,
      data:[],
      visibleModal:false,
    }
    this.tempId = '';
    this.name = "";
  }
  
  componentDidMount(){
    this.loadData();
  }

  componentWillReceiveProps(nextProps){
    if(this.props.environment !== nextProps.environment){
      this.loadData();
    }
  }

  handleSearch=(e)=>{
    this.props.form.validateFieldsAndScroll((error,value)=>{
      this.loadData(value.name);
    });
  }
  handleFormReset=()=>{
    const { form } = this.props;
    form.resetFields();
    this.loadData();
  }
  handleDelete=(id)=>{
    deleteRouters(id).then(()=>{
      message.success('域名删除成功');
      this.loadData();
    })
  }
  handleEdit=(record)=>{
    const { setFieldsValue } = this.props.form;
    this.tempId = record.name;
    setFieldsValue({
      httpsOnly:record.httpsOnly,
      host:record.host,
      stripUri:record.stripUri
    })
    this.setState({ visibleModal:true });
  }

  loadData=(name)=>{
    let params = {};
    if(name){
      params.host = name;
    }
    getRoutersList(params).then(data=>{
      let array = [];

      let appIds = [];
      let map = {};
      data.forEach(items=>{
        let tr = {};
        tr.createdAt = items.createdAt;
        if(items.hosts&&items.hosts.length>0){
          tr.id = items.id;
          tr.host = items.hosts[0];
          tr.stripUri = items.stripUri;
          tr.httpsOnly = items.httpsOnly;
          let appId = items.name.split("_")[0];
          appIds.push(appId);

          let targets = [];
          if(items.targets){
            items.targets.forEach(tar => {
              targets.push(tar.target);
            });
          }

          tr.targets = targets.toString();
        }
        array.push(tr);
        let host = items.hosts[0];
        map[host] = tr;
      })
      getRouter({"appId":appIds}).then(datas=>{
        let routes = [];
        if(datas && datas.contents.length > 0){
          datas.contents.forEach(de=>{
            let route = map[de.host];
            if(route){
              route.appName = de.name;
              routes.push(route);
            }            
          })
        }

        this.setState({
          data: routes
        })
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
    updateRouters(this.tempId,params).then(()=>{   // 第一个参数是域名 name
      message.success('修改域名成功')
    })  
    this.setState({visibleModal:false});
  }

  renderOpen=()=>{
    const Authorized = RenderAuthorized(base.allpermissions);
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
        dataIndex: 'appName',
        width: '15%',
      },
      {
        title: '应用地址',
        dataIndex: 'targets',
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
               <Authorized authority={'domain_edit'} noMatch={<a disabled='true' onClick={ ()=>{this.handleEdit(record)}}>编辑</a>}>
                <a onClick={ ()=>{this.handleEdit(record)}}>编辑</a>
               </Authorized>
                <Divider type="vertical" />
                <Authorized authority={'domain_remove'} noMatch={<Popconfirm title="是否要移除此镜像？" onConfirm={() => this.handleDelete(record.id)}><a disabled='true'>移除</a></Popconfirm>}>
                <Popconfirm title="是否要移除此镜像？" onConfirm={() => this.handleDelete(record.id)}>
                  <a>移除</a>
                </Popconfirm>
                </Authorized>
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
                  <Input placeholder="请输入" value = {this.state.name}/>
                )}
              </FormItem>
            </Col>
            {/* <Col md={8} sm={24}>
              <FormItem label="应用">
                {getFieldDecorator('role')(
                  <Input placeholder='请输入'/>
                )}
              </FormItem>
            </Col> */}
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
        content=""
        title={breadcrumbList}
        action={<GlobalEnvironmentChange/>}
        >
          {this.renderOpen()}
      </PageHeaderLayout>
    )
  }
}

const DomainList=Form.create()(DomainListForm);
export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <DomainList {...props} tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);

