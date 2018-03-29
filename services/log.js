import C2Fetch from '../utils/Fetch';
import {base} from './base'
let proxy = 'proxy/';

export function getApplications(applications){
  const url=proxy+`cce/v1/tenants/${base.tenant}/applications/${applications}`;
  return C2Fetch.get(url,null,'获取应用基本信息出错')
}

export function getApplicationBase(applications){
  const url=proxy+`cce/v1/tenants/${base.tenant}/applications/${applications}/base`
  return C2Fetch.get(url,null,'获取应用容器出错')
}

export function getApplicationLog(pod,container,queryParams){
  const url=proxy+`cce/v1/tenants/${base.tenant}/pods/${pod}/containers/${container}/logs`
  return C2Fetch.get(url,queryParams,'获取日志失败')
}