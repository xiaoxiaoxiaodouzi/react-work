import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import {Divider,Breadcrumb } from 'antd';



class PageHeaderBreadcrumb extends React.PureComponent{

  static propTypes = {
    //面包屑数组[{name:'首页',url:'/'}]
    breadcrumbList:PropTypes.array.isRequired
  }
 
  render(){
    let breadcrumTitle = <Breadcrumb style={{marginTop:6}}>
      <Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a",verticalAlign:"text-bottom"}}/>
      {this.props.breadcrumbList.map(crumb=><Breadcrumb.Item key={crumb.name}>{crumb.url?<a href={crumb.url}>{crumb.name}</a>:crumb.name}</Breadcrumb.Item>)}
    </Breadcrumb>;
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title={breadcrumTitle} action={this.props.action}/>
      </div>
    )
  }
}

export default PageHeaderBreadcrumb;