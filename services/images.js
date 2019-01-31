import C2Fetch from '../utils/Fetch';


//获取当前用户
export function getCurrentUser(){
  const url=`ws/getSubject`;
  return C2Fetch.get(url,null,'获取当前用户出错');
}



