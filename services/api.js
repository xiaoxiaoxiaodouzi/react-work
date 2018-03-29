import C2Fetch from '../utils/Fetch';

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
export function getServicesApis(appId, page, rows, condition = {}) {
    var params = { page: page, rows: rows };
    Object.assign(params, condition);
    return C2Fetch.get(proxy + `aip/v1/apps/${appId}/serviceapis`, params, "获取服务列表信息出错！");
    //提供查询所有分组中服务的方法
    //return C2Fetch.get(proxy + `aip/v2/groups/${appId}/services`, params, "获取服务列表信息出错！");
}

//获得应用已获授权服务列表
export function getAccessibilityServicesApis(appId, page, rows, condition = {}) {
    var params = { page: page, rows: rows };
    Object.assign(params, condition);
    return C2Fetch.get(proxy + `aip/v1/apikeys/${appId}/services`, params, "获取已授权服务列表信息出错！");
}

//获得应用待获授权服务列表
export function getUnAuthorizedServicesApis(appId, page, rows, condition = {}) {
    var params = { page: page, rows: rows, appId: appId };
    Object.assign(params, condition);
    //获取所有没有授权给当前应用的api列表，用于服务授权对话框，path设计有点问题
    return C2Fetch.get(proxy + `aip/v1/servicegroups/0/services`, params, "获取未授权服务列表信息出错！");
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

//重置网关Key
export function resetApiKey(appId) {
    return C2Fetch.put(proxy + `aip/v1/apikeys/${appId}/reset`, {}, {}, "重置网关KEY出错！");
}

//swagger导入解析
export function getSwaggerComparison(swaggerObj) {
    return C2Fetch.post(proxy + `aip/v1/import/parseswagger`, swaggerObj, {}, "获取Swagger比对结果失败！");
}

//导入服务
export function addServers(appid, upstream, contents, json, mark) {
    return C2Fetch.post(proxy + `aip/v1/import/${appid}/services`, { contents: contents, json: json, mark: mark, upstream: upstream }, {}, "导入服务失败");
}

//更新服务
export function updateServers(appid, contents, json) {
    return C2Fetch.post(proxy + `aip/v1/import/${appid}/updateservices`, { contents: contents, json: json }, {}, "更新服务失败");
}