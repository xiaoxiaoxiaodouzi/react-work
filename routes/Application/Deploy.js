import React from 'react'
import { Card,Divider,message,Spin } from 'antd';
import {
  BasicSettings,
  EnvVariables,
  Middleware,
  NetworkConfig,
  Settingfiles,
  Storages
} from '../../components/Application/Deploy';
import { 
  queryBaseConfig,
  queryNetwork,
  queryRoutes,
  addNetworkConfig,
  deleteNetworkConfig,
  putBaseConfig,
  putConfigs,
  changeProbe 
} from '../../services/deploy';
import { getAppInfo } from '../../services/appdetail';
export default class AppDeploy extends React.Component {
  state = {
    //tab页签切换state,也是容器名称container
    operationkey:'',
    appCode:'',
    appId:'',
    //部署页面个模块所有信息
    bases:[],
    networkConfigs:[],
    loading:true,
    networkLoading:false,
    storageLoading:false,
    settingFileLoading:false,
  }
  componentDidMount() {
    const appId = this.props.match.params.id;
    getAppInfo(appId).then((data)=>{
      this.setState({appCode:data.code,appId:data.id});
      this.getBasicInfo(data.code);
    });
  }
  //容器页签切换
  onOperationTabChange = (key) => {
    this.setState({
      operationkey: key,
    });
  }
  getNetworkInfo = ()=>{
    let queryNetwork1 = queryNetwork(this.state.appCode,{ page: 1, rows: 1000 });
    let queryRoutes1 = queryRoutes(this.state.appCode); 
    Promise.all([queryNetwork1,queryRoutes1]).then(([networks,routes]) =>{
      let networkConfigs = [],networkConfig ={};
      networks.contents.forEach((network,index1)=>{
        networkConfig={
          key:Math.random(),
          name: network.containerName,
          port: network.port,
          protocol: network.protocol,
          inneraddress:network.ip+':'+network.targetPort
        };
        routes.forEach((route,index2)=>{
          if(network.containerName === route.containerName && network.port === route.port){
            networkConfig.outaddress = route.ip;
          }
        });
        networkConfigs.push(networkConfig);
      });
      this.setState({networkConfigs,flag:Math.random(),networkLoading:false});
    });
  }
  //获取应用部署信息
  getBasicInfo = (application) => {
    let queryBaseConfig1 = queryBaseConfig(application);
    let queryNetwork1 = queryNetwork(application,{ page: 1, rows: 1000 });
    let queryRoutes1 = queryRoutes(application); 
    Promise.all([queryBaseConfig1,queryNetwork1,queryRoutes1]).then(([bases,networks,routes]) =>{
      let networkConfigs = [],networkConfig ={};
      networks.contents.forEach((network,index1)=>{
        networkConfig={
          key:Math.random(),
          name: network.containerName,
          port: network.port,
          protocol: network.protocol,
          inneraddress:network.ip+':'+network.targetPort
        };
        routes.forEach((route,index2)=>{
          if(network.containerName === route.containerName && network.port === route.port){
            networkConfig.outaddress = route.ip;
          }
        });
        networkConfigs.push(networkConfig);
      });
      if(bases){
        this.setState({
          bases,
          networkConfigs,
          loading:false,
          networkLoading:false
        },()=>{
          this.onOperationTabChange(bases[0].name);
        });
      }
    });
  }
  //基本配置修改
  onChangeBasicInfo = (version,dockerConfig,isVersionChange,isDockerConfigChange) =>{
    let bases = this.state.bases.slice();
    const { appCode,operationkey } = this.state;
    bases.forEach((base)=>{
      if(base.name === operationkey){
        if(isVersionChange){
          base.version = version;
          putBaseConfig(appCode,operationkey,'image',base).then(()=>{
            this.setState({bases});
            message.success('容器版本修改成功');
          }).catch(()=>{
            message.error('容器版本修改失败');
            this.getBasicInfo(appCode);
          });
        }
        if(isDockerConfigChange){
          base.reSource.limits = {
            cpu:{amount:dockerConfig.split('-')[0]},
            memory:{amount:dockerConfig.split('-')[1]}
          }
          putBaseConfig(appCode,operationkey,'resource',base).then(()=>{
            this.setState({bases});
            message.success('容器配置修改成功');
          }).catch(()=>{
            message.error('容器配置修改失败');
            this.getBasicInfo(appCode);
          });
        }
      }
    });
    //修改bases,networks,routes的状态值
  }
  //添加网络配置
  onAddNetworkConfig = (networkConfig,innerSelect,outerSelect) =>{
    const { operationkey,appCode } = this.state;
    networkConfig.name = operationkey;
    let params = {
      containerName:operationkey,
      port:networkConfig.port,
      protocol:networkConfig.protocol,
    };
    let networkConfigs = this.state.networkConfigs.slice();
    networkConfigs.push(networkConfig);
    this.setState({networkLoading:true,networkConfigs});
    if(innerSelect === 'open'){
      params.type = 'CLUSTERIP';
      params.targetPort=networkConfig.inneraddress.split(':')[1];
      addNetworkConfig(appCode,operationkey,params).then(()=>{
        if(outerSelect === 'open'){
          params.type = 'NODEPORT';
          params.targetPort = networkConfig.port;
          params.nodePort = networkConfig.outaddress.split(':')[1];
          params.ip = networkConfig.inneraddress.split(':')[0];
          addNetworkConfig(appCode,operationkey,params).then(()=>{
            message.success('添加网络配置成功');
            this.setState({networkLoading:false})
            this.getNetworkInfo();
          }).catch(()=>{
            message.error('添加网络配置失败');
            this.setState({networkLoading:false});
            this.getNetworkInfo();
          });
        }else{
          message.success('添加网络配置成功');
          this.setState({networkLoading:false})
          this.getNetworkInfo();
        }
      }).catch(()=>{
        message.error('添加网络配置失败');
        this.getNetworkInfo();
        this.setState({networkLoading:false})
      });
    }else{
      params.type = 'PODPORT';
      addNetworkConfig(appCode,operationkey,params).then(()=>{
        if(outerSelect === 'open'){
          params.type = 'NODEPORT';
          params.nodePort = networkConfig.outaddress.split(':')[1];
          params.targetPort=networkConfig.port;
          params.ip = '127.0.0.1';
          addNetworkConfig(appCode,operationkey,params).then(()=>{
            message.success('添加网络配置成功');
            this.setState({networkLoading:false})
            this.getNetworkInfo();
          }).catch(()=>{
            message.error('添加网络配置失败');
            this.getNetworkInfo();
            this.setState({networkLoading:false})
          });
        }else{
          message.success('添加网络配置成功');
          this.setState({networkLoading:false})
          this.getNetworkInfo();
        }
      }).catch(()=>{
        message.error('添加网络配置失败');
        this.getNetworkInfo();
        this.setState({networkLoading:false})
      });
    }
  }
  //删除网络配置
  onDeleteNetWorkConfig = (key) =>{
    let networkConfigs = this.state.networkConfigs.slice();
    networkConfigs.forEach((networkConfig,index)=>{
      let port;
      let params = {
        containerName:this.state.operationkey,
        port:networkConfig.port,
        protocol:networkConfig.protocol
      };
      if(key === networkConfig.key){
        this.setState({networkLoading:true});
        if(networkConfig.outaddress){
          params.targetPort=networkConfig.outaddress.split(':')[1];
          params.type="NODEPORT";
          port = networkConfig.outaddress.split(':')[1];
          deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
            if(networkConfig.inneraddress.split(':')[0] !== '127.0.0.1'){
              params.type="CLUSTERIP";
              port = networkConfig.port;
              deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
                message.success("删除网络配置成功");
                this.getNetworkInfo();
              }).catch(()=>{
                message.error('删除网络配置失败');
                this.getNetworkInfo();
                this.setState({networkLoading:false})
              });
            }else{
              params.type="PODPORT";
              port = networkConfig.port;
              deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
                message.success("删除网络配置成功");
                this.getNetworkInfo();
              }).catch(()=>{
                message.error('删除网络配置失败');
                this.getNetworkInfo();
                this.setState({networkLoading:false})
              });
            }
          }).catch(()=>{
            message.error('删除网络配置失败');
            this.getNetworkInfo();
            this.setState({networkLoading:false})
          });
        }else{
          if(networkConfig.inneraddress.split(':')[0] === '127.0.0.1'){
            params.type="PODPORT";
            port = networkConfig.port;
            deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
              message.success("删除网络配置成功");
              this.getNetworkInfo();
            }).catch(()=>{
              message.error('删除网络配置失败');
              this.getNetworkInfo();
              this.setState({networkLoading:false})
            });
          }else{
            params.type="CLUSTERIP";
            port = networkConfig.port;
            deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
              message.success("删除网络配置成功");
              this.getNetworkInfo();
            }).catch(()=>{
              message.error('删除网络配置失败');
              this.getNetworkInfo();
              this.setState({networkLoading:false})
            });
          }
        }
      }
    });
  }
  //添加或修改删除配置文件
  onEditSettingfiles = (configs,configContent,flag)=>{
    let {bases,appCode,operationkey} = this.state;
    bases.forEach(base=>{
      if(base.name === operationkey){
        base.configs=configs; 
        let tempBase = Object.assign({},base);
        tempBase.configs = [];
        tempBase.volumes = [];
        configs.forEach((element)=>{
          if(flag && element.name ==='config-license'){
            tempBase.volumes.push({
              mountPath:'/data/license/license.lic',
              name:'config-license',
              subpath: 'license.lic',
              additionalProperties:{
                path:'license.lic',
              }
            }); 
          }else{
            tempBase.volumes.push({
              mountPath:element.mountPath,
              name:element.name,
              additionalProperties:{
                path:element.additionalProperties.path,
              }
            });
          }
          tempBase.configs.push({
            mountPath:element.mountPath,
            name:element.name.slice(element.name.lastIndexOf('-')+1),
            additionalProperties:{
              path:element.additionalProperties.path,
              config:element.additionalProperties.config
            }
          });
        });
        this.setState({settingFileLoading:true});
        putConfigs(appCode,configContent).then(()=>{
          putBaseConfig(appCode,operationkey,'configmap',tempBase).then(()=>{
            this.setState({bases,settingFileLoading:false});
            if(flag){
              message.success('共享许可修改成功');
            }else{
              message.success('配置文件修改成功');
            }
          }).catch(()=>{
            message.error('配置文件修改失败');
            this.getBasicInfo(appCode);
            this.setState({settingFileLoading:false});
          });
        }).catch(()=>{
          message.error('配置文件修改失败');
          this.getBasicInfo(appCode);
          this.setState({settingFileLoading:false});
        });
      }
    }); 
  }
  //添加存储卷
  onEditStorages = (volumes)=>{
    const {bases,operationkey,appCode} = this.state;
    bases.forEach(base=>{
      if(base.name === operationkey){
        base.volumes=volumes; 
        this.setState({storageLoading:true});
        putBaseConfig(appCode,operationkey,'volume',base).then(()=>{
          this.setState({bases,storageLoading:false});
          message.success('存储卷修改成功');
        }).catch(()=>{
          message.error('存储卷修改失败');
          this.getBasicInfo(appCode);
          this.setState({storageLoading:false});
        });
      }
    });
  }
  onSaveStartCMD = (startCmd) =>{
    const {bases,operationkey,appCode} = this.state;
    bases.forEach(base=>{
      if(base.name === operationkey){
        if(startCmd){
          base.cmd[0]=startCmd.split(' ')[0];
          let tempArgs = startCmd.slice(startCmd.indexOf(' ')+1);
          base.args = tempArgs.split(' '); 
          putBaseConfig(appCode,operationkey,'cmd',base).then(()=>{
            this.setState({bases});
            message.success('启动命令修改成功');
          }).catch(()=>{
            message.error('启动命令修改失败');
            this.getBasicInfo(appCode);
          });
        }else{
          base.cmd = [];
          base.args = [];
          putBaseConfig(appCode,operationkey,'cmd',base).then(()=>{
            this.setState({bases});
            message.success('启动命令修改成功');
          }).catch(()=>{
            message.error('启动命令修改失败');
            this.getBasicInfo(appCode);
          });
        }
      }
    });
  }
  onChangeProbe = (probe,flag)=>{
    console.log('changeprobe',probe);
    const {bases,operationkey,appCode} = this.state;
    bases.forEach(base=>{
      if(base.name === operationkey){
        if(probe){
          if(flag){
            base.probe=probe; 
            base.readinessProbe = probe;
            console.log('probe',flag,base);
            //调用probe修改接口
            changeProbe(appCode,operationkey,base).then(()=>{
              this.setState({bases});
              message.success('健康检查开启成功');
            }).catch(err=>{
              message.error('健康检查开启失败');
              this.getBasicInfo(appCode);
            })
          }else{
            base.probe=probe; 
            //调用probe修改接口
            changeProbe(appCode,operationkey,base).then(()=>{
              this.setState({bases});
              message.success('健康检查开启成功');
            }).catch(err=>{
              message.error('健康检查开启失败');
              this.getBasicInfo(appCode);
            })
          }
        }else{
          delete base.probe;
          delete base.readinessProbe;
          changeProbe(appCode,operationkey,base).then(()=>{
            this.setState({bases});
            message.success('健康检查关闭成功');
          }).catch(err=>{
            message.error('健康检查关闭失败');
            this.getBasicInfo(appCode);
          })
        }
      }
    });
  }
  onChangeShareLicense = (configs,flag)=>{   
    let configContent = {
      data:{},
      metadata:{
        annotations:{
          data:{}
        }
      },
    }
    console.log('changesharelicense',configs,flag);
    if(flag === 'open'){
      configs.forEach(element => {
        let keyName = element.name;
        element.key = keyName;
        configContent.data[element.name] = element.additionalProperties.config;
      });
      let config = {
        additionalProperties:{
          path:'license',
        },
        mountPath:'/data/license',
        name:'config-license',
        subPath:'license'
      }
      configs.push(config);
      console.log('configs',configs,configContent);
      this.onEditSettingfiles(configs,configContent,true);
    }else{
      configs = configs.filter(element => element.name !=='config-license');
      configs.forEach(element => {
        let keyName = element.name;
        element.key = keyName;
        configContent.data[element.name] = element.additionalProperties.config;
      });
      console.log('configs',configs,configContent);
      this.onEditSettingfiles(configs,configContent,true);
    }
  }
  renderTabContent = (name) => {
    const { bases,networkConfigs,appCode,appId,operationkey,networkLoading,storageLoading,settingFileLoading } = this.state;
    let base={},networkConfig=[];
    networkConfigs.forEach(element=>{
      if(element.name === name){
        networkConfig.push(element);
      }
    });
    bases.forEach(element=>{
      if(element.name === name){
        base = element;
      }
    });
    let dockerConfig = '';
    if(base.reSource.limits){
      dockerConfig = base.reSource.limits.cpu.amount+'-'+base.reSource.limits.memory.amount;
    }
    return (
      <div>
        <BasicSettings
          artifact={base.image.split('/')[2]}
          tenant={base.image.split('/')[1]}
          version={base.version} 
          node={base.hostIP} 
          dockerConfig={dockerConfig} 
          appCode={appCode}
          operationkey={operationkey}
          probe={base.probe}
          configs={base.configs}
          onChangeProbe={this.onChangeProbe}
          onChangeShareLicense={this.onChangeShareLicense}
          onChangeBasicInfo={this.onChangeBasicInfo} />
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <NetworkConfig 
          node={base.hostIP}
          networkConfigs={networkConfig}
          networkLoading={networkLoading}
          appCode={appCode}
          operationkey={operationkey}
          onAddNetworkConfig={this.onAddNetworkConfig}
          onDeleteNetWorkConfig={this.onDeleteNetWorkConfig} />
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <EnvVariables 
          operationkey={operationkey}
          appCode={appCode}
        />
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <Middleware 
          operationkey={operationkey}
          appId={appId}/>
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <Storages 
          volumes={base.volumes}
          operationkey={operationkey}
          appCode={appCode}
          storageLoading={storageLoading}
          onEditStorages={this.onEditStorages}
        />
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <Settingfiles 
          configs={base.configs}
          cmd={base.cmd}
          args={base.args}
          operationkey={operationkey}
          appCode={appCode}
          onSaveStartCMD={this.onSaveStartCMD}
          settingFileLoading={settingFileLoading}
          onEditSettingfiles={this.onEditSettingfiles}
        />
      </div>
    )
  }
  render(){
    const { operationkey,bases,loading } = this.state;
    let contentList = {};
    let operationTabList = [];
    bases.forEach(baseConfig => {
      operationTabList.push({key:baseConfig.name,tab:baseConfig.name});
      contentList[baseConfig.name]=this.renderTabContent(baseConfig.name);
    });
    return (
      <Spin spinning={loading}>
        <Card 
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
          style={{margin:24,minHeight:1000}}>
            {contentList[operationkey]}
        </Card>
      </Spin>
    )
  }
}