import C2Fetch from '../utils/Fetch';
let proxyTp = '';

//获取租户列表
export function getTenant(queryParams){
  const url = proxyTp +`tp/v1/tenants`;
  return C2Fetch.get(url, queryParams,false);
}
//获取用户所属租户
export function getUserTenants(userId){
  let url = proxyTp+`tp/v1/tenantusers/${userId}/tenants`;
  if(userId === 'admin'){
    url = proxyTp+'tp/v1/tenants'
  }
  return C2Fetch.get(url,null,"获取用户租户信息失败");
}
  
//新增租户
export function AddTenant(bodyParams){
  const url = proxyTp +`tp/v1/tenants`
  return C2Fetch.post(url, bodyParams,null,'新增租户失败')
}
  
  
  
//删除租户
export function DeleteTenant(tenantId,code){
  const url = proxyTp +'tp/v1/tenants/'+tenantId+'/tenanttypes/'+code;
  return C2Fetch.delete(url, null,'删除租户失败');
}
  
//获取指定租户详情
export function getTenantById(tenantId){
  const url = proxyTp +`tp/v1/tenants/${tenantId}`;
  return C2Fetch.get(url,null,'获取租户信息失败');
}
// 获取租户所有管理员
export function getTenantManager(tenantId){
  const url = proxyTp +`tp/v1/tenantmanagers/tenants/${tenantId}/users`;
  return C2Fetch.get(url,null,'获取租户管理员失败');
}
// 修改租户所有管理员
export function updateTenantManager(tenantId,params){
  const url = proxyTp +`tp/v1/tenantmanagers/tenants/${tenantId}/users`;
  return C2Fetch.put(url,params,null,'修改租户管理员失败');
}
//   获取租户配额信息
export function getTenantQuota(code){
  const url = proxyTp +`tp/v1/tenanttypes/${code}/quotas`;
  return C2Fetch.get(url,null,'获取租户配额信息失败');
}

export function updateQuota(code,quotaId,params){
    const url = proxyTp +`tp/v1/tenanttypes/${code}/quotas/${quotaId}`;
    return C2Fetch.put(url,params,null,'修改租户配额失败');
} 
//tp/v1/tenants/{tenantId}/tenanttypes/{code}
export function updateTenant(tenantId,code,params){
  const url = proxyTp +`tp/v1/tenants/${tenantId}/tenanttypes/${code}`;
  return C2Fetch.post(url,params,null,'修改租户配额失败');
}
// 获取租户下的所有用户
export function getTenantUsers(tenantId){
  const url = proxyTp +`tp/v1/tenants/${tenantId}/users`;
  return C2Fetch.get(url,null,'获取租户下的所有用户失败');
}
// 删除租户下的用户
export function deleteTenantUser(tenantId,userId){
  const url = proxyTp +`tp/v1/tenants/${tenantId}/users/${userId}`;
  return C2Fetch.delete(url,null,'删除租户下的用户失败');
}
// 添加用户至指定租户
export function addTenantUser(tenantId,params){
  const url = proxyTp +`tp/v1/tenants/${tenantId}/users`;
  return C2Fetch.post(url,params,null,'添加用户至指定租户失败');
}
// 获取租户用户数
export function getTenentUsercount(tenantId){
  const url = proxyTp +`tp/v1/tenants/${tenantId}/usercount`;
  return C2Fetch.get(url,null,'获取租户用户数失败');
}

  //获取用户数目统计
export function getUserCount(tenant){
  const url=proxyTp+`tp/v1/tenants/${tenant}/usercount`;
  return C2Fetch.get(url,null,null);
}