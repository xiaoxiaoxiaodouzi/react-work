import React from 'react'
import { Card, Divider, message, Spin, Tooltip, Icon } from 'antd';
import { base as ampBase } from '../../services/base';
import {
  BasicSettings,
  EnvVariables,
  Middleware,
  NetworkConfig,
  Settingfiles,
  Storages
} from '../../components/Application/Deploy';

import { deleteNetworkConfig, addNetworkConfig, queryNetwork, queryBaseConfig, queryRoutes, putBaseConfig, putConfigs, changeProbe, queryChartBaseConfig } from '../../services/cce'
import { ErrorComponentCatch } from '../../common/SimpleComponents';
import constants from '../../services/constants';
import DepolyContext from '../../context/DepolyContext';
import { quotaFormat, quotaMiFormat } from '../../utils/utils';


class AppDeploy extends React.Component {
  state = {
    //tab页签切换state,也是容器名称container
    operationkey: '',
    appCode: '',
    appId: '',
    bases: [],   //容器信息
    networkConfigs: [],  //网络配置信息，拼接集群内，集群外地址信息
    loading: true,
    networkLoading: false,
    storageLoading: false,
    settingFileLoading: false,
    type: ''     //应用类型  apps  /middleware
  }
  componentDidMount() {
    const appData = this.props.appData;
    let appId = appData ? appData.id : this.props.appId;
    let appCode = appData ? appData.code : '';
    let type = appData ? appData.type : '';
    if (!ampBase.safeMode) {
      if (this.props.type === 'chart') {
        this.setState({ appCode: appId, type: 'chart' }, () => {
          /* this.getNetworkInfo(); */
        })
        this.getBasicInfo(appId);
      } else {
          this.setState({ appCode: appCode, appId: appId, type: type }, () => this.getNetworkInfo());
          this.getBasicInfo(appCode);
      }
    } else {
      this.setState({ appCode: appCode, type: "apps" }, () => this.getNetworkInfo());
      this.getBasicInfo(appCode);
    }

  }
  //容器页签切换
  onOperationTabChange = (key) => {
    this.setState({
      operationkey: key,
    });
  }
  //获取网络配置信息
  getNetworkInfo = () => {

    let queryNetwork1 = queryNetwork(this.state.appCode, { page: 1, rows: 1000 });
    let queryRoutes1 = queryRoutes(this.state.appCode);
    Promise.all([queryNetwork1, queryRoutes1]).then(([networks, routes]) => {
      let networkConfigs = [], networkConfig = {};
      networks.contents.forEach((network, index1) => {
        networkConfig = {
          key: Math.random(),
          name: network.containerName,
          port: network.port,
          protocol: network.protocol,
          inneraddress: network.ip + ':' + network.targetPort
        };
        routes.forEach((route, index2) => {
          if (network.containerName === route.containerName && network.port === route.port) {
            networkConfig.outaddress = route.ip;
          }
        });
        networkConfigs.push(networkConfig);
      });
      this.setState({ networkConfigs, flag: Math.random(), networkLoading: false });
    }).catch(err => {
      this.setState({ networkConfigs: [], flag: Math.random(), networkLoading: false });
    });

  }
  //获取应用部署信息
  getBasicInfo = (application) => {
    if (this.props.type === 'chart') {
      queryChartBaseConfig(application, { env: this.props.env }).then((bases) => {
        this.setState({ loading: false });
        if (bases) {
          this.setState({
            bases,
          }, () => {
            if (bases.length > 0) this.onOperationTabChange(bases[0].name);
          });
        }
      })
    } else {
      queryBaseConfig(application).then((bases) => {
        this.setState({ loading: false });
        if (bases) {
          this.setState({
            bases,
          }, () => {
            if (bases.length > 0) this.onOperationTabChange(bases[0].name);
          });
        }
      });
    }
  }
  //基本配置修改
  onChangeBasicInfo = (version, dockerConfig, isVersionChange, isDockerConfigChange, request) => {
    let bases = this.state.bases.slice();
    const { appCode, operationkey } = this.state;
    bases.forEach((base) => {
      if (base.name === operationkey) {
        if (isVersionChange) {
          base.version = version;
          putBaseConfig(appCode, operationkey, 'image', base).then(() => {
            this.getBasicInfo(appCode);
            message.success('容器版本修改成功');
          }).catch((e) => {
            ampBase.ampMessage('容器版本修改失败');
            this.getBasicInfo(appCode);
          });
        }
        if (isDockerConfigChange) {
          base.reSource.limits = {
            cpu: { amount: dockerConfig[0].split('-')[0] },
            memory: { amount: quotaMiFormat(dockerConfig[0].split('-')[1]) }
          }
          base.reSource.requests = {
            cpu: { amount: dockerConfig[1].split('-')[0] },
            memory: { amount: quotaMiFormat(dockerConfig[1].split('-')[1]) }
          }
          putBaseConfig(appCode, operationkey, 'resource', base).then(() => {
            this.getBasicInfo(appCode);
            message.success('容器配置修改成功');
          }).catch((e) => {
            ampBase.ampMessage('容器配置修改失败');
            this.getBasicInfo(appCode);
          });
        }
      }
    });
  }
  /**
   * 添加网络配置，先判断集群内地址是否开放，在判断集群外地址是否开放,先添加集群内地址再添加集群外地址
   * 集群内地址开放  @name type = 'CLUSTERIP', 调用 @function addNetworkConfig 方法
   * 集群内地址关闭  @name type = 'PODPORT', 调用 @function addNetworkConfig 方法
   * 集群外地址开放  @name type = 'NODEPORT', 调用 @function addNetworkConfig 方法
   * 集群外地址关闭  
   */
  onAddNetworkConfig = (networkConfig, innerSelect, outerSelect) => {
    const { operationkey, appCode } = this.state;
    networkConfig.name = operationkey;
    let params = {
      containerName: operationkey,
      port: networkConfig.port,
      protocol: networkConfig.protocol,
    };
    this.setState({ networkLoading: true });
    if (innerSelect === 'open') {
      params.type = 'CLUSTERIP';
      params.targetPort = networkConfig.inneraddress.split(':')[1];
      addNetworkConfig(appCode, operationkey, params).then(() => {
        if (outerSelect === 'open') {
          params.type = 'NODEPORT';
          params.targetPort = networkConfig.port;
          params.nodePort = networkConfig.outaddress.split(':')[1];
          params.ip = networkConfig.inneraddress.split(':')[0];
          addNetworkConfig(appCode, operationkey, params).then(() => {
            message.success('添加网络配置成功');
            this.setState({ networkLoading: false })
            this.getNetworkInfo();
          }).catch((e) => {
            ampBase.ampMessage('添加网络配置失败')
            this.setState({ networkLoading: false });
            this.getNetworkInfo();
          });
        } else {
          message.success('添加网络配置成功');
          this.setState({ networkLoading: false })
          this.getNetworkInfo();
        }
      }).catch((e) => {
        ampBase.ampMessage('添加网络配置失败')
        this.getNetworkInfo();
        this.setState({ networkLoading: false })
      });
    } else {
      params.type = 'PODPORT';
      addNetworkConfig(appCode, operationkey, params).then(() => {
        if (outerSelect === 'open') {
          params.type = 'NODEPORT';
          params.nodePort = networkConfig.outaddress.split(':')[1];
          params.targetPort = networkConfig.port;
          params.ip = '127.0.0.1';
          addNetworkConfig(appCode, operationkey, params).then(() => {
            message.success('添加网络配置成功');
            this.setState({ networkLoading: false })
            this.getNetworkInfo();
          }).catch((e) => {
            ampBase.ampMessage('添加网络配置失败')
            this.getNetworkInfo();
            this.setState({ networkLoading: false })
          });
        } else {
          message.success('添加网络配置成功');
          this.setState({ networkLoading: false })
          this.getNetworkInfo();
        }
      }).catch((e) => {
        ampBase.ampMessage('添加网络配置失败')
        this.getNetworkInfo();
        this.setState({ networkLoading: false })
      });
    }
  }
  onChangeNetworkConfig = (networkConfig, flag) => {
    // flag=open 增加，flag=close 删除
    const { operationkey, appCode } = this.state;
    networkConfig.name = operationkey;
    let params = {
      containerName: operationkey,
      port: networkConfig.port,
      protocol: networkConfig.protocol,
    };
    this.setState({ networkLoading: true });
    if (flag === 'open') {
      params.type = 'NODEPORT';
      params.targetPort = networkConfig.port;
      params.nodePort = networkConfig.outaddress ? networkConfig.outaddress.split(':')[1] : '';
      params.ip = networkConfig.inneraddress.split(':')[0];
      addNetworkConfig(appCode, operationkey, params).then(() => {
        message.success('添加集群外地址成功');
        this.setState({ networkLoading: false })
        this.getNetworkInfo();
      }).catch((e) => {
        ampBase.ampMessage('添加集群外地址失败')
        this.setState({ networkLoading: false });
        this.getNetworkInfo();
      });
    } else {
      params.targetPort = networkConfig.outaddress.split(':')[1];
      params.type = "NODEPORT";
      let port = networkConfig.outaddress.split(':')[1];
      deleteNetworkConfig(this.state.appCode, this.state.operationkey, port, params).then(() => {
        message.success('删除集群外地址成功');
        this.setState({ networkLoading: false });
        this.getNetworkInfo();
      }).catch((e) => {
        ampBase.ampMessage('删除集群外地址失败')
        this.setState({ networkLoading: false });
        this.getNetworkInfo();
      });
    }
  }
  /**
   * 删除网络配置，先删除集群外地址，在删除集群外地址
   * 集群内地址开放  @name type = 'CLUSTERIP', 调用 @function deleteNetworkConfig 方法
   * 集群内地址关闭  @name type = 'PODPORT', 调用 @function deleteNetworkConfig 方法
   * 集群外地址开放  @name type = 'NODEPORT', 调用 @function deleteNetworkConfig 方法
   * 集群外地址关闭  
   */
  onDeleteNetWorkConfig = (key) => {
    let networkConfigs = this.state.networkConfigs.slice();
    networkConfigs.forEach((networkConfig, index) => {
      let port;
      let params = {
        containerName: this.state.operationkey,
        port: networkConfig.port,
        protocol: networkConfig.protocol
      };
      if (key === networkConfig.key) {
        this.setState({ networkLoading: true });
        if (networkConfig.outaddress) {
          params.targetPort = networkConfig.outaddress.split(':')[1];
          params.type = "NODEPORT";
          port = networkConfig.outaddress.split(':')[1];
          deleteNetworkConfig(this.state.appCode, this.state.operationkey, port, params).then(() => {
            if (networkConfig.inneraddress.split(':')[0] !== '127.0.0.1') {
              params.type = "CLUSTERIP";
              port = networkConfig.port;
              deleteNetworkConfig(this.state.appCode, this.state.operationkey, port, params).then(() => {
                message.success("删除网络配置成功");
                this.getNetworkInfo();
              }).catch((e) => {
                ampBase.ampMessage('删除网络配置失败')
                this.getNetworkInfo();
                this.setState({ networkLoading: false })
              });
            } else {
              params.type = "PODPORT";
              port = networkConfig.port;
              deleteNetworkConfig(this.state.appCode, this.state.operationkey, port, params).then(() => {
                message.success("删除网络配置成功");
                this.getNetworkInfo();
              }).catch((e) => {
                ampBase.ampMessage('删除网络配置失败')
                this.getNetworkInfo();
                this.setState({ networkLoading: false })
              });
            }
          }).catch((e) => {
            ampBase.ampMessage('删除网络配置失败')
            this.getNetworkInfo();
            this.setState({ networkLoading: false })
          });
        } else {
          if (networkConfig.inneraddress.split(':')[0] === '127.0.0.1') {
            params.type = "PODPORT";
            port = networkConfig.port;
            deleteNetworkConfig(this.state.appCode, this.state.operationkey, port, params).then(() => {
              message.success("删除网络配置成功");
              this.getNetworkInfo();
            }).catch((e) => {
              ampBase.ampMessage('删除网络配置失败')
              this.getNetworkInfo();
              this.setState({ networkLoading: false })
            });
          } else {
            params.type = "CLUSTERIP";
            port = networkConfig.port;
            deleteNetworkConfig(this.state.appCode, this.state.operationkey, port, params).then(() => {
              message.success("删除网络配置成功");
              this.getNetworkInfo();
            }).catch((e) => {
              ampBase.ampMessage('删除网络配置失败')
              this.getNetworkInfo();
              this.setState({ networkLoading: false })
            });
          }
        }
      }
    });
  }
  //添加或修改删除配置文件,采用整体替换策略，拼接容器base的volumes和configs字段
  onEditSettingfiles = (configs, configContent, flag) => {
    let { bases, appCode, operationkey } = this.state;
    bases.forEach(base => {
      if (base.name === operationkey) {
        base.configs = configs;
        let tempBase = Object.assign({}, base);
        tempBase.configs = [];
        tempBase.volumes = [];
        configs.forEach((element) => {
          if (flag && element.name === 'config-license') {
            tempBase.volumes.push({
              mountPath: '/data/license/license.lic',
              name: 'config-license',
              subpath: 'license.lic',
              additionalProperties: {
                path: 'license.lic',
              }
            });
          } else {
            tempBase.volumes.push({
              mountPath: element.mountPath,
              name: element.name,
              additionalProperties: {
                path: element.additionalProperties.path,
              }
            });
          }
          tempBase.configs.push({
            mountPath: element.mountPath,
            name: element.name.slice(element.name.lastIndexOf('-') + 1),
            additionalProperties: {
              path: element.additionalProperties.path,
              config: element.additionalProperties.config
            }
          });
        });
        this.setState({ settingFileLoading: true });
        putConfigs(appCode, configContent).then(() => {
          putBaseConfig(appCode, operationkey, 'configmap', tempBase).then(() => {
            this.setState({ settingFileLoading: false });
            this.getBasicInfo(appCode);
            if (flag) {
              message.success('共享许可修改成功');
            } else {
              message.success('配置文件修改成功');
            }
          }).catch((e) => {
            ampBase.ampMessage('配置文件修改失败');
            this.getBasicInfo(appCode);
            this.setState({ settingFileLoading: false });
          });
        }).catch((e) => {
          ampBase.ampMessage('配置文件修改失败');
          this.getBasicInfo(appCode);
          this.setState({ settingFileLoading: false });
        });
      }
    });
  }
  //存储卷修改也采用整体替换策略，凭借好volumes字段后替换
  onEditStorages = (volumes) => {
    const { bases, operationkey, appCode } = this.state;
    bases.forEach(base => {
      if (base.name === operationkey) {
        base.volumes = volumes;
        this.setState({ storageLoading: true });
        putBaseConfig(appCode, operationkey, 'volume', base).then(() => {
          this.getBasicInfo(appCode);
          this.setState({ storageLoading: false });
          message.success('存储卷修改成功');
        }).catch((e) => {
          ampBase.ampMessage('存储卷修改失败');
          this.getBasicInfo(appCode);
          this.setState({ storageLoading: false });
        });
      }
    });
  }
  //修改启动命令，第一个空格前的命令拼接到base的cmd字段，后面的拼接到args中，cmd和args是数组
  onSaveStartCMD = (startCmd) => {
    const { bases, operationkey, appCode } = this.state;
    bases.forEach(base => {
      if (base.name === operationkey) {
        if (startCmd) {
          base.cmd[0] = startCmd.split(' ')[0];
          let tempArgs = startCmd.slice(startCmd.indexOf(' ') + 1);
          base.args = tempArgs.split(' ');
          putBaseConfig(appCode, operationkey, 'cmd', base).then(() => {
            this.getBasicInfo(appCode);
            message.success('启动命令修改成功');
          }).catch((e) => {
            ampBase.ampMessage('启动命令修改失败');
            this.getBasicInfo(appCode);
          });
        } else {
          base.cmd = [];
          base.args = [];
          putBaseConfig(appCode, operationkey, 'cmd', base).then(() => {
            this.getBasicInfo(appCode);
            message.success('启动命令修改成功');
          }).catch((e) => {
            ampBase.ampMessage('启动命令修改失败');
            this.getBasicInfo(appCode);
          });
        }
      }
    });
  }
  //健康检查修改方法，传入probe参数，flag=true为开放，flag=false为关闭
  onChangeProbe = (probe, flag) => {
    const { bases, operationkey, appCode } = this.state;
    bases.forEach(base => {
      if (base.name === operationkey) {
        if (probe) {
          if (flag) {
            base.probe = probe;
            base.readinessProbe = probe;
            //调用probe修改接口
            changeProbe(appCode, operationkey, base).then(() => {
              this.getBasicInfo(appCode);
              message.success('健康检查开启成功');
            }).catch(e => {
              ampBase.ampMessage('健康检查开启失败');
              this.getBasicInfo(appCode);
            })
          } else {
            base.probe = probe;
            //调用probe修改接口
            changeProbe(appCode, operationkey, base).then(() => {
              this.getBasicInfo(appCode);
              message.success('健康检查开启成功');
            }).catch(e => {
              ampBase.ampMessage('健康检查开启失败');
              this.getBasicInfo(appCode);
            })
          }
        } else {
          delete base.probe;
          delete base.readinessProbe;
          changeProbe(appCode, operationkey, base).then(() => {
            this.getBasicInfo(appCode);
            message.success('健康检查关闭成功');
          }).catch(e => {
            ampBase.ampMessage('健康检查关闭成功');
            this.getBasicInfo(appCode);
          })
        }
      }
    });
  }
  //健康检查修改方法，传入configs参数，flag=true为开放，flag=false为关闭，configs处理后调用修改配置文件方法即可
  onChangeShareLicense = (configs, flag) => {
    let configContent = {
      data: {},
      metadata: {
        annotations: {
          data: {}
        }
      },
    }
    if (flag === 'open') {
      configs.forEach(element => {
        let keyName = element.name;
        element.key = keyName;
        configContent.data[element.name] = element.additionalProperties.config;
      });
      let config = {
        additionalProperties: {
          path: 'license',
        },
        mountPath: '/data/license',
        name: 'config-license',
        subPath: 'license'
      }
      configs.push(config);
      this.onEditSettingfiles(configs, configContent, true);
    } else {
      configs = configs.filter(element => element.name !== 'config-license');
      configs.forEach(element => {
        let keyName = element.name;
        element.key = keyName;
        configContent.data[element.name] = element.additionalProperties.config;
      });
      this.onEditSettingfiles(configs, configContent, true);
    }
  }
  //渲染单个容器tab页的内容
  renderTabContent = (name) => {
    const { bases, networkConfigs, appCode, appId, operationkey, networkLoading, storageLoading, settingFileLoading } = this.state;
    let base = {};
    let networkConfig = [];
    networkConfigs.forEach(element => {
      if (element.name === name) {
        networkConfig.push(element);
      }
    });
    bases.forEach(element => {
      if (element.name === name) {
        base = element;
      }
    });
    let dockerConfig = [];
    let cpuLimit = "";
    let cpuRequest = '0.1';
    let memLimit = "";
    let memRequest = "0.1";
    if (base.reSource && base.reSource.limits) {
      cpuLimit = base.reSource.limits.cpu ? base.reSource.limits.cpu.amount + "" : '0';
      if (cpuLimit.indexOf('m') !== -1) {
        cpuLimit = parseInt(cpuLimit.substring(0, cpuLimit.length - 1), 10) / 1000;
      }
      memLimit = base.reSource.limits.memory ? quotaFormat(base.reSource.limits.memory.amount) : '0';
      dockerConfig.push(cpuLimit + '-' + memLimit);
      if (base.reSource.requests && base.reSource.requests.cpu) {
        let amount = base.reSource.requests.cpu.amount + "";
        if (amount.indexOf('m') !== -1) {
          cpuRequest = parseInt(amount.substring(0, amount.length - 1), 10) / 1000;
        } else {
          cpuRequest = amount;
        }
      }
      if (base.reSource.requests && base.reSource.requests.memory) {
        memRequest = quotaFormat(base.reSource.requests.memory.amount);
      }
    }
    return (
      <div>
        <BasicSettings
          type={this.state.type}
          tenant={base.image.split('/')[1]}
          artifact={base.image.split('/')[2]}
          image={base.image}
          version={base.version}
          node={base.hostIP}
          dockerConfig={dockerConfig}
          appCode={appCode}
          operationkey={operationkey}
          probe={base.probe}
          configs={base.configs}
          cpuLimit={cpuLimit}
          cpuRequest={cpuRequest}
          memRequest={memRequest}
          memLimit={memLimit}
          onChangeProbe={this.onChangeProbe}
          onChangeShareLicense={this.onChangeShareLicense}
          onChangeBasicInfo={this.onChangeBasicInfo} />
        <Divider style={{ marginBottom: 32, marginTop: 32 }} />
        <NetworkConfig
          type={this.state.type}
          node={base.hostIP}
          networkConfigs={networkConfig}
          networkLoading={networkLoading}
          appCode={appCode}
          operationkey={operationkey}
          onAddNetworkConfig={this.onAddNetworkConfig}
          onChangeNetworkConfig={this.onChangeNetworkConfig}
          onDeleteNetWorkConfig={this.onDeleteNetWorkConfig} />
        <Divider style={{ marginBottom: 32, marginTop: 32 }} />
        <EnvVariables
          type={this.state.type}
          operationkey={operationkey}
          appCode={appCode}
          base={base}
          envChange={e => this.props.envChange(e)}
        />
        <Divider style={{ marginBottom: 32, marginTop: 32 }} />
        {ampBase.safeMode ? "" : <Middleware
          type={this.state.type}
          operationkey={operationkey}
          appId={appId} />}
        <Divider style={{ marginBottom: 32, marginTop: 32 }} />
        <Storages
          type={this.state.type}
          volumes={base.volumes}
          operationkey={operationkey}
          appCode={appCode}
          storageLoading={storageLoading}
          onEditStorages={this.onEditStorages}
        />
        <Divider style={{ marginBottom: 32, marginTop: 32 }} />
        <Settingfiles
          type={this.state.type}
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
  render() {
    const { operationkey, bases, loading } = this.state;
    let contentList = {};
    let operationTabList = [];
    bases.forEach(baseConfig => {
      operationTabList.push({ key: baseConfig.name, tab: baseConfig.name });
      contentList[baseConfig.name] = this.renderTabContent(baseConfig.name);
    });

    return (
      <Spin spinning={loading}>
        <DepolyContext.Provider value={this.state}>
          {this.state.bases && this.state.bases.length > 0 ? <Card
            bordered={false}
            tabList={operationTabList}
            onTabChange={this.onOperationTabChange}
            style={{ margin: 24, minHeight: 1000 }}>
            {contentList[operationkey]}
          </Card> :
            <Card style={{ margin: 24, minHeight: 1000 }}>
              <div style={{ float: 'right' }}>
                <Tooltip title={"无容器基本配置信息"}><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn} /></Tooltip></div>
              <div style={{ color: '#d4d4d4', textAlign: 'center', fontSize: 16, marginTop: 48 }}>暂无数据</div>
            </Card>
          }
        </DepolyContext.Provider>
      </Spin>
    )
  }
}

export default ErrorComponentCatch(AppDeploy);