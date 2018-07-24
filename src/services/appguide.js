import {queryContainerConfig} from './deploy'

let quotaData;
const appUtil = {
  getQuotaData:async ()=>{
    if(quotaData)return quotaData;
    else{
      quotaData = await queryContainerConfig();
      return quotaData;
    }
  },
  getQuota: async (index)=>{
    let quotaData = await appUtil.getQuotaData();
    return quotaData[index];
  }
}

export default appUtil;