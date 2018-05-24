import C2Fetch from '../utils/Fetch';
import {base} from './base'

let proxy = 'proxy/';
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
    return C2Fetch.get(proxy + `aip/v1/apps/${appid}/manageroles/roleId/users/roleUser`, { role: type }, "获取应用管理用户信息出错！");
}

//获取应用管理用户 SYSTEM_MANAGER/BUSINESS_MANAGER/AUDIT_MANAGER
export function changeAppManager(appid, roleId, users) {
    return C2Fetch.put(proxy + `aip/v1/apps/${appid}/manageroles/${roleId}/users`, {}, { userIds: users }, "更新应用管理用户信息出错！");
}

//获取应用实例信息
export function getInstanceInfo( application) {
    return C2Fetch.get(proxy + `cce/v1/tenants/${base.tenant}/applications/${application}`, {}, "获取应用实例信息出错！");
}

//检查标签是否存在
export function checkTagExist(name) {
    return C2Fetch.post(proxy + `aip/v1/tags/names/checkifexist`, [{ name: name }], {}, "检查标签是否存在出错！");
}

//获得所有应用标签
export function getAppsTags() {
    return C2Fetch.get(proxy + `aip/v1/tags`, {}, "获取应用标签出错！");
}

//创建标签
export function createAppTags(name) {
    return C2Fetch.post(proxy + `aip/v1/tags`, [{ name: name }], {}, "创建应用标签出错！");
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

//应用状态检查
export function appStateCheck(appCode){
    let url = `cce/v1/tenants/${base.tenant}/applications/${appCode}/status`;
    return C2Fetch.get(proxy+url,null,false);
}

//应用停止
export function appStop(appCode){
    return C2Fetch.post(proxy+`cce/v1/tenants/${base.tenant}/applications/${appCode}/stop`,null,null,"应用停止失败");
}

//应用启动
export function appStart(appCode){
    return C2Fetch.post(proxy+`cce/v1/tenants/${base.tenant}/applications/${appCode}/start`,null,null,"应用启动失败");
}
//应用启动
export function isEnvChanged(appCode){
    return C2Fetch.get(proxy+`cce/v2/tenants/${base.tenant}/applications/${appCode}/isenvchanged`,null,null,false);
}
  