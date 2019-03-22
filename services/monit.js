import C2Fetch from '../utils/Fetch';
import { base } from './base';
let proxy = 'proxy/';
  
//获取应用访问量和用户数
export function appPvUv(params){
  const url=proxy+`monit/v1/app/uvpv`;
  return C2Fetch.get(url,params,'获取应用访问量和用户数出错');
}

//应用在线人数
export function appOnlineNum(params){
  const url=proxy+`monit/v1/apponlinenum`;
  return C2Fetch.get(url,params,'获取应用在线人数出错');
}

//应用最高在线人数
export function appHighestOnlineNum(params){
  const url=proxy+`monit/v1/apphighestonlinenum`;
  return C2Fetch.get(url,params,'获取应用最高在线人数出错');
}

//应用下功能访问统计，st开始时间，et结束时间
export function appVisitNum(params){
  const url=proxy+`monit/v1/appvisitnum`;
  return C2Fetch.get(url,params,'获取应用下功能访问统计出错');
}
//查询应用所有服务的平均响应时间
export function getAvgTime(appid) {
  const url = proxy +`monit/v1/app/statistics/?appIds=${appid}`
  return C2Fetch.get(url,{}, '查询应用所有服务的平均响应时间失败')
}

//获取集群信息
export function allClusterInfo(){
  const url=proxy+`monit/v1/simple/clusterinfo`;
  return C2Fetch.get(url,null,'获取集群信息出错');
}

//获取入口配置
export function getClusterNode(nodeName){
  const url=proxy+`monit/v1/clusterinfo/nodedetail/${nodeName}?tenant=${base.tenant}`;
  return C2Fetch.get(url,null,'获取入口配置信息出错');
}
  
export function getClusterInfoByTenant(){
  // /aip/v1/clustermonitor/{tenant}/clusterinfo
  const url=proxy+`monit/v1/simple/clusterinfo/${base.tenant}`;
  return C2Fetch.get(url,null,'获取租户下的集群信息出错');
}

//查询应用状态，env环境,tenant租户
export function getAppStatus(queryParams){
  const url = proxy + `monit/v1/appstatus`;
  //const url =  `http://mock.dev.c2cloud.cn/mock/5c3fed18dce6440021193e62/example/monit/v1/appstatus`
  return C2Fetch.get(url,queryParams,'查询应用状态失败！');
}

//根据根据应用code查询状态
export function getAppStatusByCode(codes){
  const url = proxy +  `monit/v1/appcodestatus`;
  //const url = `http://mock.dev.c2cloud.cn/mock/5c3fed18dce6440021193e62/example/monit/v1/statuscounts`
  return C2Fetch.get(url,{tenant:base.tenant,env:base.currentEnvironment.code,code:codes},false);
}

//根据应用状态获取应用code，返回字符数组
export function getAppCodeByStatus(status){
  const url = proxy + `monit/v1/appsbystutus`;
  return C2Fetch.get(url,{status:status,env:base.currentEnvironment.code},'根据状态获取应用失败！')
}

export function serviceavgtime(appId,params){
  const url = proxy + `monit/v1/apps/${appId}/serviceavgtime`;
  return C2Fetch.get(url,params,'查询应用下的服务平均响应市时长失败')
}

export function serviceerrornum(appId,params){
  const url = proxy + `monit/v1/apps/${appId}/serviceerrornum`;
  return C2Fetch.get(url,params,'查询应用下服务错误次数失败')
}
export function resourceusage(appId){
  const url = proxy + `monit/v1/apps/${appId}/resourceusage`;
  return C2Fetch.get(url,null,'查询应用下资源使用情况失败')
}
export function visitnum(appId,params){
  const url = proxy + `monit/v1/apps/${appId}/visitnum`;
  return C2Fetch.get(url,params,'查询应用下功能访问累计失败')
}
export function onlinenum(appId){
  const url = proxy + `monit/v1/apps/${appId}/onlinenum`;
  return C2Fetch.get(url,null,'查询应用在线人数失败')
}
export function highestonlinenum(appId){
  const url = proxy + `monit/v1/apps/${appId}/highestonlinenum`;
  return C2Fetch.get(url,null,'查询应用最高在线人数失败')
}

export function getClusterDetail(queryParams){
  const url=proxy+'monit/v2/clusters';
  return C2Fetch.get(url,queryParams,'查询集群信息失败')
}


  