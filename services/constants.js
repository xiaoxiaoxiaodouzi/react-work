import appPic from '../assets/images/app.png';
import middlewarePic from '../assets/images/middleware.png';
import tenantPic from '../assets/images/tenant.png';
import cpuPic from '../assets/images/cpu.png';
import ramPic from '../assets/images/ram.png';
import servicePic from '../assets/images/api.png';

export default {
  PROJECT_TITLE: '统一管理门户',
  GRAFANA_URL:{
    k8s:'/dashboard/db/k8s-overview?kiosk=true&theme=light',
    node:'/dashboard/db/k8s-node?var-job=prometheus-node-exporter&var-port=9100&theme=light&kiosk=true',
    functionOverview:'/dashboard/db/c2-function-overview?theme=light&kiosk=true',
    functionMonit:'/dashboard/db/c2-function-monit?theme=light&kiosk=true',
    cluster:'/dashboard/db/k8s-cluster?theme=light&kiosk=true',
    apiOverview:'/dashboard/db/c2-api-overview?theme=light&kiosk=true',
    apiMonit:'/dashboard/db/c2-api-monit?theme=light&kiosk=true',
    tenant:'/dashboard/db/c2-tenant?theme=light&kiosk=true',//租户监控 var-tenant=${tenantCode}
    app:'/dashboard/db/c2-pod-monit?theme=light&kiosk=true',//应用监控 var-pod=${appCode}
  },
  MIRROR_ADDRESS_BASE: 'registry.c2cloud.cn',
  CONFIG_KEY: {
    PASS_MANAGE_URL: 'paasManageUrl',
    GLOBAL_RESOURCE_MONIT_URL: 'globalResourceMonitUrl',
    APM_URL: 'APMServerUrl',
    MANAGE_TENANT_CODE: 'manageTenantCode',
    ERROR_MESSAGE:'errorMessage',
    MESSAGE_BELL:'messageBell',
  },
  //创建环境默认值
  NEWENV_PARAMS:{
    apiGatewayHost:'gateway-svc.admin',
    apiGatewayPort:8000,
    apiGatewayManagePort:8001,
    apiGatewaySchema:'http'
  },
  APMENABLE_KEY: [
    'APM_COLLECTOR_IP',
    'APM_APP_NAME',
  ],
  SPRING_CLOUD_KEY: [
    'spring_application_name',
    'eureka_server'
  ],
  SSO_KEY:[
    'c2_sso_client_authrizationserverinnerurl',
    'c2_sso_client_authrizationserverurl',
    'c2_sso_client_clientid',
    'c2_sso_client_clientsecret',
    'c2_sso_client_clienturl',
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
  oty: { 'service':'服务','services': '服务', 'function': '功能', 'application':'应用','applications': '应用', 
        'images': '镜像', 'appEnvs': '环境变量', 'tenant': '租户', 'healthcheck': '健康检查', 'license': 'license',
         'PAGE': '页面', 'roles': '角色', 'role': '角色', 'usergroups': '用户组', 'orgnizations': '机构', 'orgnization': '机构',
         'cluster': '集群', 'user': '用户', 'middlewares': '中间件', 'networks': '网络配置', 'volums': '存储卷',
        'job':'岗位','usergroup':'用户组' },
  ty: { login: '登录', logout: '登出', start: '启动', stop: '停止', remove: '迁移', insert: '新增', update: '修改',
       delete: '删除', upload: '上传', authorize: '授权', deauthorize: '取消授权', visit: '访问', build: '打包',
      deauthorizefunctionmanager:'取消授权功能管理员',authorizefunctionmanager: '授权功能管理员',relatefunction:'关联功能',
      deauthorizeusers:'取消授权用户集合',authorizeusers:'授权用户集合',syncservice:'同步服务',	importservice:'导入服务',
      updatesso:'修改统一认证配置',disablesso:'取消统一认证',enablesso:'启用统一认证',deauthorizeservice:'取消授权服务',
      authorizeservice:'授权服务'},
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
  WINDOW_LOCAL_STORAGE: { SAFEMODEL: 'ampSafeMode', },
};