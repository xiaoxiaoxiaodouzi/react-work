import React from 'react';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import TenantsList from '../../components/Tenants/TenantsList';

class TenantList extends React.Component {
  
  render() {
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'全局租户列表'}]}/>
        <TenantsList history={this.props.history}/>
      </div>
    );
  }
}

export default TenantList;