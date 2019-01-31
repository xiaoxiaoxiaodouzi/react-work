import React,{useState} from 'react';
import {Divider,Breadcrumb,Modal, Button } from 'antd';
import ErrorBoundary from './ErrorBoundary';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

export function BreadcrumbTitle(breadcrumbList){
  return (
  <Breadcrumb style={{marginTop:6,marginLeft:-18}}>
    <Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a",verticalAlign:"text-bottom"}}/>
    {breadcrumbList.map(crumb=><Breadcrumb.Item key={crumb.name}>{crumb.url?<a href={crumb.url}>{crumb.name}</a>:crumb.name}</Breadcrumb.Item>)}
  </Breadcrumb>
  )
}

export function GrafanaModal(props){
  const footer = (
    <Button onClick={props.onCancel}>关闭</Button>
  )
  return (
    <Modal visible={props.visible} title={props.title} width='85%' footer={footer} onCancel={props.onCancel} destroyOnClose={true} maskClosable={false} bodyStyle={{padding:0}}>
      <iframe title='Grafana' style={{border:0,height:420,width:'100%',marginBottom:-5}} src={props.url}></iframe>
    </Modal>
  )
}
/**
 *错误组件包装方法
 */
export function ErrorComponentCatch(Target){
  class Wrap extends React.Component {
    render() {
      return (
        <ErrorBoundary>
          <Target {...this.props} />
        </ErrorBoundary>
      )
    }
  }
  return Wrap;
}

export function AmpDoc(){
  const [md,setMd] = useState();
  if(md===undefined){
    const mdFile = require('../assets/doc.md');
    fetch(mdFile).then(response=>{
      response.text().then(md=>{
        setMd(md);
      })
    })
  }
  const DocMarkdown = styled(ReactMarkdown)`
    margin:24px;
  `;
  return <DocMarkdown source={md} escapeHtml={false}/>
}