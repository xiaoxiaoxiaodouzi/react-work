import moment from 'moment';


export function formateValue(value){
  return value?value:value===0?0:'--'
}

export function getTimeDistance(type,num) {
  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;
  const tempTime = new Date();
  let n = 1;
  if(num){
    n = num;
  }
  if(type === "hour"){
    
    return [moment(tempTime.getTime()-n * oneHour),moment(tempTime)];
  }
  //取过去24小时 
  if(type === "day"){
    return [moment(tempTime.getTime()-n * oneDay),moment(tempTime)];
  }
  if (type === 'today') {
    return [moment(tempTime.getTime()-n * oneDay), moment(tempTime)];
  }
  if (type === 'week') {
    return [moment(tempTime.getTime()-n *7*oneDay), moment(tempTime)];
  }
  if (type === 'month') {
    return [moment(tempTime.getTime()-n *30*oneDay), moment(tempTime)];
  }
  if (type === 'year') {
    return [moment(tempTime.getTime()-n *365*oneDay), moment(tempTime)];
  }
}


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function checkCmd(cmd) {
  cmd.trim();
  const arr = cmd.split(" ");
  if (arr.length < 2) {
    return false;
  }
  return true;
}

/*生成txt文件 */
export function downloadTxt(content,name){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', name);
  
  element.style.display = 'none';
  document.body.appendChild(element);
  
  element.click();
  
  document.body.removeChild(element);
}

/*首字母大写*/
export function upFirstWord(str){
  var firstW = str.substring(0,1).toUpperCase();
  var lastW = str.substring(1,str.length);
  return firstW+lastW;
}

/*!
* FastJson Plugin v1.0
* https://github.com/sdragoncai/fastjson.js
* Copyright 2015 dragoncai（蔡小龙）
* Email dragoncai@banbang.cn
*/
export var FastJson = {
  isArray: function (a) {
      return "object" === typeof a && "[object array]" === Object.prototype.toString.call(a).toLowerCase()
  },
  isObject: function (a) {
      return "object" === typeof a && "[object object]" === Object.prototype.toString.call(a).toLowerCase()
  },
  format: function (a) {
      if (null === a) return null;
      // eslint-disable-next-line
      "string" === typeof a && (a = eval("(" + a + ")"));
      return this._format(a, a, null, null, null)
  },
  _randomId: function () {
     // eslint-disable-next-line
      return "randomId_" + parseInt(1E9 * Math.random())
  },
  _getJsonValue: function (a, c) {
      var d = this._randomId(), b;
       // eslint-disable-next-line
      b = "" + ("function " + d + "(root){") + ("return root." + c + ";");
      b += "}";
      b += "";
      var e = document.createElement("script");
      e.id = d;
      e.text = b;
      document.body.appendChild(e);
      d = window[d](a);
      e.parentNode.removeChild(e);
      return d
  },
  _format: function (a, c, d, b, e) {
      d || (d = "");
      if (this.isObject(c)) {
          if (c.$ref) {
              var g = c.$ref; 0 === g.indexOf("$.") && (b[e] = this._getJsonValue(a, g.substring(2)));
              return
          }
           // eslint-disable-next-line
          for (var f in c) b = d, "" !== b && (b += "."), g = c[f], b += f, this._format(a, g, b, c, f)
           // eslint-disable-next-line
      } else if (this.isArray(c)) for (f in c) b = d, g = c[f], b = b + "[" + f + "]", this._format(a, g, b, c, f); return a
  }
};

/**
 * 从列表返回数据中获取分页对象
 * @param {object} result 远程返回的Page对象，包括当前页数据和分页信息
 * @param {event} pageChange(current, pageSize) 点击分页的回调函数，用来触发远程请求
 */
export function getPagination(result,pageChange){
  const pageSizeOptions = ['10','20','50'];
  if(result.totalPage>50)pageSizeOptions.push(result.totalPage.toString());
  const pagination = {
    current: result.pageIndex,
    total: result.total,
    pageSize: result.pageSize,
    pageSizeOptions:pageSizeOptions,
    showSizeChanger:true,
    showTotal: (total, range) => `共 ${total} 条记录`,
    onChange: pageChange,
    onShowSizeChange:pageChange
  }
  return pagination;
}

/**
 * 将查询条件放到当前url上
 * @param {object} history 路由的history对象 
 * @param {object} params 需要拼接到url的参数
 */
export function pushUrlParams(history,params){
  const pathname = history.location.pathname;
  
  const urlParam = pathname.includes('?')?'&':'?'+objToUrlParam(params);
  history.push(pathname+urlParam);
}

/**
 * 将url上的参数转为对象
 * @param {string} urlParamString url上的参数字符串，一般从路由对象中获取:history.location.search
 * @return {object} url参数转换后的对象
 */
export function urlParamToObj(urlParamString){
  if(urlParamString.startsWith('?'))urlParamString = urlParamString.substring(1);
  let obj = {};
  const paramStringArray = urlParamString.split('&');
  paramStringArray.forEach(paramString=>{
    const paramSplit = paramString.split('=');
    if(paramSplit.length === 2){
      const key = paramSplit[0].trim();
      const value = decodeURI(paramSplit[1].trim());
      if(obj[key]){
        if(Array.isArray(obj[key]))obj[key].push(value);
        else obj[key] = [obj[key],value];
      }else{
        obj[key] = value;
      }
    }
  })
  return obj;
}

export function objToUrlParam(obj){
  let paramStringArray = [];
  Object.keys(obj).forEach(key=>{
    let value = obj[key];
    if (Array.isArray(value)){
      value.forEach(v => {
        paramStringArray.push(key + "=" + encodeURI(v));
      })
    }else if(value!==undefined && value !== "")paramStringArray.push(key+'='+encodeURI(value));
  })
  return paramStringArray.join('&');
}

//转换成Gi
export function quotaFormat(param){
  if(param.indexOf('m')>0){
    let i=(parseFloat(param.substring(0,param.length-1))/1024/1024/1024/1000).toFixed(2);
    return i+'Gi'
  }else if(param.indexOf('Mi')>0){
     let i=(parseFloat(param.substring(0,param.length-2))/1024).toFixed(2);
    return i+'Gi';
  }else{
    return param;
  }
}

//转换成Mi
export function quotaMiFormat(param){
  if(param.indexOf('Gi')>0){
    return parseFloat(param.substring(0,param.length-2))*1024+'Mi'
  }
}