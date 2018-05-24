import C2Fetch from '../utils/Fetch';

let proxy = 'proxy/';

//APM性能管理服务
export function getAPM(appCode,queryParam) {
  const url = proxy + `apm/v1/apps/${appCode}/scatter`
  //const url = `http://172.16.25.127:8080/apm/v1/getScatterData`
  return C2Fetch.get(url, queryParam, '获取APM散点图数据失败')
}

export function getApplicationTopo({ appCode, from, to, callerRange, calleeRange }) {
  const url = proxy + `apm/v1/apps/${appCode}/mapview?applicationName=${appCode}&from=${from}&to=${to}&callerRange=${callerRange}&calleeRange=${calleeRange}&_=` + Math.random()
  return C2Fetch.get(url, null, false);
}

//获取应用资源使用情况
export function getAppmonit(appid) {
  const url = proxy + `aip/v1/appmonit/${appid}/appinfo`
  return C2Fetch.get(url, null, '获取应用资源使用情况失败')
}

//查询应用所有服务的平均响应时间
export function getAvgTime(appid) {
  const url = proxy + `aip/v1/appmonit/${appid}/appAvgTime`
  return C2Fetch.get(url, null, '查询应用所有服务的平均响应时间失败')
}

//查询应用调用服务错误次数,queryParam={startTime:统计开始时间（结束时间默认当天）apikeyId: 应用主键id
export function getErrCount(queryParam) {
  const url = proxy + `aip/v1/servicemonit/errorCount`
  return C2Fetch.get(url, queryParam, '查询应用调用服务错误次数失败')
}

//查询应用的pvuv startTime:统计开始时间endTime: 统计结束时间apikeyId: 应用主键id,Type: 需指定是查PV还是UV（如查PV传值‘PV’, 查UV传’UV’）
export function getApppvoruv(queryParam) {
  const url = proxy + `aip/v1/appmonit/apppvoruv`
  return C2Fetch.get(url, queryParam, '查询应用的pvuv失败')
}

//查询应用服务平均响应时长 startTime:统计开始时间 endTime: 统计结束时间apikeyId: 应用主键id
export function getSeviceavgtimetop(queryParam) {
  const url = proxy + `aip/v1/servicemonit/seviceavgtimetop`
  return C2Fetch.get(url, queryParam, '查询应用服务平均响应时长失败')
}

//查询最慢统计
export function getSlow(queryParam) {
  const url = proxy + `aip/v1/servicemonit/slow`
  return C2Fetch.get(url, queryParam, '查询最慢统计失败')
}

//根据node名称查询node的响应时长apm/v1/apps/{applicationName}/resphistogram
export function getRespHistogram(appCode,queryParam) {
  const url = proxy + `apm/v1/apps/${appCode}/resphistogram`
  return C2Fetch.get(url, queryParam, '查询node的响应时长失败')
}

//查询应用CPU 内存 网络数据
export function getAppStatInfo(queryParam) {
  const url = proxy + `aip/v1/appmonit/getAppStatInfo`
  return C2Fetch.get(url, queryParam, '获取应用数据失败')
}

//查询事务列表数据
export function getTransactionInfo(appCode,queryParam){
  const url = proxy +`apm/v1/apps/${appCode}/transactions`
  return C2Fetch.get(url,queryParam,'获取事务数据失败')
}
//查询事务列表数据
export function getTransactionInfoSlow(appCode,queryParam){
  const url = proxy +`apm/v1/apps/${appCode}/slowTransactions`
  return C2Fetch.get(url,queryParam,'获取事务数据失败')
}
//查询事务列表数据
export function selectDotGetTrans(queryParams,bodyParams){
  const url = proxy +`apm/v1/apptransactions/selectDotGetTrans`
  return C2Fetch.post(url,bodyParams,queryParams,'获取事务数据失败')
}
//查询调用链数据
export function getTransactionLink(traceId){
  const url = proxy +`apm/v1/apptransactions/${traceId}/mapview`
  return C2Fetch.get(url,null,'获取调用链数据失败')
}
//查询调用栈列表数据
export function getTransactionStack(traceId){
  const url = proxy +`apm/v1/apptransactions/${traceId}/callstack`
  return C2Fetch.get(url,null,'获取调用栈数据失败')
}