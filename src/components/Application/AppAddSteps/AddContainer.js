import React, { Component } from "react";
import { Modal, Steps } from "antd";
import ChooseImage from './ChooseImage';
import DeployConfig from './DeployConfig';
import AdvanceConfig from './AdvanceConfig';
import {base} from '../../../services/base'
import appUtil from '../../../services/appguide'
import ImagesForm from '../../../common/ImagesUpload/ImagesForm'

const Step = Steps.Step;

class AddContainer extends Component {
    state = {
        isStepBack:false,//选择镜像模块是否为点击上一步才显示的
        data: null,
        loading: false,
        current: 0,
        chooseItem: null,
        chooseVersion: null,
        imageTenant: null,
        imageInfo:null,
        displayChoose: true,
        displayDeploy: false,
        displayAdvance: false,

        container: {
            config: [],//配置文件
            env: [],//环境变量
            command: [],//启动命令
            args: [],//启动命令
            cmd: '',//启动命令
            volumeMounts: [],//存储卷
            ports: [],
            name: "",//容器名称
            image: "",//镜像信息
            isHealthCheck: false,//健康检查的开关
            resourcesLimit: true,//配额，写死为true
            resources: {
                limits: {
                    memory: {
                        "amount": '4G'//内存
                    },
                    cpu: {
                        "amount": '2C'//cpu核
                    }
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.setState({
                container: {...nextProps.container},
                current: 1,
                displayChoose: false,
                displayDeploy: true,
                displayAdvance: false,
            })
        }else{
            this.setState({
                current: 0,
                displayChoose: true,
                displayDeploy: false,
                displayAdvance: false,
            })
        }
    }
    afterChoose = (item, version, imageTenant,imagePath) => {
        //组装镜像信息
        let imageInfo = null
        if(!this.props.check){
            if (imageTenant === "c2cloud") {
                imageInfo = imagePath + "/c2cloud/" + item.name + ":" + version;
            } else if (imageTenant === "custom") {
                imageInfo = item.imagePath
            } else {
                imageInfo = imagePath + "/" + base.tenant + "/" + item.name + ":" + version;
            }
        }

        this.setState({
            imageTenant,
            imageInfo,
            chooseItem: item,
            chooseVersion: version,
            current: 1,
            displayChoose: false,
            displayDeploy: true,
            displayAdvance: false,
        })
    }
    stepOver = (isOk, values, netConfData, envConfData, imagePath, switched) => {
        // var newContainer = {
        //     id:this.state.container.id,
        //     config: [],//配置文件
        //     env: [],//环境变量
        //     command: [],//启动命令
        //     args: [],//启动命令
        //     cmd: '',//启动命令
        //     volumeMounts: [],//存储卷
        //     ports: [],
        //     name: "",//容器名称
        //     image: "",//镜像信息
        //     isHealthCheck: false,//健康检查的开关
        //     resourcesLimit: true,//配额，写死为true
        //     resources: {
        //         limits: {
        //             memory: {
        //                 "amount": '4Gi'//内存
        //             },
        //             cpu: {
        //                 "amount": '2'//cpu核
        //             }
        //         }
        //     }
        // }
        let newContainer = Object.assign({},this.state.container);
        newContainer.env = envConfData;
        newContainer.name = values.name;
        newContainer.isHealthCheck = switched;
        //如果是自定义镜像，则将镜像的任务id以及镜像名字存入
        if(this.state.chooseItem.taskId){
            newContainer.imageTaskId=this.state.chooseItem.taskId;
            newContainer.imageName=this.state.chooseItem.name;
        }
        let containerPorts = [];
        netConfData.forEach(net=>{
            let deployContainersPort = {containerPort:net.port,conhostPort:net.innerPort,protocol:net.protocol,nodePort:net.outerPort};
            containerPorts.push(deployContainersPort);
        })
        newContainer.ports = containerPorts;
        //拼装健康检查参数
        newContainer.base=values.base;
        
        newContainer.livenessProbe=values.base.probe;
        newContainer.readinessProbe=values.base.readinessProbe;
        newContainer.image = this.state.imageInfo;

        //组装容器启动命令
        if (values.cmd && values.cmd !== "") {
            const cmd = values.cmd;
            newContainer.cmd = cmd;
            const index = cmd.indexOf(' ');
            newContainer.command.push(cmd.substring(0, index));
            const argss = cmd.substring(index + 1, cmd.length);
            newContainer.args = argss.split(' ');
        }

        //转换资源配置信息
        appUtil.getQuota(values.resourcesType).then(quota=>{
            newContainer.resources.resourcesType = values.resourcesType;
            newContainer.resources.limits = {memory:{amount:quota.memory+quota.memoryUnit},cpu:{amount:quota.cpu}};
            this.setState({
                container: newContainer
            })
            if (isOk) {
                this.handleCancel(newContainer);
            } else {
                this.setState({
                    current: 2,
                    displayChoose: false,
                    displayDeploy: false,
                    displayAdvance: true,
                })
            }
        });

    }
 
    handleOk = (storageData, settingData) => {
        const newContainer = { ...this.state.container };
        if(storageData)newContainer.volumeMounts = storageData;
        if(settingData){
            settingData.forEach(sd=>{
                sd.fromConfigFile = true;
            })
            newContainer.volumeMounts.push(...settingData);
            newContainer.config = [];
            settingData.forEach(d=>{
                // let name = d.name.slice(d.name.lastIndexOf('-')+1);
                let configData = {key:d.key,name:d.additionalProperties.path,path:d.mountPath,contents:d.additionalProperties.config,ifExist:true};
                newContainer.config.push(configData);
            })
        }

        this.setState({
            container: newContainer
        })
        this.handleCancel(newContainer);
    }
    handleCancel = (values) => {
        this.setState({
            current: 0,
            displayChoose: true,
            displayDeploy: false,
            displayAdvance: false,
        })
        this.props.transferVisible(values);
    }
    stepTo2 = () => {
        this.setState({
            current: 1,
            displayChoose: false,
            displayDeploy: true,
            displayAdvance: false,
        })
    }
    render() {
        return (
            <Modal title="添加容器" destroyOnClose={true}
                visible={this.props.visible} footer={null}
                onCancel={() => this.handleCancel(null)} width={1000}
                maskClosable={false}
                bodyStyle={{ height: 500, overflow: 'auto' }}
            >
                <div style={{ width: '900px', margin: '0 0 40px 20px' }}>
                    <Steps current={this.state.current}>
                        <Step title="选择镜像" />
                        <Step title="部署配置" />
                        <Step title="高级配置" />
                    </Steps>
                </div>
								<div style={{ margin: 16 }}>
								{this.props.buttonValue==='2'&& this.state.displayChoose ?
								<ImagesForm tenant={base.tenant} onOk={this.afterChoose} />
								:
								<ChooseImage afterchoose={this.afterChoose}
									display={this.state.displayChoose}
									type={this.props.type}
									check={this.props.check}
									stepto2={this.stepTo2}
									isStepBack={this.state.isStepBack} />}
                    <DeployConfig item={this.state.chooseItem}
                        version={this.state.chooseVersion}
                        display={this.state.displayDeploy}
                        stepback={() => {
                            this.setState({
                                isStepBack:true,
                                current: 0,
                                displayChoose: true,
                                displayDeploy: false,
                                displayAdvance: false,
                            })
                        }}
                        stepover={this.stepOver}
                        type={this.props.type}
                        check={this.props.check}
                        container={this.state.container}
                        imageInfo={this.state.imageInfo}
                        containers={this.props.containers} />
                    <AdvanceConfig display={this.state.displayAdvance} containerName={this.state.container.name}
                        stepback={() => {
                            this.setState({
                                current: 1,
                                displayChoose: false,
                                displayDeploy: true,
                                displayAdvance: false,
                            })
                        }}
                        check={this.props.check}
                        cancel={() => this.handleCancel(null)}
                        onok={this.handleOk}
                        type={this.props.type}
                        container={this.state.container} />
                </div>
            </Modal>
        );
    }
}

export default AddContainer;