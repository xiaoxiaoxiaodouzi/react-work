import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Spin, Menu, Badge } from 'antd';
import moment from 'moment';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';

import { queryAppAIP } from '../../../services/deploy'
import { getAppManager } from '../../../services/appdetail'
import { queryAppCCE } from '../../../services/apps'
import constants from '../../../services/constants'
import { base } from '../../../services/base';

const { Description } = DescriptionList;

export default class AppResourceInfoModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      loading: true,
      appInfo: null
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appCode) this.loadData(nextProps.appCode);
  }

  loadData = (appCode) => {
    Promise.all([queryAppAIP(appCode), queryAppCCE({ appIds: [appCode] })]).then(response => {
      let appBase = response[0];
      let appCceData = response[1];
      let appInfo;
      if (appBase.length !== 0) {
        appInfo = appBase[0];
        this.setState({ appInfo });
        if (appCceData[appCode]) {
          let appCce = appCceData[appCode];
          appInfo.replicas = appCce.replicas + '/' + appCce.totalReplicas;
          appInfo.status = appCce.status;
          this.setState({ appInfo });
        }
        getAppManager(appInfo.id, 'SYSTEM_MANAGER').then(data => {
          if (data && data.length > 0) this.setState({ appInfo: { ...appInfo, managers: data } });
        });
      }
      this.setState({ loading: false });
    })

  }

  render() {
    let { appInfo } = this.state;
    const linkTo = (appid) => {
      let history = this.props.history;
      this.props.handleCancel();
      history.push("/apps/" + appid);
    }
    const closeButton = <Button onClick={this.props.handleCancel}>关闭</Button>;
    let appInfoDom, appName = '';
    const url = `${base.configs[constants.CONFIG_KEY.GLOBAL_RESOURCE_MONIT_URL]}/dashboard/db/application?var-tenant=${base.tenant}&var-application=${this.props.appCode}`;
    if (appInfo) {
      appName = appInfo.name;
      appInfoDom = (<div>
        <DescriptionList size="small" col={2}>
          <Description term="创建人">
            {appInfo.creator}
          </Description>
          <Description term="创建时间">
            {moment(appInfo.createtime).format('YYYY-MM-DD HH:mm')}
          </Description>
          <Description term="系统管理员">
            {appInfo.managers ? appInfo.managers.map(m => m.userName + ' ') : '未设置'}
          </Description>
          <Description term="实例">
            {this.state.appInfo.replicas}
          </Description>
          <Description term="状态">
            <Badge status={constants.APP_STATE_EN[appInfo.status]} text={constants.APP_STATE_CN[appInfo.status]} />
          </Description>
        </DescriptionList>
        <Menu
          defaultSelectedKeys={['monitor']}
          mode="horizontal"
        >
          <Menu.Item key="monitor">监控</Menu.Item>
          <Menu.Item key="log" disabled={true}>日志</Menu.Item>
        </Menu>
        <iframe title='resource' src={url} frameBorder="0" style={{ width: '100%', height: '338px' }}></iframe>
      </div>);
    } else {
      appInfoDom = "没有查询到应用信息。"
    }
    const title = <span>{this.props.appCode}{appInfo ? <span>(<a onClick={e => { linkTo(appInfo.id) }}>{appName}</a>)</span> : ''}</span>;

    return (
      <Modal
        width='800px'
        bodyStyle={{ height: 500 }}
        title={title}
        visible={this.props.visible}
        onCancel={this.props.handleCancel}
        footer={closeButton}
      >{
          this.state.loading ? <Spin /> : appInfoDom
        }
      </Modal>
    )
  }
}

AppResourceInfoModal.propTypes = {
  appCode: PropTypes.string.isRequired,//目标应用的code
  visible: PropTypes.bool
}

AppResourceInfoModal.defaultProps = {
  visible: false
}