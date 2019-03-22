import C2Fetch from '../utils/Fetch';
import {base} from '../services/base'
let proxy = 'proxy/';



//APM性能管理服务
export function getAPM(appCode,queryParam) {
  const url = proxy + `apm/v1/apps/${appCode}/scatter`
  //const url = `http://172.16.25.127:8080/apm/v1/getScatterData`
  return C2Fetch.get(url, queryParam, false)
}

export function getApplicationTopo({ appCode, from, to, callerRange, calleeRange }) {
  const url = proxy + `apm/v1/apps/${base.currentEnvironment.code}_${appCode}/mapview?applicationName=${appCode}&from=${from}&to=${to}&callerRange=${callerRange}&calleeRange=${calleeRange}&_=` + Math.random()
  return C2Fetch.get(url, null, false);
}

//根据node名称查询node的响应时长apm/v1/apps/{applicationName}/resphistogram
export function getRespHistogram(appCode,queryParam) {
  const url = proxy + `apm/v1/apps/${appCode}/resphistogram`
  return C2Fetch.get(url, queryParam, false)
}

//查询事务列表数据
export function getTransactionInfo(appCode,queryParam){
  const url = proxy +`apm/v1/apps/${appCode}/transactions`
  return C2Fetch.get(url,queryParam,'获取事务数据失败')
}
//查询事务列表数据
export function getTransactionInfoSlow(appCode,queryParam){
  const url = proxy +`apm/v1/apps/${appCode}/slowTransactions`
  return C2Fetch.get(url,queryParam,false)
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