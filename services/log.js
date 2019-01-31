import C2Fetch from '../utils/Fetch';
let proxy = 'proxy/';


export function getLogs(params,header){
  const url=proxy+`log/v1/resource/logsearch`
  return C2Fetch.get(url,params,'查询日志出错',header)
}

//查询操作对象类型
export function getOTY(queryParams,header){
  const url =proxy+`log/v1/resource/objtypes`
  return C2Fetch.get(url,queryParams,'查询操作对象类型出错',header )
}

//查询操作类型
export function getTY(header){
  const url=proxy+`log/v1/resource/optypes`
  return C2Fetch.get(url,{},'查询操作类型出错',header)
}
export function routerLog(uri){
  const url = 'sso/v1/accesslog';
  return C2Fetch.get(url,{uri},false);
}

//获取安全策略元数据
export function getDataSource(){
  const url = proxy + 'sso/v1/oauth2securitypolicy/securitypolicymetadata';
  return C2Fetch.get(url,false);
}

//新增或修改安全策略
export function updateSafeStrategy(safeCode,bodyParams){
  return C2Fetch.post(proxy +`sso/v1/oauth2securitypolicy/securitypolicy/${safeCode}`, bodyParams, {}, "新增或修改安全策略出错！");
}

//获取当前系统安全策略
export function getSafeStrategy(){
  const url = proxy + 'sso/v1/oauth2securitypolicy/securitypolicy';
  return C2Fetch.get(url,false);
}