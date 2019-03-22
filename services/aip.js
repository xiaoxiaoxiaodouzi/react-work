import C2Fetch from '../utils/Fetch';
import { base } from './base'
let proxy = 'proxy/';


//获得网关详情
export function getApiGatewayInfo(appid) {
  return C2Fetch.get(proxy + `aip/v1/apps/${appid}/key`, {}, "获取服务网关秘钥信息出错！");
}

//获得网关详情
export function getApiGatewayUrl() {
  return C2Fetch.get(proxy + `aip/v1/apigateway/urls`, {}, "获取服务网关地址信息出错！",{},true);
}

//获得应用列表
export function getAppsList() {
  return C2Fetch.get(proxy + `aip/v1/apps`, {}, "获取应用列表出错！");
}


//查询应用对外服务
export function getServicesApi(appId, apiId) {
  return C2Fetch.get(proxy + `aip/v1/groups/${appId}/services/${apiId}`, {}, "查询服务详情出错！");
}

//清空应用下的服务
export function clearAllApis(appId){
  return C2Fetch.delete(proxy + `aip/v2/services/${appId}`,{},'清空服务失败！');
}

//移除服务
export function removeServiceApi(appId, apiId) {
  return C2Fetch.delete(proxy + `aip/v1/groups/${appId}/services/${apiId}`, {}, "删除服务出错!");
}

//获得应用已获授权服务列表
export function getAccessibilityServicesApis(appId, page, rows, condition = {}) {
  var params = { page: page, rows: rows };
  if(condition){
      if(condition.nameorurl){
          var uri = condition.nameorurl;
          condition.nameorurl = encodeURI(uri);
      }
      Object.assign(params, condition);
  }
    
  return C2Fetch.get(proxy + `aip/v1/apikeys/${appId}/services`, params, "获取已授权服务列表信息出错！");
}

//获得应用待获授权服务列表
export function getUnAuthorizedServicesApis(appId, page, rows, condition = {}) {
  var params = { page: page, rows: rows, appId: appId };
  if(condition.nameorurl){
      var uri = condition.nameorurl;
      condition.nameorurl = encodeURI(uri);
  }
  Object.assign(params, condition);
  //获取所有没有授权给当前应用的api列表，用于服务授权对话框，path设计有点问题
  return C2Fetch.get(proxy + `aip/v1/servicegroups/${appId}/services`, params, "获取未授权服务列表信息出错！");
}

//批量添加应用服务授权
export function addAuthorizedServicesApis(appId, appIdsStr) {
  return C2Fetch.post(proxy + `aip/v1/apikeys/${appId}/services`, {}, { sid: appIdsStr }, "批量添加应用服务授权出错！");
}

//批量移除应用服务授权
export function removeAuthorizedServicesApis(appId, appIdsStr) {
  return C2Fetch.delete(proxy + `aip/v1/apikeys/${appId}/services/${appIdsStr}`, {}, "批量移除应用服务授权出错！");
}

//移除应用对外服务
export function removeServicesApis(appId, apiId) {
  return C2Fetch.delete(proxy + `aip/v1/groups/${appId}/services/${apiId}`, {}, "删除服务出错！");
}

//批量移除应用对外服务
export function removeServicesApisBatch(appId, apiIds) {
  return C2Fetch.delete(proxy + `aip/v1/groups/${appId}/services?ids=${apiIds}`, null, "删除服务出错！");
}


//重置网关Key
export function resetApiKey(appId) {
  return C2Fetch.put(proxy + `aip/v1/apikeys/${appId}/reset`, {}, {}, "重置网关KEY出错！");
}

//swagger导入解析
export function getSwaggerComparison(swaggerObj) {
  return C2Fetch.post(proxy + `aip/v1/import/parseswagger`, swaggerObj, {}, "获取Swagger比对结果失败！");
}

//拉取远程swagger
export function getRemoteSwagger(url) {
  return C2Fetch.get(proxy + `aip/v1/import/fetchswaggerjson`, { url: url }, "获取远程Swagger失败！");
}

//导入服务
export function addServers(appid, upstream, contents, json, mark) {
  return C2Fetch.post(proxy + `aip/v1/import/${appid}/services`, { contents: contents, json: json, mark: mark, upstream: upstream, tenant: base.tenant, appId: appid }, {}, "导入服务失败");
}

//同步服务查询
export function getSynServices(groupId){
  const url=proxy+`aip/v1/groups/${groupId}/sync`
  return C2Fetch.get(url,{},'同步服务查询出错！')
}

//同步服务
export function synServices(groupId,ids){
  const url=proxy+`aip/v1/groups/${groupId}/sync`
  return C2Fetch.put(url,{},{ids:ids},'同步服务失败')
}

//更新服务
export function updateServers(appid, contents, json) {
  return C2Fetch.post(proxy + `aip/v1/import/${appid}/updateservices`, { contents: contents, json: json }, {}, "更新服务失败");
}
export function addServerGroup(group) {
  return C2Fetch.post(proxy + `aip/v1/groups`, group, null, "添加应用失败");
}
export function delServerGroup(groupId) {
  return C2Fetch.delete(proxy + `aip/v1/groups/${groupId}`, null, "删除应用失败");
}
//获取服务标签
export function queryAppTags(appid) {
  let url = proxy + `aip/v1/groups/${appid}/tags`;
  return C2Fetch.get(url, null, "获取服务标签失败");
}
//aip/v1/groups/8vN2aFA0RtqghaPao28Rjw/tags/aaa
//创建服务标签
export function createTags(appid, tag) {
  let url = proxy + `aip/v1/groups/${appid}/tags/${tag}`;
  return C2Fetch.post(url, null, null, "创建服务标签失败");
}
//aip/v1/groups/8vN2aFA0RtqghaPao28Rjw/services?ctx=
//添加服务
export function addService(appid, params) {
  var service = params.service
  Object.assign(service,{tenant:base.tenant});//加入租户数据
  let url = proxy + `aip/v1/groups/${appid}/services`;
  return C2Fetch.post(url, params, null, "添加服务失败");
}
//获取应用应用失败
export function queryAllGroups(tenant) {
  let url = proxy + `aip/v2/groups?tenant=${tenant || base.tenant}`;

  return C2Fetch.get(url, null, "获取应用应用失败");
}

export function queryAllServices(groupId, page, rows, tagId, method, name, uri, tenant) {
  let params = {
      page,
      rows,
      method,
      name,
      uri: encodeURI(uri),
      tenant
  }
  if (tagId != null) {
      Object.assign(params, { tagId: tagId })
  }
  if (groupId != null) {
      Object.assign(params, { groupId: groupId })
  }
  let url = proxy + `aip/v2/services`;
  return C2Fetch.get(url, params, "获取应用应用失败");
}
//查看该服务被授权给了哪些应用应用
export function getApiGrationinfo(appid, apiid, page, rows, condition) {
  var params = { page: page, rows: rows };
  if (condition) {
      if(condition.nameorurl){
          var uri = condition.nameorurl;
          condition.nameorurl = encodeURI(uri);
      }
      Object.assign(params, condition);
  }
  let url = proxy + `aip/v1/groups/${appid}/services/${apiid}/grationapps`;
  return C2Fetch.get(url, params, "获取服务授权的应用失败");
}

//获取接口请求参数及响应状态码
export function getApiParameters(appid, apiId) {
  let url = proxy + `aip/v1/groups/${appid}/services/${apiId}/parameters`;
  return C2Fetch.get(url, {}, "获取服务请求参数及响应状态码失败");
}

//移除对应用的服务授权
export function removeAppServer(apiId, appid) {
  let url = proxy + `aip/v1/apikeys/services/${apiId}?apikeys=${appid}`;
  return C2Fetch.delete(url, {}, "移除应用服务授权失败");
}

//修改对应用的服务属性
export function changeApiProperty(appId, apiId, property) {
  let url = proxy + `aip/v1/groups/${appId}/services/${apiId}`;
  return C2Fetch.put(url, property, {}, "更改应用服务授权失败");
}

//创建服务标签
export function createTag(appId, tagName) {
  let url = proxy + `aip/v1/groups/${appId}/tags`;
  return C2Fetch.post(url, { name: tagName, desc: tagName }, {}, "创建服务标签失败");
}
//添加标签
export function addTag(appid, params) {
  let url = proxy + `aip/v1/groups/${appid}/tags`;
  return C2Fetch.post(url, params, null, "添加标签失败");
}

//aip/v1/apikeys/6366/apikeys?apikeyids=1,NzEhfQuiaQOm7ILaiaSU8hpQ
export function addAppsToServer(serverId, appIds) {
  const url = proxy + `aip/v1/apikeys/${serverId}/apikeys?apikeyids=${appIds}`;
  return C2Fetch.post(url, null, null, '服务授权给应用失败');
}

//获得应用详情
export function getAppInfo(appid) {
  return C2Fetch.get(proxy + 'aip/v1/apps/' + appid, {}, "获取应用信息出错！");
}

//修改应用属性
export function changeAppProperty(appid, property, value) {
  return C2Fetch.put(proxy + 'aip/v1/apps/' + appid, property, { type: 1 }, "修改应用名称出错！");
}

//获取应用管理用户 SYSTEM_MANAGER/BUSINESS_MANAGER/AUDIT_MANAGER
export function getAppManager(appid, type) {
  return C2Fetch.get(proxy + `aip/v1/apps/${appid}/manageroles/${type}/users`,{}, "获取应用管理用户信息出错！");
}

//获取应用管理用户 SYSTEM_MANAGER/BUSINESS_MANAGER/AUDIT_MANAGER
export function changeAppManager(appid, roleId, users) {
  return C2Fetch.put(proxy + `aip/v1/apps/${appid}/manageroles/${roleId}/users`, {}, { userIds: users }, "更新应用管理用户信息出错！");
}



//获得所有应用标签
export function getAppsTags() {
  return C2Fetch.get(proxy + `aip/v1/tags`, {tenant:base.tenant}, "获取应用标签出错！");
}

//创建标签
export function createAppTags(queryParam) {
  return C2Fetch.post(proxy + `aip/v1/tags`,[queryParam] , {}, "创建应用标签出错！");
}

//获取指定应用标签
export function getAppTags(appid) {
  return C2Fetch.get(proxy + `aip/v1/apps/${appid}/tags`, {}, "获取应用信息出错！");
}

//绑定应用应用标签
export function addAppTag(appid, tag) {
  return C2Fetch.post(proxy + `aip/v1/apps/${appid}/tags`, [tag], {}, "添加应用标签出错！");
}

//移除指定应用标签
export function removeAppTag(appid, tag) {
  return C2Fetch.delete(proxy + `aip/v1/apps/${appid}/tags`, { tagIds: [tag] }, "移除应用标签出错！");
}
//查询aip应用列表
export function queryAppAIP(params,header){
  //if(!envId) envId=base.environment;
  return C2Fetch.get(proxy+'aip/v1/apps',params,"获取应用列表数据出错！",header);
}
  
  
//添加应用基本信息
export function addAppBasicInfo(bodyParams,header){
  return C2Fetch.post(proxy+'aip/v1/apps',bodyParams,null,true,header);
}
  
//删除应用基本信息
export function deleteAppBasicInfo(appId){
  return C2Fetch.delete(proxy+'aip/v1/apps/'+appId,null,true);
}
  
  
  
//查询应用的所有标签
export function queryTags(params,header){
  return C2Fetch.get(proxy+'aip/v1/tags',params,"查询应用所有标签出错！",header);
}
  
  
//校验应用id和name是否存在 
export function checkIdName(bodyParams,queryParams,header){
  return C2Fetch.post(proxy+'aip/v1/checkappexist',bodyParams,queryParams,"校验失败！",header);
}
  
  
// //查询应用信息 
// export function queryAppCount(params){
//   return C2Fetch.get(proxy+'monit/v1/appcount',params,"获取应用信息失败");
// }


export function getChart(){
  const url=proxy+`api/charts/amp`
  return C2Fetch.get(url,{},'获取chart列表失败',{'AMP-ENV-ID':1})
}
//查询应用详情（相同方法）
// export function getApp(appid){
//   const url=proxy+`aip/v1/apps/${appid}`;
//   return C2Fetch.get(url,null,false);
// }


  

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
//获取域名所属应用信息
export function getRouter(routerId){
  const url =`proxy/aip/v1/apps`
  return C2Fetch.get(url,routerId,'获取域名所属应用信息失败')
}
//查询资源
export function getResources(queryParam){
	const url=proxy+`aip/v1/resources`
	return C2Fetch.get(url,queryParam,'查询资源出错！')
}

//查询子资源
export function getResource(appId,queryParams){
	const url=proxy+`aip/v1/apps/${appId}/resources`
	return C2Fetch.get(url,queryParams,'查询资源出错！')
} 

//查询应用下的功能
export function getResourceTree(appId,queryParams){
	const url=proxy+`aip/v1/apps/${appId}/resourcetree`
	return C2Fetch.get(url,queryParams,'查询资源出错！')
}

//查询所有功能的标签
export function getAllFunctionTags(queryParams){
	const url = proxy +`aip/v1/resourcetags`;
	queryParams.tenant = base.tenant;
	return C2Fetch.get(url,queryParams,'查询功能标签出错');
}

//查询功能下的标签
export function getFunctionTags(appId,resourceId ,queryParams){
	const url=proxy+`aip/v1/apps/${appId}/resources/${resourceId}/tags`;
	queryParams.tenant = base.tenant;
	return C2Fetch.get(url,queryParams,'查询功能标签出错');
}

//创建功能标签 bodyParam:标签数组
export function postFunctionTags(appId,resourceId,bodyParam){
	const url = proxy+`aip/v1/apps/${appId}/resources/${resourceId}/tags`;
	return C2Fetch.post(url,bodyParam,{tenant:base.tenant},'创建功能标签失败！');
}

//删除功能标签 params包括tagIds、tenant
export function deleteFunctionTags(appId,resourceId,params){
	const url =proxy + `aip/v1/apps/${appId}/resources/${resourceId}/tags`;
	params.tenant = base.tenant;
	return C2Fetch.delete(url,params,"删除功能标签失败！");

}

//查询资源详情
export function getResourceById(appId,id,queryParams){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}`
	return C2Fetch.get(url,queryParams,'查询资源出错！')
}

//查询资源下的用户集合
export function getResourceUserCollections(appId,id){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/usercollections`
	return C2Fetch.get(url,{},'修改资源出错！')
}

//修改资源
export function updateResource(appId,id,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}`
	return C2Fetch.post(url,bodyParam,{},'修改资源出错！')
}

//新增资源
export function addResource(appId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/resources`
	return C2Fetch.post(url,bodyParam,{},'新增资源出错')
}


/* //查询用户集合下面的用户
export function getUsersCollection(queryParam){
	const url=proxy+`/uop/v1/usercollection/users`;
	return C2Fetch.get(url,queryParam,'获取用户集合失败')
} */

//查询角色下的用户
export function getUsersByRoleId(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/users`;
	return C2Fetch.get(url,queryParam,'查询角色下的用户失败')
}

//查询角色资源数据
export function getRoleResources(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources`
	return C2Fetch.get(url,queryParam,'查询角色资源数据出错！')
}

//批量查询角色下面的资源数据
export function getRoleListResources(queryParam){
	const url=proxy+`aip/v1/roleresources`;
	return C2Fetch.get(url,queryParam,'获取角色下面的资源出错！')
}
//删除功能/aip/v1/apps/{appId}/resources/{id}
export function deleteFunctional(appId,id){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}`
	return C2Fetch.delete(url,{},'删除功能失败！')
}
// 查询权限资源的用户信息
export function getResourceUser(appId,id,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/users`
	return C2Fetch.get(url,queryParam,'查询权限资源的用户信息出错')
}

//查询角色下已授权用户集合 aip/v1/apps/{appId}/roles/{roleId}/usercollections
export function getRoleUserCollection(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections`
	return C2Fetch.get(url,queryParam,'查询角色下已授权用户集合数据出错！')
}

// 替换用户集合
export function updateUserCollection(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections`
	return C2Fetch.put(url,bodyParam,{},'角色授权用户集合出错')
}
///aip/v1/apps/{appId}/roles/{roleId}/usercollections/{id}
export function deleteUserCollection(appId,roleId,id){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections/${id}`
	return C2Fetch.delete(url,{},'角色取消授权用户集合出错')
}


export function updateRoleResource(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources`
	return C2Fetch.put(url,bodyParam,{},'角色关联资源出错')
}
//查询资源关联的角色信息 aip/v1/apps/{appId}/roles/{roleId}/usercollections
export function getResourceRole(appId,id,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/roles`
	return C2Fetch.get(url,queryParam,'查询资源关联的角色信息出错！')
}

//移除资源关联的角色
export function deleteResourceRole(appId,id,roleId){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/roles/${roleId}`
	return C2Fetch.delete(url,{},'移除资源关联的角色失败')
} 


//角色授权管理员用户集合
export function roleManagerUsers(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/managers`
	let data = C2Fetch.put(url,bodyParam,{},'角色授权管理员用户集合出错');
	return data;
}

//角色授权管理员用户集合
export function getRoleManagerUsers(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/managers`
	return C2Fetch.get(url,queryParam,'角色授权管理员用户集合出错')
}

///aip/v1/apps/{appId}/roles/{roleId}/managers/{id}
export function deleteRoleManager(appId,roleId,id){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/managers/${id}`
	return C2Fetch.delete(url,{},'删除角色授权管理员用户集合出错')
}


//导入资源预览接口
// export function importPreviewResources(appId,file){
// 	const url = proxy + `aip/v1/apps/${appId}/resources/preview`;
// 	return C2Fetch.postFile(url,file);
// }

//导入应用权限资源
// export function importResources(appId){
// 	const url = proxy + `aip/v1/apps/${appId}/resource`;
// 	return C2Fetch.download(url);
// }

// //导出应用权限资源
// export function exportResources(appId,fileName){
// 	const url = proxy + `aip/v1/apps/${appId}/resources/export`;
// 	return C2Fetch.download(url,fileName);
// }

//导入应用角色
export function importRoles(appId,bodyParams){
	const url = proxy + `aip/v1/apps/${appId}/roleres/import`;
	return C2Fetch.post(url,bodyParams,{},'导入数据失败！');
}

//导入角色预览
export function importPreviewRoles(appId,file){
	const url = proxy + `aip/v1/apps/${appId}/roleres/preview`;
	return C2Fetch.postFile(url,file,null,"导入文件失败");
}

//导出应用角色资源
export function exportRoles(appId,fileName){
	const url = proxy + `aip/v1/apps/${appId}/roleres/export`;
	return C2Fetch.download(url,fileName);
}
//获取应用菜单
export function getMenus(appId){
  const url=proxy+`aip/v1/apps/${appId}/menuTree`;
  return C2Fetch.get(url,null,"获取菜单目录出错");
}
  
//获取应用菜单详细树
export function getMenuTrees(appId){
  const url=proxy+`aip/v1/apps/${appId}/menutrees`;
  return C2Fetch.get(url,null,"获取菜单目录出错");
}
  
//应用菜单新增
export function addMenus(appId,bodyParams){
  const url=proxy+`aip/v1/apps/${appId}/menus`;
  return C2Fetch.post(url,bodyParams,null,"新增菜单目录出错");
}
//根据菜单Id查询指定菜单
export function getMenuById(appId,id){
  const url=proxy+`aip/v1/apps/${appId}/menus/${id}`
  return C2Fetch.get(url,null,"获取菜单信息出错"); 
}
//根据菜单Id删除指定菜单
export function deleteMenuById(appId,id){
  const url=proxy+`aip/v1/apps/${appId}/menus/${id}`
  return C2Fetch.delete(url,null,"删除菜单信息出错"); 
}
//应用菜单修改
export function updateMenus(appId,id,bodyParams){
  const url=proxy+`aip/v1/apps/${appId}/menus/${id}`;
  return C2Fetch.put(url,bodyParams,null,"修改菜单目录出错");
}

//获取应用数目统计-不用传租户
export function queryAppCount(params,headers){
  const url=proxy+`aip/v2/appcount`;
  return C2Fetch.get(url,params,null,headers);
}
//获取服务数目统计-不用传租户
export function queryServiceCount(params,headers){
  const url=proxy+`aip/v2/servicecount`;
  return C2Fetch.get(url,params,null,headers);
}
  

  
export function postNavigation(navigation,id) {
	let url = proxy + `aip/v1/navigations`;
	if(id)url += `/${id}`;
    return C2Fetch.post(url, navigation,null, "操作失败");
}

export function getNavigations(search){
	const url = proxy+`aip/v1/navigationtree`;
	return C2Fetch.get(url,search,'查询全局导航错误');
}

export function getGlobalRoles(params){
  const url = proxy + 'aip/v1/globalroles';
  return C2Fetch.get(url,params,'查询全局角色错误');
}

export function exportNavigations(){
  const url = proxy+`aip/v1/navigationsexport/export`;
  C2Fetch.download(url,'全局导航.txt')
}

export function previewNavigations(file){
  const url = proxy + `aip/v1/navigationsexport/preview`;
  return C2Fetch.postFile(url, file, {}, '预览全局导航数据出错', null);
}

export function importNavigations(data){
  const url = proxy + `aip/v1/navigationsexport/import`;
  return C2Fetch.post(url, data, {}, '导入全局导航数据出错', null);
}
export function addNavigationsFunctions(menuId,fnIds){
	const url = proxy+`aip/v1/navigations/${menuId}/functions`;
	return C2Fetch.put(url,fnIds,null,'添加菜单错误');
}
export function deleteNavigation(id){
  const url = proxy+`aip/v1/navigations/${id}`;
  return C2Fetch.delete(url,null,'删除菜单出错');
}
export function deleteNavigationFunction(mid,fid){
	const url = proxy+`aip/v1/navigations/${mid}/functions/${fid}`;
	return C2Fetch.delete(url,null,'删除菜单功能出错');
}
export function navigationsSort(pid,ids){
	const url = proxy+`aip/v1/navigations/${pid}/reorder`;
	return C2Fetch.put(url,ids,null,'导航排序失败');
}
//获取入口配置
export function entrypoints(appid){
  const url=proxy+`aip/v1/apps/${appid}/entrypoints`;
  return C2Fetch.get(url,null,false);
}
//新增入口配置
export function addEntrypoints(appid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/entrypoints`;
  return C2Fetch.post(url,bodyParams,null,false)
}
  
//修改入口配置
export function editEntrypoints(appid,entrypointId,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/entrypoints/${entrypointId}`;
  return C2Fetch.put(url,bodyParams,null,false)
}
  
//删除入口配置
export function deleteEntrypoints(appid,entrypointId){
  const url=proxy+`aip/v1/apps/${appid}/entrypoints/${entrypointId}`;
  return C2Fetch.delete(url,null,false);
}
  
//获取应用统一认证配置信息
export function getSso(appid){
  const url=proxy+`aip/v1/apps/${appid}/sso`;
  return C2Fetch.get(url,null,"获取获取应用统一认证配置信息出错")
}
  
//启用统一认证
export function openSso(appid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/sso`;
  return C2Fetch.post(url,bodyParams,null,false)
}
   
//修改应用统一认证配置信息
export function eidtSso(appid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/sso`;
  return C2Fetch.put(url,bodyParams,null,"修改应用统一认证配置信息出错")
}
  
//关闭统一认证
export function closeSso(appid){
  const url=proxy+`aip/v1/apps/${appid}/sso`;
  return C2Fetch.delete(url,null,"启用统一认出错")
}
  
  
//查询应用详情
export function getApp(appid){
  const url=proxy+`aip/v1/apps/${appid}`;
  return C2Fetch.get(url,null,"查询应用出错");
}
  
//修改应用
export function updateApp(appid,queryParams,bodyParams) {
  const url = proxy + `aip/v1/apps/${appid}`;
  return C2Fetch.put(url, bodyParams, queryParams, "修改应用出错");
}
  
//删除应用
export function deleteApp(appid){
  const url=proxy+`aip/v1/apps/${appid}`
  return C2Fetch.delete(url,null,false)
}
  
  
  
  
//查询中间件关联的应用名称
export function getAppByMiddleware(middlewareId){
  const url=proxy+`aip/v1/middlewares/${middlewareId}/apps`;
  return C2Fetch.get(url,null,"查询中间件关联的应用出错");
}
  
  

  
//获取应用可管理的机构
export function getManagerOrgs(appid){
  const url=proxy+`aip/v1/apps/${appid}/canmanageorgs`;
  return C2Fetch.get(url,null,"获取可管理机构出错");
}  
  
//获取应用机构表格数据
export function getManagertables(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/manageorgtables`
  return C2Fetch.get(url,queryParams,"获取可管理机构表格出错");
}
  
//获取角色列表
export function getRoles(appId,queryParams){
  const url=proxy+`aip/v1/apps/${appId}/roles`;
  return C2Fetch.get(url,queryParams,"获取角色失败")
}
//新增角色
export function addRole(appid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/roles`
  return C2Fetch.post(url,bodyParams,null,"新增角色失败")
}
//修改角色
export function updateRole(appid,roleid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/roles/${roleid}`
  return C2Fetch.put(url,bodyParams,null,"修改角色失败")
}
  
//删除角色
export function deleteRole(appid,roleid){
  const url=proxy+`aip/v1/apps/${appid}/roles/${roleid}`
  return C2Fetch.delete(url,null,"删除角色失败")
}
//判断角色编码是否存在，存在返回角色对象,不存在返回null	
export function getRolesByCode(appId,code){
  const url=proxy+`aip/v1/apps/${appId}/roles/${code}`;
  return C2Fetch.get(url,null,"角色编码已存在")
}
  

  
//查询应用角色所有权限资源
export function getRoleAllResources(appid,roleId){
  const url=proxy+`aip/v1/apps/${appid}/roles/${roleId}/resources`
  return C2Fetch.get(url,null,'获取角色拥有权限资源出错')
}

//更新应用指定角色拥有资源
export function updateRoleResources(appid,queryParams,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/permitedresources`
  return C2Fetch.post(url,bodyParams,queryParams,'更新角色拥有资源失败')
}
  
//获取用户列表
export function getUsers(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/permittedusers`;
  return C2Fetch.get(url,queryParams,"获取用户列表出错")
}
  
//将用户从应用可反问列表中移除
export function deleteUser(appid,userid){
  const url=proxy+`aip/v1/apps/${appid}/users/${userid}`
  return C2Fetch.delete(url,null,"禁用用户出错")
}
//将用户添加到应用可访问列表
export function addUser(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/users`
  return C2Fetch.post(url,null,queryParams,"添加用户出错")
}
  
//用户可供选择的角色树
export function roleTree(appid,userid){
  const url=proxy+`aip/v1/apps/${appid}/roles/roleTree/${userid}`
  return C2Fetch.get(url,null,"获取用户选择的角色树失败")
}
  
//给用户授权指定角色
export function updateRoleTree(appid,userid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/users/${userid}/roles`
  return C2Fetch.post(url,null,queryParams,'授权指定角色失败')
}
  
//获取白名单列表
export function getWhiteUsers(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/whiteusers`;
  return C2Fetch.get(url,queryParams,"获取白名单列表出错")
}
  
//将用户从应用白名单中移除
export function deleteWhiteUsers(appid,userid){
  const url=proxy+`aip/v1/apps/${appid}/whiteusers/${userid}`
  return C2Fetch.delete(url,null,"移除用户出错") 
}

//白名单替换接口
export function putWhiteUsers(appId,userIds){
  const url = proxy+`aip/v1/apps/${appId}/whitelist`;
  return C2Fetch.put(url,userIds,{},'修改白名单失败');
}
  
//添加白名单用户
export function addWhiteUsers(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/whiteusers`
  return C2Fetch.post(url,null,queryParams,"添加用户失败")
}
  
//查询资源
export function getAppResources(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/resources`
  return C2Fetch.get(url,queryParams,'获取资源失败')
}
  
//新增表单
export function addResources(appid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/privilegeresource`
  return C2Fetch.post(url,bodyParams,null,'新增资源出错')
}
  
//修改表单
export function updateResources(appid,resourcesId,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/privilegeresource/${resourcesId}`
  return C2Fetch.put(url,bodyParams,null,'修改资源出错')
}
  
//删除表单
export function deleteResources(appid,resourcesId){
  const url=proxy+`aip/v1/apps/${appid}/privilegeresource/${resourcesId}`
  return C2Fetch.delete(url,null,'删除资源失败')
}
//获取租户下的应用数
export function getTenantApps(tenant){
  const url=proxy+`aip/v2/appcount`
  return C2Fetch.get(url,tenant,'获取应用数失败')
}
  
//入口数据预览
export function resourcesync(appId,bodyParam){
	const url = proxy+`aip/v1/apps/${appId}/resourcesync`;
	return C2Fetch.post(url,bodyParam,{},'同步入口数据失败');
}

//同步入口数据预览
export function previewSync(appId){
	const url =proxy+ `aip/v1/apps/${appId}/resourcesync`;
	return C2Fetch.get(url,{},'获取入口数据失败');
}

export function getEnvHealth(envId){
  const url=proxy+`health`
  return C2Fetch.get(url,null,false,{'AMP-ENV-ID':envId})
}

export function getAllPermissons(params){
  let url=proxy+`aip/v1/allpermissions`
  return C2Fetch.get(url,params,'查询角色下的资源失败',{'AMP-ENV-ID':1});
}

//获取黑名单列表
export function getBlacks(appId,page,rows){
  let url =proxy+ `aip/v1/apps/${appId}/blacklist`;
  return C2Fetch.get(url,{page:page,rows:rows},"查询黑名单失败");
}

//黑名单替换接口
export function putBlacks(appId,userIds){
  let url = proxy+`aip/v1/apps/${appId}/blacklist`;
  return C2Fetch.put(url,userIds,{},'修改黑名单失败');
}

//讲用户从黑名单移除
export function deleteBlacks(appId,userIds){
  let url =proxy+ `aip/v1/apps/${appId}/blacklist`;
  return C2Fetch.delete(url,{userId:userIds},"将用户从黑名单移除失败");
}