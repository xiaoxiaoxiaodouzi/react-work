import C2Fetch from '../utils/Fetch';
import {base} from './base';
import constants from './constants'
import {queryBaseConfig ,queryEnvs} from './deploy'



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
export function queryLicenses(page,rows){
  const url = proxy+`v1/tenants/${base.tenant}/licenses`;
  return C2Fetch.get(url,{ page: page, rows: rows },"获取许可信息列表出错！");
}
//修改指定许可信息
export function updateLicense(params){
  const url = proxy+`cce/v2/tenant/${base.tenant}/license`;
  return C2Fetch.post(url,params,null,"修改许可信息出错！");
}

//获取全局动态路由配置
export function getConfigs(){
  const url =`amp/v1/configs`;
  return C2Fetch.get(url,null,'获取动态路由失败')
}

//修改全局动态路由
export function updateConfigs(bodyParams){
  const url = `amp/v1/configs`;
  return C2Fetch.post(url, bodyParams,null, '修改设置失败')
}

export async function APMisOpen(code,callback){
  const env = base.currentEnvironment;
  const configs = env.code + '_' + code;
  //获取全局动态路由配置
  let data1=await getConfigs().then(data1=>{
    return data1;
  });
  let data=await queryBaseConfig(code).then(data=>{
    //获取应用的环境变量来判断是否开启了APM地址配置
    let ary = [];
    if (data) {
      data.forEach(item => {
        ary.push(queryEnvs(code, item.name))
      })
    }
    return ary;
  })
  let datas=await Promise.all(data).then(datas => {
    let bool = false;
    datas.forEach(items => {
      if(!bool){
        //设置标志位，如果环境变量中只要有一个容器符合条件的key value，则为true
        let a = false;
        let b = false;
        //遍历数据 ，看是否有满足条件的数据 即（环境CODE-应用CODE）
        items.forEach((item => {
          if (item) {
            //当满足情况时
            if (item.key === constants.APMENABLE_KEY[0] && item.value === data1[constants.CONFIG_KEY.APM_URL]) {
              b = true;
            }
          }
          if (item) {
            //当满足情况时
            if (item.key === 'APPNAME' && item.value === configs) {
              a = true;
            }
          }
        }))
        //如果多个容器里面都有对应的值的话，则认为APM是开启的
        if (a && b) {
          bool=true;
        }
      }
    })
    return bool;
  });
  return datas;
}
