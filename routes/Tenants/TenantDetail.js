import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import UserSelectModal from '../../common/UserSelectModal';
import { Route,withRouter } from 'react-router-dom';
import { message } from 'antd';
import { getTenantById,getTenantManager,updateTenantManager } from '../../services/tenants';
import QuotaList from '../../components/Tenants/QuotaList';
import UserManage from '../../components/Tenants/UserManage';
import constants from '../../services/constants'

const { Description } = DescriptionList;
const tabList = [
  { key: 'quota', tab: '配额' }, 
  { key: 'user', tab: '用户' }, 
];
class TenantDetail extends React.Component {
  state = {
    tenantId:'',
    name:'',
    tenantManager:[],
    tabActiveKey:'quota',
    code:'',
    tenantCode:'',
  }
  componentDidMount() {   
    //I9eQ139sQxOOnSVfALzPjg
    let url = document.location.toString();
    if(url.indexOf("tenants") > 0){
      let temp = url.slice(url.indexOf("tenants")+8);
      const id = url.slice(url.indexOf("tenants")+8,temp.indexOf('/')>0?(url.indexOf("tenants")+8+temp.indexOf('/')):undefined);
      this.setState({tenantId:id});
      this.loadTenantById(id);
    }
    if(url.indexOf("user") > 0){
      this.setState({ tabActiveKey: 'user' });
    }
  }
  loadTenantById = (tenantId) =>{
    getTenantManager(tenantId).then(data=>{
      let tenantManager = [];
      data.forEach(element => {
        tenantManager.push(element);
      });
      this.setState({tenantManager});
    });
    getTenantById(tenantId).then(data=>{
      this.setState({ name:data.name,code:data.code,tenantCode:data.tenant_code });
    });
  }
  onManagerChange=(users)=> { 
    let ids = [];
    users.forEach(element => {
      ids.push(element.id);
    });
    updateTenantManager(this.state.tenantId,ids).then(data=>{
      this.setState({ tenantManager: users });
      message.success('修改租户管理员成功');
    });
  }
  onTabChange=(key)=> {
    this.props.history.push({ pathname: `/tenants/${this.state.tenantId}/${key}` });
    this.setState({ tabActiveKey: key });
  }
  render() {
    const { tenantManager,name,code,tenantId,tabActiveKey,tenantCode } = this.state;
    const content = (
      <DescriptionList size="small" col="2">
        <Description term="租户管理员">
          <UserSelectModal 
            tenantId={tenantId}
            title={'设置租户管理员'}
            mark='租户管理员'
            description=''
            selectedUsers={tenantManager} 
            dataIndex={{ dataIdIndex: 'id', dataNameIndex: 'name' }} 
            onOk={(users) => { this.onManagerChange(users) }} />
        </Description>
      </DescriptionList>
    )
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={'租户名：'+name}
          logo={<img alt="" src={constants.PIC.tenant} />}
          content={content}
          tabList={tabList}
          tabActiveKey={tabActiveKey}
          onTabChange={(key)=>this.onTabChange(key)}
        />
        <Route 
          path="/tenants/:appId" 
          render={ () => <QuotaList code={code} tenantId={tenantId} tenantCode={tenantCode} /> } exact />
        <Route 
          path="/tenants/:appId/quota" 
          render={ () => <QuotaList code={code} tenantId={tenantId} tenantCode={tenantCode} /> } />
        <Route 
          path="/tenants/:appId/user" 
          render={ () => <UserManage tenantId={tenantId} /> } />
      </div>
    );
  }
}

export default withRouter(TenantDetail);