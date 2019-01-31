import React, { Fragment, Component } from 'react';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Card, message, Form, Tooltip} from 'antd';
import EnvSetting from '../../components/Setting/EnvSetting';
import { updateConfigs } from '../../services/amp'
import constants from '../../services/constants'
import { base } from '../../services/base'
import { getUsersByGroup, putUsersByGroup } from '../../services/uop';
import SystemBasicForm from '../../components/Setting/SystemBasicForm'
import Authorized from '../../common/Authorized';
import {BreadcrumbTitle} from '../../common/SimpleComponents';

const { Description } = DescriptionList;
class SystemSettingForm extends Component {
  state = {
    systemManager: [],
    paasManageUrl: '',     //部署内网地址
    APMServerUrl: '',  //APM地址
    manageTenantCode: '',     //管理租户code
    visibleSet: false,       //平台设置模态框
    managers: [],
    userVisible: false,
    adminNames: '',
    globalResourceMonitUrl:'',
    openOrClose:base.configs.passEnabled?'关闭cce权限':'打开cce权限'
  };
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({

      paasManageUrl: base.configs[constants.CONFIG_KEY.PASS_MANAGE_URL],
      APMServerUrl: base.configs[constants.CONFIG_KEY.APM_URL],
      manageTenantCode: base.configs[constants.CONFIG_KEY.MANAGE_TENANT_CODE],
      globalResourceMonitUrl: base.configs[constants.CONFIG_KEY.GLOBAL_RESOURCE_MONIT_URL],
      passEnabled:base.configs.passEnabled,
      errorMessage:base.configs.errorMessage,
      messageBell:base.configs.messageBell,
      APMEnabled:base.configs.APMEnabled,
      monitEnabled:base.configs.monitEnabled
    })
    this._getUserGroup();
  }

  _getUserGroup = () => {
    getUsersByGroup("adminGroup",{ 'AMP-ENV-ID':1}).then(data => {
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

  //开启平台设置模态框
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
        message.success('修改成功')
             
        if(values.passEnabled !== this.state.passEnabled){
          window.location.reload();
        } 

        if(values.monitEnabled !== this.state.monitEnabled){
          window.location.reload();
        }
        this.setState({
          visibleSet: false,
          ...data
        })
        base.configs = data; 
      }
    })
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
    const breadcrumbTitle = BreadcrumbTitle([{name:'高级设置'},{name:'系统设置'}]);
    return (
      <PageHeaderLayout
        title={breadcrumbTitle}
        content="应用管理平台系统设置界面，提供全局参数、系统环境相关配置"
      >
        <Card bordered={false} title='平台设置' style={{marginBottom:24}}
          extra={<Fragment><Authorized authority={'systemset_editPlatformSetting'} noMatch={<a disabled='true' onClick={() => this.OpenModal()}>编辑</a>}><a onClick={() => this.OpenModal()}>编辑</a></Authorized></Fragment>}
        >
          <DescriptionList col={3} size="large">
            <Description term="管理租户CODE">
              {this.state.manageTenantCode}
            </Description>
            <Description term="错误消息提示">
              {this.state.errorMessage?'开启':'关闭'}
            </Description>
            <Description term="消息铃铛">
              {this.state.messageBell?'开启':'关闭'}
            </Description>
            <Description term="PAAS部署">
              {this.state.passEnabled?<Tooltip title={'部署内网地址\n'+this.state.paasManageUrl}>已启用</Tooltip>:"已关闭"}
            </Description>
            <Description term="性能监控">
              {this.state.APMEnabled?<Tooltip title={'性能监控地址\n'+this.state.APMServerUrl}>已启用</Tooltip>:"已关闭"}
            </Description>
            <Description term="资源监控">
              {this.state.monitEnabled?<Tooltip title={'资源监控地址\n'+this.state.globalResourceMonitUrl}>已启用</Tooltip>:"已关闭"}
            </Description>
          </DescriptionList>
          <DescriptionList col={1} size="large" style={{ marginTop: 16 }}>
            <Description term="管理员">
              {this.state.adminNames}
            </Description>
          </DescriptionList>
        </Card>

        <EnvSetting history={this.props.history}/>

        <SystemBasicForm visibleSet={this.state.visibleSet}
          _handleOk={this._handleOk}
          _handleCancle={this._handleCancle}
          _putUsersByGroup={users => this._putUsersByGroup(users)}
          globalResourceMonitUrl={this.state.globalResourceMonitUrl}
          manageTenantCode={this.state.manageTenantCode}
          paasManageUrl={this.state.paasManageUrl}
          APMServerUrl={this.state.APMServerUrl}
          APMEnabled={this.state.APMEnabled}
          monitEnabled={this.state.monitEnabled}
          errorMessage={this.state.errorMessage}
          passEnabled={this.state.passEnabled}
          messageBell={this.state.messageBell}
          managers={this.state.managers}
          />

      </PageHeaderLayout>
    );
  }
}

export default Form.create()(SystemSettingForm);