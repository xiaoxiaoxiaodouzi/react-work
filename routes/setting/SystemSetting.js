import React, { Fragment, Component} from 'react';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Card,Switch ,Modal,Input,message,Form} from 'antd';
import EnvSetting from '../../components/Setting/EnvSetting';
import { getConfigs,updateConfigs} from '../../services/setting'
import constants from '../../services/constants'
const { Description } = DescriptionList;

const breadcrumbList = [{
  title: '高级设置',
  href: '/#/setting',
}, {
  title: '系统设置'
}];

class SystemSettingForm extends Component{
  state = {
    systemManager:[],
    checked:false,
    routerUrl:'',       //全局动态路由配置地址
    visible:false,      //开启动态路由配置模态框
    closeVisible:false,
    paasManageUrl:'',     //部署内网地址
    APMServerUrl:'',  //APM地址
    visibleSet:false,       //平台设置模态框
  };

  
  componentDidMount(){
    this.loadData();
  }

  loadData=()=>{
    getConfigs().then(data => {
      if (data[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE] === '1') {
        this.setState({ checked: true })
      }
      this.setState({ 
        routerUrl: data[constants.CONFIG_KEY.GLOBAL_ROUTER_URL],
        paasManageUrl:data[constants.CONFIG_KEY.PASS_MANAGE_URL],
        APMServerUrl: data[constants.CONFIG_KEY.APM_URL],
       })
    })
  }
  componentWillReceiveProps(nextProps) {

    //当路由切换时
    if (this.props.location !== nextProps.location) {
      window.scrollTo(0, 0)
    }
  }

  handleClick=()=>{
    
    if(this.state.checked){
      //关闭动态路由配置
      this.setState({
        closeVisible:true,  
      })
    }else{
      let form = this.props.form;
      form.setFieldsValue = {
        url: this.state.routerUrl,
      }
      this.setState({
        visible:true,
      })
    }
  }
  onManagerChange=(type, users)=> {
    /* var usersId = [];
    users.forEach((element)=>{
      usersId.push(element.id);
    })
    changeAppManager(this.appid,type,usersId)
    .then((response)=>{
        this.setState({
          systemManager:users
        })
    }) */
    this.setState({
      systemManager:users
    })
  }
 //开启动态路由模态框 确认按钮
  handleOnOk=()=>{
    let bodyParams={}
    bodyParams[constants.CONFIG_KEY.GLOBAL_ROUTER_URL]=this.state.routerUrl;
    bodyParams[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE]='1'
    updateConfigs(bodyParams).then(data=>{
      message.success('动态路由设置成功')
      this.setState({visible:false,checked:true})
      this.props.globalRouterChange(true);
    })
  }

  //开启动态路由模态框 取消按钮
  handleCancle=()=>{
    this.setState({visible:false})
    this.loadData();
  }

  //关闭动态路由配置
  onOk=()=>{
    let bodyParams={
      globalRouterEnable:'0'
    }
    updateConfigs(bodyParams).then(data => {
      message.success('关闭动态路由成功')
      this.setState({ closeVisible: false, checked: false })
      this.props.globalRouterChange(false);
    })
  }

  onCancle=()=>{
    this.setState({closeVisible:false})
  }

//开启模态框
  OpenModal=()=>{
    let form = this.props.form;
    //给模态框设置初始值
    form.setFieldsValue({
      paasManageUrl: this.state.paasManageUrl,
      APMServerUrl: this.state.APMServerUrl,
    })
    this.setState({
      visibleSet:true,
    })
  }
  
  _handleCancle=()=>{
    this.setState({
      visibleSet:false
    })
  }

  _handleOk=()=>{
    let form = this.props.form;
    form.validateFields((err,values)=>{
      if(err){
        return
      } 
      if(values){
        updateConfigs(values).then(data=>{
          if(data){
            this.setState({
              visibleSet:false,
              ...data
            })
            message.success('修改成功')
          }
        })
      }
    })
  }

  //表单数据校验
  validateParams = (rule, value, callback) => {
    let regport=constants.reg.port;
    let reghost=constants.reg.host
    if (rule.field ==='paasManageUrl'){
      if(value){
        if (!reghost.test(value)){
          callback('请输入正确格式类似于 http://xxx.xx.xx.xx')
          return;
        }
      }else{
        callback('请输入部署地址')
        return;
      }
    }
    if (rule.field === 'APMServerUrl') {
      if(value){
        if (!regport.test(value)) {
          callback('请输入正确格式类似于 xxx.xx.xx.xx:xxxx')
          return;
        }
      }
    }
    if (rule.field === 'url') {
      if (value) {
        if (!reghost.test(value)) {
          callback('请输入正确格式类似于 http://xxx.xx.xx.xx')
          return;
        }
      } else {
        callback('请输入动态路由地址')
        return;
      }
    }
    callback()
    
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const title = (
      <Fragment>
        <span style={{ marginRight: 24 }}>全局动态路由配置</span>
        <Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.checked} onClick={this.handleClick} />
      </Fragment>
    )
    const action = <a style={{ float: "right", fontSize: 14 }} onClick={e=>this.setState({visible:true})}>修改</a>
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
    return (
      <PageHeaderLayout
        title="系统设置"
        content="应用管理平台系统设置界面，提供全局参数、系统环境相关配置"
        breadcrumbList={breadcrumbList}>
        <Card 
          bordered={false}
          title='平台设置'
          extra={<Fragment><a onClick={() => this.OpenModal()}>编辑</a></Fragment>}
           >
          <DescriptionList col={2} size="large">
            <Description term="部署内网地址">
              {this.state.paasManageUrl}
            </Description>
            <Description term="APM地址">
              {this.state.APMServerUrl}
            </Description>
          </DescriptionList>
        </Card>
        <EnvSetting/>
        <Card title={title}>
          <DescriptionList col={1} title={this.state.checked?action:''}>
            {!this.state.checked ?
              <Description term="温馨提示">如需使用统一域名管理，请先启用动态路由配置。</Description> 
              : 
              <Description term="全局动态路由地址">{this.state.routerUrl}</Description>}
          </DescriptionList>
        </Card>

        <Modal
          title='全局动态路由配置'
          visible={this.state.visible}
          onOk={this.handleOnOk}
          onCancel={this.handleCancle}
        >
          <Form>
            <Form.Item {...formItemLayout} label="动态路由地址">
              {getFieldDecorator('url', {
                initialValue: this.state.routerUrl ,
                rules: [{ required: true, 
                  validator: this.validateParams }],
              })(
                <Input onChange={e => this.setState({ routerUrl: e.target.value })} />
              )}
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title='关闭全局动态路由'
          visible={this.state.closeVisible}
          onOk={this.onOk}
          onCancel={this.onCancle}
        >
          确认是否关闭全局动态路由？
        </Modal>

        <Modal
          title='修改平台设置'
          visible={this.state.visibleSet}
          onOk={this._handleOk}
          onCancel={this._handleCancle}
        >
          <Form>
            <Form.Item {...formItemLayout} label="部署内网地址">
              {getFieldDecorator('paasManageUrl', {
                initialValue: this.state.routerUrl,
                rules: [{ 
                  required: true, 
                  validator: this.validateParams 
              }],
              })(
                <Input/>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="APM地址">
              {getFieldDecorator('APMServerUrl', {
                initialValue: this.state.routerUrl,
                rules: [{ 
                  required: true,
                  validator: this.validateParams  
              }],
               
              })(
                <Input />
              )}
            </Form.Item>
          </Form>

        </Modal>

      </PageHeaderLayout>
    );
  }
}
const SystemSetting=Form.create()(SystemSettingForm);
export default SystemSetting;