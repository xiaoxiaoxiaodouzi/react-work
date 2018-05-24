

class C2QuickSearch {

  //递归判定条件
  _checkConditon(datablob, condition) {

    let checkData = null;//需要被比对的数据
    //判定键值是否存在
    if (!condition[0]) {
      return false;
    }

    //判断value是否在第一级
    var splitArray = condition[0].split("/");
    if (splitArray.length) {
      var temp = datablob;
      for (var n = 0; n < splitArray.length; n++) {
        temp = temp[splitArray[n]];
      }
      checkData = temp;
    } else {
      checkData = datablob[condition[0]];
    }

    let result = false;
    switch (condition[1]) {
      case '==': 
        if (checkData === condition[2]) result = true;
        break;
      case '!=': 
        if (checkData !== condition[2]) result = true;
        break;
      case 'like': 
        var str = checkData;
        var patt = new RegExp(condition[2]); //主意是非全局匹配
        var ret_test = patt.test(str);
        if (ret_test) result = true;
        break;
      default: break;
    }
    return result;
  }

  //多条件匹配condition=[[['name','like','刘'],'&&',['pid','==','12ewefdf32']],"||",['name','==','刘圣坚']]
  _checkConditionResult(datablob, condition) {

    if (typeof condition !== 'object' && condition.length !== 3) {
      return false;
    }

    if (typeof condition[1] !== 'string') {
      return false;
    }

    //嵌套条件情况
    if (typeof condition[0] === 'object') {
      var resultBool;
      var childCondition = condition[0];
      resultBool = this._checkConditionResult(datablob, childCondition);
      //嵌套条件 && || 快速判断
      if (resultBool) {
        if (condition[1] === '||') {
          return true;
        }else if(condition[1] === '&&'){
          return this._checkConditionResult(datablob, condition[2]);
        }
      } else if (!resultBool) {
        if (condition[1] === '&&') {
          return false;
        } else if (condition[1] === '||') {
          if (typeof condition[2] === 'object') {
            return this._checkConditionResult(datablob, condition[2]);
          } else {
            return this._checkConditon(datablob, condition[2]);
          }
        }
      }
    }

    //普通条件
    //类型检查
    if (typeof condition[0] !== 'string') {
      return false;
    }

    return this._checkConditon(datablob, condition);
  }

  //模糊拼音匹配
  // static switchPinyin(datablob) {
  //   const pinyin = require("./pinyin");
  //   var cnpinyin = pinyin.getFullChars(datablob, false);
  //   return cnpinyin;
  // }

  static search(json, condition) {
    var resultArray = [];
    for (var key in json) {
      //必须满足条件
      if (C2QkS._checkConditionResult(json[key], condition)) {
        resultArray.push(json[key]);
      }
    }
    return resultArray;
  }

  static query(json, condition) {
    var resultArray = [];
    for (var key in json) {
      //必须满足条件
      if (C2QkS._checkConditionResult(json[key], condition)) {
        resultArray.push(json[key]);
      }
    }
    return resultArray;
  }
}
const C2QkS = new C2QuickSearch();
module.exports = C2QuickSearch;