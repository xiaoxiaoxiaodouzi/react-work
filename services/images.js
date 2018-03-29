import C2Fetch from '../utils/Fetch';
import {base} from './base'
let proxy = 'proxy/';

//获取用户镜像信息
export function getImages(tenant,queryParams){
  const url=proxy+`cce/v1/images/${tenant}`
  return C2Fetch.get(url,queryParams,'获取镜像列表失败')
}

export function getImageCategorys(){
  const url=proxy+`cce/v1/imagecategorys`
  return C2Fetch.get(url,null,'获取分类报错')
}

//获取镜像详细信息
export function getDetail(tenant,artifact){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}`
  return C2Fetch.get(url,null,'获取镜像失败')
}
//获取镜像所有配置信息
export function getList(tenant,artifact){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/manifests`
  return C2Fetch.get(url,null,'获取镜像配置失败')
}

//更新镜像信息
export function updateList(tenant,artifact,tag,bodyParams){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/tags/${tag}`
  return C2Fetch.put(url,bodyParams,null,'修改失败')
}

//删除镜像
export function deleteList(tenant,artifact,tag){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/tags/${tag}`
  return C2Fetch.delete(url,null,'删除失败')
}

//查询环境变量
export function getEnvs(tenant,artifact,queryParams){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/envs`
  return C2Fetch.get(url,queryParams,'更新环境变量失败')
}

//新增环境变量
export function addEnvs(tenant,artifact,bodyParams){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/envs`
  return C2Fetch.post(url,bodyParams,null,'新增环境变量失败')
}

//修改环境变量
export function updateEnvs(tenant,artifact,bodyParams){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/envs`
  return C2Fetch.put(url,bodyParams,null,'更新环境变量失败')
}

//修改镜像详情
export function updateImages(tenant,artifact,bodyParams){
  const url=proxy+`proxy/cce/v1/images/${tenant}/${artifact}`
  return C2Fetch.put(url,bodyParams,null,'修改镜像详情失败')
}

//删除环境变量
export function deleteEnvs(tenant,artifact,env){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/envs/${env}`
  return C2Fetch.delete(url,null,'删除环境变量失败')
}

//查询环境变量的KEY存不存在
export function getKeys(tenant,artifact,key){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/envs/${key}`
  return C2Fetch.get(url,null,'查询KEY失败')
}

//根据镜像名称获取Dockerfile
export function getDockerfileByArtifact(artifact){
  const url=proxy+`cce/v1/images/pack/dockerfile/image/${artifact}`
  return C2Fetch.get(url,null,'查询Dockerfile失败')
}

//根据程序包类型获取Dockerfile
export function getDockerfileByType(type){
  const url=proxy+`cce/v1/images/pack/dockerfile/app/${type}`
  return C2Fetch.get(url,null,'查询Dockerfile失败')
}

//打包镜像
export function pack(bodyParams){
  const url=proxy+`cce/v1/images`
  return C2Fetch.post(url,bodyParams,null,'打包失败')
}

//获取打包任务日志
export function getLogs(taskid,queryParams){
  const url=proxy+`cce/v1/images/pack/log/${taskid}`
  return C2Fetch.get(url,queryParams,'获取打包日志失败')
}

//分页查询打包任务
export function getTaskList(queryParams){
  const url=proxy+`cce/v1/images/pack/task`
  return C2Fetch.get(url,queryParams,'获取打包日志列表失败')
}

//获取当前用户
export function getCurrentUser(){
  const url=`ws/getSubject`;
  return C2Fetch.get(url,null,'获取当前用户出错');
}

//根据用户iD去获取用户信息
export function getUserInfo(id){
  const url=`uop/sso/v1/users/${id}`;
  return C2Fetch.get(url,null,'获取用户信息s出错');
}


