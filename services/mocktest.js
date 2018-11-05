import C2Fetch from '../utils/Fetch';

//查询应用信息 
export function mockTest(){
  return C2Fetch.get('mocktest/get').then(function(response) {
		return response.json();
	});
}