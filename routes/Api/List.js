import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Card } from 'antd';
import ProvidedServicesTable from '../../components/Application/Api/ProvidedServices'


//面包屑
const breadcrumbList = [{
  title: '首页',
  href: '#/',
}, {
  title: '服务列表'
}];

class ApiList extends React.Component {
  state = {}

  render() {
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title="服务列表" breadcrumbList={breadcrumbList} />
        <Card bordered={false} style={{ margin: 24 }}>
          <ProvidedServicesTable editable={false} />
        </Card>
      </div >
    );
  }
}

export default ApiList;