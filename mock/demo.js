/**
 * 根据后台接口功能版本分类，每一个新版本加的接口作为一个模块。新建的模块记得添加到./index.js。
 * 
 * 导出数组，对象格式为：
 * name：接口描述
 * url:请求的路径,可以精确匹配路径，例如：'ws/getSubject';或者某路径开头或结尾的'begin:proxy/aip/vi/apps','end:.jpg'。
 *    如果有路径上带有query参数'?xxx=123',可以通过begin进行匹配
 *    如果有路径上带有path参数，可以通过pathToRegexp对象进行匹配。https://github.com/pillarjs/path-to-regexp
 * method:请求方式,get,post,put,delete,head,patch。默认get请求
 * data:请求返回的数据,可以是对象，也可以是函数。
 *    请务必按照接口文档格式写，如果有调整，需要告知到接口开发人员同步进行调整
 * 
 * mock数据更详细文档请参考：http://www.wheresrhys.co.uk/--mock/api
 * 
 * http://mockjs.com/examples.html#Name
 */

import pathToRegexp from 'path-to-regexp';
import Mock from 'mockjs';
const Random = Mock.Random;

export default [
  {
    name:'获取应用详情',
    url:pathToRegexp('proxy/aip/v1/apps/:id'),
    data:{"name":"Mock测试数据","acl":true,"apm":false,"clusterName":"开发集群","code":"tenant-management","createtime":1510904661000,"creator":"admin","deployMode":"k8s","desc":"","groupId":"aipGroup","healthCheck":false,"host":"tp.dev.c2cloud.cn","icon":"http://s3.c2cloud.cn/icons/2017/7/9/1-default.svg","id":"jgicJSKuOSaaXticsYcDCxfQ","routeId":"fftefMrKTYqPNyHzamwRQg","schema":"http","sn":7,"springcloud":false,"status":"succeeded","stripurl":"0","tenant":"develop","type":"web","updatetime":1535608539000,"upstream":"N0p2pk7KRZ2LPtOAUn66TA","uri":"/"}
  },
  {
    url:pathToRegexp('proxy/aip/v1/groups/:groupId/services/:serviceId/grationapps(.*)'),
    data:{"contents":[{"clusterName":"开发集群","code":"apps-integration","createtime":1503368516000,"creator":"admin","deployMode":"k8s","desc":"应用资源管理系统以应用或服务为管理粒度，将应用和服务当作系统的管理对象资源，使用多租户管理机制，系统管理者能够为租户创建适合的物理或逻辑集群，租户的所有资源集中运行在该定义的资源集群内，有效防止与其他租户的资源抢占与权限冲突。","groupId":"aipGroup","host":"http://aip.dev.c2cloud.cn","icon":"string","id":"0","name":"mock数据B","routeId":"0","schema":"http","sn":1,"status":"succeeded","stripurl":"0","tags":[{"id":"GE6Bu5TxRxmpwzdyLDpRHQ","name":"基础平台"}],"tenant":"develop","type":"web","updatetime":1533886200000,"upstream":"dWfR1pJjRRu12f1COIMWkQ","uri":"/"},{"clusterName":"测试集群","code":"uop-platform","createtime":1501566827000,"creator":"admin","deployMode":"k8s","desc":"12345d","groupId":"aipGroup","host":"http://uop.dev.c2cloud.cn","id":"2","name":"mock数据A","replicas":1,"routeId":"2","schema":"http","sn":3,"status":"succeeded","stripurl":"f","tags":[{"id":"GE6Bu5TxRxmpwzdyLDpRHQ","name":"基础平台"}],"tenant":"develop","type":"web","updatetime":1534304061000,"upstream":"http://X_M9KSluSuOVLP0xfnKv3w","uri":"/"}],"pageIndex":1,"pageSize":10,"total":2,"totalPage":1}
  },
  {
    url:'begin:proxy/aip/v1/resources',
    method:'get',
    data:{
      contents:[{id:'123',name:Random.cname(),desc:Random.cparagraph(),appName:Random.ctitle(),appId:'xxx',userCollectionList:[]}
      ],
      pageIndex:1,
      pageSize:10,
      total:20,
      totalPage:2
    }
  },{
    url:'ws/getSubject',
    method:'post',
    data:(url,opts)=>{
      return {id:'admin',realname:"bbbPost"};
    }
  },{
    url:'ws/getSubject',
    method:'get',
    data:(url,opts)=>{
      return {id:'admin',realname:Random.cname()+"get"};
    }
  }
]