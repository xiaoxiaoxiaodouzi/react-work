import C2Fetch from '../utils/Fetch';

let proxy = 'proxy/';
//获取应用菜单
export function getMenus(appId){
  const url=proxy+`aip/v1/apps/${appId}/menuTree`;
  return C2Fetch.get(url,null,"获取菜单目录出错");
}

//获取应用菜单详细树
export function getMenuTrees(appId){
  const url=proxy+`aip/v1/apps/${appId}/menutrees`;
  return C2Fetch.get(url,null,"获取菜单目录出错");
}

//应用菜单新增
export function addMenus(appId,bodyParams){
  const url=proxy+`aip/v1/apps/${appId}/menus`;
  return C2Fetch.post(url,bodyParams,null,"新增菜单目录出错");
}
//根据菜单Id查询指定菜单
export function getMenuById(appId,id){
  const url=proxy+`aip/v1/apps/${appId}/menus/${id}`
  return C2Fetch.get(url,null,"获取菜单信息出错"); 
}
//根据菜单Id删除指定菜单
export function deleteMenuById(appId,id){
  const url=proxy+`aip/v1/apps/${appId}/menus/${id}`
  return C2Fetch.delete(url,null,"删除菜单信息出错"); 
}
//应用菜单修改
export function updateMenus(appId,id,bodyParams){
  const url=proxy+`aip/v1/apps/${appId}/menus/${id}`;
  return C2Fetch.put(url,bodyParams,null,"修改菜单目录出错");
}
