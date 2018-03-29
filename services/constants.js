export default {
  PROJECT_TITLE: '统一管理门户',
  MENUS: [
    {
      id: 1, name: 'Dashboard', icon: 'dashboard', children: [
        { id: 11, name: '资源监控', link: '/dashboard/resource' },
        { id: 12, name: 'API监控', link: '/dashboard/api' },
      ]
    },
    { id: 2, name: '应用列表', icon: 'appstore', link: '/apps' },
    { id: 3, name: '中间件列表', icon: 'paper-clip', link: '/middlewares' },
    { id: 4, name: 'API列表', icon: 'api', link: '/apis' },
    // {id:5,name:'基础数据',icon:'database',children:[
    //   {id:51,name:'租户管理',link:'/base/orgs'}
    // ]},
    {
      id: 6, name: '高级设置', icon: 'tool', children: [
        { id: 61, name: '域名管理', link: '/setting/domain' },
        { id: 62, name: '集群', link: '/setting/cluster' },
        { id: 63, name: '镜像', link: '/setting/images' },
        { id: 64, name: '许可信息', link: '/setting/license' },
        { id: 65, name: '系统设置', link: '/setting/syssetting' },
      ]
    },
  ],
  MIRROR_ADDRESS_BASE: 'registry.c2cloud.cn',
};