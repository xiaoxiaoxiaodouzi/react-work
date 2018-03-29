import React from 'react';
import {Icon} from 'antd';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
const copyright = <div>Copyright <Icon type="copyright" /> 2018 湖南科创信息技术股份有限公司</div>;
export default () => {
  return (
    <GlobalFooter copyright={copyright}></GlobalFooter>
  );
};