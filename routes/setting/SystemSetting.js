import React, { Fragment, Component } from 'react';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Card, Switch, Modal, Input, message, Form, Breadcrumb, Divider } from 'antd';
import EnvSetting from '../../components/Setting/EnvSetting';
import { getConfigs, updateConfigs } from '../../services/setting'
import constants from '../../services/constants'
import { base } from '../../services/base'
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'
import { getUsersByGroup, putUsersByGroup } from '../../services/functional';
import SystemBasicForm from '../../components/Setting/SystemBasicForm'
import RenderAuthorized from 'ant-design-pro/lib/Authorized';
//import WrapAuth from '../../common/WrapAuthComponent'

const { Description } = DescriptionList;
const breadcrumbTitle = <Breadcrumb style={{ marginTop: 6 }}>
  <Breadcrumb.Item><Divider type="vertical" style={{ width: "2px", height: "15px", backgroundColor: "#15469a", "verticalAlign": "text-bottom" }} /> 高级设置</Breadcrumb.Item>
  <Breadcrumb.Item>系统设置</Breadcrumb.Item>
</Breadcrumb>;
class SystemSettingForm extends Component {
  state = {
    systemManager: [],
    checked: false,
    routerUrl: '',       //全局动态路由配置地址
    visible: false,      //开启动态路由配置模态框
    closeVisible: false,
    paasManageUrl: '',     //部署内网地址
    APMServerUrl: '',  //APM地址
    manageTenantCode: '',     //管理租户code
    visibleSet: false,       //平台设置模态框
    path: '',
    isDone: false,      //是否初始化完成？
    managers: [],
    userVisible: false,
    adminNames: '',
    initialize: '1',
    globalResourceMonitUrl:'',
  };
  componentDidMount() {
    if (base.configs.initialize === '1') {
      this.setState({ isDone: true })
    }
    this.setState({
      path: this.props.pathname
    })
    this.loadData();
  }

  loadData = () => {
    getConfigs().then(data => {
      if (data[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE] === '1') {
        this.setState({ checked: true })
      }
      this.setState({
        routerUrl: data[constants.CONFIG_KEY.GLOBAL_ROUTER_URL],
        paasManageUrl: data[constants.CONFIG_KEY.PASS_MANAGE_URL],
        APMServerUrl: data[constants.CONFIG_KEY.APM_URL],
        manageTenantCode: data[constants.CONFIG_KEY.MANAGE_TENANT_CODE],
        initialize: data[constants.CONFIG_KEY.INITIALIZE],
        globalResourceMonitUrl: data[constants.CONFIG_KEY.GLOBAL_RESOURCE_MONIT_URL]
      })
    });
    this._getUserGroup();
  }
  /*   componentWillReceiveProps(nextProps) {
      //当路由切换时
      if (this.props.location !== nextProps.location) {
        window.scrollTo(0, 0)
      }
      if (nextProps.location) {
        if (nextProps.location.pathname) {
          this.setState({
            path: nextProps.location.pathname
          });
          this.loadData();
        }
      }
    }
    }*/

  _getUserGroup = () => {
    getUsersByGroup("adminGroup").then(data => {
      let names = []
      data.forEach(man => {
        names.push(man.name);
      });
      this.setState({
        adminNames: names.toString(),
        managers: data
      })
    })
  }

  handleClick = () => {

    if (this.state.checked) {
      //关闭动态路由配置
      this.setState({
        closeVisible: true,
      })
    } else {
      let form = this.props.form;
      form.setFieldsValue = {
        url: this.state.routerUrl,
      }
      this.setState({
        visible: true,
      })
    }
  }
  onManagerChange = (type, users) => {
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
      systemManager: users
    })
  }
  //开启动态路由模态框 确认按钮
  handleOnOk = () => {
    let form = this.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      let bodyParams = {}
      bodyParams[constants.CONFIG_KEY.GLOBAL_ROUTER_URL] = this.state.routerUrl;
      bodyParams[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE] = '1'
      updateConfigs(bodyParams).then(data => {
        message.success('动态路由设置成功');
        this.setState({ visible: false, checked: true });
        base.configs.globalRouterEnable = '1';
        base.configs[constants.CONFIG_KEY.GLOBAL_ROUTER_URL] = this.state.routerUrl;
        this.props.globalRouterChange(true);
      })
    })
  }

  //开启动态路由模态框 取消按钮
  handleCancle = () => {
    this.setState({ visible: false })
  }

  //关闭动态路由配置
  onOk = () => {
    let bodyParams = {
      globalRouterEnable: '0'
    }
    updateConfigs(bodyParams).then(data => {
      message.success('关闭动态路由成功');
      this.setState({ closeVisible: false, checked: false });
      base.configs.globalRouterEnable = '0';
      this.props.globalRouterChange(false);
    })
  }

  onCancle = () => {
    this.setState({ closeVisible: false })
  }

  //开启模态框
  OpenModal = () => {
    let form = this.props.form;
    //给模态框设置初始值
    form.setFieldsValue({
      paasManageUrl: "",
      APMServerUrl: this.state.APMServerUrl,
      manageTenantCode: this.state.manageTenantCode,
    })
    this.setState({
      visibleSet: true,
    })
  }

  _handleCancle = () => {
    this.setState({
      visibleSet: false
    })
  }

  _handleOk = (values) => {
    updateConfigs(values).then(data => {
      if (data) {
        this.setState({
          visibleSet: false,
          ...data
        })
        base.configs = data;
        message.success('修改成功')
      }
    })
  }

  //表单数据校验
  validateParams = (rule, value, callback) => {
    let reghost = constants.reg.host
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

  _putUsersByGroup = (users) => {
    let ids = [];
    users.forEach(user => {
      ids.push(user.id);
    });
    putUsersByGroup("adminGroup", { userIds: ids }).then(data => {
      this._getUserGroup();
      this.setState({
        userVisible: false
      })
    });
  }

  render() {
    const Authorized = RenderAuthorized(base.allpermissions);
    const { getFieldDecorator } = this.props.form;
    const title = (
      <Fragment>
        <span style={{ marginRight: 24 }}>全局动态路由配置</span>
        <Authorized authority={'systemset_globalDynamicRouting'} noMatch={<Switch disabled='true' checkedChildren="开" unCheckedChildren="关" checked={this.state.checked} onClick={this.handleClick} />}>
          <Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.checked} onClick={this.handleClick} />
        </Authorized>
      </Fragment>
    )
    const action =
      <Authorized authority={'systemset_editGlobalDynamicRouting'} noMatch={<a disabled='true' style={{ float: "right", fontSize: 14 }} onClick={e => this.setState({ visible: true })}>修改</a>}>
        <a style={{ float: "right", fontSize: 14 }} onClick={e => this.setState({ visible: true })}>修改</a>
      </Authorized>
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
        title={breadcrumbTitle}
        content="应用管理平台系统设置界面，提供全局参数、系统环境相关配置"
      >

        <Card
          bordered={false}
          title='平台设置'
          extra={<Fragment><Authorized authority={'systemset_editPlatformSetting'} noMatch={<a disabled='true' onClick={() => this.OpenModal()}>编辑</a>}><a onClick={() => this.OpenModal()}>编辑</a></Authorized></Fragment>}
        >
          <DescriptionList col={3} size="large">
            <Description term="部署内网地址">
              {this.state.paasManageUrl}
            </Description>
            <Description term="性能监控地址">
              {this.state.APMServerUrl}
            </Description>
            <Description term="管理租户CODE">
              {this.state.manageTenantCode}
            </Description>
            {this.state.isDone ? '' :
              <Description term="是否初始化完成">
                {this.state.initialize === '1' ? '是' : '否'}
              </Description>}
            <Description term="全局资源监控地址">
              {this.state.globalResourceMonitUrl}
            </Description>

          </DescriptionList>
          <DescriptionList col={1} size="large" style={{ marginTop: 10 }}>
            <Description term="管理员">
              {this.state.adminNames}
            </Description>

          </DescriptionList>
        </Card>
        <EnvSetting path={this.state.path} />
        <Card title={title}>
          <DescriptionList col={1} title={this.state.checked ? action : ''}>
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
                initialValue: this.state.routerUrl,
                rules: [{
                  required: true,
                  validator: this.validateParams
                }],
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

        <SystemBasicForm visibleSet={this.state.visibleSet}
          _handleOk={this._handleOk}
          _handleCancle={this._handleCancle}
          _putUsersByGroup={users => this._putUsersByGroup(users)}
          initialize={this.state.initialize}
          globalResourceMonitUrl={this.state.globalResourceMonitUrl}
          manageTenantCode={this.state.manageTenantCode}
          paasManageUrl={this.state.paasManageUrl}
          APMServerUrl={this.state.APMServerUrl}
          managers={this.state.managers}
          CheckBoxChange={value => { this.setState({ initialize: value }) }}
          isDone={this.state.isDone} />

      </PageHeaderLayout>
    );
  }
}

const SystemSetting = Form.create()(SystemSettingForm);
export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <SystemSetting {...props} tenant={context.tenant} globalRouterChange={context.globalRouterChange} />}
  </GlobalHeaderContext.Consumer>
);