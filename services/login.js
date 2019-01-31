import { base } from './base';
import {getUserTenants,getTenant} from './tp'
import C2Fetch from '../utils/Fetch';
import constants from './constants';
import ampMenus from './ampMenus';
import ALL_PERMISSIONS from '../services/permissions.json';
import { getCceTenant } from './cce';

function getCurrentUser(){
  const url=`ws/getSubject`;
  return C2Fetch.get(url,null,"获取当前用户信息失败");
}
function getConfigs(){
  const url =`amp/v1/configs`;
  return C2Fetch.get(url,null,'获取系统设置失败')
}
//安全模式登录
const safeLogin = (account,password)=>{
  const url = 'safemode/login';
  return C2Fetch.post(url,{account,password},null,true,{'Safe-Mode':true});
}
//安全模式登出
const safeLogout = ()=>{
  const url = 'safemode/logout';
  return C2Fetch.post(url,null,null,'安全模式登录异常',{'Safe-Mode':true});
}
function getMenus(permissions,passEnabled,monitEnabled){
  let menus = [];
  if(base.safeMode){
    menus = ampMenus.SAVE_MODE_MENU;
  }else{
    menus = ampMenus.MENUS.filter(m=>{//根据资源权限过滤
      if(!m.resourceId||permissions.includes(m.resourceId)){
        if(m.children){
          m.children = m.children.filter(sm=>!sm.resourceId||permissions.includes(sm.resourceId));
          return m.children.length>0;
        }
        return true;
      }else return false;
    });

    if(!passEnabled){//禁用Pass过滤依赖cce接口的菜单
      menus = menus.filter(m=>{
        if(m.cceDepend) return false;
        else{
          if(m.children){
            m.children = m.children.filter(sm=>!sm.cceDepend);
          }
          return true;
        }
      })
    }

    if(!monitEnabled){
      menus = menus.filter(m =>{
        if(m.monitDepend) return false;
        else{
          if(m.children){
            m.children = m.children.filter(sm=>!sm.monitDepend);
          }
          return true;
        }
      })
    }
  }
  return menus;
}

//获取租户。安全模式从cce接口获取；其他从tp获取，admin在tp报错时继续去cce获取
async function getTenants(isSafeMode,userId,roles){
  let tenants = [];
  if(isSafeMode){
    let cceTenants = await getCceTenant();
    cceTenants.forEach(t=>{
      tenants.push({id:t,name:t,code:t});
    })
  }else{
    try {
      let tenantData = userId === 'admin'||roles.includes('amp_admin')?(await getTenant({code:constants.TENANT_CODE[0]})):(await getUserTenants(userId));
      tenants = base.filterTenantData(tenantData);
    } catch (error) {
      if(userId === 'admin'){
        let cceTenants = await getCceTenant();
        cceTenants.forEach(t=>{
          tenants.push({id:t,name:t,code:t});
        })
      }
    }
  }
  return tenants;
}

const login = async () => {
  //当前用户
  let u = await getCurrentUser();
  if(base.safeMode)u = {id:'admin',realname:'AMP管理员'};
  base.currentUser = u;
  //admin从cce获取租户，平台管理员拿所有租户，其他拿所属租户
  let tenants = await getTenants(base.safeMode,u.id,u.roles);
  base.isAdmin = u.id==='admin'||(u.roles && u.roles.includes('amp_admin'));
  
  // if ((u.roles && u.roles.includes('amp_admin')) || u.id === 'admin') base.isAdmin = true;
  //管理员进来查所有租户
  // let tenantData = base.isAdmin?await getTenant({code:constants.TENANT_CODE[0]}):await getUserTenants(u.id);
  return {currentUser:u,tenants};
}

const getCurrentTenant = (tenants)=>{
  if(tenants===undefined || tenants.length===0) return;
  let currentTenant;
  if (window.localStorage.localTenantCode) {
    tenants.forEach(t => {
      if (t.code === window.localStorage.localTenantCode) {
        currentTenant = t;
      }
    })
  }
  if (!currentTenant) {
    currentTenant = tenants[0];
    window.localStorage.localTenantCode = currentTenant.code;
  }
  return currentTenant;
}

const anthAndMenus = async (user)=>{
  let configs  = await getConfigs();
  if(configs.passEnabled === undefined)configs.passEnabled=true;
  base.configs = configs;
  //权限
  let permissions = user.id==='admin'?ALL_PERMISSIONS.map(p=>p.code):await base.getAllPermissons({ roleCode: user.roles });
  base.allpermissions = permissions;
  //菜单
  const passEnabled = configs.passEnabled;
  let menus = getMenus(permissions,passEnabled,configs.monitEnabled);
  return menus;
}

const updateEnvironment = (tenantCode)=>{
  base.getEnvironmentsByTenant(tenantCode).then(environments=>{
    base.environments = environments;
    let currentEnvironment = base.getCurrentEnvironment(environments);
    base.currentEnvironment = currentEnvironment;
    base.environment = currentEnvironment?currentEnvironment.id:null;
  });
}

const readyGlobalData = async ()=>{
  // let configs  = await getConfigs();
  let environments = base.isAdmin?await base.getEnvironments({mode:'simple'}):await base.getEnvironmentsByTenant(base.tenant);
  environments = environments.filter(e=>!e.disabled);
  // base.configs = configs;
  base.environments = environments;
  let currentEnvironment = base.getCurrentEnvironment(environments);
  base.currentEnvironment = currentEnvironment;
  base.environment = currentEnvironment?currentEnvironment.id:null;
  return {currentEnvironment };
}


export default {login,getCurrentTenant,anthAndMenus,readyGlobalData,updateEnvironment,safeLogout,safeLogin};