import React from 'react';
import { Spin } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
/* 图表loading组件，用于显示加载图表数据
   props.loading loading状态
   props.loadingText loading数据文本
   props.children 数据加载完成后显示的图表
   props.exception 数据加载完成后是否有数据
   props.exceptionText 数据加载异常显示文本
*/

export default (props) => {
  if(props.loading){
    return (
      <div style={{ textAlign: "center" }}>
        <Spin />
        <span>  {props.loadingText}数据加载中...</span>
      </div>
    )
  }else if(props.exception){
    return (
      <Exception 
        title={<span style={{fontSize:40}}>无数据</span>} 
        desc={props.exceptionText} 
        img="images/exception/404.svg" 
        actions={<div />} />
    )
  }else{
    return props.children;
  }
};