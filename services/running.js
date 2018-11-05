import C2Fetch from '../utils/Fetch';
import {base} from '../services/base'

let proxy = 'proxy/';
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

//删除应用UPSTREAM
export function deleteUpstream(upstreamCode){
 const url=`amp/v1/upstreams/${upstreamCode}`;
 return C2Fetch.delete(url,null,false);
}


//查询中间件关联的应用名称
export function getAppByMiddleware(middlewareId){
  const url=proxy+`aip/v1/middlewares/${middlewareId}/apps`;
  return C2Fetch.get(url,null,"查询中间件关联的应用出错");
}

export function deleteAppDeploy(appCode){
  const url=proxy+`cce/v1/tenants/${base.tenant}/applications/${appCode}`;
  return C2Fetch.delete(url,null,false);
}

//查询应用可访问机构
  export function getOrgs(appid){
  const url=proxy+`aip/v1/apps/${appid}/permittedorgs`;
  return C2Fetch.get(url,null,"查询机构出错");
}

//更新应用可访问机构
export function updateOrgs(appid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/permittedorgs`;
  return C2Fetch.post(url,bodyParams,null,"修改机构出错");
}

//删除应用所有可访问机构
export function deleteOrgs(appid,bodyParams){
  const url=proxy+`aip/v1/apps/${appid}/permittedorgs`;
  return C2Fetch.delete(url,bodyParams,null,"删除机构出错");
}

//获取应用可管理的机构
export function getManagerOrgs(appid){
  const url=proxy+`aip/v1/apps/${appid}/canmanageorgs`;
  return C2Fetch.get(url,null,"获取可管理机构出错");
}

//批量将机构的数据权限(r:只读,rw:读写)授权给应用
export function orgPermissions(bodyParams){
  const url=proxy+`uop/v1/orgpermissions`
  return C2Fetch.post(url,bodyParams,null,"授权失败")
}

//解除应用下机构数据权限
export function deleteOrgPermissions(appid,categoryId){
  const url=proxy+`uop/v1/orgpermissions/apps/${appid}/categoryorgs/${categoryId}`
  return C2Fetch.delete(url,null,"解除应用机构数据权限失败")
}

//获取应用机构表格数据
export function getManagertables(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/manageorgtables`
  return C2Fetch.get(url,queryParams,"获取可管理机构表格出错");
}

//获取指定分类机构详情
export function getCategoryorgs(categoryId){
  const url=proxy+`uop/v1/categoryorgs/${categoryId}`;
  return C2Fetch.get(url,null,"获取指定分类机构出错")
}

//获取指定机构详情
export function getOrg(orgid){
  const url=proxy+`uop/v1/orgs/${orgid}`;
  return C2Fetch.get(url,null,"获取机构详情出错")
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

//	查询指定应用指定角色拥有的菜单资源
export function getRoleMenus(appId,roleId){
  const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/menus`
  return C2Fetch.get(url,null,"查询菜单资源失败")
}

//查询应用角色所有权限资源
export function getRoleAllResources(appid,roleId){
  const url=proxy+`aip/v1/apps/${appid}/roles/${roleId}/resources`
  return C2Fetch.get(url,null,'获取角色拥有权限资源出错')
}
//更新应用指定角色拥有的菜单资源
export function updateRoleMenus(appId,roleId,queryParams){
  const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/menus`
  return C2Fetch.post(url,null,queryParams,"更新角色菜单失败")
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

//添加白名单用户
export function addWhiteUsers(appid,queryParams){
  const url=proxy+`aip/v1/apps/${appid}/whiteusers`
  return C2Fetch.post(url,null,queryParams,"添加用户失败")
}

//查询资源
export function getResources(appid,queryParams){
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