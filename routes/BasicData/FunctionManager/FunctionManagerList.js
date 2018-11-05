import React from 'react';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import FunctionManagerTable from '../../../components/BasicData/FunctionManager/FunctionManagerTable';

const breadcrumbList = [{
  title: '首页',
  href: '#/',
}, {
  title: '功能管理员'
}];

export default class FunctionManagerList extends React.PureComponent {
  render() {
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title="功能管理员" breadcrumbList={breadcrumbList} />
        <FunctionManagerTable/>
      </div>
    );
  }
}
