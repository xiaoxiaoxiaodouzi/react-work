import React from 'react'
import { Card,Divider,message,Spin } from 'antd';
import {BasicSettings,EnvVariables,Middleware,NetworkConfig,Settingfiles,Storages} from '../../components/Application/Deploy';
import { queryBaseConfig,queryNetwork,queryRoutes,addNetworkConfig,deleteNetworkConfig,putBaseConfig,putConfigs } from '../../services/deploy';
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
      //console.log("values",networks,routes);
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
      //console.log("values",bases,networks,routes);
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
  renderTabContent = (name) => {
    const { bases,networkConfigs,appCode,appId,operationkey,networkLoading } = this.state;
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
        <Middleware 
          operationkey = {operationkey}
          appId = {appId}/>
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <EnvVariables 
          operationkey = {operationkey}
          appCode = {appCode}
        />
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <Storages 
          volumes={base.volumes}
          operationkey = {operationkey}
          appCode = {appCode}
          onEditStorages={this.onEditStorages}
        />
        <Divider style={{ marginBottom: 32,marginTop:32 }} />
        <Settingfiles 
          configs={base.configs}
          cmd={base.cmd}
          args={base.args}
          operationkey = {operationkey}
          appCode = {appCode}
          onSaveStartCMD={this.onSaveStartCMD}
          onEditSettingfiles={this.onEditSettingfiles}
        />
      </div>
    )
  }
  //基本配置修改
  onChangeBasicInfo = (version,dockerConfig,isVersionChange,isDockerConfigChange) =>{
    ////console.log("123454",version,dockerConfig);
    let bases = this.state.bases.slice();
    const { appCode,operationkey } = this.state;
    bases.forEach((base)=>{
      if(base.name === operationkey){
        if(isVersionChange){
          base.version = version;
          putBaseConfig(appCode,operationkey,'image',base).then(()=>{
            this.setState({bases});
            message.success('容器版本修改成功');
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
          });
        }
      }
    });
    //修改bases,networks,routes的状态值
  }
  //添加网络配置
  onAddNetworkConfig = (networkConfig,innerSelect,outerSelect) =>{
    ////console.log("onAddnetwork",networkConfig,innerSelect,outerSelect);
    const { operationkey,appCode } = this.state;
    this.setState({networkLoading:true});
    networkConfig.name = operationkey;
    let params = {
      containerName:operationkey,
      port:networkConfig.port,
      protocol:networkConfig.protocol,
    };
    if(innerSelect === 'open'){
      params.type = 'CLUSTERIP';
      params.targetPort=networkConfig.inneraddress.split(':')[1];
      ////console.log("params inner open",params);
      addNetworkConfig(appCode,operationkey,params).then(()=>{
        if(outerSelect === 'open'){
          params.type = 'NODEPORT';
          params.targetPort = networkConfig.port;
          params.nodePort = networkConfig.outaddress.split(':')[1];
          params.ip = networkConfig.inneraddress.split(':')[0];
          ////console.log("params inner open11111",params);
          addNetworkConfig(appCode,operationkey,params).then(()=>{
            message.success('添加网络配置成功');
            this.getNetworkInfo();
          });
        }else{
          message.success('添加网络配置成功');
          this.getNetworkInfo();
        }
      });
    }else{
      params.type = 'PODPORT';
      addNetworkConfig(appCode,operationkey,params).then(()=>{
        if(outerSelect === 'open'){
          params.type = 'NODEPORT';
          params.nodePort = networkConfig.outaddress.split(':')[1];
          params.targetPort=networkConfig.port;
          params.ip = '127.0.0.1';
          ////console.log("params inner open111",params);
          addNetworkConfig(appCode,operationkey,params).then(()=>{
            message.success('添加网络配置成功');
            this.getNetworkInfo();
          });
        }else{
          message.success('添加网络配置成功');
          this.getNetworkInfo();
        }
      });
    }
  }
  //删除网络配置
  onDeleteNetWorkConfig = (key) =>{
    let networkConfigs = this.state.networkConfigs.slice();
    this.setState({networkLoading:true});
    ////console.log("onDeleteNetWorkConfig",networkConfigs,key);
    networkConfigs.forEach((networkConfig,index)=>{
      let port;
      let params = {
        containerName:this.state.operationkey,
        port:networkConfig.port,
        protocol:networkConfig.protocol
      };
      if(key === networkConfig.key){
        if(networkConfig.outaddress){
          params.targetPort=networkConfig.outaddress.split(':')[1];
          params.type="NODEPORT";
          port = networkConfig.outaddress.split(':')[1];
          ////console.log("params",params,port);
          deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
            if(networkConfig.inneraddress.split(':')[0] !== '127.0.0.1'){
              params.type="CLUSTERIP";
              port = networkConfig.port;
              deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
                message.success("删除网络配置成功");
                this.getNetworkInfo();
              });
            }else{
              params.type="PODPORT";
              port = networkConfig.port;
              deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
                message.success("删除网络配置成功");
                this.getNetworkInfo();
              });
            }
          });
        }else{
          if(networkConfig.inneraddress.split(':')[0] === '127.0.0.1'){
            params.type="PODPORT";
            port = networkConfig.port;
            ////console.log("inner close",params,port);
            deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
              message.success("删除网络配置成功");
              this.getNetworkInfo();
            });
          }else{
            params.type="CLUSTERIP";
            port = networkConfig.port;
            //console.log("inner open",params,port);
            deleteNetworkConfig(this.state.appCode,this.state.operationkey,port,params).then(()=>{
              message.success("删除网络配置成功");
              this.getNetworkInfo();
            });
          }
        }
        //networkConfigs.splice(index,1);
        //this.setState({networkConfigs});
      }
    });
  }
  //添加或修改删除配置文件
  onEditSettingfiles = (configs,configContent)=>{
    //console.log("onEditSettingfiles111",configs,configContent);
    let {bases,appCode,operationkey} = this.state;
    bases.forEach(base=>{
      if(base.name === operationkey){
        base.configs=configs; 
        let tempBase = Object.assign({},base);
        tempBase.configs = [];
        tempBase.volumes = [];
        configs.forEach((element)=>{
          tempBase.volumes.push({
            mountPath:element.mountPath,
            name:element.name,
            additionalProperties:{
              path:element.additionalProperties.path,
            }
          });
          tempBase.configs.push({
            mountPath:element.mountPath,
            name:element.name.slice(element.name.lastIndexOf('-')+1),
            additionalProperties:{
              path:element.additionalProperties.path,
              config:element.additionalProperties.config
            }
          });
        });
        //console.log("tempBase",tempBase);
        putConfigs(appCode,configContent).then(()=>{
          putBaseConfig(appCode,operationkey,'configmap',tempBase).then(()=>{
            this.setState({bases});
            message.success('配置文件修改成功');
          });
        });
      }
    }); 
  }
  //添加存储卷
  onEditStorages = (volumes)=>{
    //console.log("onEditStorages111",volumes);
    const {bases,operationkey,appCode} = this.state;
    bases.forEach(base=>{
      if(base.name === operationkey){
        base.volumes=volumes; 
        putBaseConfig(appCode,operationkey,'volume',base).then(()=>{
          this.setState({bases});
          message.success('存储卷修改成功');
        });
      }
    });
  }
  onSaveStartCMD = (startCmd) =>{
    //console.log("startcmd",startCmd);
    const {bases,operationkey,appCode} = this.state;
    bases.forEach(base=>{
      if(base.name === operationkey){
        if(startCmd){
          base.cmd[0]=startCmd.split(' ')[0];
          let tempArgs = startCmd.slice(startCmd.indexOf(' ')+1);
          base.args = tempArgs.split(' '); 
          //console.log("ccccc111",base.cmd,base.args);
          putBaseConfig(appCode,operationkey,'cmd',base).then(()=>{
            this.setState({bases});
            message.success('启动命令修改成功');
          });
        }else{
          base.cmd = [];
          base.args = [];
          putBaseConfig(appCode,operationkey,'cmd',base).then(()=>{
            this.setState({bases});
            message.success('启动命令修改成功');
          });
        }
      }
    });
  }
  componentDidMount() {
    const appId = this.props.match.params.id;
    getAppInfo(appId).then((data)=>{
      this.setState({appCode:data.code,appId:data.id});
      this.getBasicInfo(data.code);
    });
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