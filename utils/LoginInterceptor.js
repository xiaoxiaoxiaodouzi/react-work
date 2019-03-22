import { getConfigs, queryAllEnvs, getCurrentUser, getEnvironmentsByTenant } from "../services/amp";
import { getTenant, getUserTenants } from "../services/tp";
import { getCceTenant } from "../services/cce";
import constants from "../services/constants";
import { base } from "../services/base";
import ampMenus from "../services/ampMenus";
import { getAllPermissons } from "../services/aip";
import { message } from "antd";

let interceptor = [];
async function getCceTenants() {
  let tenants = [];
  try {
    let cceTenants = await getCceTenant();
    cceTenants.forEach(t => {
      tenants.push({ id: t, name: t, code: t });
    })
  } catch (e) {
    tenants.push({ id: 'admin', name: 'admin', code: 'admin' });
  }
  return tenants;
}
//获取租户。安全模式从cce接口获取；其他从tp获取，admin在tp报错时继续去cce获取
async function getTenants(isSafeMode, userId, roles) {
  let tenants = [];
  if (isSafeMode) {
    tenants = await getCceTenants();
  } else {
    try {
      let tenantData = userId === 'admin' || roles.includes('amp_admin') ? (await getTenant({ code: constants.TENANT_CODE[0] })) : (await getUserTenants(userId));
      tenants = base.filterTenantData(tenantData);
    } catch (error) {
      tenants = await getCceTenants();
    }
  }
  return tenants;
}
function getCurrentTenant(tenants) {
  if (tenants === undefined || tenants.length === 0) return null;
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
function getMenus(permissions, passEnabled, monitEnabled) {
  let menus = [];
  if (base.safeMode) {
    menus = ampMenus.SAVE_MODE_MENU;
  } else {
    if (base.isAdmin) menus = ampMenus.MENUS;
    else {
      menus = ampMenus.MENUS.filter(m => {//根据资源权限过滤
        if (!m.resourceId || permissions.includes(m.resourceId)) {
          if (m.children) {
            m.children = m.children.filter(sm => !sm.resourceId || permissions.includes(sm.resourceId));
            return m.children.length > 0;
          }
          return true;
        } else return false;
      });
    }
  }
  if (!passEnabled) {//禁用Pass过滤依赖cce接口的菜单
    menus = menus.filter(m => {
      if (m.cceDepend) return false;
      else {
        if (m.children) {
          m.children = m.children.filter(sm => !sm.cceDepend);
        }
        return true;
      }
    })
  }

  if (!monitEnabled) {//禁用监控过滤依赖monitor接口的菜单
    menus = menus.filter(m => {
      if (m.monitDepend) return false;
      else {
        if (m.children) {
          m.children = m.children.filter(sm => !sm.monitDepend);
        }
        return true;
      }
    })
  }
  return menus;
}

//获取环境，如果没有初始化环境，进入安全模式初始化环境
interceptor.push(async (history) => {
  if (base.safeMode) return true;
  let envs = await queryAllEnvs({ 'Safe-Mode': true });
  base.environments = envs || [];
  if (envs.length === 0) {
    history.replace('/login', { message: '还未创建环境，安全登录后进行环境初始化。' });
    return false;
  }
  return true;
});

//当前用户和租户信息
interceptor.push(async () => {
  const u = base.safeMode ? { id: 'admin', realname: 'AMP管理员' } : await getCurrentUser();
  base.currentUser = u;
  //admin从cce获取租户，平台管理员拿所有租户，其他拿所属租户
  let tenants = await getTenants(base.safeMode, u.id, u.roles);
  base.tenants = tenants;
  base.isAdmin = u.id === 'admin';
  base.isAmpAdmin = u.id === 'admin' || (u.roles && u.roles.includes('amp_admin'));
  let currentTenant = getCurrentTenant(tenants);
  if (currentTenant) {
    base.tenant = currentTenant.code;
    return true;
  } else {
    message.info('当前登录用户不属于任何租户！请联系管理员')
    return false;
  }
})

//获取amp配置，如果配置获取错误，或者系统初始化为false，跳转到安全登录页面
interceptor.push(async (history) => {
  let ampConfigs = await getConfigs();
  if (ampConfigs) base.configs = ampConfigs;
  else {
    base.configs = {
      manageTenantCode: "admin",
      paasManageUrl: constants.DEFAULT_URL.passApigetway,
      passEnabled: false,
      APMEnabled: false,
      monitEnabled: false,
      errorMessage: true,
      messageBell: true,
      initialized: true,
    }
  }
  return true;
});

//权限和菜单
interceptor.push(async () => {
  const user = base.currentUser;
  if (user) {
    //权限
    let permissions = user.id === 'admin' ? [] : await getAllPermissons({ roleCode: user.roles });
    base.allpermissions = permissions;
    //菜单
    const passEnabled = base.configs.passEnabled;
    let menus = getMenus(permissions, passEnabled, base.configs.monitEnabled);
    base.menus = menus;
  }
  return true;
});

//环境
interceptor.push(async () => {
  let environments = base.isAdmin ? await queryAllEnvs() : await getEnvironmentsByTenant(base.tenant);
  environments = environments.filter(e => !e.disabled);
  base.environments = environments;

  let currentEnvironment = base.getCurrentEnvironment(environments);
  base.currentEnvironment = currentEnvironment;
  base.environment = currentEnvironment ? currentEnvironment.id : null;
  return true;
})

async function LoginInterceptor(history) {
  for (let i = 0; i < interceptor.length; i++) {
    let next = await interceptor[i](history);
    if (!next) break;
  }
}

export default LoginInterceptor;
