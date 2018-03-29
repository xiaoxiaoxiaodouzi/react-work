import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Button, Card } from 'antd';
import { queryApp } from '../../services/apps'
import ProvidedServicesTable from '../../components/Application/Api/ProvidedServices'
import Link from 'react-router-dom/Link';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

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