import React, { Component } from 'react';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import { message, Form } from 'antd';
import { updateConfigs } from '../../services/amp'
import constants from '../../services/constants'
import { base } from '../../services/base'
import { getUsersByGroup, putUsersByGroup } from '../../services/uop';
import { Route } from 'react-router-dom';
import { BreadcrumbTitle } from '../../common/SimpleComponents';
import PlatForm from './PlatForm'
import SystemBasicSetting from '../../components/Setting/SystemBasicSetting';
import EnvSettingNew from '../../components/Setting/EnvSettingNew';

const basePath = 'setting/syssetting'
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
    globalResourceMonitUrl: '',
    openOrClose: base.configs.passEnabled ? '关闭cce权限' : '打开cce权限',
    tabActiveKey: 'basic',
    Updatedisabled: true,    //子表单的按钮disabled属性
  };
  componentDidMount() {
    let path = window.location.href.split(basePath + '/');
    if (path.length > 0) {
      this.setState({ tabActiveKey: path[1] })
    }
    this.loadData();
  }

  loadData = () => {
    this.setState({
      paasManageUrl: base.configs[constants.CONFIG_KEY.PASS_MANAGE_URL],
      APMServerUrl: base.configs[constants.CONFIG_KEY.APM_URL],
      manageTenantCode: base.configs[constants.CONFIG_KEY.MANAGE_TENANT_CODE],
      globalResourceMonitUrl: base.configs[constants.CONFIG_KEY.GLOBAL_RESOURCE_MONIT_URL],
      passEnabled: base.configs.passEnabled,
      APMEnabled: base.configs.APMEnabled,
      monitEnabled: base.configs.monitEnabled
    })
    this._getUserGroup();
  }

  _getUserGroup = () => {
    getUsersByGroup("adminGroup", { 'AMP-ENV-ID': 1 }).then(data => {
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


  _handleOk = (values) => {
    updateConfigs(values).then(data => {
      if (data) {
        message.success('修改成功')

        if (values.passEnabled !== this.state.passEnabled) {
          window.location.reload();
        }

        if (values.monitEnabled !== this.state.monitEnabled) {
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

  onTabChange = (key) => {
    let { history } = this.props;
    history.push({ pathname: `/${basePath}/${key}` })
    this.setState({ tabActiveKey: key })
  }

  render() {
    const breadcrumbTitle = BreadcrumbTitle([{ name: '平台管理' }, { name: '系统设置' }]);

    const tabList = [{
      key: 'basic',
      tab: '基础设置',
    }, {
      key: 'platform',
      tab: '平台引擎',
    }, {
      key: 'env',
      tab: '业务环境',
    }];

    return (
      <PageHeaderLayout
        title={breadcrumbTitle}
        content="应用管理平台系统设置界面，提供全局参数、系统环境相关配置"
        tabList={tabList}
        tabActiveKey={this.state.tabActiveKey}
        onTabChange={this.onTabChange}
      >
        <Route path={`/${basePath}/basic`}
          render=
          {props =>
            <SystemBasicSetting
              _putUsersByGroup={users => this._putUsersByGroup(users)}
              managers={this.state.managers}
            />}
        />
        <Route path={`/${basePath}`}
          render=
          {props =>
            <SystemBasicSetting
              _putUsersByGroup={users => this._putUsersByGroup(users)}
              managers={this.state.managers}
            />}
          exact />
        <Route path={`/${basePath}/platform`} component={PlatForm} exact />
        <Route path={`/${basePath}/env`} render={props => <EnvSettingNew history={this.props.history} />} exact />
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(SystemSettingForm);