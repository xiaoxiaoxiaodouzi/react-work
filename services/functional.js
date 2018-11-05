import C2Fetch from '../utils/Fetch';
let proxy = 'proxy/';

//查询资源
export function getResources(queryParam){
	const url=proxy+`aip/v1/resources`
	return C2Fetch.get(url,queryParam,'查询资源出错！')
}

//查询子资源
export function getResource(appId,queryParams){
	const url=proxy+`aip/v1/apps/${appId}/resources`
	return C2Fetch.get(url,queryParams,'查询资源出错！')
} 

//查询应用下的功能
export function getResourceTree(appId,queryParams){
	const url=proxy+`aip/v1/apps/${appId}/resourcetree`
	return C2Fetch.get(url,queryParams,'查询资源出错！')
} 

//查询资源详情
export function getResourceById(appId,id,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}`
	return C2Fetch.get(url,bodyParam,{},'查询资源出错！')
}

//查询资源下的用户集合
export function getResourceUserCollections(appId,id){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/usercollections`
	return C2Fetch.get(url,{},'修改资源出错！')
}

//修改资源
export function updateResource(appId,id,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}`
	return C2Fetch.post(url,bodyParam,{},'修改资源出错！')
}
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

//新增资源
export function addResource(appId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/resources`
	return C2Fetch.post(url,bodyParam,{},'新增资源出错')
}


/* //查询用户集合下面的用户
export function getUsersCollection(queryParam){
	const url=proxy+`/uop/v1/usercollection/users`;
	return C2Fetch.get(url,queryParam,'获取用户集合失败')
} */

//查询角色下的用户
export function getUsersByRoleId(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/users`;
	return C2Fetch.get(url,queryParam,'查询角色下的用户失败')
}

//查询用户组关联的用户
export function getUsersByGroup(id){
	const url=proxy+`uop/v1/usergroups/${id}/users`
	return C2Fetch.get(url,{},'查询用户组关联用户失败')
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
//查询角色资源数据
export function getRoleResources(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources`
	return C2Fetch.get(url,queryParam,'查询角色资源数据出错！')
}

//批量查询角色下面的资源数据
export function getRoleListResources(queryParam){
	const url=proxy+`aip/v1/roleresources`;
	return C2Fetch.get(url,queryParam,'获取角色下面的资源出错！')
}

//批量查询角色下面的用户
export function getUsersByroleList(){
	
}
//删除功能/aip/v1/apps/{appId}/resources/{id}
export function deleteFunctional(appId,id){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}`
	return C2Fetch.delete(url,{},'删除功能失败！')
}
// 查询权限资源的用户信息
export function getResourceUser(appId,id,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/users`
	return C2Fetch.get(url,queryParam,'查询权限资源的用户信息出错')
}

//查询角色下已授权用户集合 aip/v1/apps/{appId}/roles/{roleId}/usercollections
export function getRoleUserCollection(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections`
	return C2Fetch.get(url,queryParam,'查询角色下已授权用户集合数据出错！')
}
// 新增授权用户集合
export function addUserCollection(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections`
	return C2Fetch.post(url,bodyParam,{},'新增用户集合出错')
}
// 替换用户集合
export function updateUserCollection(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections`
	return C2Fetch.put(url,bodyParam,{},'角色授权用户集合出错')
}
///aip/v1/apps/{appId}/roles/{roleId}/usercollections/{id}
export function deleteUserCollection(appId,roleId,id){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/usercollections/${id}`
	return C2Fetch.delete(url,{},'角色取消授权用户集合出错')
}
///aip/v1/apps/{appId}/roles/{roleId}/resources 角色关联资源
export function addRoleResource(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources`
	return C2Fetch.post(url,bodyParam,{},'角色关联资源出错')
}
//aip/v1/apps/{appId}/roles/{roleId}/resources 角色解除关联资源
export function deleteRoleResource(appId,roleId,resId){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources/${resId}`
	return C2Fetch.delete(url,{},'角色解除关联资源出错')
}

export function updateRoleResource(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/resources`
	return C2Fetch.put(url,bodyParam,{},'角色关联资源出错')
}
//查询资源关联的角色信息 aip/v1/apps/{appId}/roles/{roleId}/usercollections
export function getResourceRole(appId,id,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/roles`
	return C2Fetch.get(url,queryParam,'查询资源关联的角色信息出错！')
}

//移除资源关联的角色
export function deleteResourceRole(appId,id,roleId){
	const url=proxy+`aip/v1/apps/${appId}/resources/${id}/roles/${roleId}`
	return C2Fetch.delete(url,{},'移除资源关联的角色失败')
} 

export function globalrolemanages(){
	const url = proxy+`aip/v1/globalrolemanages`;
	return C2Fetch.get(url,null,'查询全局角色管理员失败');
}

//角色授权管理员用户集合
export async function roleManagerUsers(appId,roleId,bodyParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/managers`
	let data = await C2Fetch.put(url,bodyParam,{},'角色授权管理员用户集合出错');
	return data;
}

//角色授权管理员用户集合
export function getRoleManagerUsers(appId,roleId,queryParam){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/managers`
	return C2Fetch.get(url,queryParam,'角色授权管理员用户集合出错')
}

///aip/v1/apps/{appId}/roles/{roleId}/managers/{id}
export function deleteRoleManager(appId,roleId,id){
	const url=proxy+`aip/v1/apps/${appId}/roles/${roleId}/managers/${id}`
	return C2Fetch.delete(url,{},'删除角色授权管理员用户集合出错')
}

//查询用户集合下的用户详情
export function getCollectionUsers(queryParam){
	const url=proxy+`uop/v1/usercollectionusers`
	return C2Fetch.get(url,queryParam,'查询用户集合下的用户出错')
}

//角色授权管理员用户集合
export async function permissionsVerify(bodyParam,queryParam){
	const url=proxy+`aip/v1/permissions/verify`
	let data =C2Fetch.post(url,bodyParam,queryParam,'鉴权出错');
	return data;
}

//查询所有权限资源Code接口
export function getAllPermissions(queryParam){
	const url=proxy+`aip/v1/allpermissions`
	return C2Fetch.get(url,queryParam,'查询权限资源编码出错')
}

/* 
export async function setRoleMangage(){
	let x  = await this.setRoleMangage()
	xxx.setRoleMangage
	return 
} */