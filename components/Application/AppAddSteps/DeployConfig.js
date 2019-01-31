import React, { Component } from "react";
import { message, Input, Button, Radio, Row, Col, Form,InputNumber, Select} from "antd";
/* import NetworkConfig from '../Deploy/NetworkConfig';
import EnvVariables from '../Deploy/EnvVariables';
import HealthCheck from '../Deploy/HealthCheck'; */
import { checkCmd } from '../../../utils/utils';
import appUtil from '../../../services/cce'
import {getEnvs} from '../../../services/cce'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
const { Description } = DescriptionList;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
class DeployConfig extends Component {
    state = {
        radioValue: 0,//资源配置id
        imagePath: null,
        // isCustPath: false,//当前的镜像地址是否为自定义的
        networkConfigs: [],
        netConfData: [],
        envConfData: [],
        switched: false,
        quotaInfo: [],
        name: '',            //容器名称
        base: '',            //健康检查参数
        customize:false,
        request:0.1,
        limit:0.1,
        memory:1
    }
    envFlag = false;
    netFlag = false;
    defaultNode = '--.--.--.--';
    componentDidMount() {
        if (this.props.check) {
            // this.props.form.setFieldsValue(this.props.container);
            this.props.form.setFieldsValue({
                name: this.props.container.name,
                cmd: this.props.container.cmd,

            });
            this.props.container.ports.forEach((p, i) => {
                let networkConfig = { key: i, port: p.containerPort, protocol: p.protocol };
                if (p.conhostPort) networkConfig.inneraddress = this.defaultNode + ':' + p.conhostPort;
                if (p.outerPort) networkConfig.outaddress = this.defaultNode + ':' + p.outerPort;
                this.state.networkConfigs.push(networkConfig);
            })
            let customize = this.props.container.resources.resourcesType==='-1' || this.props.container.resources.resourcesType===-1?true:false;
            let resources = this.props.container.resources;
            this.setState({
                networkConfigs: this.state.networkConfigs,
                netConfData: this.state.networkConfigs,
                switched: this.props.container.isHealthCheck,
                radioValue: this.props.container.resources.resourcesType,
                customize:customize,
                envConfData: this.props.container.env,
                name: this.props.container.name,
                cmd: this.props.container.cmd,
                base: this.props.container.base,
                limit:customize?resources.limits.cpu.amount:0.1,
                request:customize?resources.requests.cpu.amount:0.1,
                memory:customize? resources.limits.memory.amount.substring(0,resources.limits.memory.amount.length - 2):1
            })
        }
        appUtil.getQuotaData().then(data => {
            this.setState({ quotaInfo: data });
        });
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.item && nextProps.item!==this.props.item){
            getEnvs(nextProps.item.namespace,nextProps.item.name).then(data=>{
                let ary=[];
                if(data.contents.length>0){
                    data.contents.forEach(i=>{
                        ary.push({
                            name:i.envKey,
                            value:i.defaultValue,
                            operateWay:'add',
                            source:'0',
                            desc:i.envDescribe,
                        })
                    })
                }
                this.setState({envConfData:ary})
            })
        }
    }
   /*  
    getImagePath = () => {
        queryImagePath().then(data => {
            this.setState({
                imagePath: data.url.split("https://")[1],
                isCustPath: false,
            })
        })
    } */
    radioChange = (e) => {
        this.setState({
            radioValue: e.target.value
        })

        if(e.target.value === -1 || e.target.value === '-1'){
            this.setState({
                customize:true
            })
        }else{
            this.setState({
                customize:false
            })
        }
    }

    handleSubmit = (e, value) => {
        e.preventDefault();
        if (this.netFlag) {
            message.error('网络配置表格中存在未保存数据，请先保存');
            return;
        }
        if (this.envFlag) {
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
                            if (this.props.container.name !== values.name) {
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
                //把健康检查的参数放到容器里面去
                values.base = this.state.base ? this.state.base : '';
                if (value === "确定") {
                    this.props.stepover(true, values, this.state.netConfData, this.state.envConfData, this.state.imagePath,
                         this.state.switched,this.state.limit,this.state.request,this.state.memory);
                } else {
                    this.props.stepover(false, values, this.state.netConfData, this.state.envConfData, 
                        this.state.imagePath, this.state.switched,this.state.limit,this.state.request,this.state.memory);
                }
            }
        });
    }
    afterNetConf = (data, flag) => {
        if (flag) {
            this.netFlag = true;
        } else {
            this.setState({
                netConfData: data,
                networkConfigs: data,
            })
            this.netFlag = false;
        }
    }
    afterEnvConf = (data, flag) => {
        if (flag) {
            this.envFlag = true;
        } else {
            this.setState({
                envConfData: data,
            })
            this.envFlag = false;
        }
    }
    onForward = () => {
        if (this.netFlag) {
            message.error('网络配置表格中存在未保存数据，请先保存');
            return;
        }
        if (this.envFlag) {
            message.error('环境变量表格中存在未保存数据，请先保存');
            return;
        }
        this.props.stepback();
    }
    onChangeProbe = (probe) => {
        // 修改健康检查信息
        let base = {
            probe: probe,
            readinessProbe: probe,
            name: this.state.name
        }
        this.setState({ base, isHealthCheck: true })
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
        /* const formTailLayout = {
            wrapperCol: { span: 7, offset: 17 },
        }; */
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
                                rules: [{ required: true, message: '请输入容器名称！' }, { message: '只支持小写英文、数字、中划线！', pattern: '^[a-z0-9-]+$' }],
                            })(
                                <Input placeholder="只支持小写英文、数字、中划线" onChange={e => this.setState({ name: e.target.value })} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="资源配置：">
                            <RadioGroup onChange={this.radioChange} size="default" value={this.state.radioValue}>
                                {
                                    this.state.quotaInfo.map((quota, index) => {
                                        return <RadioButton key={index} value={index}>{quota.cpu + '核'} {quota.memory + quota.memoryUnit}</RadioButton>;
                                    })
                                }
                                <RadioButton key='-1' value='-1'>自定义</RadioButton>
                            </RadioGroup>
                        </FormItem>

                        <div style={{marginTop:8}}>
                            {this.state.customize?
                            <div>
                            <DescriptionList style={{marginLeft:10}} col={1}>
                                <Description term="CPU限制"><div><Select disabled={true} style={{width:100,marginRight:5}} value='request'><Select.Option value='request'>request</Select.Option></Select>
                                                <InputNumber defaultValue={this.state.request} precision={1} onChange={
                                                  (value)=>{
                                                    if(value>this.state.limit){
                                                      message.info("request值不能大于limit！")
                                                    }else{
                                                      this.setState({request:value});
                                                    }
                                                }} 
                                                style={{width:'50%'}} min={0.1} max={this.state.limit} step={0.1}/> 核</div>
                                            <div style={{marginTop:5}}><Select disabled={true} style={{width:100,marginRight:5}} value='limit'><Select.Option value='limit'>limit</Select.Option></Select>
                                            <InputNumber defaultValue={this.state.limit} precision={1} 
                                            onChange={(value)=>{
                                              if(value<this.state.request){
                                                message.info("request值不能大于limit！")
                                              }else{
                                                this.setState({limit:value});
                                              }
                                            }} 
                                            style={{width:'50%'}} min={this.state.request} step={0.1}/> 核</div>
                                            <div style={{marginTop:5,color:'rgb(190,190,190)'}}>request只用于资源分配调度，不限制实际使用</div>
                                            <div style={{color:'rgb(190,190,190)'}}>limit与资源调度无关，表示资源的最大使用上限</div>
                                        </Description>                     
                                    </DescriptionList> 
                                    <DescriptionList style={{marginTop:10,marginLeft:35}} col={1}>
                                        <Description term="内存"><InputNumber defaultValue={this.state.memory} onChange={(value)=>this.setState({memory:value})} style={{width:'63%'}} min={1} max={32}/> Gi
                                                                <div style={{marginTop:5,color:'rgb(190,190,190)'}}>内存限制默认rquest=limit</div>
                                        </Description>
                                    </DescriptionList>
                                </div>
                                    :"" 
                                    }
                            </div>
                        {/* <br />
                        <FormItem {...formItemLayout} label="健康检查：">
                            <HealthCheck container={this.state.name} onChangeProbe={this.onChangeProbe} probe={this.state.base ? this.state.base.probe : ''} />
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
                                <Input placeholder="示例：systemctl restart docker" />
                            )}
                        </FormItem> 
                        <FormItem {...formTailLayout}>
                            {
                                this.props.check ? "" :
                                    <Button onClick={() => this.onForward()}>上一步</Button>
                            }
                            <Button style={{ marginLeft: '20px' }} htmlType="submit"
                                onClick={(e) => this.handleSubmit(e, "下一步")}>下一步</Button> 
                            <Button style={{ marginLeft: '20px' }} type="primary"
                                htmlType="submit"
                                onClick={(e) => this.handleSubmit(e, "确定")}>确定</Button>
                        </FormItem>
                        */}
                    </Form>
                </Col>
                <Col style={{marginTop:105}} span={24}>
                    <p style={{float:'right'}} >
                    {
                        this.props.check ? "" :
                            <Button onClick={() => this.onForward()}>上一步</Button>
                    }
                    <Button style={{ marginLeft: '20px' }} type="primary"
                        htmlType="submit"
                        onClick={(e) => this.handleSubmit(e, "确定")}>确定</Button>
                    </p>
                </Col>
            </Row>
        )
    }
}
export default DeployConfig = Form.create()(DeployConfig);