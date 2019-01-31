import React, { PureComponent } from 'react';
import { Form, Tabs, Modal, Switch, Button, Table, message,Checkbox,Popconfirm, Input } from 'antd';
import constants from '../../services/constants';
import DynamicFormEditor from '../../common/DynamicForm/DynamicFormEditor';
import EnvRouteTemplateTable from './EnvRouteTemplateTable';

import {queryTenantByEnv, deleteEnvTenant, addEnvTenants} from '../../services/amp';
import moment from 'moment';
const TabPane = Tabs.TabPane;


class EnviromentForm extends PureComponent{

    constructor(props) {
      super(props)
    
      const baseItems = [
        {label:'名称',name:'name',required:true},
        {label:'编码',name:'code',required:true},
        {label:'授权服务器地址',name:'authServerAddress',required:true,regExp:constants.reg.host},
        {label:'授权服务器内网地址',name:'authServerInnerAddress',required:true,regExp:constants.reg.host}
      ];
      const gatewayItems = [
        {label:'网关协议',name:'apiGatewaySchema',required:true,type:'select',options:[{label:'http',value:'http'},{label:'https',value:'https'}]},
        {label:'网关地址',name:'apiGatewayHost',required:true},
        {label:'网关端口',name:'apiGatewayPort',required:true,type:'number'},
        {label:'网关管理端口',name:'apiGatewayManagePort',required:true,type:'number'},
      ];
      const featureItems = [
        {label:'SpringCloud支持',name:'springCloudSwitch',type:'switch',attribute:{checkedChildren:'开启', unCheckedChildren:'关闭'}},
        {label:'注册中心地址',name:'eurekaServerUrls',regExp:constants.reg.host},
      ]

      this.state = {
         baseItems,gatewayItems,featureItems,data:{},tenants:[],tenantsModalVisible:false,tabActiveKey:'1',
         routerUrlHelp:'',routerUrlValidateStatus:'',
      }
    }
     
    tenantMap = {};
    componentWillReceiveProps(nextProps){
      if(nextProps.data!==this.props.data){
        let env = {};
        Object.assign(env,nextProps.data);
        //数组转对象
        this.tenantMap = nextProps.tenants.reduce((prev,obj)=>{
          prev[obj.code] = obj.name;
          return prev;
        },{})
        this.validateRouterUrl(env.routerSwitch,env.routerUrl);
        this.setState({data:env,tenants:nextProps.tenants,tabActiveKey:'1'});
      }
    }

    disabledTenants = [];
    addTenantModel = e=>{
      //所有租户转成租户Checkbox选项，已选的值禁用
      let tenantValues = [];
      if(this.state.data.envTenants){
        this.state.data.envTenants.forEach(t=>{
          tenantValues.push(t.tenantCode);
          this.disabledTenants.push(t.tenantCode);
        })
      }
      let tenantOptions = [];
      this.state.tenants.forEach(t=>{
        tenantOptions.push({label:t.name,value:t.code,disabled:tenantValues.includes(t.code)});
      })
      this.setState({tenantsModalVisible:true,tenantValues,tenantOptions});
    }
    addTenantHandle = e=>{
      let newTcode = this.state.tenantValues.filter(tcode=>!this.disabledTenants.includes(tcode));
      const newTenant = newTcode.map(code=>({environmentId:this.state.data.id,tenantCode:code}));
      addEnvTenants(newTenant).then(data=>{
        message.success('操作成功');
        this.setState({tenantsModalVisible:false});
        this.queryEnvTenants();
      })
    }
    
    tenantChange = (values)=>{
      this.setState({tenantValues:values});
    }

    deleteEnvTenant = (tid)=>{
      deleteEnvTenant(tid).then(data=>{
        message.success('操作成功');
        this.queryEnvTenants();
      })
    }
    queryEnvTenants = ()=>{
      queryTenantByEnv(this.state.data.id).then(envTenants=>{
        envTenants.forEach(t=>{
          t.tenantName = this.tenantMap[t.tenantCode]
        })
        const data = {...this.state.data,envTenants};
        this.setState({data});
      })
    }

    routerSwitchChange= (checked)=>{
      this.setState({ data: {...this.state.data,routerSwitch:checked}});
      this.validateRouterUrl(checked,this.state.data.routerUrl);
    }
    routerUrlChange = (e)=>{
      const value = e.target.value;
      this.setState({ data: {...this.state.data,routerUrl:value}});
      this.validateRouterUrl(this.state.data.routerSwitch,value);
    }
    validateRouterUrl = (routerSwitch,routerUrl)=>{
      if(!routerSwitch || routerUrl){
        this.setState({routerUrlHelp:'',routerUrlValidateStatus:''});
        return true;
      }else{
        this.setState({routerUrlHelp:'开启动态路由后，必须填写路由管理地址',routerUrlValidateStatus:'error'});
        return false;
      }
    }

    onSubmit = ()=>{
      let validate =  true;
      let evnValues = {};
      this.baseForm.validateFields((errors,values)=>{
        if(errors){
          validate = false;
          this.setState({tabActiveKey:'1'})
        }
        Object.assign(evnValues,values);
      })
      this.gatewayForm.validateFields((errors,values)=>{
        if(errors){
          validate = false;
          this.setState({tabActiveKey:'2'})
        }
        Object.assign(evnValues,values);
      })
      this.featureForm.validateFields((errors,values)=>{
        if(errors){
          validate = false;
          this.setState({tabActiveKey:'3'})
        }
        Object.assign(evnValues,values);
      })
      if(validate){
        evnValues.id = this.state.data.id;
        if(this.validateRouterUrl(this.state.data.routerSwitch,this.state.data.routerUrl)){
          evnValues.routerSwitch = this.state.data.routerSwitch;
          evnValues.routerUrl = this.state.data.routerUrl;
          this.props.onOk(evnValues);
        }else{
          this.setState({tabActiveKey:'5'});
        }
      }
    }


    render(){
      let {baseItems,gatewayItems,featureItems,data} = this.state;  
      const tenantColumns = [
        {title:'租户名称',dataIndex:'tenantName'},
        {title:'创建人',dataIndex:'creator'},
        {title:'创建时间',dataIndex:'ctime',render:(text,record)=>{
          return moment(text).format("YYYY-MM-DD");
        }},
        {title:'操作',dataIndex:'action',render:(text,record)=>{

          return (
            <Popconfirm title="确定删除该租户?" onConfirm={e=>{this.deleteEnvTenant(record.id)}}>
              <a>删除</a>
            </Popconfirm>
          )
        }}
      ];

      return (
        <Modal
          bodyStyle={{ overflow: 'auto', height: '400px' }}
          title={this.props.title}  destroyOnClose={true}
          visible={this.props.visible}
          width = {800}
          onOk={this.onSubmit}
          onCancel={this.props.onCancel}
        >
          <Tabs tabPosition='left' activeKey={this.state.tabActiveKey} onChange={activeKey=>this.setState({tabActiveKey:activeKey})}>
            <TabPane tab="基本信息" key="1" forceRender={true}>
              <DynamicFormEditor items={baseItems} getForm={form=>this.baseForm = form} data={data} footer={null} labelCol={6}/>
            </TabPane>
            <TabPane tab="网关配置" key="2" forceRender={true}>
              <DynamicFormEditor items={gatewayItems} getForm={form=>this.gatewayForm = form} data={data} footer={null} labelCol={6}/>
            </TabPane>
            <TabPane tab="特性" key="3" forceRender={true}>
              <DynamicFormEditor items={featureItems} getForm={form=>this.featureForm = form} data={data} footer={null} labelCol={6}/>
            </TabPane>
            <TabPane tab="所属租户" key="4" forceRender={true}>
              {/* <Alert message="本页签修改的内容会直接生效。" type="info" showIcon style={{marginBottom:10}}/> */}
              <Button icon='plus' type='primary' style={{marginBottom:10}} onClick={this.addTenantModel}>新增所属租户</Button>
              <Table columns={tenantColumns} rowKey="id" size='middle' dataSource={data.envTenants}></Table>
            </TabPane>
            <TabPane tab="全局路由" key="5" forceRender={true}>
                <Form.Item label='全局路由' labelCol={{span:4}} wrapperCol={{span:8}} style={{marginBottom:0}}>
                  <Switch checkedChildren='开启' unCheckedChildren='关闭' checked={data.routerSwitch} onChange={this.routerSwitchChange}/>
                </Form.Item>
                <Form.Item label='路由管理地址' labelCol={{span:4}} wrapperCol={{span:12}} style={{marginBottom:5}} required={data.routerSwitch} 
                help={this.state.routerUrlHelp} validateStatus={this.state.routerUrlValidateStatus}>
                  <Input value={data.routerUrl} onChange={this.routerUrlChange} disabled={!data.routerSwitch}/>  
                </Form.Item>
              <EnvRouteTemplateTable rowKey="id" data={data.routeTemplate} environmentId={data.id}/>
            </TabPane>
          </Tabs>
          <Modal title='选择所属租户' visible={this.state.tenantsModalVisible} onOk={this.addTenantHandle} onCancel={e=>{this.setState({tenantsModalVisible:false})}} >
            <Checkbox.Group options={this.state.tenantOptions} value={this.state.tenantValues} onChange={this.tenantChange} />
          </Modal>
        </Modal>
      )
    }
}
export default Form.create()(EnviromentForm);