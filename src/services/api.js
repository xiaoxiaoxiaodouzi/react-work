import C2Fetch from '../utils/Fetch';
import { base } from './base'
let proxy = 'proxy/';

//获得网关详情
export function getApiGatewayInfo(appid) {
    return C2Fetch.get(proxy + `aip/v1/apps/${appid}/key`, {}, "获取服务网关秘钥信息出错！");
}

//获得网关详情
export function getApiGatewayUrl() {
    return C2Fetch.get(proxy + `aip/v1/apigateway/urls`, {}, "获取服务网关地址信息出错！");
}

//获得应用列表
export function getAppsList() {
    return C2Fetch.get(proxy + `aip/v1/apps`, {}, "获取应用列表出错！");
}
//获得应用key列表
export function getAppsKeyList(page = 1, rows = 9999) {
    return C2Fetch.get(proxy + `aip/v1/apikeys`, { page: page, rows: rows }, "获取应用Key列表出错！");
}

//获得应用服务列表
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

//查询应用对外服务
export function getServicesApi(appId, apiId) {
    return C2Fetch.get(proxy + `aip/v1/groups/${appId}/services/${apiId}`, {}, "查询服务详情出错！");
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

//更新服务
export function updateServers(appid, contents, json) {
    return C2Fetch.post(proxy + `aip/v1/import/${appid}/updateservices`, { contents: contents, json: json }, {}, "更新服务失败");
}
export function addServerGroup(group) {
    return C2Fetch.post(proxy + `aip/v1/groups`, group, null, "添加服务组失败");
}
export function delServerGroup(groupId) {
    return C2Fetch.delete(proxy + `aip/v1/groups/${groupId}`, null, "删除服务组失败");
}
//获取服务标签
export function queryTags(appid) {
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
//获取应用服务组失败
export function queryAllGroups(tenant) {
    let url = proxy + `aip/v2/groups?tenant=${tenant || base.tenant}`;

    return C2Fetch.get(url, null, "获取应用服务组失败");
}
//aip/v2/groups/{group}/services
export function queryGroupsById(id) {
    let url = proxy + `aip/v1/groups/${id}/tags`;
    return C2Fetch.get(url, null, "获取应用服务组失败");
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
    return C2Fetch.get(url, params, "获取应用服务组失败");
}

//查询服务统计数据
export function queryServiceData(names) {
    let url = proxy + `aip/v1/monit/servicedata?serviceNames=${names}`;
    return C2Fetch.get(url, null, "获取服务统计数据失败");
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
//查询所有应用
export function queryAllApps(page, row, servicecode) {
    let params = {
        page: page,
        rows: row,
        cond: { "servicecode": servicecode }
    }
    const url = proxy + `aip/v1/apikeys`;
    return C2Fetch.get(url, params, "获取所有待授权应用出错！");
}
//aip/v1/apikeys/6366/apikeys?apikeyids=1,NzEhfQuiaQOm7ILaiaSU8hpQ
export function addAppsToServer(serverId, appIds) {
    const url = proxy + `aip/v1/apikeys/${serverId}/apikeys?apikeyids=${appIds}`;
    return C2Fetch.post(url, null, null, '服务授权给应用失败');
}