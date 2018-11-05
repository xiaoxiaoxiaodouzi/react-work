import { base } from './base';
import {getUserTenants,getTenant} from './tenants'
import C2Fetch from '../utils/Fetch';
import constants from './constants';

function getCurrentUser(){
  const url=`ws/getSubject`;
  return C2Fetch.get(url,null,"获取当前用户信息失败");
}
function getConfigs(){
  const url =`amp/v1/configs`;
  return C2Fetch.get(url,null,'获取系统设置失败')
}
function getMenus(permissions){
  let menus = constants.MENUS.filter(m=>{
    if(!m.resourceId||permissions.includes(m.resourceId)){
      if(m.children){
        m.children = m.children.filter(sm=>!sm.resourceId||permissions.includes(sm.resourceId));
      }
      return true;
    }else return false;
  });
  return menus;
}

const login = async () => {
  //当前用户
  let u = await getCurrentUser();
  base.currentUser = u;
  //admin和平台管理员权限一样！
  if ((u.roles && u.roles.includes('amp_admin')) || u.id === 'admin') base.isAdmin = true;
  if (u.roles && u.roles.includes('roleManager')) base.isRoleManager = true;
  //管理员进来查所有租户
  let tenantData = base.isAdmin?await getTenant({code:constants.TENANT_CODE[0]}):await getUserTenants(u.id);
  let tenants = base.filterTenantData(tenantData);
  
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

const anthAndMenus = async (roles)=>{
  //权限
  let permissions = await base.getAllPermissons({ roleCode: roles });
  base.allpermissions = permissions;
  //菜单
  let menus = getMenus(permissions);
  return menus;
}

const updateEnvironment = (tenantCode)=>{
  base.getEnvironmentsByTenant(tenantCode).then(environments=>{
    base.environments = environments;
    let currentEnvironment = base.getCurrentEnvironment(environments);
    base.currentEnvironment = currentEnvironment;
  });
}

const readyGlobalData = async (tenantCode)=>{
  let configs  = await getConfigs();
  let environments = await base.getEnvironmentsByTenant(tenantCode);
  base.configs = configs;
  base.environments = environments;
  let currentEnvironment = base.getCurrentEnvironment(environments);
  base.currentEnvironment = currentEnvironment;
  return {configs,currentEnvironment };
}


export default {login,getCurrentTenant,anthAndMenus,readyGlobalData,updateEnvironment};