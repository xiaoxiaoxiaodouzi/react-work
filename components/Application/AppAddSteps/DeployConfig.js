import React, { Component } from "react";
import { message, Input, Button, Radio, Row, Col, Form, Switch } from "antd";
import NetworkConfig from '../Deploy/NetworkConfig';
import EnvVariables from '../Deploy/EnvVariables';
import { checkCmd } from '../../../utils/utils';
import appUtil from '../../../services/appguide'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class DeployConfig extends Component {
    state = {
        radioValue: 0,//资源配置id
        imagePath: null,
        // isCustPath: false,//当前的镜像地址是否为自定义的
        networkConfigs:[],
        netConfData: [],
        envConfData: [],
        switched: false,
        quotaInfo:[]
    }
    envFlag = false;
    netFlag = false;
    defaultNode = '--.--.--.--';
    componentDidMount() {
        if (this.props.check) {
            // this.props.form.setFieldsValue(this.props.container);
            this.props.form.setFieldsValue({
                name: this.props.container.name,
                cmd: this.props.container.cmd
            });
            this.props.container.ports.forEach((p,i)=>{
                let networkConfig = {key:i,port:p.containerPort,protocol:p.protocol};
                if(p.conhostPort)networkConfig.inneraddress=this.defaultNode+':'+p.conhostPort;
                if(p.outerPort)networkConfig.outaddress=this.defaultNode+':'+p.outerPort;
                this.state.networkConfigs.push(networkConfig);
            })
            this.setState({
                networkConfigs:this.state.networkConfigs,
                netConfData:this.state.networkConfigs,
                switched: this.props.container.isHealthCheck,
                radioValue: this.props.container.resources.resourcesType,
                envConfData:this.props.container.env
            })
        }
        appUtil.getQuotaData().then(data=>{
            this.setState({quotaInfo:data});
        });
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.item && nextProps.item.imagePath) {
    //         this.setState({
    //             imagePath: nextProps.item.imagePath,
    //             isCustPath: true,
    //         })
    //     } else{
    //         if (this.state.isCustPath) {
    //             this.getImagePath();
    //         }
    //     }
    // }
    // getImagePath = () => {
    //     queryImagePath().then(data => {
    //         this.setState({
    //             imagePath: data.url.split("https://")[1],
    //             isCustPath: false,
    //         })
    //     })
    // }
    radioChange = (e) => {
        this.setState({
            radioValue: e.target.value
        })
    }
    //健康检查开关变化
    switchChange = (checked) => {
        this.setState({
            switched: checked
        })
    }

    handleSubmit = (e, value) => {
        e.preventDefault();
        if(this.netFlag){
            message.error('网络配置表格中存在未保存数据，请先保存');
            return;
        }
        if(this.envFlag){
            message.error('环境变量表格中存在未保存数据，请先保存');
            return;
        }
        const containers = this.props.containers;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.resourcesType = this.state.radioValue;
                
                //校验容器名称是否存在
                if (containers && containers.length > 0) {
                    const conExist = containers.filter(item => item.name === values.name);
                    if (conExist && conExist.length > 0) {
                        if (this.props.check) {
                            if(this.props.container.name !== values.name){
                                this.props.form.setFields({
                                    name: {
                                        value: values.name,
                                        errors: [new Error('容器名已存在！')],
                                    },
                                });
                                message.error("容器名已存在！")
                                return;
                            }  
                        } else {
                            this.props.form.setFields({
                                name: {
                                    value: values.name,
                                    errors: [new Error('容器名已存在！')],
                                },
                            });
                            message.error("容器名已存在！")
                            return;
                        }
                    }
                }

                //校验命令格式
                if (values.cmd && values.cmd !== "") {
                    const flag = checkCmd(values.cmd);
                    if (!flag) {
                        this.props.form.setFields({
                            cmd: {
                                value: values.cmd,
                                errors: [new Error('命令格式错误！')],
                            },
                        });
                        return;
                    }
                }
                if (value === "确定") {
                    this.props.stepover(true, values, this.state.netConfData, this.state.envConfData, this.state.imagePath, this.state.switched);
                } else {
                    this.props.stepover(false, values, this.state.netConfData, this.state.envConfData, this.state.imagePath, this.state.switched);
                }
            }
        });
    }
    afterNetConf = (data,flag) => {
        if(flag){
            this.netFlag = true;
        }else{
            this.setState({
                netConfData: data,
                networkConfigs:data,
            })
            this.netFlag = false;
        }
    }
    afterEnvConf = (data,flag) => {
        if(flag){
            this.envFlag = true;
        }else{
            this.setState({
                envConfData: data,
            })
            this.envFlag = false;
        }
    }
    onForward=()=>{
        if(this.netFlag){
            message.error('网络配置表格中存在未保存数据，请先保存');
            return;
        }
        if(this.envFlag){
            message.error('环境变量表格中存在未保存数据，请先保存');
            return;
        }
        this.props.stepback();
    }
    render() {
        const formItemLayout = {
            labelCol: {
                span: 2,
            },
            wrapperCol: {
                span: 22,
            },
        };
        const formTailLayout = {
            wrapperCol: { span: 7, offset: 17 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Row style={{ display: this.props.display ? 'block' : 'none' }}>
                <Col span={24}>
                    <Form layout="horizontal" onSubmit={this.handleSubmit}
                        style={{ marginTop: 24 }} hideRequiredMark>
                        <FormItem {...formItemLayout} label="镜像地址：">
                            {
                                this.props.check ?
                                    <font>{this.props.container.image}</font>
                                    : <font>{this.props.imageInfo}</font>
                            }
                        </FormItem>
                        <FormItem {...formItemLayout} label="容器名称：">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入容器名称！' },{message: '只支持小写英文、数字、下划线！', pattern: '^[a-z0-9_]+$'}],
                            })(
                                <Input placeholder="只支持小写英文、数字、下划线" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="资源配置：">
                            <RadioGroup onChange={this.radioChange} size="default" value={this.state.radioValue}>
                                {
                                    this.state.quotaInfo.map((quota,index)=>{
                                        return <RadioButton key={index} value={index}>{quota.cpu+'核'} {quota.memory+quota.memoryUnit}</RadioButton>;
                                    })
                                }
                            </RadioGroup>
                        </FormItem>
                        <br />
                        <FormItem {...formItemLayout} label="健康检查：">
                            <Switch checkedChildren="开" unCheckedChildren="关" checked={this.state.switched} onChange={this.switchChange} />
                        </FormItem>
                        <div style={{ margin: '40px 0 10px 10px' }}>
                            <div>
                                <NetworkConfig isAddApp={true}
                                    networkConfigs={this.state.networkConfigs}
                                    node={this.defaultNode}
                                    afternetconf={this.afterNetConf} />
                            </div>
                            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                                <EnvVariables isAddApp={true}
                                    envData={this.state.envConfData}
                                    // env={this.props.check ? this.props.container.env : []}
                                    afterenvconf={this.afterEnvConf} />
                            </div>
                        </div>
                        <FormItem {...formItemLayout} label="启动命令">
                            {getFieldDecorator('cmd')(
                                <Input placeholder="容器启动命令" />
                            )}
                        </FormItem>
                        <FormItem {...formTailLayout}>
                            {
                                this.props.check ? "" :
                                    <Button onClick={()=>this.onForward()/* this.props.stepback */}>上一步</Button>
                            }
                            <Button style={{ marginLeft: '20px' }} htmlType="submit"
                                onClick={(e) => this.handleSubmit(e, "下一步")}>下一步</Button>
                            <Button style={{ marginLeft: '20px' }} type="primary"
                                htmlType="submit"
                                onClick={(e) => this.handleSubmit(e, "确定")}>确定</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        )
    }
}
export default DeployConfig = Form.create()(DeployConfig);