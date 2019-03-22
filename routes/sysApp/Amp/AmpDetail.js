import React from 'react';
import { PageHeader, Card } from 'antd';
import { breadcrumbItemRender } from '../../../common/SimpleComponents';

export default function AmpDetail(props){
  const breadcrumbList=[
    {title: '平台管理'},
    {title: '系统设置',href:'/setting/syssetting'},
    {title: '平台引擎',href:'/setting/syssetting/platform'},
    {title: '应用管理平台'}
  ];
  
  return (
    <div style={{ margin: '-24px -24px 0' }}>
      <PageHeader title='应用管理平台' breadcrumb={{ routes:breadcrumbList ,itemRender:breadcrumbItemRender}}>
        包含平台及所有应用的部署、管理、运维与运营的功能界面
      </PageHeader>
      <Card style={{margin:24,minHeight:window.innerHeight-305}}>
        <h1 style={{color:'gray'}}>敬请期待...</h1>
      </Card>
    </div>
  )
}