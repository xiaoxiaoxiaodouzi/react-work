import C2Fetch from '../utils/Fetch';
import {base} from './base';
let proxy = 'proxy/';
//获取所有环境
export function queryAllEnvs(){
  const url = `amp/v1/envs`;
  return C2Fetch.get(url,null,"获取容器基本配置信息出错！");
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
//根据租户ID查看许可信息
export function queryCurrentLicense(){
  const url = proxy+`v1/tenants/${base.tenant}/currentlicense`;
  return C2Fetch.get(url,null,"获取当前许可信息出错！");
}
//查看许可信息
export function queryLicenses(){
  const url = proxy+`v1/tenants/${base.tenant}/licenses`;
  return C2Fetch.get(url,null,"获取许可信息列表出错！");
}
//修改指定许可信息
export function updateLicense(params){
  const url = proxy+`v1/tenants/${base.tenant}/license`;
  return C2Fetch.post(url,params,null,"修改许可信息出错！");
}