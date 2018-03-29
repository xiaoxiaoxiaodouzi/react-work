import React from 'react';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div style={{ margin: '-24px -24px 0' }} className='page-header-layout'>
    {top}
    <PageHeader key="pageheader" {...restProps}  />
    {children ? <div className='content'>{children}</div> : null}
  </div>
);
