import C2Fetch from '../utils/Fetch';
import {base} from './base';
let proxy = 'proxy/';
//查询容器基本配置信息，tenants=develop,application=apps-integration
export function queryBaseConfig(application){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/base`;
  return C2Fetch.get(url,null,"获取容器基本配置信息出错！");
}
//查询获取容器网络配置信息 tenants=develop,application=apps-integration
export function queryNetwork(application,queryParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/network`;
  return C2Fetch.get(url,queryParams,"获取容器网络配置信息出错！");
}
//查询获取应用的路由配置 tenants=develop,application=apps-integration
export function queryRoutes(application){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/routes`;
  return C2Fetch.get(url,null,"获取应用的路由配置出错！");
}
//更新容器基本配置信息 tenants=develop,application=apps-integration,container=redis
//type为以下值时分别完成对应操作,env:更新环境变量,volume:更新存储卷（绑定/解绑/修改）,image：更新版本, resource：修改配额
export function putBaseConfig(application,container,type,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/${type}`;
  return C2Fetch.post(url,bodyParams,null,"修改容器基本配置出错！");
}
//修改容器自定义配置文件
export function putConfigs(application,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/configMap`;
  return C2Fetch.post(url,bodyParams,null,"修改容器自定义配置文件出错！");
}
//新增容器网络配置
export function addNetworkConfig(application,container,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/ports`;
  return C2Fetch.post(url,bodyParams,null,"新增容器网络配置出错！");
}
//清空容器网络配置
export function deleteNetworkConfig(application,container,port,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/ports/${port}`;
  return C2Fetch.put(url,bodyParams,null,"删除容器网络配置出错！");
}
//获取可挂载存储卷信息
export function queryMountableVolumes(){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes?mountable=true`;
  return C2Fetch.get(url,null,"获取可挂载存储卷信息出错！");
}
export function createVolumes(bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes`;
  return C2Fetch.post(url,bodyParams,null,"创建存储卷出错！");
}
//获取应用的环境变量
export function queryEnvs(application,container){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs`;
  return C2Fetch.get(url,null,"获取应用的环境变量出错！");
}
//添加应用的环境变量
export function addEnvs(application,container,params){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs`;
  return C2Fetch.post(url,params,null,"添加应用的环境变量出错！");
}
//删除应用的环境变量
export function deleteEnvs(application,container,key){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${key}`;
  return C2Fetch.delete(url,null,"删除应用的环境变量出错！");
}
//修改应用的环境变量
export function editEnvs(application,container,params,key){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${key}`;
  return C2Fetch.put(url,params,null,"修改应用的环境变量出错！");
}
///aip/v1/apps/{appId}/middlewares
export function getMiddleware(appId){
  const url = proxy+`aip/v1/apps/${appId}/middlewares`;
  return C2Fetch.get(url,null,"获取应用关联中间件出错！");
} 
/* {
  "id": "string",
  "appId": "string",
  "middlewareId": "string"
} */
export function addMiddleware(appId,params){
  const url = proxy+`aip/v1/apps/${appId}/middlewares`;
  return C2Fetch.post(url,params,null,"应用关联中间件出错！");
}
export function deleteMiddleware(appId,middlewareId){
  const url = proxy+`aip/v1/apps/${appId}/middlewares?middlewareid=${middlewareId}`;
  return C2Fetch.delete(url,null,"应用取消关联中间件出错！");
}
//获取容器配置信息
export function queryContainerConfig(){
  const url = proxy+`cce/v2/quota`;
  return C2Fetch.get(url,null,"获取容器配置信息出错！");
}
//撤销环境变量修改
export function resetEnv(application,container,envId,params){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/resetenv?envId=${envId}`;
  return C2Fetch.post(url,params,null,"撤销环境变量修改出错！");
}
//查询容器版本信息
export function queryImageVersions(tenant,artifact,params){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant+'/'+artifact +'/manifests',params,"获取镜像版本数据出错！");
}