import C2Fetch from '../utils/Fetch';
import {base} from './base';
import constants from './constants'

let proxy = 'proxy/';
//获取集群信息
export function allClusterInfo(){
  const url=proxy+`aip/v1/clustermonitor/clusterinfo`;
  return C2Fetch.get(url,null,'获取集群信息出错');
}
//获取入口配置
export function getClusterNode(nodeName){
  const url=proxy+`/aip/v1/clustermonitor/clusterinfo/nodedetail/${nodeName}`;
  return C2Fetch.get(url,null,'获取入口配置信息出错');
}

export function getClusterInfoByTenant(){
  // /aip/v1/clustermonitor/{tenant}/clusterinfo
  const url=proxy+`aip/v1/clustermonitor/clusterinfo/${base.tenant}`;
  return C2Fetch.get(url,null,'获取租户下的集群信息出错');
}
//获取应用数目统计
export function getAppCount(params,headers){
  const url=proxy+`monit/v2/appcount`;
  return C2Fetch.get(url,params,null,headers);
}

//获取服务数目统计
export function getServiceCount(params,headers){
  const url=proxy+`monit/v2/servicecount`;
  return C2Fetch.get(url,params,null,headers);
}
//获取用户数目统计
export function getUserCount(tenant){
  const url=proxy+`tp/v1/tenants/${tenant}/usercount`;
  return C2Fetch.get(url,null,null);
}

//获取集群下应用数目统计
export function getAppCountCluster(params){
  const url=proxy+`monit/v2/appcount`;
  return C2Fetch.get(url,params,null);
}

//获取服务数目统计 tenant appId
export function tenantsNodes(params){
  const url=proxy+`cce/v1/tenants/nodes`;
  return C2Fetch.get(url,params,'获取租户节点信息出错');
}
//获取网关应用
export function getApigatewayApp(envCode){
  const manageTenant = base.configs[constants.CONFIG_KEY.MANAGE_TENANT_CODE]
  const url=proxy+`cce/v1/tenants/${manageTenant}/applications`;
  let params = {appType:'apigateway',env:envCode};
  return C2Fetch.get(url,params,"获取网关应用出错");
}
//获取应用资源监控数据
export function getAppMonit(appCode){
  const manageTenant = base.configs[constants.CONFIG_KEY.MANAGE_TENANT_CODE]
  const url=proxy+`aip/v1/clustermonitor/tenant/${manageTenant}/apps/${appCode}`;
  return C2Fetch.get(url,null,"获取应用资源使用情况出错");
}
//获取服务调用次数统计
export function getServicecalltimes(params,header){
  params.tenant = base.configs[constants.CONFIG_KEY.MANAGE_TENANT_CODE];
  const url=proxy+`monit/v1/servicecalltimes`;
  return C2Fetch.get(url,params,'获取服务调用次数统计出错',header);
}

//获取服务平均响应时间统计
export function getServiceavgtimes(params,header){
  const url=proxy+`monit/v1/serviceavgtimes`;
  return C2Fetch.get(url,params,false,header);
}
//获取服务报错次数统计
export function getServiceerrortimes(params){
  const url=proxy+`monit/v1/serviceerrortimes`;
  return C2Fetch.get(url,params,false);
}
//获取应用访问量和用户数
export function appPvUv(params){
  const url=proxy+`monit/v1/appuvpv`;
  return C2Fetch.get(url,params,'获取应用访问量和用户数出错');
}