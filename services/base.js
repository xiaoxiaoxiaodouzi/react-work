import C2Fetch from '../utils/Fetch';
// import constants from './constants';

let proxy = 'proxy/';
export let base = {
  currentUser:null,
  environments:[],
  currentEnvironment:null,
  tenant:null,
  configs:null,
  menus:[],
  isAdmin:false,
  isRoleManager:false,
  allpermissions:[],
  getCurrentUser:()=>{
    const url=`ws/getSubject`;
    return C2Fetch.get(url,null,"获取当前用户信息失败");
  },
  getCurrentEnvironment:(allEnviroments)=>{
    if(!allEnviroments || allEnviroments.length === 0) return ;
    let currentEnvironment;
    allEnviroments.forEach(e => {
      if (window.localStorage.localEnvironmentId === e.id) currentEnvironment = e;
      if (e.isMain && currentEnvironment === undefined) currentEnvironment = e;
    })
    if(!currentEnvironment){
      currentEnvironment = allEnviroments[0];
    }
    return currentEnvironment;
  },
  loginOut:()=>{
    const url=`ws/logout`;
    return C2Fetch.get(url,null,"退出登录失败");
  },
  getAppState:(stateCode)=>{
    const stateMap = {
      succeeded:{name:'运行中',color:'green'},
      failed:{name:'失败',color:'red'},
      running:{name:'启动中',color:'yellow'},
      pending:{name:'等待',color:'red'},
      stop:{name:'停止',color:'red'}
    }
    return stateMap[stateCode];
  },
  getEnvironments:()=>{
    let url = 'amp/v1/envs';
    return C2Fetch.get(url,null,"获取环境信息失败");
  },
  getEnvironmentsByTenant:(code)=>{
    let url = 'amp/v1/envTenant/tenant/'+code;
    return C2Fetch.get(url,null,"根据租户获取环境信息失败");
  },
  getAllPermissons:(params)=>{
    let url=proxy+`aip/v1/allpermissions`
    return C2Fetch.get(url,params,'查询角色下的资源失败')
  },
  //过滤到PASS租户
  filterTenantData:(tenantData)=>{
    let tenants = [];
    tenantData.forEach(t => {
      if (t.tenant_type && t.tenant_type.indexOf('PAAS') !== -1 && t.tenant_code) {
        tenants.push({ name: t.name, code: t.tenant_code, id: t.id });
      }
    })
    return tenants;
  }
 ///aip/v1/allpermissions
}
