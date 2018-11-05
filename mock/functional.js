
import pathToRegexp from 'path-to-regexp';
import Mock from 'mockjs'

//随机ID    Mock.mock('@string("upper", 22)')          Random.string( pool?, min?, max? )
//随机名字   Mock.mock('@cname')
//随机时间   Mock.mock('@datetime()')
//随机标题   Mock.mock('@ctitle(5)')                    Random.ctitle( min?, max? )
//随机数字   Mock.mock('@integer(60, 100)')            Random.integer( min, max )
//随机语句   Mock.mock('@csentence()')                    Random.csentence( min, max 
const Random = Mock.Random;

export default [{
  name:'获取岗位',
  url: 'proxy/uop/v1/jobs',
  method: 'get',
  data: [
    { userCollectionName: Random.cname(), userCollectionId: Random.string("upper", 22),userCollectionType:'JOB' },
    { userCollectionName: Random.cname(), userCollectionId: Random.string("upper", 22),userCollectionType:'JOB' },
    { userCollectionName: Random.cname(), userCollectionId: Random.string("upper", 22),userCollectionType:'JOB' },
  ]
},{
  name:'获取用户组',
  url:'proxy/uop/v1/usergroups',
  method:'get',
  data: [
    { userCollectionName: Random.cname(), userCollectionId: Random.string("upper", 22),userCollectionType:'USERGROUP' },
    { userCollectionName: Random.cname(), userCollectionId: Random.string("upper", 22),userCollectionType:'USERGROUP' },
    { userCollectionName: Random.cname(), userCollectionId: Random.string("upper", 22),userCollectionType:'USERGROUP' },
  ]
},/*  {
  //查询角色资源数据
  url: pathToRegexp('proxy/aip/v1/apps/:appId/roles/:roleId/resources(.*)'),
  method: 'get',
  data: {
    pageIndex: 1,
    pageSize: 10,
    total: 2,
    totalPage: 1,
    contents: [
      {
        name: '功能A', id: '123', appId: 'xxx', code: 'aaa', parentId: 'sda', type: 'function', source: 'asdf'
      }, {
        name: '功能b', id: '123', appId: 'xxx', code: 'aaa', parentId: 'sda', type: 'function', source: 'asdf'
      }]
  }
},  */{
  //查询角色用户集合
  url: pathToRegexp('proxy/aip/v1/apps/:appId/roles/:roleId/usercollections'),
  method: 'get',
  data: {
    "pageIndex": 1,
    "pageSize": 10,
    "total": 1,
    "contents": [{
      "id": "asdf",
      "useruserCollectionId": Random.string("upper", 22),
      "userCollectionType": "ORG",
      "creator": Random.cname(),
      "createtime": Random.datetime(),
      "userCollectionName":Random.ctitle(5),
      "userCount":Random.integer(60, 100)
    }]
  }
},{
  //取消角色下的授权用户集合
  url:pathToRegexp('proxy/aip/v1/apps/:appId/roles/:roleId/usercollections/:id'),
  method:'delete',
  data:[]
}
, {
  //查询角色下的用户
  url: pathToRegexp('proxy/aip/v1/apps/:appId/roles/:roleId/users(.*)'),
  method: 'get',
  data: {
    pageIndex: 1,
    pageSize: 10,
    total: 2,
    totalPage: 1,
    contents: [{
      userId: Random.string("upper", 22),
      userName: Random.cname(),
      userCollections: [{
        userCollectionId: Random.string("upper", 22),
        userCollectionName: Random.cname(),
        userCollectionType: 'ORG'
      }, {
        userCollectionId: Random.string("upper", 22),
        userCollectionName: Random.cname(),
        userCollectionType: 'ORG'
      }
      ]
    }]
  }
}, {
  url: pathToRegexp('proxy/uop/v1/usercollection/users'),
  method: 'get',
  data: {
    contents: [{
      userId: Random.string("upper", 22),
      userName: Random.cname(),
      userCollections: [{
        'userCollectionId': Random.string("upper", 22),
        'userCollectionType': 'ORG',
        'userCollectionName': Random.cname()
      }]
    }],
    pageIndex: 1,
    pageSize: 10,
    total: 2,
    totalPage: 1
  }
},/*  {
  //查询应用某个用户集合下的所有用户
  url: pathToRegexp('proxy/uop/v1/usergroups/:id/users'),
  method: 'get',
  data: {
    contents: [{
      name: Random.cname(),
      org: Mock.mock('@ctitle(5)'),
      roles:Mock.mock('@ctitle(4)'),
      data1: Mock.mock('@ctitle(2)'),
      users: '岗位：产品交付',
    }, {
      name: '马德华',
      org: '平台研究所',
      roles: '测试角色B',
      data1: '功能B',
      users: '岗位：开发人员',
    }],
    pageIndex: 1,
    pageSize: 10,
    total: 20,
    totalPage: 2
  }
}, */ 
 /* {
  //查询资源
  url:pathToRegexp('proxy/aip/v1/resources(.*)'),
  method:'get',
  data:{
    contents: [{
      name: Mock.mock('@ctitle(5)'),
      id: 1,
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: Mock.mock('@string("upper", 4)'),
      parentId: 0,
      type: 'function',
      source: Mock.mock('@string("upper", 4)'),
      uri: Mock.mock('@string("upper", 4)')
    }, {
      name: Mock.mock('@ctitle(5)'),
      id: 2,
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: Mock.mock('@string("upper", 4)'),
      parentId: 1,
      type: 'function',
      source: Mock.mock('@string("upper", 4)'),
      uri: Mock.mock('@string("upper", 4)')
    },{
      name: Mock.mock('@ctitle(5)'),
      id: 6,
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: Mock.mock('@string("upper", 4)'),
      parentId: 1,
      type: 'function',
      source: Mock.mock('@string("upper", 4)'),
      uri: Mock.mock('@string("upper", 4)')
    },{
      name: Mock.mock('@ctitle(5)'),
      id: 3,
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: Mock.mock('@string("upper", 4)'),
      parentId: 2,
      type: 'function',
      source: Mock.mock('@string("upper", 4)'),
      uri: Mock.mock('@string("upper", 4)')
    },{
      name: Mock.mock('@ctitle(5)'),
      id: 4,
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: Mock.mock('@string("upper", 4)'),
      parentId: 3,
      type: 'function',
      source: Mock.mock('@string("upper", 4)'),
      uri: Mock.mock('@string("upper", 4)')
    },{
      name: Mock.mock('@ctitle(5)'),
      id: 5,
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: Mock.mock('@string("upper", 4)'),
      parentId: 4,
      type: 'function',
      source: Mock.mock('@string("upper", 4)'),
      uri: Mock.mock('@string("upper", 4)')
    }],
    pageIndex: 1,
    pageSize: 10,
    total: 2,
    totalPage: 2
  }
},  */
/*  {
  //查询某个功能关联的资源
  url: pathToRegexp('proxy/aip/v1/apps/:appId/resources/:id'),
  method: 'get',
  data: {
    contents: [{
      name: Mock.mock('@ctitle(5)'),
      id: 'ceshi',
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: 'aaa',
      parentId: Mock.mock('@string("lower", 22)'),
      type: 'function',
      source: Mock.mock('@string("upper", 4)')
    }, {
      name: Mock.mock('@ctitle(5)'),
      id: 'ceshi',
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: 'aaa',
      parentId: Random.string("upper", 22),
      type: 'function',
      source: Mock.mock('@string("upper", 4)')
    }],
    pageIndex: 1,
    pageSize: 10,
    total: 2,
    totalPage: 2
  }
},   *//*  {
  //修改某个功能关联的资源
  url: pathToRegexp('proxy/aip/v1/apps/:appId/resources/:id(.*)'),
  method: 'post',
  data: {
    contents: [{
      name: Random.ctitle(5),
      id: 'ceshi',
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: 'aaa',
      parentId: Random.string("lower", 22),
      type: 'function',
      source: Random.string("upper", 4)
    }, {
      name: Random.ctitle(5),
      id: 'ceshi',
      appId: 'lJVF0LSZSDib9WHUqno6iaAg',
      code: 'aaa',
      parentId: Random.string("upper", 22),
      type: 'function',
      source: Random.string("upper", 4)
    }],
    pageIndex: 1,
    pageSize: 10,
    total: 2,
    totalPage: 2
  }
},  */  {
  //查询权限资源关联的角色 
  url: pathToRegexp('proxy/aip/v1/apps/:appId/resources/:id/roles(.*)'),
  method: 'get',
  data: {
    contents: [{
      "id":Random.string("upper", 22),
      "roleId": "cnFaI7TJQBy_V_KoEAfH5g",
      "roleName": Random.cname(),
      "roleDesc": Random.csentence() ,
      "userCollections": [{ userCollectionId: Random.string("upper", 22), userCollectionName: Random.cname(), userCollectionType: 'JOB' }],
    }, {
      "id": Random.string("upper", 22),
      "roleId": "cnFaI7TJQBy_V_KoEAfH5g",
      "roleName":Random.cname(),
      "roleDesc": Random.csentence() ,
      "userCollections": [{ userCollectionId:Random.string("upper", 22), userCollectionName:Random.cname(), userCollectionType: 'USERGROUP' }],
    }],
    pageIndex: 1,
    pageSize: 10,
    total: 20,
    totalPage: 2
  }
}, {
  //移除权限资源关联的角色
  url: pathToRegexp('proxy/aip/v1/apps/:appId/resources/:id/roles/:roleId'),
  method: 'delete',
  data: []
}, {
  //查询资源下关联的用户
  url: pathToRegexp('proxy/aip/v1/apps/:appId/resources/:id/users(.*)'),
  method: 'get',
  data: {
    pageIndex: 1,
    pageSize: 10,
    total: 2,
    totalPage: 2,
    contents: [{
      userId: Random.string("upper", 22),
      userName: Random.cname(),
      userCollections: [{
        userCollectionId: Random.string("upper", 22),
        userCollectionName: Random.cname(),
        userCollectionType: 'JOB'
      }, {
        userCollectionId: Random.string("upper", 22),
        userCollectionName: Random.cname(),
        userCollectionType: 'ORG'
      }],
      roleList: [{
        id: 'cnFaI7TJQBy_V_KoEAfH5g',
        name: Random.cname()
      }, {
        id: 'cnFaI7TJQBy_V_KoEAfH5g',
        name: Random.cname()
      }]
    }]
  }
},{
   //查询应用下关联的用户
url: pathToRegexp('proxy/aip/v1/apps/:appId/permittedusers(.*)'),
method: 'get',
data: {
  pageIndex: 1,
  pageSize: 10,
  total: 2,
  totalPage: 2,
  contents: [{
    userId: Random.string("upper", 22),
    userName: Random.cname(),
    userCollections: [{
      userCollectionId: Random.string("upper", 22),
      userCollectionName: Random.cname(),
      userCollectionType: 'ORG'
    }, {
      userCollectionId: Random.string("upper", 22),
      userCollectionName: Random.cname(),
      userCollectionType: 'ORG'
    }],
    roleList: [{
      id: 'cnFaI7TJQBy_V_KoEAfH5g',
      name: Random.cname()
    }, {
      id: 'cnFaI7TJQBy_V_KoEAfH5g',
      name: Random.cname()
    }],
    resourceList:[{id:Random.string("upper", 22),name:Random.cname()}]
  }]
}
},/*{
    url:'begin:proxy/aip/v1/resources',
    method:'get',
    data:{
      contents:[
        { name:'功能A',id:'123',appName:'大家一起用',appId:'xxx',roleList:[{id:'aaxiangasdf',name:'juese详情'}],desc:'asdf',managerList:[{managerId:'aaasda',managerName:'管理员'}],userCollectionList:[{userCollectionId:'asdfa',userCollectionName:'用户集合',userCollectionType:'ORG'}]},
        { name:'功能B',id:'123',appName:'大家一起用',appId:'xxx',roleList:[{id:'aaxiangasdf',name:'juese详情'}],desc:'asdf',managerList:[{managerId:'aaasda',managerName:'管理员'}],userCollectionList:[{userCollectionId:'asdfa',userCollectionName:'用户集合',userCollectionType:'ORG'}]},
        { name:'功能C',id:'123',appName:'大家一起用',appId:'xxx',roleList:[{id:'aaxiangasdf',name:'juese详情'}],desc:'asdf',managerList:[{managerId:'aaasda',managerName:'管理员'}],userCollectionList:[{userCollectionId:'asdfa',userCollectionName:'用户集合',userCollectionType:'ORG'}]},
      ],
      pageIndex:1,
      pageSize:10,
      total:20,
      totalPage:2
    }
  },{
    //查询权限资源关联的角色 接口未知
    url:pathToRegexp('xxx'),
    method:'get',
    data:{
      contents:[{"appId":"0","code":"default","defaultRole":true,"desc":"普通角色","id":"0","name":"普通角色"},{"appId":"0","code":"admin","defaultRole":false,"desc":"在应用管理系统中具有超级管理员权限的角色","id":"HtopsMiFS7iI2ZW61T_lWw","name":"平台管理员"}]
      pageIndex:1,
      pageSize:10,
      total:20,
      totalPage:2
    }
  },{
     //角色详情操作记录 接口未知
     url:pathToRegexp('xxx'),
     method:'get',
     data:{
 
    }
  } */
  
]