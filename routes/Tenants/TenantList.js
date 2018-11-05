import React from 'react';
import {Breadcrumb,Divider} from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import TenantsList from '../../components/Tenants/TenantsList'

class TenantList extends React.Component {
  
  render() {
    let title = <Breadcrumb style={{marginTop:6}}>
    <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> 租户管理</Breadcrumb.Item>
  </Breadcrumb>;
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader  title={title} content='全局租户列表'/>
        <TenantsList history={this.props.history}/>
      </div>
    );
  }
}

export default TenantList;