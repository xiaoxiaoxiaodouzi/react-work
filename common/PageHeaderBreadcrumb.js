import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import {BreadcrumbTitle} from './SimpleComponents'



class PageHeaderBreadcrumb extends React.PureComponent{
  static propTypes = {
    //面包屑数组[{name:'首页',url:'/'}]
    breadcrumbList:PropTypes.array.isRequired
  }
 
  render(){
    return (
      // <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title={BreadcrumbTitle(this.props.breadcrumbList)} action={this.props.action}/>
      // </div>
    )
  }
}

export default PageHeaderBreadcrumb;