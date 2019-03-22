import React from 'react';
import { PageHeader, Card } from 'antd';
import { breadcrumbItemRender } from '../../../common/SimpleComponents';

export default function CepGatewayDetail(props){
  const breadcrumbList=[
    {title: '平台管理'},
    {title: '系统设置',href:'/setting/syssetting'},
    {title: '平台引擎',href:'/setting/syssetting/platform'},
    {title: '服务网关'}
  ];
  
  return (
    <div style={{ margin: '-24px -24px 0' }}>
      <PageHeader title='服务网关' breadcrumb={{ routes:breadcrumbList ,itemRender:breadcrumbItemRender}}>
      包含平台及所有应用的微服务管理
      </PageHeader>
      <Card style={{margin:24,minHeight:window.innerHeight-305}}>
        <h1 style={{color:'gray'}}>敬请期待...</h1>
      </Card>
    </div>
  )
}