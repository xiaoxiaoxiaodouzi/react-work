import C2Fetch from '../utils/Fetch';
import {base} from './base'

let proxy = 'proxy/';
//查询aip应用列表
export function queryAppAIP(params){
  return C2Fetch.get(proxy+'aip/v1/apps',params,"获取应用列表数据出错！");
}
//查询cce应用列表
export function queryAppCCE(params){
  return C2Fetch.get(proxy+'cce/v1/tenants/'+base.tenant+'/applications',params,"获取应用列表数据出错！");
}
//查询镜像列表
export function queryImages(tenant,params){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant,params,"获取镜像列表数据出错！");
}
//查询集群列表
export function queryClusters(){
  return C2Fetch.get(proxy+'cce/v1/tenants/'+base.tenant+'/clusters',null,"获取集群数据出错！");
}
//查询镜像版本列表
export function queryImageVersions(tenant,artifact,params){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant+'/'+artifact +'/manifests',params,"获取镜像版本数据出错！");
}
//查询镜像的最新版本列表
export function queryLatestVersion(tenant,artifact){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant+'/'+artifact +'/latest',null,"获取最新的镜像版本出错！");
}
//查询镜像地址
export function queryImagePath(){
  return C2Fetch.get(proxy+'cce/v1/harbor/url',null,"获取镜像地址数据出错！");
}

//添加应用基本信息
export function addAppBasicInfo(bodyParams){
  return C2Fetch.post(proxy+'aip/v1/apps',bodyParams,null,"应用管理添加应用失败");
}

//删除应用基本信息
export function deleteAppBasicInfo(appId){
  return C2Fetch.delete(proxy+'aip/v1/apps/'+appId,null,true);
}

//添加应用部署信息
export function addAppDeployInfo(bodyParams){
  return C2Fetch.post(proxy+'cce/v1/tenants/'+base.tenant+'/applications',bodyParams,null,false);
}

//查询应用的所有标签
export function queryTags(params){
  return C2Fetch.get(proxy+'aip/v1/tags',params,"查询应用所有标签出错！");
}

//查询镜像分类
export function queryCategorys(){
  return C2Fetch.get(proxy+'cce/v1/imagecategorys',null,"查询镜像分类数据出错！");
}

//校验应用id和name是否存在 
export function checkIdName(bodyParams,queryParams){
  return C2Fetch.post(proxy+'aip/v1/apps/1/checkexist',bodyParams,queryParams,"校验失败！");
}

//校验应用code是否存在 
export function checkCodeName(code) {
  return C2Fetch.get(proxy + `cce/v1/tenants/${base.tenant}/applications/${code}/id`,null, "编码重复！");
}

//查询应用信息 
export function queryAppInfo(application){
  return C2Fetch.get(proxy+'cce/v1/tenants/'+base.tenant+'/applications/'+application,null,"获取应用信息失败");
}
//查询应用信息 
export function queryAppCount(params){
  return C2Fetch.get(proxy+'/aip/v2/appcount',params,"获取应用信息失败");
}
