import C2Fetch from '../utils/Fetch';

let proxy = 'proxy/';
//初始化环境
export function createEnv(code,bodyParams){
  const url=proxy+`tiller/v1/releases/${code}`
  return C2Fetch.post(url,bodyParams,{},'创建环境出错',{Authorization:'Basic YWRtaW46YWRtaW4='})
}
  
//查询创建环境状态、
export function getEnvStatus(code){
  const url=proxy+`tiller/v1/releases/${code}/status`
  return C2Fetch.get(url,{},false)
}

//回退新建环境的应用
export function tiller(code){
  const url=proxy+`tiller/v1/releases/${code}`;
  return C2Fetch.delete(url,{purge:true},'删除部署应用失败')
}