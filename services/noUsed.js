import C2Fetch from '../utils/Fetch';
import {base} from './base';
let proxy = 'proxy/';
let proxyTp = '';

//没有用到的所有services

//获得应用key列表 (没用到？)
export function getAppsKeyList(page = 1, rows = 9999) {
    return C2Fetch.get(proxy + `aip/v1/apikeys`, { page: page, rows: rows }, "获取应用Key列表出错！");
}

//获得应用服务列表(没用到？)
export function getServicesApis(groupId, page, rows, condition = {}) {
    var params = {
        page: page,
        rows: rows,
    };
    if(condition){
        if(condition.nameorurl){
            var uri = condition.nameorurl;
            condition.nameorurl = encodeURI(uri);
        }
        Object.assign(params, condition);
    }
      
    return C2Fetch.get(proxy + `aip/v1/groups/${groupId}/serviceapis`, params, "获取服务列表信息出错！");
    //提供查询所有分组中服务的方法
    //return C2Fetch.get(proxy + `aip/v2/groups/${appId}/services`, params, "获取服务列表信息出错！");
  }
    

//aip/v2/groups/{group}/services(没用到？)
export function queryGroupsById(id) {
    let url = proxy + `aip/v1/groups/${id}/tags`;
    return C2Fetch.get(url, null, "获取应用应用失败");
}

//查询所有应用(没用到？)
export function queryAllApps(page, row, servicecode) {
    let params = {
        page: page,
        rows: row,
        cond: { "servicecode": servicecode }
    }
    const url = proxy + `aip/v1/apikeys`;
    return C2Fetch.get(url, params, "获取所有待授权应用出错！");
}

//检查标签是否存在(没用到？)
export function checkTagExist(name) {
    return C2Fetch.post(proxy + `aip/v1/tags/names/checkifexist`, [{ name: name }], {}, "检查标签是否存在出错！");
}

//查询应用调用服务错误次数,queryParam={startTime:统计开始时间（结束时间默认当天）apikeyId: 应用主键id
//该接口有问题，返回200状态，但是内容为空，到时转json出错!(没用到？)
export function getErrCount(queryParam) {
    const url = proxy + `aip/v1/servicemonit/errorCount`
    return C2Fetch.get(url, queryParam, '查询应用调用服务错误次数失败')
}

//查询最慢统计(没用到？)
export function getSlow(queryParam) {
    const url = proxy + `aip/v1/servicemonit/slow`
    return C2Fetch.get(url, queryParam, '查询最慢统计失败')
}
//查询应用CPU 内存 网络数据(没用到？)
export function getAppStatInfo(queryParam) {
    const url = proxy + `aip/v1/appmonit/getAppStatInfo`
    return C2Fetch.get(url, queryParam, '获取应用数据失败')
}

//查询应用服务平均响应时长 startTime:统计开始时间 endTime: 统计结束时间apikeyId: 应用主键id(没用到？)
export function getSeviceavgtimetop(queryParam) {
    const url = proxy + `aip/v1/servicemonit/seviceavgtimetop`
    return C2Fetch.get(url, queryParam, '查询应用服务平均响应时长失败')
}

// 新增授权用户集合(没用到?)
export function addUserCollection(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections`
	return C2Fetch.post(url,bodyParam,{},'新增用户集合出错')
}

///aip/v1/apps/{appId}/roles/{roleId}/resources 角色关联资源(没用到？)
export function addRoleResource(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources`
	return C2Fetch.post(url,bodyParam,{},'角色关联资源出错')
}
//aip/v1/apps/{appId}/roles/{roleId}/resources 角色解除关联资源（没用到？）
export function deleteRoleResource(appId,roleId,resId){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources/${resId}`
	return C2Fetch.delete(url,{},'角色解除关联资源出错')
}

//没用到？
export function globalrolemanages(){
	const url = proxy+`aip/v1/globalrolemanages`;
	return C2Fetch.get(url,null,'查询全局角色管理员失败');
}

//角色授权管理员用户集合(没用到？)
export function permissionsVerify(bodyParam,queryParam){
	const url=proxy+`aip/v1/permissions/verify`
	let data =C2Fetch.post(url,bodyParam,queryParam,'鉴权出错');
	return data;
}

//查询所有权限资源Code接口(没用到？)
export function getAllPermissions(queryParam){
	const url=proxy+`aip/v1/allpermissions`
	return C2Fetch.get(url,queryParam,'查询权限资源编码出错')
}

//(没用到？)
export function relesExport(appId){
    const url = proxy + `aip/v1/apps/${appId}/roleres/export`;
    return C2Fetch.download(url,'rolesres.json');
}
//获取应用数目统计(没用到？)
export function getAppCount(params,headers){
    const url=proxy+`monit/v1/appcount`;
    return C2Fetch.get(url,params,null,headers);
}

//获取服务数目统计(没用到？)
export function getServiceCount(params,headers){
    const url=proxy+`aip/v2/servicecount`;
    return C2Fetch.get(url,params,null,headers);
}
    
  //获取集群下应用数目统计(没用到？)
export function getAppCountCluster(params){
    const url=proxy+`monit/v1/appcount`;
    return C2Fetch.get(url,params,null);
}

//	查询指定应用指定角色拥有的菜单资源（没用到？）
export function getRoleMenus(appId,roleId){
    const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/menus`
    return C2Fetch.get(url,null,"查询菜单资源失败")
}

//更新应用指定角色拥有的菜单资源(没用到?)
export function updateRoleMenus(appId,roleId,queryParams){
    const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/menus`
    return C2Fetch.post(url,null,queryParams,"更新角色菜单失败")
}

  
//查询应用可访问机构（没用的接口）
export function getOrgs(appid){
    const url=proxy+`aip/v1/apps/${appid}/permittedorgs`;
    return C2Fetch.get(url,null,"查询机构出错");
}
    
//更新应用可访问机构（没用的接口）
export function updateOrgs(appid,bodyParams){
    const url=proxy+`aip/v1/apps/${appid}/permittedorgs`;
    return C2Fetch.post(url,bodyParams,null,"修改机构出错");
}
    
  //删除应用所有可访问机构（没用的接口）
export function deleteOrgs(appid,bodyParams){
    const url=proxy+`aip/v1/apps/${appid}/permittedorgs`;
    return C2Fetch.delete(url,bodyParams,null,"删除机构出错");
}

//获取指定租户下的环境(没用到？)
export function queryEnvByTenant(code){
    const url=`amp/v1/envTenant/tenant/${code}`
    return C2Fetch.get(url,null,"获取环境信息出错！");
}

//替换环境下的租户(没用到？)
export function updateEnvTenant(id,bodyParams){
    const url=`amp/v1/envTenant/env/${id}/envs`
    return C2Fetch.put(url,bodyParams,null,'替换环境下的租户失败')
}

//打包镜像(没用到？)
export function pack(bodyParams){
    const url=proxy+`cce/v1/images`
    return C2Fetch.post(url,bodyParams,null,'打包失败')
}

//获取服务数目统计 tenant appId(没用到？)
export function tenantsNodes(params){
    const url=proxy+`cce/v1/tenants/nodes`;
    return C2Fetch.get(url,params,'获取租户节点信息出错');
}

//修改指定许可信息(没用到？)
export function updateLicense(params){
    const url = proxy+`cce/v2/tenants/${base.tenant}/license`;
    return C2Fetch.post(url,params,null,"修改许可信息出错！");
}

//查询服务统计数据(没用到？)
export function queryServiceData(names) {
    let url = proxy + `monit/v1/service/statistics?serviceNames=${names}`;
    return C2Fetch.get(url, null, "获取服务统计数据失败");
}

// 获取指定配额信息(没用到？)
export function getQuotaByCode(code,quotaId){
    const url = proxyTp +`tp/v1/tenanttypes/${code}/quotas/${quotaId}`;
    return C2Fetch.get(url,null,'获取指定配额信息失败');
}


//获取指定分类机构详情(没用到？)
export function getCategoryorgs(categoryId){
    const url=proxy+`uop/v1/categoryorgs/${categoryId}`;
    return C2Fetch.get(url,null,"获取指定分类机构出错")
}
  
//获取指定机构详情(没用到？)
export function getOrg(orgid){
    const url=proxy+`uop/v1/orgs/${orgid}`;
    return C2Fetch.get(url,null,"获取机构详情出错")
}

//根据用户iD去获取用户信息(没用到？)
export function getUserInfo(id){
    const url=`uop/sso/v1/users/${id}`;
    return C2Fetch.get(url,null,'获取用户信息出错');
}