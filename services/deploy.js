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
  return C2Fetch.post(url,bodyParams,null,false);
}
//修改容器自定义配置文件
export function putConfigs(application,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/configMap`;
  return C2Fetch.post(url,bodyParams,null,false);
}
//新增容器网络配置
export function addNetworkConfig(application,container,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/ports`;
  //return C2Fetch.post(url,bodyParams,null,"新增容器网络配置出错！");
  return C2Fetch.post(url,bodyParams,null,false);
}
//清空容器网络配置
export function deleteNetworkConfig(application,container,port,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/ports/${port}`;
  //return C2Fetch.put(url,bodyParams,null,"删除容器网络配置出错！");
  return C2Fetch.put(url,bodyParams,null,false);
}
//获取可挂载存储卷信息
export function queryMountableVolumes(){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes?mountable=true`;
  return C2Fetch.get(url,null,"获取可挂载存储卷信息出错！");
}

//删除存储卷
export function deleteVolumes(volume) {
  const url = proxy + `cce/v1/tenants/${base.tenant}/volumes/${volume}`;
  return C2Fetch.delete(url, null, "删除存储卷信息出错！");
}
//获取存储卷信息
export function queryAllVolumes(params){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes`;
  return C2Fetch.get(url,params,"获取存储卷信息出错！");
}
export function createVolumes(bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes`;
  return C2Fetch.post(url,bodyParams,null,"创建存储卷出错！");
}
//cce/v1/tenants/develop/volumes/ttt?recover=true
export function recoverVolumes(volume){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes/${volume}`;
  return C2Fetch.put(url,null,{recover:true},"恢复存储卷出错！");
}
export function deleteVolumesImmediately(volume) {
  const url = proxy + `cce/v1/tenants/${base.tenant}/volumes/${volume}/immediately`;
  return C2Fetch.delete(url, null, "彻底删除存储卷信息出错！");
}

//获取应用的环境变量
export function queryEnvs(application,container){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs`;
  return C2Fetch.get(url,null,"获取应用的环境变量出错！");
}
//添加应用的环境变量
export function addEnvs(application,container,params){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs`;
  return C2Fetch.post(url,params,null,false);
}
//批量添加应用的环境变量
export function batchAddEnvs(application,container,params){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appbatchenvs`;
  return C2Fetch.post(url,params,null,false);
}
//查询应用环境变量key是否存在

export function existEnvs(application, container, env) {
  const url = proxy + `/cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${env}`;
  return C2Fetch.get(url, null, "查询应用环境变量key是否存在出错！");
}

//删除应用的环境变量
export function deleteEnvs(application,container,key){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${key}`;
  return C2Fetch.delete(url,null,false);
}
//修改应用的环境变量
export function editEnvs(application,container,params,key){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${key}`;
  return C2Fetch.put(url,params,null,false);
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
  return C2Fetch.post(url,params,null,false);
}
//查询容器版本信息
export function queryImageVersions(tenant,artifact,params){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant+'/'+artifact +'/manifests',params,"获取镜像版本数据出错！");
}
//proxy/cce/v1/tenants/develop/applications/testtsw2/containers/ttt/probe
export function changeProbe(application,container,params){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/probe`;
  return C2Fetch.post(url,params,null,'修改健康检查参数失败');
}
//查询aip应用列表
export function queryAppAIP(code){
  return C2Fetch.get(proxy+`aip/v1/apps?code=${code}`,null,"获取应用列表数据出错！");
}