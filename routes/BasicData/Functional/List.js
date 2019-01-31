import React from 'react'
import FunctionalList from '../../../components/BasicData/Functional/FunctionalList';
import PageHeaderBreadcrumb from '../../../common/PageHeaderBreadcrumb';
import GlobalEnvironmentChange from '../../../components/GlobalEnvironmentChange'
import {Card} from 'antd'

export default class List extends React.Component {
  render() {
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'基础数据'},{name:'功能列表'}]} action={<GlobalEnvironmentChange/>}/>
        <Card bordered={false} style={{ margin: '24px 24px 0' }} >
        <FunctionalList />
        </Card>
      </div>
    );
  }
}
