import React from 'react';
// import AppRoute from "./AppRoutes/AppRoute";
// import GateWay from "./GateWay/GateWay";
// import SpringCloud from "./SpringCloud/SpringCloud";
import { Redirect } from 'react-router-dom';
// import AmpDetail from './Amp/AmpDetail';
// import CceDetail from './Cce/CceDetail';
// import CepGatewayDetail from './CepGateway/CepGatewayDetail';
// import MonitorDetail from './Monitor/MonitorDetail';
// import LogDetail from './Log/LogDetail';
// import ApmDetail from './APM/ApmDetail';

export default function SysAppRoute(props) {
  const env = props.match.params.env;
  const code = props.match.params.code;
  // if (env === 'cep') {
  //   if (code === 'amp') return <AmpDetail />
  //   if (code === 'cce') return <CceDetail />
  //   if (code === 'apigateway') return <CepGatewayDetail />
  //   if (code === 'monitor') return <MonitorDetail />
  //   if (code === 'log') return <LogDetail />
  //   if (code === 'apm') return <ApmDetail />
  // } else {
  //   if (code === 'ams') return <Redirect to='/apps/0' />
  //   if (code === 'route') return <AppRoute {...props}/>
  //   if (code === 'apigateway') return <GateWay {...props} />
  //   if (code === 'spring') return <SpringCloud {...props} />
  // }
  if (env === 'cep') {
    if (code === 'amp') return <Redirect to='/apps/4' />
    if (code === 'cce') return <Redirect to='/apps/6' />
    if (code === 'apigateway') return <Redirect to='/apps/apigateway' />
    if (code === 'monitor') return <Redirect to='/apps/monitor' />
    if (code === 'log') return <Redirect to='/apps/log' />
    if (code === 'apm') return <Redirect to='/apps/apm' />
  } else {
    if (code === 'ams') return <Redirect to='/apps/0' />
    if (code === 'route') return <Redirect to='/apps/toute' />
    if (code === 'apigateway') return <Redirect to='/apps/apigateway' />
  }
  return <Redirect to='/apps/4' />
}