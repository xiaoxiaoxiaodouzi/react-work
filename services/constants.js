import appPic from '../assets/images/app.png';
import middlewarePic from '../assets/images/middleware.png';
import tenantPic from '../assets/images/tenant.png';
import cpuPic from '../assets/images/cpu.png';
import ramPic from '../assets/images/ram.png';
import servicePic from '../assets/images/api.png';
import Dashboard from '../routes/Dashboard/Dashboard'

export default {
  PROJECT_TITLE: '统一管理门户',
  //菜单设置。父菜单必须设置code属性，用来匹配菜单展开
  MENUS: [
    {
      id: '1', name: 'Dashboard', icon: 'dashboard', code: '/dashboard', resourceId: 'dashboard_admin',component:Dashboard, link: '/dashboard/admin',
      //  children: [
      //   { id: '10', name: '全局监控', link: '/dashboard/admin', resourceId: 'dashboard_admin' },
      //   { id: '11', name: '资源监控', link: '/dashboard/resource', resourceId: 'dashboard_resource' },
      //   { id: '12', name: '服务监控', link: '/dashboard/api', resourceId: 'dashboard_api' },
      // ]
    },
    { id: '2', name: '应用', icon: 'appstore', link: '/apps', resourceId: 'apps' },
    { id: '3', name: '中间件', icon: 'paper-clip', link: '/middlewares', resourceId: 'middlewares' },
    { id: '4', name: '服务', icon: 'api', link: '/apis', resourceId: 'apis' },
    { id: '5', name: '功能', icon: 'solution',link: '/functional', resourceId: 'functional' },
    { id: '6', name: '全局导航', icon: 'global',link: '/navigationmanage', resourceId: 'navigationmanage' },
    {
      id: '7', name: '机构用户', icon: 'bar-chart', code: '/orguser',children: [
        { id: '71', name: '机构管理', link: '/orgs' ,resourceId:"orgs"},
        { id: '72', name: '用户管理', link: '/users' ,resourceId:'users'},
        { id: '73', name: '用户组管理', link: '/groups',resourceId:'groups' },
        { id: '74', name: '维度管理', link: '/metas' ,resourceId:'metas'},
        { id: '75', name: '字典管理', link: '/dicts' ,resourceId:'dicts'},
      ]
    },
    {
      id: '8', name: '高级设置', icon: 'setting', code: '/setting',children: [
        { id: '81', name: '租户', link: '/tenants', resourceId: 'tenants' },
        { id: '82', name: '域名', link: '/setting/domain', resourceId: 'setting_domain' },
        { id: '83', name: '集群', link: '/setting/cluster', resourceId: 'setting_cluster' },
        { id: '84', name: '镜像', link: '/setting/images', resourceId: 'setting_images' },
        { id: '85', name: '存储卷', link: '/setting/storage', resourceId: 'setting_storage' },
        { id: '86', name: '许可信息', link: '/setting/license', resourceId: 'setting_license' },
        { id: '87', name: '系统设置', link: '/setting/syssetting', resourceId: 'setting_syssetting' },
      ],
    }
  ],

  MIRROR_ADDRESS_BASE: 'registry.c2cloud.cn',
  CONFIG_KEY: {
    PASS_MANAGE_URL: 'paasManageUrl',
    GLOBAL_ROUTER_ENABLE: 'globalRouterEnable',
    GLOBAL_ROUTER_URL: 'globalRouterUrl',
    GLOBAL_RESOURCE_MONIT_URL:'globalResourceMonitUrl',
    APM_URL: 'APMServerUrl',
    MANAGE_TENANT_CODE: 'manageTenantCode',
    INITIALIZE: 'initialize',
  },
  APMENABLE_KEY: [
    'APM_COLLECTOR_IP',
    'APM_APP_NAME',
  ],
  SPRING_CLOUD_KEY: [
    'spring_application_name',
    'eureka_server'
  ],
  reg: {
    // eslint-disable-next-line
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //验证标准http或者https .com 结尾的格式
    url: /^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig,
    //验证http https开头 xxx.xxx.xxx格式
    host: /^(http|https):\/\/[\w\-_]+(.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])$/,
    //验证xxx.xxx.xxx:xxxx格式
    port: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:\d*)?$/,
    //验证xxx.xxx.xx.xx
    ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
    //证件号码验证：身份证等等
    certificateNum: /^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4})|\d{3}[Xx])$/i,
  },
  APP_STATE_EN: { 'succeeded': 'success', 'running': 'success', 'stop': 'default', 'pending': 'processing', 'exception': 'warning', 'failed': 'error', 'unknown': 'default' },
  APP_STATE_CN: { 'succeeded': '运行中', 'running': '启动中', 'stop': '停止', 'pending': '待启动', 'exception': '异常', 'failed': '失败', 'unknown': '未知' },
  //配额code，只显示cpu和内存
  QUOTA_CODE: ['cpus', 'rams'],
  TENANT_CODE: ['PAAS'],
  SWAGGER_URL: 'http://aip.dev.c2cloud.cn/ext/swagger/index.html',
  //进度条颜色状态(x<70: className='normal' 70<x<90:className='warning' x>90:className='danger') 
  PROGRESS_STATUS: [75, 90],
  PIC: { app: appPic, middleware: middlewarePic, tenant: tenantPic, cpu: cpuPic, ram: ramPic, service: servicePic },
  WARN_COLOR: { normal: "#50cb9d", warn: "#f6b002", error: "#ff4431" },

  functionResource: {
    userCollectionType: { ORG: '机构', USERGROUP: '用户组', JOB: '岗位' },
    type: { innerservice: '内部服务', outerservice: '外部服务', page: '页面', element: '页面元素', function: '功能', menu: '菜单', custom: '自定义资源' },
    source: ['自定义', 'IDE']
  },
  NAVIGATION_TYPE: { catalog: "CATALOG", function: "FUNCTION" },
  AMP_ROLEMANAGER: ['amp_roleManager'],
};