import React,{PureComponent,Fragment} from 'react';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Card,Switch } from 'antd';
import EnvSetting from '../../components/Setting/EnvSetting';
import UserSelectModal from '../../common/UserSelectModal';
import InputInline from '../../common/Input';

const { Description } = DescriptionList;

const breadcrumbList = [{
  title: '高级设置',
  href: '/#/setting',
}, {
  title: '系统设置'
}];
const title =(
  <Fragment>
    <span style={{marginRight:24}}>全局动态路由配置</span>
    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
  </Fragment>
)
export default class Component extends PureComponent {
  state = {
    systemManager:[],
    deployAddress:'aaa',
  };
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
  onDeployAddressChangeCommit = (value)=>{
    this.setState({
      deployAddress: value
    })
  }
  render() {
    const { systemManager,deployAddress } = this.state;
    return (
      <PageHeaderLayout
        title="集群列表"
        content="应用管理平台系统设置界面，提供全局参数、系统环境相关配置"
        breadcrumbList={breadcrumbList}>
        <Card 
          bordered={false}
          title='平台设置' >
          <DescriptionList size="large">
            <Description term="平台管理员">
              <UserSelectModal 
                title={'设置平台管理员'} 
                selectedUsers={systemManager} 
                dataIndex={{dataIdIndex:'USERID',dataNameIndex:'userName'}} 
                onOk={(users) => { this.onManagerChange('SYSTEM_MANAGER', users) }} /> 
            </Description>
            <Description term="是否启用admin账号">
              是
            </Description>
            <Description term="部署内网地址">
              <InputInline 
                value={deployAddress} 
                onChange={this.onDeployAddressChangeCommit} 
                dataType={'Input'} mode={'inline'} 
                defaultNullValue={'暂无'} 
                rule={{ required: true }} />
              {/* Key c2_paas_manage_address */}
            </Description>
          </DescriptionList>
        </Card>
        <EnvSetting/>
        <Card title={title} >
          <span>温馨提示：如需使用统一域名管理，请先启用动态路由配置。</span>
        </Card>
      </PageHeaderLayout>
    );
  }
}