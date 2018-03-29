import C2Fetch from '../utils/Fetch';
import {base} from './base'
let proxy = 'proxy/';

//获取集群
export function getClusters(){
  const url=proxy+`cce/v1/tenants/${base.tenant}/clusters`
  return C2Fetch.get(url,null,'获取集群出错')
}

//新建集群
export function addCluster(bodyParams){
  const url=proxy+`cce/v1/tenants/${base.tenant}/clusters`
  return C2Fetch.post(url,bodyParams,null,'新增集群出错')
}

//删除集群
export function deleteCluster(id){
  const url=proxy+`cce/v1/tenants/${base.tenant}/clusters/${id}`
  return C2Fetch.delete(url,null,'删除集群出错')
}

//获取集群中的节点信息
export function getNodes(id){
  const url=proxy+`cce/v1/tenants/${base.tenant}/clusters/${id}/nodes`
  return C2Fetch.get(url,null,'获取主机列表出错')
}

//删除集群中的一个节点
export function deleteNodes(id,node){
  const url=proxy+`cce/v1/tenants/${base.tenant}/clusters/${id}/nodes/${node}`
  return C2Fetch.delete(url,null,'删除主机出错')
}

//集群加入主机
export function addHosts(id,host){
  const url=proxy+`cce/v1/tenants/${base.tenant}/clusters/${id}/hosts/${host}`
  return C2Fetch.post(url,null,null,'添加主机失败')
}