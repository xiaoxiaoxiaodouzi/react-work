import appPic from '../assets/images/app.png';
import middlewarePic from '../assets/images/middleware.png';
import tenantPic from '../assets/images/tenant.png';
import cpuPic from '../assets/images/cpu.png';
import ramPic from '../assets/images/ram.png';
import servicePic from '../assets/images/api.png';

export default {
  PROJECT_TITLE: '统一管理门户',
  //菜单设置。父菜单必须设置code属性，用来匹配菜单展开
  MENUS: [
    {
      id: '1', name: 'Dashboard', icon: 'dashboard', code:'/dashboard', children: [
        { id: '10', name: '全局监控', link: '/dashboard/admin' },
        { id: '11', name: '资源监控', link: '/dashboard/resource' },
        { id: '12', name: '服务监控', link: '/dashboard/api' },
      ]
    },
    { id: '2', name: '应用列表', icon: 'appstore', link: '/apps' },
    { id: '3', name: '中间件列表', icon: 'paper-clip', link: '/middlewares' },
    { id: '4', name: '服务列表', icon: 'api', link: '/apis' },
    { id: '5', name: '租户管理', icon: 'solution', link: '/tenants' },
    // {id:5,name:'基础数据',icon:'database',children:[
    //   {id:51,name:'租户管理',link:'/base/orgs'}
    // ]},
    {
      id: '6', name: '高级设置', icon: 'tool', code:'/setting',children: [
        { id: '61', name: '域名管理', link: '/setting/domain'},
        { id: '62', name: '集群', link: '/setting/cluster' },
        { id: '63', name: '镜像', link: '/setting/images' },
        { id: '64', name: '许可信息', link: '/setting/license' },
        { id: '65', name: '系统设置', link: '/setting/syssetting' },
        { id: '66', name: '存储卷管理', link: '/setting/storage' },
      ]
    },
  ],
  MIRROR_ADDRESS_BASE: 'registry.c2cloud.cn',
  CONFIG_KEY:{
    PASS_MANAGE_URL:'paasManageUrl',
    GLOBAL_ROUTER_ENABLE:'globalRouterEnable',
    GLOBAL_ROUTER_URL:'globalRouterUrl',
    APM_URL:'APMServerUrl'
  },
  APMENABLE_KEY:[
    'PP_COLLECTOR_IP'
  ],
  reg:{
    // eslint-disable-next-line
    email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //验证标准http或者https .com 结尾的格式
    url: /^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig,
    //验证http https开头 xxx.xxx.xxx格式
    host:/(http|https):\/\/[\w\-_]+(.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])$/,
    //验证xxx.xxx.xxx:xxxx格式
    port: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:\d*)?$/,
    //验证xxx.xxx.xx.xx
    ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
    //证件号码验证：身份证等等
    certificateNum:/^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4})|\d{3}[Xx])$/i,
  },
  APP_STATE_EN:{ 'succeeded': 'success', 'running': 'processing', 'stop': 'error', 'pending': 'default' },
  APP_STATE_CN:{ 'succeeded': '运行中', 'running': '启动中', 'stop': '停止', 'pending': '等待' },
  //配额code，只显示cpu和内存
  QUOTA_CODE:['cpus','rams'],
  TENANT_CODE: ['PAAS'],
  SWAGGER_URL:'http://aip.dev.c2cloud.cn/ext/swagger/index.html',
  //进度条颜色状态(x<70: className='normal' 70<x<90:className='warning' x>90:className='danger') 
  PROGRESS_STATUS:[75,90],
  PIC:{app:appPic,middleware:middlewarePic,tenant:tenantPic,cpu:cpuPic,ram:ramPic,service:servicePic}

};