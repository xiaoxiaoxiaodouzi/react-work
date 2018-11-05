import C2Fetch from '../utils/Fetch';
let proxy = 'proxy/';


export function postNavigation(navigation,id) {
	let url = proxy + `aip/v1/navigations`;
	if(id)url += `/${id}`;
    return C2Fetch.post(url, navigation,null, "操作失败");
}

export function getNavigations(search){
	const url = proxy+`aip/v1/navigationtree`;
	return C2Fetch.get(url,search,'查询全局导航错误');
}
export function addNavigationsFunctions(menuId,fnIds){
	const url = proxy+`aip/v1/navigations/${menuId}/functions`;
	return C2Fetch.put(url,fnIds,null,'添加菜单错误');
}
export function deleteNavigation(id){
    const url = proxy+`aip/v1/navigations/${id}`;
    return C2Fetch.delete(url,null,'删除菜单出错');
}
export function deleteNavigationFunction(mid,fid){
	const url = proxy+`aip/v1/navigations/${mid}/functions/${fid}`;
	return C2Fetch.delete(url,null,'删除菜单功能出错');
}
export function navigationsSort(pid,ids){
	const url = proxy+`aip/v1/navigations/${pid}/reorder`;
	return C2Fetch.put(url,ids,null,'导航排序失败');
}
