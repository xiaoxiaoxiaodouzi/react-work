import React from 'react';
import { Table, Divider, message, Form, Button, Select, Radio, Row, Col, InputNumber } from 'antd';
import AddContainer from './AddContainer';
import { queryClusters } from '../../../services/apps';

const FormItem = Form.Item;
const Option = Select.Option;



class Step2 extends React.Component {
    state = {
        check:false,//弹框是否为点击的查看
        loading:false,
        selectedRowKeys: null,
        buttonValue: "1",
        addConVisible: false,
        clusters: null,
        containers: [],
        container:null
    }
    componentDidMount() {
        this.getClusters();
    }
    getClusters() {
        queryClusters().then(data => {
            this.setState({
                clusters: data
            })
        })
    }
    handleButtonChange = (e) => {
        this.setState({
            buttonValue: e.target.value
        })
    }
    deleteContainer = (e, name) => {
        this.setState({
            loading:true
        })
        e.preventDefault();
        const newData = this.state.containers.filter(item => item.name !== name);
        this.setState({ 
            containers: newData,
            selectedRowKeys:null,
            loading:false
        });
    }
    deleteContainers = () => {
        if (!this.state.selectedRowKeys) {
            message.warning("请选择要删除的容器！");
            return;
        }
        this.setState({
            loading:true
        })
        const newContainers = [...this.state.containers];
        this.state.selectedRowKeys.map((item, index) => {
            delete newContainers[item];
        })
        let newContainers2=[];
        for(let i=0;i<newContainers.length;i++){
            if(newContainers[i]){
                newContainers2.push(newContainers[i])
            }
        }
        this.setState({ containers: newContainers2,selectedRowKeys:null,loading:false });
    }
    //添加的容器id
    index=0
    afterAddContainer = (container) => {
        if (container) {
            if(this.state.check){
                const newContainers=this.state.containers.filter(item=>item.id!==container.id);
                newContainers.push(container);
                this.setState({
                    containers:newContainers
                })
            }else{
                container.id="newContainer"+this.index;
                this.index+=1;
                this.state.containers.push(container);
                this.setState({
                    containers: this.state.containers
                })
            }
        }
        this.setState({
            addConVisible: false
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.submitstep2(values, this.state.containers);
            }
        });
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    //点击查看弹框，直接跳到部署配置
    check = (record) => {
        this.setState({
            check:true,
            addConVisible: true,
            container:record
        })
    }
    //点击添加容器，弹框
    add = () => {
        this.setState({
            check:false,
            addConVisible: true
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 3,
            },
            wrapperCol: {
                span: 12,
            },
        };
        const formTailLayout = {
            wrapperCol: { span: 6, offset: 17 },
        };
        const containerColumns = [{
            title: '容器名称',
            dataIndex: 'name',
            key: 'name',
            width:'25%',
        }, {
            title: '镜像',
            dataIndex: 'image',
            key: 'image',
            width:'40%',
        }, {
            title: '计算资源',
            dataIndex: 'resources',
            key: 'resources',
            width:'15%',
            render: (text, record) => {
                return text?text.limits.cpu.amount + "核/" + text.limits.memory.amount:'';
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            width:'20%',
            render: (text,record) => (
                <span>
                    <a onClick={()=>this.check(record)}>查看</a>
                    <Divider type="vertical" />
                    <a onClick={(e) => this.deleteContainer(e, record.name)}>删除</a>
                </span>
            )
        }];
        const containerRowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div style={{ display: this.props.display ? 'block' : 'none' }}>
                <Row>
                    <Col span={24} offset={1}>
                        <Form layout="horizontal" onSubmit={this.handleSubmit} style={{ marginTop: 24 }} hideRequiredMark>
                            <FormItem {...formItemLayout} label="部署方式：">
                                {(
                                    <Radio.Group value={this.state.buttonValue} onChange={this.handleButtonChange}>
                                        <Radio.Button value="1">镜像部署</Radio.Button>
                                        <Radio.Button value="2" disabled>程序包部署</Radio.Button>
                                        <Radio.Button value="3" disabled>已采用其他方式部署</Radio.Button>
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="部署集群：">
                                {getFieldDecorator('cluster', {
                                    rules: [{ required: true, message: '请选择部署集群！' }],
                                })(
                                    <Select placeholder="请选择应用部署的集群">
                                        {
                                            this.state.clusters ? this.state.clusters.map((item) => {
                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                            }) : ""
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="部署副本数：">
                                {getFieldDecorator('replicas', { initialValue: 1 }, {
                                    rules: [{ required: true, message: '请输入部署副本数！' }],
                                })(
                                    <InputNumber min={1} onChange={this.onChange} />
                                )}
                            </FormItem>
                            <Row style={{ marginTop: '80px' }}>
                                <Col span={24} offset={1}>
                                    <Button type="primary" icon="plus"
                                        onClick={this.add}>添加容器</Button>
                                    <Button style={{ marginLeft: '10px' }}
                                        onClick={this.deleteContainers}>删除</Button>
                                    <AddContainer transferVisible={this.afterAddContainer}
                                        visible={this.state.addConVisible}
                                        type={this.props.type}
                                        check={this.state.check}
                                        container={this.state.container}
                                        containers={this.state.containers} />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col span={21} offset={1}>
                                    <Table rowSelection={containerRowSelection} columns={containerColumns}
                                        dataSource={this.state.containers} rowKey={(record, index) => index}
                                        loading={this.state.loading} />
                                </Col>
                            </Row>
                            <br />
                            <br />
                            <FormItem {...formTailLayout}>
                                <Button onClick={this.props.stepback}>上一步</Button>
                                <Button type="primary" htmlType="submit"
                                    style={{ marginLeft: '20px' }}>创建</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Step2 = Form.create()(Step2);