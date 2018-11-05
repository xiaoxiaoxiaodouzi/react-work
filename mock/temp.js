// import Mock from 'mockjs';

// const Random = Mock.Random;
export default [
  {
    name:'全局管理员列表',
    url:'begin:proxy/aip/v1/globalrolemanages',
    data:[
      {name:'科创研究院',type:'ORG',userCount:50,roles:[{id:123,name:'角色A',functionalCount:20,application:{name:"机构用户",id:123}},{name:'角色B',functionalCount:30,application:{name:"机构用户"}}]},
      {name:'省中心支持组',type:'USERGROUP',userCount:50,roles:[{name:'角色A',functionalCount:20,application:{id:123,name:"机构用户"}},{name:'角色B',functionalCount:30,application:{name:"机构用户"}}]},
      {name:'运维管理员',type:'JOB',userCount:50,roles:[{name:'角色E',functionalCount:20,application:{name:"通讯录"}}]},
    ]
  },
  // {
  //   name:'全局导航',
  //   url:'begin:proxy/aip/v1/navigations',
  //   method:'get',
  //   data:[
  //     {id:'1',name:Random.cname(),type:'menu', desc:'xxxdesc',fontIcon:'ant-design',icon1:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png.',pid:'0',url:'www.baidu.com',functional:{id:123,name:'xxx功能'}},
  //     {id:'2',name:'机构用户',type:'functional',fontIcon:'twitter',url:'www.baidu.com',pid:'1',application:{name:'机构用户',id:'123'}},
  //     {id:'3',name:'订单管理',type:'functional',fontIcon:'weibo',url:'www.baidu.com',pid:'1',application:{name:'机构用户',id:'123'}},
  //     {id:'4',name:'系统设置',type:'menu',fontIcon:'qq',url:'www.baidu.com',pid:'0'},
  //   ]
  // }
]