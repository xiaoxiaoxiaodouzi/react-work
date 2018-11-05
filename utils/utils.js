import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function formateValue(value){
  return value?value:value===0?0:'--'
}

export function deepClone(p){
  var c = {};   //目标对象默认为空
  for (var i in p) {       //遍历原对象中的所有可枚举key
    if (typeof p[i] === 'object') {      //属性是否为对象或数组
  　　  c[i] = (p[i].constructor === Array) ? [] : {};    // 将目标对象对应属性设置为空对象或空数组
  　　  deepClone(p[i]);  //递归拷贝子对象的所有属性
    } else {
  　　  c[i] = p[i];         //如果为基本数据类型则直接赋值
  　 }
  }
  return c;
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

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
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
