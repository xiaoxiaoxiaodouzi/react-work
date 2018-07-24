import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import TenantsList from '../../components/Tenants/TenantsList'
//面包屑
const breadcrumbList = [{
  title: '首页', 
  href: '#/',
},{
  title: '租户列表'
}];

class TenantList extends React.Component {
  
  render() {
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title="租户列表" breadcrumbList={breadcrumbList} />

        <TenantsList history={this.props.history}/>
      </div>
    );
  }
}

export default TenantList;