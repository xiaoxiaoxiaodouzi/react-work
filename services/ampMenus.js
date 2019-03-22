

import AppList from '../routes/Application/List';
import Dashboard from '../routes/Dashboard/Dashboard';
import Resource from '../routes/Dashboard/Resource';
import Api from '../routes/Dashboard/Api';
import Orgs from '../routes/orguser/Orgs';
// import Users from '../routes/orguser/Users'
// import NavigationManage from '../routes/NavigationManage/NavigationListRoute';
import Metadatas from '../routes/orguser/Metas';
import Dicts from '../routes/orguser/Dicts';
import Groups from '../routes/orguser/Groups';
import ChangeLog from '../routes/orguser/ChangeLog';
import MiddlewareList from '../routes/Middleware/List'
import DomainList from '../routes/setting/DomainList'
import Cluster from '../routes/setting/Cluster'
import SystemSetting from '../routes/setting/SystemSetting'
import SafeStrategy from '../routes/setting/SafeStrategy'
import Storages from '../routes/setting/Storage'
import LicenseMessage from '../routes/setting/LicenseMessage'
import Images from '../routes/setting/Images'
// import Tenants from '../routes/Tenants/TenantList'
import Tenants from '../components/Tenants/TenantsListNew'
// import FunctionalList from '../routes/BasicData/Functional/List'
import ApiList from '../routes/Api/List';
import CceAppList from '../safemode/CceAppList';
import Log from '../routes/setting/Log'
import K8s from '../routes/Dashboard/K8s'
import FunctionOverview from '../routes/Dashboard/FunctionOverview'
import ClusterNew from '../routes/setting/ClusterNew';
import FuncNavigation from '../routes/FuncNavigation/FuncNavigation';
import ImportAndExport  from '../routes/orguser/ImportAndExport';

export default {
  //菜单设置。父菜单必须设置code属性，用来匹配菜单展开
  MENUS: [
    {
      id: '1', name: 'Dashboard', icon: 'dashboard', cceDepend: true, monitDepend: true,
      children: [
        { id: '11', name: '全局监控', link: '/dashboard/admin', resourceId: 'dashboard_admin', component: Dashboard, cceDepend: true, monitDepend: true },
        { id: '12', name: '资源监控', link: '/dashboard/resource', resourceId: 'dashboard_resource', component: Resource, cceDepend: true, monitDepend: true },
        { id: '13', name: '服务监控', link: '/dashboard/api', resourceId: 'dashboard_api', component: Api, cceDepend: true, monitDepend: true },
        { id: '14', name: '应用引擎', link: '/dashboard/k8s', component: K8s, cceDepend: true, monitDepend: true },
        { id: '15', name: '功能概览', link: '/dashboard/fnoverview', component: FunctionOverview, cceDepend: true, monitDepend: true },
      ]
    },
    { id: '2', name: '应用', icon: 'appstore', link: '/apps', resourceId: 'apps', component: AppList, exact: true },
    
    { id: '4', name: '服务', icon: 'api', link: '/apis', resourceId: 'apis', component: ApiList, exact: true },
    // { id: '5', name: '功能', icon: 'solution', link: '/functional', resourceId: 'functional', component: FunctionalList, exact: true },
    // { id: '6', name: '全局导航', icon: 'global', link: '/navigationmanage', resourceId: 'navigationmanage', component: NavigationManage },
    { id: '5', name: '功能', icon: 'global', link: '/funcs', resourceId: 'funcNavigation', component: FuncNavigation },
    {
      id: '7', name: '机构用户', icon: 'bar-chart', children: [
        { id: '71', name: '组织架构', link: '/organization',component: Orgs },
        // { id: '72', name: '用户管理', link: '/users', resourceId: 'users', component: Users, exact: true },
        {id:'72',name:'导入导出',link:'/imports',component:ImportAndExport,exact:true},
        { id: '73', name: '用户组管理', link: '/groups', resourceId: 'groups', component: Groups, exact: true },
        { id: '74', name: '维度管理', link: '/metas', resourceId: 'metas', component: Metadatas, exact: true },
        { id: '75', name: '字典管理', link: '/dicts', resourceId: 'dicts', component: Dicts, exact: true },
        { id: '76', name: '变更日志', link: '/changelog', resourceId: 'changelog', component: ChangeLog, exact: true },
      ]
    },
    {
      id: '8', name: '平台管理', icon: 'setting', children: [
        { id: '81', name: '租户', link: '/tenants', resourceId: 'tenants', component: Tenants, exact: true },
        { id: '3', name: '中间件', icon: 'paper-clip', link: '/middlewares', resourceId: 'middlewares', component: MiddlewareList, exact: true },
        { id: '82', name: '域名', link: '/setting/domain', resourceId: 'setting_domain', component: DomainList },
        { id: '83', name: '服务器', link: '/setting/cluster', resourceId: 'setting_cluster', cceDepend: true, component: ClusterNew ,exact:true},
        { id: '84', name: '镜像', link: '/setting/images', resourceId: 'setting_images', cceDepend: true, component: Images, exact: true },
        { id: '85', name: '存储卷', link: '/setting/storage', resourceId: 'setting_storage', cceDepend: true, component: Storages },
        { id: '86', name: '许可信息', link: '/setting/license', resourceId: 'setting_license', cceDepend: true, component: LicenseMessage },
        { id: '88', name: '日志', link: '/setting/log', resourceId: 'setting_log', component: Log },
        { id: '89', name: '安全策略', link: '/setting/safestrategy', resourceId: 'setting_safestrategy', component: SafeStrategy },
        { id: '87', name: '系统设置', link: '/setting/syssetting', resourceId: 'setting_syssetting', component: SystemSetting },
      ],
    }
  ],

  SAVE_MODE_MENU: [
    { id: '2', name: '应用列表', icon: 'appstore', link: '/apps', resourceId: 'apps', component: CceAppList,cceDepend: true,exact: true },
    { id: '83', name: '集群', icon: 'cluster', link: '/setting/cluster', resourceId: 'setting_cluster', component: Cluster,cceDepend: true },
    { id: '84', name: '镜像', icon: 'block', link: '/setting/images', resourceId: 'setting_images', component: Images,cceDepend: true, exact: true },
    { id: '85', name: '存储卷', icon: 'hdd', link: '/setting/storage', resourceId: 'setting_storage', component: Storages,cceDepend: true },
    { id: '86', name: '许可信息', icon: 'file-text', link: '/setting/license', resourceId: 'setting_license', component: LicenseMessage,cceDepend: true },
    { id: '87', name: '系统设置', icon:'setting', link: '/setting/syssetting', resourceId: 'setting_syssetting', component: SystemSetting },
  ],
}