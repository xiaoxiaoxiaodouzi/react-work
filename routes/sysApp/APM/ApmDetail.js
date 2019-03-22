import React from 'react';
import { PageHeader, Card } from 'antd';
import { breadcrumbItemRender } from '../../../common/SimpleComponents';

export default function ApmDetail(props){
  const breadcrumbList=[
    {title: '平台管理'},
    {title: '系统设置',href:'/setting/syssetting'},
    {title: '平台引擎',href:'/setting/syssetting/platform'},
    {title: '资源监控'}
  ];
  
  return (
    <div style={{ margin: '-24px -24px 0' }}>
      <PageHeader title='资源监控' breadcrumb={{ routes:breadcrumbList ,itemRender:breadcrumbItemRender}}>
      提供应用性能监控能力
      </PageHeader>
      <Card style={{margin:24,minHeight:window.innerHeight-305}}>
        <h1 style={{color:'gray'}}>敬请期待...</h1>
      </Card>
    </div>
  )
}