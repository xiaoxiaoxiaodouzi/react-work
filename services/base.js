import C2Fetch from '../utils/Fetch';
import { message } from "antd";
// import constants from './constants';

export let base = {
  currentUser:{},
  environments:[],
  currentEnvironment:{},
  tenant:null,
  tenants:[],
  environment:'1',
  configs:{},
  menus:[],
  isAdmin:false,
  isAmpAdmin:false,
  safeMode:false,
  isRoleManager:false,
  allpermissions:[],
  checkPermission:(permission)=>{
    return this.base.isAdmin || this.base.allpermissions.includes(permission);
  },
  getCurrentUser:()=>{
    const url=`ws/getSubject`;
    return C2Fetch.get(url,null,"获取当前用户信息失败");
  },
  /**
   * 当前环境匹配顺序
   * 1. 匹配浏览器本地存储的环境（最后一次在当前浏览器中切换的环境）
   * 2. 找是否有包含主环境
   * 3. 默认选择第一个环境
   */
  getCurrentEnvironment:(allEnviroments)=>{
    if(!allEnviroments || allEnviroments.length === 0) return ;
    let currentEnvironment;
    let mainEnvironment;
    for (let index = 0; index < allEnviroments.length; index++) {
      const e = allEnviroments[index];
      if (window.localStorage.localEnvironmentId === e.id){
        currentEnvironment = e;
        break;
      } 
      if(e.isMain)mainEnvironment = e;
    }
    if(currentEnvironment === undefined)currentEnvironment = mainEnvironment?mainEnvironment:allEnviroments[0];
    
    return currentEnvironment;
  },
  loginOut:()=>{
    const url=`ws/logout`;
    return C2Fetch.get(url,null,false);
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
  //过滤到PASS租户
  filterTenantData:(tenantData)=>{
    let tenants = [];
    tenantData.forEach(t => {
      if (t.tenant_type && t.tenant_type.indexOf('PAAS') !== -1 && t.tenant_code) {
        tenants.push({ name: t.name, code: t.tenant_code, id: t.id });
      }
    })
    return tenants;
  },
  ampMessage:(title,description)=>{
    if(base.configs.errorMessage)message.error(title);
    if(base.configs.messageBell)base.addMessage({title,description});
  }
 
}
