import React from "react";
import { Route} from 'react-router-dom';
import {routerLog} from '../services/log';
import {base} from '../services/base'

/**
 * 路由拦截器
 */
export default class InterceptedRoute extends React.Component {
  componentRender = (props)=>{
    if(!base.safeMode){
      //发送路由访问路由
      routerLog(props.location.pathname);
    }
    return <this.props.component {...props} {...this.props.params}/>;
  }
  render() {
    const {link,exact=false} = this.props;
    return <Route path={link} render={this.componentRender} exact={exact}/>;
  }
}
