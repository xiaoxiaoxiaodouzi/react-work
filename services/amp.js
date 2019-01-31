import C2Fetch from '../utils/Fetch';
import {base} from './base'

export function addRouteTempate(routeTemplate) {
  return C2Fetch.post('amp/v1/routetemplates', routeTemplate,null, "新增路由模版出错！");
}

export function updateRouteTempate(id,routeTemplate) {
  return C2Fetch.post(`amp/v1/routetemplates/${id}`, routeTemplate,null, "更新路由模版出错！");
}

export function deleteRouteTempate(id) {
  return C2Fetch.delete(`amp/v1/routetemplates/${id}`,null, "删除路由模版出错！");
}

export function getRouteTemplate(){
  const url = 'amp/v1/routetemplates';
  return C2Fetch.get(url,{environmentId:base.currentEnvironment.id},'查询路由模板出错');
}

//获取域名列表
export function getRoutersList(params) {
  const url = `amp/v1/routers`
  return C2Fetch.get(url, params, '获取域名列表出错')
}

//添加域名
export function addRouters(bodyParams) {
  const url = `amp/v1/routers`
  return C2Fetch.post(url, bodyParams, null, false)
}

//修改域名
export function updateRouters(code, bodyParams) {
  const url = `amp/v1/routers/${code}`
  return C2Fetch.post(url, bodyParams, null, false)
}
//删除域名
export function deleteRouters(id) {
  const url = `amp/v1/routers/${id}`
  return C2Fetch.delete(url, null, '修改域名出错')
}

//获取应用的域名列表
export function getRouters(code) {
  const url = `amp/v1/routers/${code}`
  return C2Fetch.get(url, null, '获取域名列表出错')
}

//获取集群
export function getupstream(appCode){
  const url =`amp/v1/upstreams/${appCode}`
  return C2Fetch.get(url,null,'获取集群失败')
}

//添加、修改、删除集群
export function doUpstream(upstream,bodyParams,queryParams){
  const url =`amp/v1/upstreams/${upstream}`
  return C2Fetch.post(url,bodyParams,queryParams,'添加集群失败')
}


//删除应用UPSTREAM
export function deleteUpstream(upstreamCode){
  const url=`amp/v1/upstreams/${upstreamCode}`;
  return C2Fetch.delete(url,null,false);
 }

 //获取所有环境
export function queryAllEnvs(){
  const url = `amp/v1/envs`;
  return C2Fetch.get(url,null,"获取容器基本配置信息出错！");
}



//获取指定环境下的租户
export function queryTenantByEnv(envId){
  const url=`amp/v1/envtenants`;
  return C2Fetch.get(url,{environmentId:envId},'获取环境下的租户失败');
}

export function deleteEnvTenant(id){
  const url = `amp/v1/envtenants/${id}`;
  return C2Fetch.delete(url,null,'删除环境下的所属租户失败');
}
export function addEnvTenants(envTenants){
  const url = `amp/v1/envtenants`;
  return C2Fetch.post(url,envTenants,null,'新增环境下的所属租户失败');
}
//获取指定环境
export function queryEnvById(id){
  const url = `amp/v1/envs/${id}`;
  return C2Fetch.get(url,null,"获取指定环境信息出错！");
}
//添加环境
export function addEnv(params){
  const url = `amp/v1/envs`;
  return C2Fetch.post(url,params,null,"添加环境出错！");
}
//删除指定环境
export function deleteEnv(id){
  const url = `amp/v1/envs/${id}`;
  return C2Fetch.delete(url,null,"删除指定环境出错！");
}
//修改指定环境
export function updateEnv(id,params){
  const url = `amp/v1/envs/${id}`;
  return C2Fetch.post(url,params,null,"修改指定环境出错！");
}

//获取全局系统设置
export function getConfigs(){
  const url =`amp/v1/configs`;
  return C2Fetch.get(url,null,'获取系统设置失败')
}

//修改全局动态路由
export function updateConfigs(bodyParams){
  const url = `amp/v1/configs`;
  return C2Fetch.post(url, bodyParams,null, '修改设置失败')
}

//上传文件
export function uploadIcon(file){
  const url = `amp/v1/files`;
  return C2Fetch.postFile(url,file,{},'上传图片失败');
}
export function getPluginConfig(params){
  const url = `amp/v1/pluginconfig`;
  return C2Fetch.get(url, params, '获取匿名访问地址失败')
}
export function ssorouterplugin(params){
  const url = `amp/v1/ssorouterplugin`;
  return C2Fetch.post(url, {},params, '获取匿名访问地址失败')
}
export function deleteSsorouterplugin(params){
  const url = `amp/v1/ssorouterplugin`;
  return C2Fetch.delete(url, params, '删除路由认证插件失败')
}

