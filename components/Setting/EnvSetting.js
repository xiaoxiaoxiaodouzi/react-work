import React from 'react';
import { Button, Card, Form, message, Modal, Col, Tooltip,Alert,Popconfirm } from 'antd';
import { getEnvHealth } from '../../services/aip';
import { queryAllEnvs, addEnv, deleteEnv, updateEnv } from '../../services/amp';
import { getTenant } from "../../services/tp";
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { base } from '../../services/base';
import AddEnvSetting from './AddEnvSetting'
import Authorized from '../../common/Authorized';
import FormEditorModal from '../../common/DynamicForm/FormEditorModal'
import EnvStatus from './EnvStatus'
import EnviromentForm from './EnviromentForm';
import constants from '../../services/constants'

const { Description } = DescriptionList;

class EnvSetting extends React.Component {
  state = {
    data: [],
    envLoding:true,
    updateEnvModalVisible: false, //手动新增环境模态框
    addVisible: false,    // 部署新环境模态框visible
    createEnvItems:[], //接入已有环境Modal属性
    createEnvVisible:false, //接入已有环境Modal显示
    code: '',//查看环境的code
    id: '',//新增环境ID 或者查看环境的ID
    env: {},   //当前环境所有属性
    record:{},
    tenants:[], //所有PASS租户
    tenanteMap:{} //租户Map
  };

  //是否具有环境编辑权限
  envEditAuth = base.allpermissions.includes('systemset_editEnviromentConfig');

  componentWillMount(){
    this.queryAllEnvs();
    getTenant().then(data=>{
      const tenants = base.filterTenantData(data);
      //数组转对象
      let tenanteMap = tenants.reduce((acc,obj)=>{
        acc[obj.code] = obj.name;
        return acc;
      },{});
      this.setState({tenanteMap,tenants});
    });
  }

  queryAllEnvs = () => {
    queryAllEnvs().then((data) => {

      this.setState({ data,envLoding:false });
      data.forEach(env => {
        //检查环境健康状态，禁用环境不查询
        if(!env.disabled){
          getEnvHealth(env.id).then(health=>{
            //健康检查通过，暂时表示一切正常，不做处理。
          }).catch(error=>{
            env.errorMessage = '环境健康检查未通过！';
            this.setState({data:this.state.data});
          })
        }
      });
    });
  }


  addEnv = () => {
    const createEnvItems = [
      {label:'名称',name:'name',required:true},
      {label:'编码',name:'code',required:true},
      {label:'授权服务器地址',name:'authServerAddress',required:true,regExp:constants.reg.host},
      {label:'授权服务器内网地址',name:'authServerInnerAddress',required:true,regExp:constants.reg.host},
      {label:'网关协议',name:'apiGatewaySchema',required:true,type:'select',options:[{label:'http',value:'http'},{label:'https',value:'https'}]},
      {label:'网关地址',name:'apiGatewayHost',required:true},
      {label:'网关端口',name:'apiGatewayPort',required:true,type:'number'},
      {label:'网关管理端口',name:'apiGatewayManagePort',required:true,type:'number'},
    ];
    this.setState({ createEnvVisible: true, createEnvItems});
  }

  disabledEvn = (id,disabled)=>{
    updateEnv(id,{disabled:disabled}).then(data=>{
      message.success('操作成功');
      this.queryAllEnvs();
    })
  }

  onDelete = (id) => {
    deleteEnv(id).then(() => {
      message.success('删除指定环境成功');
      this.queryAllEnvs();
    })
  }

  updateEnvHandle = (values) => {
    updateEnv(values.id,values).then(newElement => {
      message.success('更新环境成功');
      this.setState({ updateEnvModalVisible: false});
      this.queryAllEnvs();
    })
  }

  //接入新环境确认处理
  createEnvHandle = (values) =>{
    addEnv(values).then(env => {
      message.success('添加环境成功');
      this.setState({ createEnvVisible: false});
      this.queryAllEnvs();
    })
  }

  //部署新环境确认处理
  addNewEnv = (env) => {
    addEnv(env).then(newElement => {
      message.success('添加环境成功');
      this.setState({ updateEnvModalVisible: false, id: newElement.id });
      this.queryAllEnvs();
    })
  }

  autoAddEnv = () => {
    this.setState({ addVisible: true })
  }

  openEnvStateModal = (env) => {
    this.setState({ code: env.code, envStatusVisible: true, id: env.id, env: env })
  }

  //查询环境监控状态模态框关闭
  handleCancel = () => {
    this.setState({ envStatusVisible: false })
    getEnvHealth(this.state.id).then(data => {
      this.setState({ env: Object.assign(this.state.env, { success: true }) })
    }).catch(err => {
      this.setState({ env: Object.assign(this.state.env, { success: false }) })
    })
  }

  render() {
    //环境卡片标题
    const envTitle = env=>{
      const mainEnvIcon = env.isMain?'【主环境】':'';
      return (
        <span>{mainEnvIcon}{env.name}({env.code})</span>
      )
    }

    let {data,tenanteMap,editingEvn} = this.state;
    //环境租户换中文名
    data.forEach(env=>{
      let envTenants = [];
      env.envTenants && env.envTenants.forEach(t=>{
        if(tenanteMap[t.tenantCode]){
          t.tenantName = tenanteMap[t.tenantCode];
          envTenants.push(tenanteMap[t.tenantCode]);
        }
      })
      env.envTenantName = envTenants.length>0?envTenants.join(','):'--';
    })

    //环境卡片的操作
    const envCardExtra = (env)=>{
      const canEdit = base.allpermissions.includes('systemset_editEnviromentConfig');
      const canDelete = base.allpermissions.includes('systemset_deleteEnviromentConfig');
      let actions = [];
      //查看环境状态
      actions.push(<a onClick={e=>this.openEnvStateModal(env)}>查看状态</a>);
      if(canEdit)actions.push(<a onClick={e=>this.setState({updateEnvModalVisible:true,editingEvn:env})}>编辑</a>);
      if(!env.isMain){
        if(canEdit)env.disabled?actions.push(<a onClick={e=>this.disabledEvn(env.id,false)}>启用</a>):actions.push(<a onClick={e=>this.disabledEvn(env.id,true)}>禁用</a>);
        if(canDelete){
          const deleteEle = <Popconfirm title="确定删除该环境?" onConfirm={e=>this.onDelete(env.id)}><a>删除</a></Popconfirm>;
          actions.push(deleteEle);
        }
      }
      return (
        actions.map(action=>action)
      );
    }
    
    return (
      <Card
        bordered={false}
        title='环境配置'
        loading = {this.state.envLoding}
        style={{ margin: '24px 0' }}
        bodyStyle={{ padding: 0 }} >
        {
          this.state.data.map((env, index) => {
            return (
              <Card
                key={index}
                type="inner"
                style={{ margin: 16 }}
                className={env.disabled?'env-card disabled':'env-card'}
                title={envTitle(env)}
                extra={envCardExtra(env)}
                >
                  {!env.disabled&&env.errorMessage&&<Alert message={env.errorMessage} type="warning" style={{marginBottom:10}} showIcon />}
                  <DescriptionList size="small" col={3}>
                    <Description term="服务监控">{env.serviceMonitorSwitch?<Tooltip title={'服务监控地址：'+env.serviceMonitorAddress}>已启用</Tooltip>:'已关闭'}</Description>
                    <Description term="全局路由">{env.routerSwitch?<Tooltip title={'路由管理地址：'+env.routerUrl}>已启用</Tooltip>:'已关闭'}</Description>
                    <Description term="SpringCloud支持">{env.springCloudSwitch?<Tooltip title={'注册中心地址：'+env.eurekaServerUrls}>已启用</Tooltip>:'已关闭'}</Description>
                    <Description term="网关地址">{env.apiGatewaySchema+'://'+env.apiGatewayHost}</Description>
                    <Description term="网关端口">{env.apiGatewayPort}</Description>
                    <Description term="网关管理端口">{env.apiGatewayManagePort}</Description>
                    <Description term="授权服务器地址">{env.authServerAddress}</Description>
                    <Description term="授权服务器内网地址">{env.authServerInnerAddress}</Description>
                    <div class="ant-col-xs-24 ant-col-sm-24 ant-col-md-24" style={{paddingLeft: 16, paddingRight: 16}}>
                      <div class="antd-pro-description-list-term">所属租户</div>
                      <div class="antd-pro-description-list-detail">{env.envTenantName}</div>
                    </div>
                  </DescriptionList>
              </Card>
            )
          })
        }
        <div style={{marginLeft:16}}>
          <Authorized authority={'systemset_addEnviromentConfig'} noMatch={<Button disabled='true' style={{ width: '100%', marginBottom: 24 }} type="dashed" onClick={this.newRecord} icon="plus" >添加环境</Button>}>
            {base.configs.passEnabled?<Col style={{paddingRight:16}} span={12} >
              <Button
                style={{ width: '100%', marginBottom: 24 }}
                type="dashed"
                onClick={this.addEnv}
                icon="plus" >
                接入已有环境
              </Button>
            </Col>:<Col style={{paddingRight:16}} span={24} >
              <Button
                style={{ width: '100%', marginBottom: 24 }}
                type="dashed"
                onClick={this.addEnv}
                icon="plus" >
                接入已有环境
              </Button>
            </Col>}
            {base.configs.passEnabled?<Col style={{paddingRight:16}} span={12}>
              <Button
                style={{ width: '100%', marginBottom: 24 }}
                type="dashed"
                onClick={this.autoAddEnv}
                icon="plus" >
                部署新环境
              </Button>
            </Col>:""}
          </Authorized>

          <AddEnvSetting id={this.state.id} title='部署新环境' history={this.props.history} visible={this.state.addVisible} onChange={(flag) => { this.setState({ addVisible: flag });this.queryAllEnvs(); }} addNewEnv={this.addNewEnv} code={this.state.code} />
          <EnviromentForm title='环境编辑' data={editingEvn} visible={this.state.updateEnvModalVisible} tenants={this.state.tenants} onOk={this.updateEnvHandle} onCancel={e=>{this.setState({ updateEnvModalVisible: false });this.queryAllEnvs();}}/>
          <FormEditorModal title='接入已有环境' visible={this.state.createEnvVisible} items={this.state.createEnvItems} onCancel={e=>this.setState({createEnvVisible:false})} onOk={this.createEnvHandle}></FormEditorModal>
          <Modal
            width={800}
            bodyStyle={{ height: '500px', overflow: 'auto' }}
            visible={this.state.envStatusVisible}
            destroyOnClose
            title='环境状态'
            footer={null}
            onCancel={() => this.handleCancel()}
          >
            <EnvStatus code={this.state.code} history={this.props.history} id={this.state.id} onCancel={() => this.handleCancel()}/>
          </Modal>

        </div>

      </Card >
    );
  }
}
const AntDe = Form.create()(EnvSetting);
export default AntDe;