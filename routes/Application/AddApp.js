import React from 'react';
import { message, Card, Steps, Col, Row,Breadcrumb, Divider} from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Step1, Step2, Step3 } from '../../components/Application/AppAddSteps';
import { addAppDeployInfo } from '../../services/cce'
import { addAppEnvs } from '../../services/cce'
import { addServerGroup, updateApp, addAppBasicInfo, deleteAppBasicInfo } from '../../services/aip'
import { base } from '../../services/base'
import { doUpstream } from '../../services/amp'
import CreateAppContext from '../../context/CreateAppContext';

const Step = Steps.Step;
class AddApp extends React.Component {
  state = {
    tenant:base.tenant,
    type: this.props.location.search.substring(1) === 'middleware' ? 'middleware' : 'app',
    current: 0,
    displayStep1: true,
    displayStep2: false,
    displayStep3: false,
    status: "",
    appInfo: {
      name: "",//应用名称
      groupId: "default",
      code: "",//应用code
      type: "web",//应用类型
      tags: [],
      deployMode: 'k8s',//默认应用部署类型
      tenant: base.tenant
    },
    deployment: {
      metadata: {
        labels: {
          cluster: "",//集群id
          application: "",
          environment: base.currentEnvironment.id,//当前环境ID
        },
        annotations: {
          name: "",//应用名
          creator: base.currentUser.realname,//当前用户名
          environment: base.currentEnvironment.name,
        },
        namespace: base.tenant,//租户
        name: ""//应用 id
      },
      spec: {
        replicas: "1",//副本数
        template: {
          spec: {//容器信息
            containers: [{
              config: [],//配置文件
              env: [],//环境变量
              command: [],//启动命令
              args: [],//启动命令
              cmd: [],//启动命令
              volumeMounts: [],//存储卷
              ports: [
                // {
                //   containerPort: 80,//容器端口
                //   conhostPort: 80,//服务端口
                //   protocol: "TCP",//协议
                // }
              ],
              name: "",//容器名称
              image: "",//镜像名
              isHealthCheck: false,//健康检查的开关
              resourcesLimit: true,//配额，写死为true
              resources: {
                limits: {
                  memory: {
                    "amount": '4GB'//内存
                  },
                  cpu: {
                    "amount": 2//cpu核
                  }
                }
              }
            }]
          }
        },
      }
    },

    clusterService: {
      metadata: {
        annotations: {
          name: "",
          creator: base.currentUser.realname
        }
      },
      spec: {
        type: 'ClusterIP',
        ports: []
      }
    },
    nodePortService: {
      metadata: {
        annotations: {
          name: "",
          creator: base.currentUser.realname
        }
      },
      spec: {
        type: 'NodePort',
        ports: []
      }
    },
    ingress: {
      metadata: {
        annotations: {
          name: "",
          creator: base.currentUser.realname
        },
        namespace: base.tenant
      },
      spec: {
        rules: [{
          host: "",
          http: {
            paths: {
              backend: {
                servicePort: {
                  IntVal: ''
                }
              }
            }
          }
        }]
      }
    },
    configMap: {
      metadata: {
        annotations: {
          data: {}
        }
      },
      data: {}
    },

    stateChange:(state)=>{
      this.setState({
        ...state
      })
    }

  }

  submitstep2 = (values, containers) => {
    //应用管理添加应用
    addAppBasicInfo(this.state.appInfo,{'AMP-ENV-ID':this.state.appInfo.enviroment}).then(newAppInfo => {
      //部署平台添加应用
      addAppDeployInfo({ deployment: this.state.deployment, configMap: this.state.configMap, clusterService: this.state.clusterService, nodePortService: this.state.nodePortService }).then(data => {
        //保存为已生效环境变量
        let appContainers = this.state.deployment.spec.template.spec.containers;
        appContainers.forEach(c => {
          let containerName = c.name;
          c.env.forEach(e => {
            e.key = e.name;
            e.operateWay = 'effect';
            addAppEnvs(this.state.appInfo.code, containerName, e);
          });
          //添加api-key的环境变量（临时处理！）
          const apiKeyEvn = {key:'c2_sso_proxy_apigateway_apikey',value:newAppInfo.routeId,desc:'API-KEY',source:1};
          const proxySchemaEvn = {key:'c2_sso_proxy_apigateway_schema',value:base.currentEnvironment.apiGatewaySchema,desc:'网关协议',source:1};
          const proxyHostEvn = {key:'c2_sso_proxy_apigateway_host',value:base.currentEnvironment.apiGatewayHost,desc:'网关地址',source:1};
          const proxyPortEvn = {key:'c2_sso_proxy_apigateway_port',value:base.currentEnvironment.apiGatewayPort,desc:'网关端口',source:1};
          const appCodeEvn = {key:'application_code',value:newAppInfo.code,desc:'应用编码',source:1};
          const appIdEvn = {key:'application_id',value:newAppInfo.id,desc:'应用ID',source:1};
          const appNameEvn = {key:'applicaiton_name',value:newAppInfo.name,desc:'应用名称',source:1};
          const appEnvironmentEvn = {key:'application_env',value:base.currentEnvironment.code,desc:'应用名称',source:1};
          const initEvns = [apiKeyEvn,proxyHostEvn,proxySchemaEvn,proxyPortEvn,appCodeEvn,appIdEvn,appNameEvn,appEnvironmentEvn];
          initEvns.forEach(evn=>{
            addAppEnvs(this.state.appInfo.code, containerName, evn);
          });
        })
        //创建应用之后添加集群
        let queryParams = {
          code: newAppInfo.upstream,
          name: newAppInfo.name,
          targets: [],
        }
        doUpstream(newAppInfo.upstream, queryParams, { appId: newAppInfo.id }).then(res => {
        })
        //将应用ID添加为服务分组
        if (this.state.type !== 'middleware') addServerGroup({ id: newAppInfo.id, name: newAppInfo.name });
        this.setState({
          newAppInfo: newAppInfo,
          status: data.status,
          current: 2,
          displayStep1: false,
          displayStep2: false,
          displayStep3: true,
        })
      }).catch((e) => {
        base.ampMessage("部署平台添加应用出错！" );
        deleteAppBasicInfo(newAppInfo.id);
      })
    })
  }

  //其他方式部署创建应用
  otherSubmitstep2 = (arrays) => {
    addAppBasicInfo({ ...this.state.appInfo, deployMode: 'custom' }).then(newAppInfo => {
      if (arrays instanceof Array && arrays.length > 0) {
        //调用集群新增接口
        let targets = [];
        let str = '';
        let ctx = '';
        arrays.forEach(item => {
          item.ip.forEach(i => {
            let target = {
              ip: i.ip,
              port: i.port,
              weight: '10',
            }
            str += 'http://' + i.ip + ':' + i.port + ','
            targets.push(target)
            ctx = item.ctx;
          })
        })
        let queryParams = {
          code: newAppInfo.upstream,
          name: newAppInfo.name,
          targets: targets,
        }
        let params = {
          type: '2'
        }

        let bodyParams = {
          host: str.substring(0, str.length - 1),
          //先暂时这样写
          ctx: ctx ? ctx : '',
        }
        updateApp(newAppInfo.id, params, bodyParams).then(data => {
          if (data) {
            message.success('操作成功')
            doUpstream(newAppInfo.upstream, queryParams, { appId: newAppInfo.id }).then(res => {
            })
          }
        })
      }
      //将应用ID添加为服务分组
      if (this.state.type !== 'middleware') {
        addServerGroup({ id: newAppInfo.id, name: newAppInfo.name });
      }
      this.setState({
        newAppInfo: newAppInfo,
        current: 2,
        displayStep1: false,
        displayStep2: false,
        displayStep3: true,
        //状态为1表示应用创建成功
        status: 1,
      })
    })

  }
  stepBack = () => {
    this.setState({
      current: 0,
      displayStep1: true,
      displayStep2: false,
      displayStep3: false,
    })
  }
  render() {
    const description = (
      <div style={{ height: '100px' }}></div>
    )

    let breadcrumbList = <Breadcrumb style={{marginTop:6}}>
    <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> <a href="/#/apps">应用列表</a></Breadcrumb.Item>
    <Breadcrumb.Item>创建应用</Breadcrumb.Item>
    </Breadcrumb>;
    let labelName = "应用";
    if(this.state.type==="middleware"){
      
      breadcrumbList = <Breadcrumb style={{marginTop:6}}>
    <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> <a href="/#/middlewares">中间件列表</a></Breadcrumb.Item>
    <Breadcrumb.Item>创建中间件</Breadcrumb.Item>
    </Breadcrumb>;
      labelName = "中间件";
    }

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title={breadcrumbList} 
          content={labelName+'创建过程分为应用基本信息、部署配置过程'} />
        <Card bordered={false} style={{ margin: 24 }}>
          <Row>
            <Col span={4} style={{ borderRight: '1px solid #E0E0E0' }}>
              <Steps direction="vertical" current={this.state.current} style={{ marginTop: '60px' }}>
                <Step title="基础信息" description={description} />
                <Step title="部署信息" description={description} />
                <Step title="完成" description={description} />
              </Steps>
            </Col>
            <Col span={20}>
            <CreateAppContext.Provider value={this.state}>
              <Step1 />
              <Step2 stepback={this.stepBack}
                submitstep2={this.submitstep2}
                otherSubmitstep2={this.otherSubmitstep2} />
                
              <Step3 display={this.state.displayStep3} appinfo={this.state.newAppInfo} type={this.state.type}
                status={this.state.status} />
            </CreateAppContext.Provider>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default AddApp;