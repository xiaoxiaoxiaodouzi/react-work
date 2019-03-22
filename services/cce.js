import C2Fetch from '../utils/Fetch';
import {base} from './base'
import constants from './constants'

let proxy = 'proxy/';

//获取应用实例信息
export function getInstanceInfo( application) {
  return C2Fetch.get(proxy + `cce/v1/tenants/${base.tenant}/applications/${application}`, {}, "获取应用实例信息出错！");
}
//迁移应用
export function changeAppCluster(appId,clusterId){
  return C2Fetch.post(proxy+`cce/v1/tenants/${base.tenant}/applications/${appId}/migration`,clusterId,{},"应用迁移失败！")
}

//应用伸缩
export function changeAppExtention(appId,num){
  return C2Fetch.post(proxy+`cce/v1/tenants/${base.tenant}/applications/${appId}/extension`,num,{},"修改副本数失败")
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
//查询cce应用列表
export function queryAppCCE(params){
  return C2Fetch.get(proxy+'cce/v1/tenants/'+base.tenant+'/applications',params,"获取应用列表数据出错！");
}
//查询镜像列表
export function queryImages(tenant,params){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant,params,"获取镜像列表数据出错！");
}
//查询集群列表
export function queryClusters(){
  return C2Fetch.get(proxy+'cce/v1/tenants/'+base.tenant+'/clusters',null,"获取集群数据出错！");
}
//查询镜像版本列表
export function queryImageVersions(tenant,artifact,params){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant+'/'+artifact +'/manifests',params,"获取镜像版本数据出错！");
}
//查询镜像的最新版本列表
export function queryLatestVersion(tenant,artifact){
  return C2Fetch.get(proxy+'cce/v1/images/'+tenant+'/'+artifact +'/latest',null,"获取最新的镜像版本出错！");
}
//查询镜像地址
export function queryImagePath(){
  return C2Fetch.get(proxy+'cce/v1/harbor/url',null,"获取镜像地址数据出错！");
}
//添加应用部署信息
export function addAppDeployInfo(bodyParams){
  return C2Fetch.post(proxy+'cce/v1/tenants/'+base.tenant+'/applications',bodyParams,null,false);
}
  
//查询镜像分类
export function queryCategorys(){
  return C2Fetch.get(proxy+'cce/v1/imagecategorys',null,"查询镜像分类数据出错！");
}
//校验应用code是否存在 
export function checkCodeName(code) {
  return C2Fetch.get(proxy + `cce/v1/tenants/${base.tenant}/applications/${code}/id`,null, "编码重复！");
}
  
//查询应用信息 
export function queryAppInfo(application){
  return C2Fetch.get(proxy+'cce/v1/tenants/'+base.tenant+'/applications/'+application,null,"获取应用信息失败");
}

  
//获取集群
export function getClusters(tenant){
  const url=proxy+`cce/v1/tenants/${tenant?tenant:base.tenant}/clusters`
  return C2Fetch.get(url,null,'获取集群出错')
}

//获取集群
export function getClustersByTenant(tenantId){
  let tenant = tenantId?tenantId:base.tenant
  const url=proxy+`cce/v2/clusters`
  return C2Fetch.get(url,{tenant:tenant},'获取集群出错')
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
  
export function getClusterInfo(){
  const url=proxy+`cce/v1/tenants/info`
  return C2Fetch.get(url,null,'获取集群详情出错')
}
  
//获取集群中的节点信息
export function getNodes(id,tenant){
  const url=proxy+`cce/v1/tenants/${tenant}/clusters/${id}/nodes`
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

export function getAMSPort(queryParam){
  const url =	proxy+`cce/v2/tenants/${base.tenant}/nodeport`
  return C2Fetch.get(url,queryParam,'获取AMS端口失败')
}
//获取应用资源使用情况
// export function getAppmonit(appid) {
//   const url = proxy + `cce/v1/appmonit/${appid}/appinfo`
//   return C2Fetch.get(url, null, '获取应用资源使用情况失败')
// }
//查询容器基本配置信息，tenants=develop,application=apps-integration
export function queryBaseConfig(application){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/base`;
  return C2Fetch.get(url,null,"获取容器基本配置信息出错！");
}


//查询获取容器网络配置信息 tenants=develop,application=apps-integration
export function queryNetwork(application,queryParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/network`;
  return C2Fetch.get(url,queryParams,"获取容器网络配置信息出错！");
}
//查询获取应用的路由配置 tenants=develop,application=apps-integration
export function queryRoutes(application){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/routes`;
  return C2Fetch.get(url,null,"获取应用的路由配置出错！");
}
//更新容器基本配置信息 tenants=develop,application=apps-integration,container=redis
//type为以下值时分别完成对应操作,env:更新环境变量,volume:更新存储卷（绑定/解绑/修改）,image：更新版本, resource：修改配额
export function putBaseConfig(application,container,type,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/${type}`;
  return C2Fetch.post(url,bodyParams,null,false);
}
//修改容器自定义配置文件
export function putConfigs(application,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/configMap`;
  return C2Fetch.post(url,bodyParams,null,false);
}
//新增容器网络配置
export function addNetworkConfig(application,container,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/ports`;
  //return C2Fetch.post(url,bodyParams,null,"新增容器网络配置出错！");
  return C2Fetch.post(url,bodyParams,null,false);
}
//清空容器网络配置
export function deleteNetworkConfig(application,container,port,bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/ports/${port}`;
  //return C2Fetch.put(url,bodyParams,null,"删除容器网络配置出错！");
  return C2Fetch.put(url,bodyParams,null,false);
}
//获取可挂载存储卷信息
export function queryMountableVolumes(){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes?mountable=true`;
  return C2Fetch.get(url,null,"获取可挂载存储卷信息出错！");
}
  
//删除存储卷
export function deleteVolumes(volume) {
  const url = proxy + `cce/v1/tenants/${base.tenant}/volumes/${volume}`;
  return C2Fetch.delete(url, null, "删除存储卷信息出错！");
}
//获取存储卷信息
export function queryAllVolumes(params){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes`;
  return C2Fetch.get(url,params,"获取存储卷信息出错！");
}
export function createVolumes(bodyParams){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes`;
  return C2Fetch.post(url,bodyParams,null,"创建存储卷出错！");
}
//cce/v1/tenants/develop/volumes/ttt?recover=true
export function recoverVolumes(volume){
  const url = proxy+`cce/v1/tenants/${base.tenant}/volumes/${volume}`;
  return C2Fetch.put(url,null,{recover:true},"恢复存储卷出错！");
}
export function deleteVolumesImmediately(volume) {
  const url = proxy + `cce/v1/tenants/${base.tenant}/volumes/${volume}/immediately`;
  return C2Fetch.delete(url, null, "彻底删除存储卷信息出错！");
}
  
//获取应用的环境变量
export function queryEnvs(application,container){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs`;
  return C2Fetch.get(url,null,"获取应用的环境变量出错！");
}
  
//添加应用的环境变量
export function addAppEnvs(application,container,params){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs`;
  return C2Fetch.post(url,params,null,false);
}
  
//批量添加应用的环境变量
export function batchAddEnvs(application,container,params){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appbatchenvs`;
  return C2Fetch.post(url,params,null,false);
}
  
//查询应用环境变量key是否存在
export function existEnvs(application, container, env) {
  const url = proxy + `cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${env}`;
  return C2Fetch.get(url, null, "查询应用环境变量key是否存在出错！");
}
  
//删除应用的环境变量
export function deleteAppEnvs(application,container,key){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${key}`;
  return C2Fetch.delete(url,null,false);
}
//修改应用的环境变量
export function editEnvs(application,container,params,key){
  const url = proxy+`cce/v2/tenants/${base.tenant}/applications/${application}/containers/${container}/appenvs/${key}`;
  return C2Fetch.put(url,params,null,false);
}
//获取容器配置信息
export function queryContainerConfig(){
  const url = proxy+`cce/v2/quota`;
  return C2Fetch.get(url,null,"获取容器配置信息出错！");
}
//撤销环境变量修改
export function resetEnv(application,container,envId,params){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/resetenv?envId=${envId}`;
  return C2Fetch.post(url,params,null,false);
}
  //查询容器版本信息
  // export function queryImageVersions(tenant,artifact,params){
  //   return C2Fetch.get(proxy+'cce/v1/images/'+tenant+'/'+artifact +'/manifests',params,"获取镜像版本数据出错！");
  // }
  //proxy/cce/v1/tenants/develop/applications/testtsw2/containers/ttt/probe
export function changeProbe(application,container,params){
  const url = proxy+`cce/v1/tenants/${base.tenant}/applications/${application}/containers/${container}/probe`;
  return C2Fetch.post(url,params,null,'修改健康检查参数失败');
}
  
export function getCceTenant(){
  return C2Fetch.get(proxy+'cce/v1/tenants',null,'查询所有租户出错');
}
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
export function getList(tenant,artifact,queryParams){
  const url=proxy+`cce/v1/images/${tenant}/${artifact}/manifests`
  return C2Fetch.get(url,queryParams,false)
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
  return C2Fetch.get(url,queryParams,'获取环境变量失败')
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
  const url=proxy+`cce/v1/images/${tenant}/${artifact}`
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
  
  
  
//获取打包任务日志
export function getLogs(taskid,queryParams){
  const url=proxy+`cce/v1/images/pack/log/${taskid}`
  return C2Fetch.get(url,queryParams,'获取打包日志失败')
}
  
//根据任务ID查询打包任务
export function getTaskById(taskid){
  const url=proxy+`cce/v1/images/pack/task/${taskid}`
  return C2Fetch.get(url,null,'获取镜像任务失败')
}
  
//分页查询打包任务
export function getTaskList(queryParams){
  const url=proxy+`cce/v1/images/pack/task`
  return C2Fetch.get(url,queryParams,'获取打包日志列表失败')
}
  
export function getApplicationsInfo(applications){
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
  
//获取应用事件
export function getEvents(appCode){
  const url = proxy + `cce/v1/tenants/${base.tenant}/applications/${appCode}/events`;
  return C2Fetch.get(url,{},true);
}

//获取网关应用
export function getApigatewayApp(envCode){
  const manageTenant = base.configs[constants.CONFIG_KEY.MANAGE_TENANT_CODE]
  const url=proxy+`cce/v1/tenants/${manageTenant}/applications`;
  let params = {appType:'apigateway',env:envCode};
  return C2Fetch.get(url,params,"获取网关应用出错");
}
//获取应用资源监控数据(被monit接口代替)
// export function getAppMonit(appCode){
//   const manageTenant = base.configs[constants.CONFIG_KEY.MANAGE_TENANT_CODE]
//   const url=proxy+`cce/v1/clustermonitor/tenant/${manageTenant}/apps/${appCode}`;
//   return C2Fetch.get(url,null,"获取应用资源使用情况出错");
// }

export function deleteAppDeploy(appCode){
  const url=proxy+`cce/v1/tenants/${base.tenant}/applications/${appCode}`;
  return C2Fetch.delete(url,null,false);
}
export function getApplications(tenant,queryParams){
  const url=proxy+`cce/v1/tenants/${tenant}/applications`;
  return C2Fetch.get(url,queryParams,'获取应用出错')
}
  
export function getStatus(tenant,id){
  const url=proxy+`cce/v1/tenants/${tenant}/applications/${id}/status`;
  return C2Fetch.get(url,null,'获取应用出错');
}
  
//根据租户ID查看许可信息
export function queryCurrentLicense(){
  const url = proxy+`cce/v2/tenants/${base.tenant}/currentlicense`;
  return C2Fetch.get(url,null,"获取当前许可信息出错！");
}
//查看许可信息
export function queryLicenses(page,rows){
  const url = proxy+`cce/v2/tenants/${base.tenant}/licenses`;
  return C2Fetch.get(url,{ page: page, rows: rows },"获取许可信息列表出错！");
}

//查询镜像仓库地址

export function getImage(){
  const url=proxy+`cce/v1/harbor/url`
  return C2Fetch.get(url,{},'获取镜像仓库地址报错')
}
  
//查询nfs
export function getNFS(){
  const url=proxy+`cce/v1/nfs/info`
  return C2Fetch.get(url,{},'获取nfs出错')
}

  //新增租户
export function AddCCETenant(bodyParams){
  const url = proxy +`cce/v2/tenants`
  return C2Fetch.post(url, bodyParams,null,'新增租户失败')
}

// 获取应用资源使用量
export function getApplicationRes(tenant){
  const url = proxy +`cce/v2/tenants/${tenant}/usedres`;
  return C2Fetch.get(url,null,'获取应用资源使用量失败');
}
//应用状态检查
export function appStateCheck(appCode){
  let url = `cce/v1/tenants/${base.tenant}/applications/${appCode}/status`;
  return C2Fetch.get(proxy+url,null,false);
}

//查询应用下是否存在存储卷，是则返回存储卷列表，否则返回false
export function queryAppVolumns(appCode){
  return queryBaseConfig(appCode).then(base=>{
    let volumes = [];
    if(base && base.length){
      base.forEach(element => {
        volumes = volumes.concat(element.volumes);
      });
    }
    return volumes;
  })
}

export async function getCreateAppConfig(tenant){
  return {cluster:await getClusters(tenant),nodePort:await getAMSPort({ num: 1 }), nodeName:await getNodeList() ,chartList:await componentContent('env')}
}

let quotaData;
const appUtil = {
  getQuotaData:async ()=>{
    if(quotaData)return quotaData;
    else{
      quotaData = await queryContainerConfig();
      return quotaData;
    }
  },
  getQuota: async (index)=>{
    let quotaData = await appUtil.getQuotaData();
    return quotaData[index];
  }
}

export default appUtil;

//获取集群列表（new）
export function getClusterList(queryParam){
  const url=proxy+'cce/v2/clusters';
  return C2Fetch.get(url,queryParam,'查询集群信息失败')
}

//修改集群类型
export function editClusterType(name,bodyParams){
  const url=proxy+`cce/v2/clusters/${name}`;
  return C2Fetch.post(url,bodyParams,null,'修改类型失败')
}

//修改集群排序
export function reorderClusters(bodyParams){
  const url=proxy+`cce/v2/reorderclusters`;
  return C2Fetch.put(url,bodyParams,null,'修改集群排序失败')
}

export function getCorecomponents(params){
  // const url = proxy + 'cce/v1/corecomponents';
  // return C2Fetch.get(url,params,'获取系统组件出错');
  return new Promise((resolve,reject)=>{
    if(params.env === 'cep')
    resolve([{
      "description": "包含平台及所有应用的部署、管理、运维与运营的功能界面",
      "health": "health",
      "healthDesc": "健康",
      "icon": "",
      "lightColor": "green",
      "name": "amp",
      "showName": "cep-amp",
      "version": "2.2.2-r1"
    }, {
      "description": "基于Kubernetes的容器调度引擎",
      "health": "health",
      "healthDesc": "健康",
      "icon": "",
      "lightColor": "green",
      "name": "cce",
      "showName": "科创容器引擎",
      "version": "2.1.3"
    }, {
      "description": "包含平台及所有应用的微服务管理",
      "health": "health",
      "healthDesc": "健康",
      "icon": "",
      "lightColor": "green",
      "name": "apigateway",
      "showName": "服务网关",
      "version": "0.14.0-v1.9.8"
    }, {
      "description": "A Helm chart for monitor",
      "health": "health",
      "healthDesc": "健康",
      "icon": "",
      "lightColor": "green",
      "name": "monitor",
      "showName": "监控服务",
      "version": "2.6.0-alpha.1"
    }, {
      "description": "日志服务",
      "health": "health",
      "healthDesc": "健康",
      "lightColor": "green",
      "name": "log",
      "showName": "日志服务",
      "version": "1.0.3"
    }, {
      "description": "提供应用性能监控能力",
      "health": "health",
      "healthDesc": "健康",
      "icon": "",
      "lightColor": "green",
      "name": "apm",
      "showName": "cep-apm",
      "version": "v2.2.2-r5"
    }]);
    else resolve([{"description":"提供应用、认证、权限与功能管理的能力","health":"health","healthDesc":"健康","lightColor":"green","name":"ams","showName":"应用集成服务","version":"v2.2.2-alpha.1"},{"description":"包含平台及所有应用的微服务管理","health":"health","healthDesc":"健康","lightColor":"green","name":"apigateway","showName":"服务网关","version":"0.14.0-alpha.1"},{"description":"包含平台及所有应用的域名管理","health":"health","healthDesc":"健康","lightColor":"green","name":"route","showName":"应用路由","version":"0.14.0-v0.23-alpha.1"}])
  })
}


//queryParams:{env:}
export function deployCorecomponents(name,queryParams,bodyParams){
  const url=proxy+`cce/v1/corecomponents/${name}`
  return C2Fetch.post(url,bodyParams,queryParams,'组件部署失败')
}



//params:{name:,envCode:}
export function componentStatus(name,envCode){
  const url=proxy+`cce/v1/corecomponents/${name}/status`;
  return C2Fetch.get(url,envCode,'查询组件状态失败')
}

export function deleteComponent(name,params){
  const  url=proxy+`cce/v1/corecomponents/${name}`
  return C2Fetch.delete(url,params,'删除组件失败')
}

export function componentContent(name,params){
  const url=proxy+`cce/v1/corecomponents/${name}/content`
  return C2Fetch.get(url,params,'查询组建content失败!')
}

export function getNodeList(){
  const url=proxy+`cce/v2/nodelist`
  return C2Fetch.get(url,null,'获取k8s节点报错')
}

//查询容器基本配置信息，tenants=develop,application=apps-integration
export function queryChartBaseConfig(application,params){
  const url = proxy+`cce/v1/tenants/${base.configs.manageTenantCode}/charts/${application}/base`;
  return C2Fetch.get(url,params,"获取chart基本配置信息出错！");
}