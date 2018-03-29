import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Button } from 'antd';
import { queryApp } from '../../services/apps'
import {AppTable,AppState} from '../../components/Application/AppList'

//面包屑
const breadcrumbList = [{
  title: '首页',
  href: '#/',
},{
  title: '应用列表'
}];

class AppList extends React.Component {
  
  render() {
    console.log(this.props);
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title="应用列表" breadcrumbList={breadcrumbList} />
        <AppState normal="25" warm="0" abnormal="0" />
        <AppTable tenant={this.props.tenant} environment={this.props.environment}/>
      </div>
    );
  }
}

export default AppList;