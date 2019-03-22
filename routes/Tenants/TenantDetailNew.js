import React from 'react'
import PageHeaderLayout from '../../routes/setting/layouts/PageHeaderLayout';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import UserSelectModal from '../../common/UserSelectModal';
import { Route,withRouter } from 'react-router-dom';
import { message } from 'antd';
import { getTenantById, getTenantManager, updateTenantManager } from '../../services/tp';
import QuotaList from '../../components/Tenants/QuotaList';
import UserManage from '../../components/Tenants/UserManage';
import TenantsServices from '../../components/Tenants/TenantsServices'
import constants from '../../services/constants';
import { base } from '../../services/base';
import Link from 'react-router-dom/Link';

const { Description } = DescriptionList;
let tabList = [
  { key: 'baseinfo', tab: '基础信息' }, 
  { key: 'services', tab: '服务器组' }, 
];
// eslint-disable-next-line 
let tabList2
//cce权限
if(!base.configs.passEnabled){
  tabList2 = [
    { key: 'services', tab: '服务器组' }, 
  ];
}
class TenantDetailNew extends React.Component {
  state = {
    tenantId:'',
    name:'',
    tenantManager:[],
    tabActiveKey:'baseinfo',
    code:'',
    tenantCode:'',
    tenant:{}
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
    //cce权限
    if(!base.configs.passEnabled){
      this.setState({ tabActiveKey: 'baseinfo' });
    }
    if(url.indexOf("baseinfo") > 0){
      this.setState({ tabActiveKey: 'baseinfo' });
    }
    if(url.indexOf("services") > 0){
      this.setState({ tabActiveKey: 'services' });
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
      this.setState({ name:data.name,code:data.code,tenantCode:data.tenant_code,tenant:data});
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
    const breadCrumbList = [{ title: '平台管理' },{title:<Link to='/tenants'>租户列表</Link>}, { title: '租户详情' }]
    const { tenantManager,code,tenantId,tabActiveKey,tenantCode } = this.state;
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
    //cce权限
    return (
      <PageHeaderLayout
      logo={<img alt="" src={constants.PIC.tenant} />}
      breadcrumbList={breadCrumbList}
      title={this.state.name}
      content={content}
      tabList={tabList}
      tabActiveKey={tabActiveKey}
      onTabChange={(key)=>this.onTabChange(key)}
      >
        <Route 
            path="/tenants/:appId" 
            render={ () => {
              return <div>
                {base.configs.passEnabled? <QuotaList title="配额" code={code} tenantId={tenantId} tenantCode={tenantCode}  tenant={this.state.tenant}/>:''}
                <UserManage title="成员"  tenantId={tenantId} />
                </div>
            } } exact />
          <Route 
        path="/tenants/:appId/baseinfo" 
        render={ () => {
          return <div>
            {base.configs.passEnabled? <QuotaList  title="配额"code={code} tenantId={tenantId} tenantCode={tenantCode} />:''}
            <UserManage title="成员" tenantId={tenantId} />
            </div>
        } } exact />
        <Route 
            path="/tenants/:appId/services" 
            render={ () => <TenantsServices {...this.props} tenantCode={tenantCode} /> } />
    </PageHeaderLayout>
    );
    
  }
}

export default withRouter(TenantDetailNew);