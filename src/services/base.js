import C2Fetch from '../utils/Fetch';

let proxy = 'proxy/';
export let base = {
  currentUser:null,
  environments:[],
  currentEnvironment:null,
  currentTenantInfo:null,
  tenant:null,
  configs:null,
  getCurrentUser:()=>{
    const url=`ws/getSubject`;
    return C2Fetch.get(url,null,"获取当前用户信息失败");
  },
  loginOut:()=>{
    const url=`ws/logout`;
    return C2Fetch.get(url,null,"退出登录失败");
  },
  getUserTenants:(userId) => {
    let url = proxy+`tp/v1/tenantusers/${userId}/tenants`;
    if(userId === 'admin'){
      url = proxy+'tp/v1/tenants'
    }
    return C2Fetch.get(url,null,"获取用户租户信息失败");
  },
  getAppState:(stateCode)=>{
    const stateMap = {
      succeeded:{name:'运行中',color:'green'},
      failed:{name:'失败',color:'red'},
      running:{name:'启动中',color:'yellow'},
      pending:{name:'等待',color:'red'},
      stop:{name:'停止',color:'red'}
    }
    return stateMap[stateCode];
  },
  getEnvironments:()=>{
    let url = 'amp/v1/envs';
    return C2Fetch.get(url,null,"获取环境信息失败");
  }
}
