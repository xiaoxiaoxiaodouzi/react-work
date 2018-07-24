import C2Fetch from '../utils/Fetch';

//获取域名列表
export function getRoutersList() {
  const url = `amp/v1/routers`
  return C2Fetch.get(url, null, '获取域名列表出错')
}
//获取域名所属应用信息
export function getRouter(routerId){
  const url =`proxy/aip/v1/apps?routeId=${routerId}`
  return C2Fetch.get(url,null,'获取域名所属应用信息失败')
}

//添加域名
export function addRouters(bodyParams) {
  const url = `amp/v1/routers`
  return C2Fetch.post(url, bodyParams, null, false)
}

//修改域名
export function updateRouters(code, bodyParams) {
  const url = `amp/v1/routers/${code}`
  return C2Fetch.post(url, bodyParams, null, false)
}
//删除域名
export function deleteRouters(name) {
  const url = `amp/v1/routers/${name}`
  return C2Fetch.delete(url, null, '修改域名出错')
}

//获取应用的域名列表
export function getRouters(code) {
  const url = `amp/v1/routers/${code}`
  return C2Fetch.get(url, null, '获取域名列表出错')
}

//获取集群
export function getupstream(appCode){
  const url =`amp/v1/upstreams/${appCode}`
  return C2Fetch.get(url,null,'获取集群失败')
}

//添加、修改、删除集群
export function doUpstream(upstream,bodyParams,queryParams){
  const url =`amp/v1/upstreams/${upstream}`
  return C2Fetch.post(url,bodyParams,queryParams,'添加集群失败')
}

