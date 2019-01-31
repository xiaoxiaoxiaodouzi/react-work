import C2Fetch from '../utils/Fetch';
let proxy = 'proxy/';


//查询顶层机构
export function getTopOrgs(){
	const url=proxy+`uop/v1/toporgs`
	return C2Fetch.get(url,{},'查询顶层机构出错！')
}
//查询分类机构
export function getCategoryOrgs(){
	const url=proxy+`uop/v1/categoryorgs`
	return C2Fetch.get(url,{},'查询顶层机构出错！')
}
//查询机构树
export function getOrgsTree(categoryId){
	const url=proxy+`uop/v1/orgs/0/children`
	return C2Fetch.get(url,{categoryId:categoryId},'查询机构树出错！')
}
//根据机构id查询机构数据
export function getChildrenOrgs(orgId,queryParam){
	const url=proxy+`uop/v1/orgs/${orgId}/children`
	return C2Fetch.get(url,queryParam,'查询机构数据出错！')
}

//查询用户组数据
export function getUsergroups(queryParam){
	const url=proxy+`uop/v1/usergroups`
	return C2Fetch.get(url,queryParam,'查询用户组数据出错！')
}
//查询机构下的用户数
export function getUserCount(categoryId,ids,cascade){
	const url=proxy+`uop/v1/usercounts`
	return C2Fetch.get(url,{categoryId:categoryId,cascade:cascade,id:ids},'查询机构下的用户数出错！')
}


//查询用户组关联的用户
export function getUsersByGroup(id,header){
	const url=proxy+`uop/v1/usergroups/${id}/users`
	return C2Fetch.get(url,{},'查询用户组关联用户失败',header)
}

//设置用户组关联的用户
export function putUsersByGroup(id,ids){
	const url=proxy+`uop/v1/usergroups/${id}/users`
	return C2Fetch.put(url,null,ids,'设置用户组关联用户失败')
}
//根据机构名称查询机构信息
export function searchOrgByName(queryParam){
	const url=proxy+`uop/v1/orgs`
	return C2Fetch.get(url,queryParam,'根据机构名称查询机构信息出错！')
}
//查询岗位数据
export function getJobs(queryParam){
	const url=proxy+`uop/v1/jobs`
	return C2Fetch.get(url,queryParam,'查询岗位数据出错！')
}

//批量查询角色下面的用户
export function getUsersByroleList(){
	
}


//查询用户集合下的用户详情
export function getCollectionUsers(queryParam){
	const url=proxy+`uop/v1/usercollectionusers`
	return C2Fetch.get(url,queryParam,'查询用户集合下的用户出错')
}



/* 
export async function setRoleMangage(){
	let x  = await this.setRoleMangage()
	xxx.setRoleMangage
	return 
} */


//获取用户详情
export function getUserInfos(id){
  const url=proxy+`uop/v1/users/${id}`;
  return C2Fetch.get(url,null,'获取用户信息出错');
}
  

  //批量将机构的数据权限(r:只读,rw:读写)授权给应用
export function orgPermissions(bodyParams){
  const url=proxy+`uop/v1/orgpermissions`
  return C2Fetch.post(url,bodyParams,null,"授权失败")
}
  
//解除应用下机构数据权限
export function deleteOrgPermissions(appid,categoryId){
  const url=proxy+`uop/v1/orgpermissions/apps/${appid}/categoryorgs/${categoryId}`
  return C2Fetch.delete(url,null,"解除应用机构数据权限失败")
}
  
// 获取用户属性
export function getUserDictdata(){
  const url = proxy +`udp/v1/dictdata?code=sex&code=certificateType&code=state`;
  return C2Fetch.get(url,null,'获取用户字典数据失败');
}