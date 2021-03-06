import React from 'react';
import { message, Card, Steps, Col, Row } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Step1, Step2, Step3 } from '../../components/Application/AppAddSteps';
import { addAppBasicInfo, addAppDeployInfo, deleteAppBasicInfo } from '../../services/apps';
import {updateApp} from '../../services/running'
import {addEnvs } from '../../services/deploy'
import {addServerGroup} from '../../services/api'
import {base} from '../../services/base'
import {doUpstream} from '../../services/domainList'

const Step = Steps.Step;
class AddApp extends React.Component {
  state = {
    type:this.props.location.search.substring(1)==='middleware'?'middleware':'app',
    current: 0,
    displayStep1: true,
    displayStep2: false,
    displayStep3: false,
    status:"",
    appInfo: {
      name: "",//应用名称
      groupId: "default",
      code: "",//应用code
      type: "web",//应用类型
      tags: [],
      deployMode:'k8s',//默认应用部署类型
      tenant:base.tenant
    },

    deployment: {
      metadata: {
        labels: {
          cluster: "",//集群id
          application:"",
          environment:base.currentEnvironment.id,//当前环境ID
        },
        annotations: {
          name: "",//应用名
          creator: base.currentUser.realname,//当前用户名
          environment:base.currentEnvironment.name,
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

    clusterService:{
      metadata: {
        annotations: {
          name: "",
          creator:base.currentUser.realname
        }
      },
      spec: {
        type: 'ClusterIP',
        ports: []
      }
    },
    nodePortService : {
      metadata: {
        annotations: {
          name: "",
          creator:base.currentUser.realname
        }
      },
      spec: {
        type: 'NodePort',
        ports: []
      }
    },
    ingress : {
      metadata: {
          annotations: {
              name: "",
              creator:base.currentUser.realname
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
    configMap : {
      metadata: {
        annotations: {
          data: {}
        }
      },
      data: {}
    }
  }
  submitStep1 = (values, selectedTags) => {
    const newDeployment = { ...this.state.deployment };
    newDeployment.metadata.annotations.name = values.name;
    newDeployment.metadata.labels.application = values.id;
    newDeployment.metadata.name = values.id;

    const newAppInfo = { ...this.state.appInfo };
    newAppInfo.name = values.name;
    newAppInfo.code = values.id;

    if(this.state.type==="middleware"){
      newAppInfo.type = "middleware";
    }else{
      newAppInfo.type = values.type;
    }

    newAppInfo.tags = selectedTags;

    this.setState({
      appInfo: newAppInfo,
      current: 1,
      displayStep1: false,
      displayStep2: true,
      displayStep3: false,
      deployment: newDeployment
    })
  }

  submitstep2 = (values, containers) => {
    const newDeployment = { ...this.state.deployment };
    newDeployment.metadata.labels.cluster = values.cluster;
    newDeployment.spec.replicas = values.replicas;
    if (containers.length > 0) {
      newDeployment.spec.template.spec.containers = containers;

     // let clusterPorts = this.state.clusterService.spec.ports;
      let nodePortPorts = this.state.nodePortService.spec.ports;
      containers.forEach(c=>{
        c.ports.forEach(p=>{
          let clusterPort = {port:p.conhostPort,protocol:p.protocol,targetPort:{IntVal:p.containerPort},name:c.name,nodePort:p.nodePort}
          //if(p.conhostPort)clusterPorts.push({...clusterPort});
          //clusterPort.port = p.nodePort;
          nodePortPorts.push(clusterPort);
        })
        c.config.forEach(c=>{
          // eslint-disable-next-line
          this.state.configMap.data[c.key] = c.contents;
        })
      })
    }else{
      message.error("请先添加容器！");
      return;
    }
    this.setState({
      deployment: newDeployment
    })
    
    //应用管理添加应用
    console.log('1')
    addAppBasicInfo(this.state.appInfo).then(newAppInfo => {
      //部署平台添加应用
      addAppDeployInfo({ deployment: newDeployment,configMap:this.state.configMap,clusterService:this.state.clusterService,nodePortService:this.state.nodePortService }).then(data => {
        //保存为已生效环境变量
        let appContainers = newDeployment.spec.template.spec.containers;
        appContainers.forEach(c=>{
          let containerName = c.name;
          c.env.forEach(e=>{
            e.key = e.name;
            e.operateWay = 'effect';
            addEnvs(this.state.appInfo.code,containerName,e);
          });
        })

        // containers.forEach(res=>{
        //   res.ports.forEach(i=>{
        //     let params = {
        //       containerName:res.name,
        //       port:i.containerPort,
        //       protocol:i.protocol,
        //       type:'NODEPORT',
        //       targetPort:i.conhostPort,
        //       nodePort:i.outerPort,
        //     };
        //     addNetworkConfig(newAppInfo.code,res.name,params).then(nets=>{
        //       debugger;
        //     }).catch(err=>{
        //       message.error('"新增'+res.name+'容器网络配置出错！"')
        //     })

        //   })
        // })

        //将应用ID添加为服务分组
        if(this.state.type!=='middleware') addServerGroup({id:newAppInfo.id,name:newAppInfo.name});
        this.setState({
          newAppInfo:newAppInfo,
          status:data.status,
          current: 2,
          displayStep1: false,
          displayStep2: false,
          displayStep3: true,
        })
      }).catch((error) => {
        message.error("部署平台添加应用出错！");
        deleteAppBasicInfo(newAppInfo.id);
      })
    })
  }

  //其他方式部署创建应用
  otherSubmitstep2=(arrays)=>{
    addAppBasicInfo({...this.state.appInfo,deployMode:'custom'}).then(newAppInfo => {
      if(arrays instanceof Array && arrays.length>0){
        //调用集群新增接口
        let targets=[];
        let str='';
        let ctx='';
        arrays.forEach(item=>{
          item.ip.forEach(i=>{
            let target={
              ip: i.ip,
              port: i.port,
              weight: '10',
            }
            str+='http://'+i.ip+':'+i.port+','
            targets.push(target)
            ctx=item.ctx;
          })
        })
        let queryParams={
          code: newAppInfo.upstream,
          name:newAppInfo.name,
          targets: targets,
        }
        let params = {
          type: '2'
        }
        
        let bodyParams = {
          host: str.substring(0,str.length-1),
          //先暂时这样写
          ctx:ctx?ctx:'',
        }
        updateApp(newAppInfo.id,params,bodyParams).then(data=>{
          if(data){
            message.success('操作成功')
            doUpstream(newAppInfo.upstream,queryParams,{appId:newAppInfo.id}).then(res=>{
            })
          }
        })
      }
      //将应用ID添加为服务分组
      if(this.state.type!=='middleware'){
        addServerGroup({id:newAppInfo.id,name:newAppInfo.name});
      }
      this.setState({
        newAppInfo:newAppInfo,
        current: 2,
        displayStep1: false,
        displayStep2: false,
        displayStep3: true,
        //状态为1表示应用创建成功
        status:1,
      })
    })

  }
  // getStepContent = () => {
  //   const current = this.state.current;
  //   switch (current) {
  //     case 0:
  //       return <Step1 submitstep1={this.submitStep1} />
  //       break;
  //     case 1:
  //       return <Step2 tenant="c2cloud"
  //         submitstep2={this.submitstep2} />
  //       break;
  //     case 2:
  //       return <Step3 deployment={this.state.deployment} />
  //       break;
  //   }
  // }
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
    // const stepContent = this.getStepContent();
    let breadcrumbList = [{
        title: '应用列表',
        href: '/#/apps',
      }, {
        title: '创建应用',
    }];
    let labelName = "应用";
    if(this.state.type==="middleware"){
      breadcrumbList = [{
        title: '中间件列表',
        href: '/#/middlewares',
      }, {
        title: '创建中间件',
      }];
      labelName = "中间件";
    }

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title={labelName+'创建向导'} breadcrumbList={breadcrumbList}
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
              <Step1 submitstep1={this.submitStep1} display={this.state.displayStep1}
                type={this.state.type}/>
              <Step2 stepback={this.stepBack}
                submitstep2={this.submitstep2} display={this.state.displayStep2}
                otherSubmitstep2={this.otherSubmitstep2}
                type={this.state.type} tenant={base.tenant}
                />
              <Step3 display={this.state.displayStep3} appinfo={this.state.newAppInfo} type={this.state.type} 
                status={this.state.status} />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default AddApp;