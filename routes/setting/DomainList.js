import React, { Fragment,Component } from 'react';
import {Table,Row, Col, Form, Input,  Button, Divider ,Card,Popconfirm, Checkbox,Modal,Select,message} from 'antd';
import {getRoutersList,updateRouters,deleteRouters} from '../../services/amp'
import { getRouter } from '../../services/aip'
import moment from 'moment'
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext';
import Authorized from '../../common/Authorized';
import Link from 'react-router-dom/Link';

const Option = Select.Option;
const FormItem = Form.Item;
class DomainListForm extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:false,
      data:[],
      visibleModal:false,
      appMap:{}
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
      this.loadData(this.state.name);
    })
  }
  handleEdit=(record)=>{
    const { setFieldsValue } = this.props.form;
    this.tempId = record.id;
    setFieldsValue({
      httpsOnly:record.httpsOnly,
      host:record.host,
      stripPath:record.stripPath,
      protocols:record.protocols[0]
    })
    this.setState({ visibleModal:true,record:record });
  }

  loadData=(name)=>{
    let params = {};
    if(name){
      params.host = name;
    }
    getRoutersList(params).then(data=>{

     let appCodes = []
      data.forEach(items=>{
        let tr = {};
        tr.updataAt = items.updataAt;
        if(items.hosts&&items.hosts.length>0){
        
          let appCode = items.appCode;
          if(appCodes.indexOf(appCode) === -1){
            appCodes.push(appCode);
          }
          items.host = items.hosts[0];        
        }
       
      })
      //查询应用名称
      getRouter({"code":appCodes}).then(apps=>{
      
        let map = {};
        if(apps &&  apps.length > 0){
          
          apps.forEach(app=>{
                map[app.code] = app;
          })
 
        }
        this.setState({
          appMap:map,
          data: data
        })
      }).catch(err =>{
        this.setState({
          data: data
        })
      })
     
    })
  }

  addHost=()=>{
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    let record = this.state.record;
    // let params = {
    //   hosts:[ values.host ],
    //   https_only:values.httpsOnly,
    //   name:this.tempId, //appid
    //   stripUri:values.stripUri,
    //   upstreamUrl:'http://'+values.host,
    //   uris:['/']
    // }
    record.hosts=[ values.host ];
    record.https_only=values.httpsOnly;
    record.name=this.tempId; //appid
    record.stripPath=values.stripPath;
    record.upstreamUrl='http://'+values.host;
    record.uris=['/'];
    record.protocols=[values.protocols];
    updateRouters(this.tempId,record).then(()=>{   // 第一个参数是域名 name
      message.success('修改域名成功')
      this.loadData(this.state.name);
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
        dataIndex: 'stripPath',
        width: '15%',
        render:(value) => value ? '是' : '否'
      },
      {
        title: '应用',
        dataIndex: 'appCode',
        width: '15%',
        render:(text,record) =>{
          let appMap = this.state.appMap;
          return <Link to={`/apps/${appMap && appMap[record.appCode]?appMap[record.appCode].id:''}`}>{appMap && appMap[record.appCode]?appMap[record.appCode].name:'--'}</Link>
        }
      },
      // {
      //   title: '应用地址',
      //   dataIndex: 'targets',
      //   width: '15%',
      // },
      {
        title:'更新时间',
        dataIndex:'updatedAt',
        width:'20%',
        render:(text,record)=>{
          if(text){
            // eslint-disable-next-line
            return moment(parseInt(text+'000')).format('YYYY-MM-DD HH:mm')
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
              {getFieldDecorator('protocols')(
                <Select>
                  <Option value='http'>http</Option>
                  <Option value='https'>https</Option>
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
              {getFieldDecorator('stripPath', { valuePropName: 'checked' })(
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
      <div style={{ margin: '-24px -24px 0 -24px' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'高级设置'},{name:'域名管理'}]} action={<GlobalEnvironmentChange/>}/>
        <div style={{ margin: '24px 24px 0' }}>
          {this.renderOpen()}
        </div>
      </div>
    )
  }
}

const DomainList=Form.create()(DomainListForm);
export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <DomainList {...props} tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);

