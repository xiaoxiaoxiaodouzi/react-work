import appPic from '../assets/images/app.png';
import middlewarePic from '../assets/images/middleware.png';
import tenantPic from '../assets/images/tenant.png';
import cpuPic from '../assets/images/cpu.png';
import ramPic from '../assets/images/ram.png';
import servicePic from '../assets/images/api.png';
import pcPic from '../assets/images/pc.png';

export default {
  PROJECT_TITLE: '统一管理门户',
  GRAFANA_URL: {
    k8s: '/dashboard/db/k8s-overview?kiosk=true&theme=light',
    node: '/dashboard/db/k8s-node?var-job=prometheus-node-exporter&var-port=9100&theme=light&kiosk=true',
    functionOverview: '/dashboard/db/c2-function-overview?theme=light&kiosk=true',
    functionMonit: '/dashboard/db/c2-function-monit?theme=light&kiosk=true',
    cluster: '/dashboard/db/k8s-cluster?theme=light&kiosk=true',
    apiOverview: '/dashboard/db/c2-api-overview?theme=light&kiosk=true',
    apiMonit: '/dashboard/db/c2-api-monit?theme=light&kiosk=true',
    tenant: '/dashboard/db/c2-tenant?theme=light&kiosk=true',//租户监控 var-tenant=${tenantCode}
    app: '/dashboard/db/c2-pod-monit?theme=light&kiosk=true',//应用监控 var-pod=${appCode}
  },
  MIRROR_ADDRESS_BASE: 'registry.c2cloud.cn',
  DEFAULT_URL: {
    harbor: 'cep-harbor-svc.admin.svc.cluster.local',
    passApigetway: 'cep-apigateway-svc.admin.svc.cluster.local'//172.17.81.66:31120
  },

  CONFIG_KEY: {
    PASS_MANAGE_URL: 'paasManageUrl',
    GLOBAL_RESOURCE_MONIT_URL: 'globalResourceMonitUrl',
    APM_URL: 'APMServerUrl',
    MANAGE_TENANT_CODE: 'manageTenantCode',
    ERROR_MESSAGE: 'errorMessage',
    MESSAGE_BELL: 'messageBell',
  },
  CHART_DEPLOYMENT: {
    logEsClusterNode: 'cep-log-es-client-svc.admin.svc.cluster.local:9200',
    logNodePort: '30056',
    filebeatConfigOutputElasticsearchHosts: ['cep-log-es-client-svc.admin.svc.cluster.local:9200'],
    filebeatTemplateJson: {
      "index_patterns": [
        "filebeat-6.3.1-*"
      ],
      "mappings": {
        "doc": {
          "_meta": {
            "version": "6.3.1"
          },
          "date_detection": false,
          "dynamic_templates": [
            {
              "fields": {
                "mapping": {
                  "type": "keyword"
                },
                "match_mapping_type": "string",
                "path_match": "fields.*"
              }
            },
            {
              "docker.container.labels": {
                "mapping": {
                  "type": "keyword"
                },
                "match_mapping_type": "string",
                "path_match": "docker.container.labels.*"
              }
            },
            {
              "strings_as_keyword": {
                "mapping": {
                  "ignore_above": 1024,
                  "type": "keyword"
                },
                "match_mapping_type": "string"
              }
            }
          ],
          "properties": {
            "@timestamp": {
              "type": "date"
            },
            "docker": {
              "properties": {
                "container": {
                  "properties": {
                    "id": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "image": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "labels": {
                      "type": "object"
                    },
                    "name": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    }
                  }
                }
              }
            },
            "kubernetes": {
              "properties": {
                "annotations": {
                  "type": "object"
                },
                "container": {
                  "properties": {
                    "image": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "name": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    }
                  }
                },
                "labels": {
                  "type": "object"
                },
                "namespace": {
                  "ignore_above": 1024,
                  "type": "keyword"
                },
                "node": {
                  "properties": {
                    "name": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    }
                  }
                },
                "pod": {
                  "properties": {
                    "name": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    }
                  }
                }
              }
            },
            "oplog": {
              "properties": {
                "log": {
                  "properties": {
                    "ap": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "apn": {
                      "norms": false,
                      "type": "text"
                    },
                    "env": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "method": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "url": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "userAgent": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "remark": {
                      "norms": false,
                      "type": "text"
                    },
                    "class": {
                      "norms": false,
                      "type": "text"
                    },
                    "co": {
                      "norms": false,
                      "type": "text"
                    },
                    "ip": {
                      "type": "ip"
                    },
                    "level": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "logmessage": {
                      "norms": false,
                      "type": "text"
                    },
                    "ob": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "obn": {
                      "norms": false,
                      "type": "text"
                    },
                    "op": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "opn": {
                      "norms": false,
                      "type": "text"
                    },
                    "optype": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "st": {
                      "type": "short"
                    },
                    "thread": {
                      "norms": false,
                      "type": "text"
                    },
                    "ty": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "oty": {
                      "ignore_above": 1024,
                      "type": "keyword"
                    },
                    "latency": {
                      "type": "long"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "order": 1,
      "settings": {
        "index": {
          "mapping": {
            "total_fields": {
              "limit": 10000
            }
          },
          "number_of_routing_shards": 30,
          "number_of_shards": 3,
          "refresh_interval": "5s"
        }
      }
    },
    logPipelineJson: {
      "description": "Pipeline for parsing oplog log logs",
      "processors": [{
        "grok": {
          "field": "message",
          "patterns": [
            "\\[%{OPS:oplog.log.optype}\\] %{OPTIME:oplog.log.timestamp} %{NUMBER:oplog.log.st} %{DATA:oplog.log.ap} %{DATA:oplog.log.apn} %{DATA:oplog.log.env} %{DATA:oplog.log.op} %{DATA:oplog.log.opn} %{DATA:oplog.log.ip} %{USERNAME:oplog.log.ty} %{USERNAME:oplog.log.oty} %{DATA:oplog.log.ob} %{DATA:oplog.log.obn} %{DATA:oplog.log.method} %{DATA:oplog.log.url} %{DATA:oplog.log.userAgent} %{NUMBER:oplog.log.latency} %{DATA:oplog.log.remark} %{JAVALOGMESSAGE:oplog.log.co}",
            "\\[%{OPS:oplog.log.optype}\\] %{OPTIME:oplog.log.timestamp} %{NUMBER:oplog.log.st} %{DATA:oplog.log.ap} %{DATA:oplog.log.apn} %{DATA:oplog.log.op} %{DATA:oplog.log.opn} %{DATA:oplog.log.ip} %{USERNAME:oplog.log.ty} %{USERNAME:oplog.log.oty} %{DATA:oplog.log.ob} %{DATA:oplog.log.obn} %{NUMBER:oplog.log.latency} %{JAVALOGMESSAGE:oplog.log.co}"
          ],
          "pattern_definitions": {
            "OPS": "OP",
            "OPTIME": "%{YEAR}/%{MONTHNUM}/%{MONTHDAY}[T ]%{ISO8601_HOUR}:?%{MINUTE}(?::?%{SECOND})?%{ISO8601_TIMEZONE}?"
          },
          "ignore_missing": true
        }
      }, {
        "remove": {
          "field": "message"
        }
      }, {
        "rename": {
          "field": "@timestamp",
          "target_field": "read_timestamp"
        }
      }, {
        "date": {
          "field": "oplog.log.timestamp",
          "target_field": "@timestamp",
          "formats": ["YYYY/MM/dd H:m:s.SSS", "YYYY-MM-dd H:m:s,SSS"],
          "timezone": "Asia/Shanghai"
        }
      }, {
        "remove": {
          "field": "oplog.log.timestamp"
        }
      }],
      "on_failure": [{
        "set": {
          "field": "error.message",
          "value": "{{ _ingest.on_failure_message }}"
        }
      }]
    }


  },
  //创建环境默认值
  NEWENV_PARAMS: {
    apiGatewayHost: 'gateway-svc.admin',
    apiGatewayPort: 8000,
    apiGatewayManagePort: 8001,
    apiGatewaySchema: 'http',
    severInnerAddress: 'router-svc.admin.svc.cluster.local:8000',
    apiGatewayAddress: 'apigateway-svc.admin.svc.cluster.local:8000'
  },
  APMENABLE_KEY: [
    'APM_COLLECTOR_IP',
    'APM_APP_NAME',
  ],
  SPRING_CLOUD_KEY: [
    'spring_application_name',
    'eureka_server'
  ],
  SSO_KEY: [
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
  oty: {
    'service': '服务', 'services': '服务', 'function': '功能', 'application': '应用', 'applications': '应用',
    'images': '镜像', 'appEnvs': '环境变量', 'tenant': '租户', 'healthcheck': '健康检查', 'license': 'license',
    'PAGE': '页面', 'roles': '角色', 'role': '角色', 'usergroups': '用户组', 'orgnizations': '机构', 'orgnization': '机构',
    'cluster': '集群', 'user': '用户', 'middlewares': '中间件', 'networks': '网络配置', 'volums': '存储卷',
    'job': '岗位', 'usergroup': '用户组'
  },
  ty: {
    login: '登录', logout: '登出', start: '启动', stop: '停止', remove: '迁移', insert: '新增', update: '修改',
    delete: '删除', upload: '上传', authorize: '授权', deauthorize: '取消授权', visit: '访问', build: '打包',
    deauthorizefunctionmanager: '取消授权功能管理员', authorizefunctionmanager: '授权功能管理员', relatefunction: '关联功能',
    deauthorizeusers: '取消授权用户集合', authorizeusers: '授权用户集合', syncservice: '同步服务', importservice: '导入服务',
    updatesso: '修改统一认证配置', disablesso: '取消统一认证', enablesso: '启用统一认证', deauthorizeservice: '取消授权服务',
    authorizeservice: '授权服务'
  },
  APP_STATE_EN: { 'succeeded': 'success', 'running': 'success', 'stop': 'default', 'pending': 'processing', 'exception': 'warning', 'failed': 'error', 'unknown': 'default' },
  APP_STATE_CN: { 'succeeded': '运行中', 'running': '启动中', 'stop': '停止', 'pending': '待启动', 'exception': '异常', 'failed': '失败', 'unknown': '未知' },
  //配额code，只显示cpu和内存
  QUOTA_CODE: ['cpus', 'rams', 'apps', 'apis', 'containers', 'envs'],
  TENANT_CODE: ['PAAS'],

  SWAGGER_URL: 'http://aip.dev.c2cloud.cn/ext/swagger/index.html',

  //进度条颜色状态(x<70: className='normal' 70<x<90:className='warning' x>90:className='danger') 
  PROGRESS_STATUS: [75, 90],
  PIC: { app: appPic, middleware: middlewarePic, tenant: tenantPic, cpu: cpuPic, ram: ramPic, service: servicePic, pc: pcPic },
  WARN_COLOR: { normal: "#50cb9d", warn: "#f6b002", error: "#ff4431" },

  functionResource: {
    userCollectionType: { ORG: '机构', USERGROUP: '用户组', JOB: '岗位' },
    type: { innerservice: '内部服务', outerservice: '外部服务', page: '页面', element: '页面元素', function: '功能', menu: '菜单', custom: '自定义资源' },
    source: ['自定义', 'IDE']
  },
  NAVIGATION_TYPE: { catalog: "CATALOG", function: "FUNCTION" },
  AMP_ROLEMANAGER: ['amp_roleManager'],
  WINDOW_LOCAL_STORAGE: { SAFEMODEL: 'ampSafeMode', },
  QUOTA_LIMIT: [{ cpu: 0.5, mem: 0.5 }, { cpu: 0.5, mem: 1 }, { cpu: 1, mem: 1 }, { cpu: 1, mem: 2 }, { cpu: 2, mem: 4 }, { cpu: 4, mem: 8 }],
  MODAL_STYLE: { BODY_HEIGHT: window.innerHeight-300, DEFAULT_WIDTH: 800, BIG_WIDTH: 1000 }
};