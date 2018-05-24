import React from 'react';
import { Form, Input, Button, Select, Alert, Row, Col } from 'antd';
import TagManager from '../../../common/TagManager';
import { queryTags, checkIdName,checkCodeName } from '../../../services/apps';
import {base} from '../../../services/base'

const FormItem = Form.Item;
const Option = Select.Option;

class Step1 extends React.Component {
    state = {
        selectedTags: [],
        allTags: [],
        addbefore:'',       //租户code+环境
    }

    componentDidMount(){
       /*  let tenant = base.tenant;
        let environment = base.currentEnvironment;
        this.setState({
            addbefore: tenant + '-' + 'environment'
        }) */
    }
    getTags = () => {
        if(this.state.allTags.length===0){
            queryTags().then(data => {
                this.setState({
                    allTags: data
                })
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let checkIdName1=checkIdName({attr:values.name},{attr:"name",tenant:base.tenant});
                let checkIdName2=checkIdName({attr:values.id},{attr:"code",tenant:base.tenant});
                let checkCode = checkCodeName(values.id)
                Promise.all([checkIdName1, checkIdName2, checkCode]).then(([flag1,flag2,flag3])=>{
                    let checked=true;
                    if(flag1){
                        checked=false;
                        this.props.form.setFields({
                            name: {
                                value: values.name,
                                errors: [new Error('应用名称已存在！')],
                            },
                        });
                    }
                    if(flag2 || flag3){
                        checked=false;
                        this.props.form.setFields({
                            id: {
                                value: values.id,
                                errors: [new Error('应用Code已存在！')],
                            },
                        });
                    }
                    if(checked){
                        this.props.submitstep1(values,this.state.selectedTags);
                    }
                })
            }
        });
    };
    onVisibleChange = (visible) => {
        if (visible) {
            this.getTags();
        }
    }
    index=0;
    onChange = (param) => {
        if (param.event === "add") {
            const newSelected = [param.value, ...this.state.selectedTags];
            this.setState({
                selectedTags: newSelected
            })
        } else if (param.event === "create") {
            const newSelected = [{id:"newSelect"+this.index,name:param.value.name}, ...this.state.selectedTags];
            this.index+=1;
            this.setState({
                selectedTags: newSelected
            })
        } else {
            const newSelected = this.state.selectedTags.filter(item => item.id !== param.value.id);
            this.setState({
                selectedTags: newSelected
            })
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 12,
            },
        };
        const formTailLayout = {
            wrapperCol: { span: 4, offset: 13 },
        };
        const labelName = this.props.type==='app'?'应用':'中间件';
        return (
            <div style={{ display: this.props.display ? 'block' : 'none' }}>
                <Row>
                    <Col span={20} offset={2}>
                        <Alert
                            showIcon
                            message='通常情况下，运行环境可以分为"正式"、"测试"、"开发"环境，甚至更多(根据具体情况而定)，不同运行环境可以对应不同的部署集群'
                            style={{ marginBottom: 24 }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={16} offset={6}>
                        <Form layout="horizontal" onSubmit={this.handleSubmit} style={{ marginTop: 24 }} hideRequiredMark>
                            <FormItem {...formItemLayout} label={labelName+'名称'}>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: `请输入${labelName}名称！` }],
                                })(
                                    <Input placeholder={labelName+'显示名称'} />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={labelName+'CODE:'}>
                                {getFieldDecorator('id', {
                                    rules: [{ required: true, message: `请输入${labelName}ID！` },{message: '只支持小写英文、数字、下划线！', pattern: '^[a-z0-9_]+$'}],
                                })(
                                    <Input  placeholder="只支持小写英文、数字、下划线" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="分类标签：">
                                {getFieldDecorator('tags')(
                                    <TagManager
                                        selectedTags={this.state.selectedTags}
                                        onVisibleChange={this.onVisibleChange}
                                        allTags={this.state.allTags}
                                        onChange={this.onChange} />
                                )}
                            </FormItem>
                            {this.props.type==='app'?
                                <FormItem {...formItemLayout} label={labelName+'类型：'}>
                                    {getFieldDecorator('type',{initialValue:"web"})(
                                        <Select>
                                            <Option value="web">web</Option>
                                            <Option value="app">app</Option>
                                        </Select>
                                    )}
                                </FormItem>:''
                            }
                            <FormItem {...formItemLayout} label="运行环境：">
                                {(
                                    <font>{base.currentEnvironment.name}</font>
                                )}
                            </FormItem>
                            <FormItem {...formTailLayout}>
                                <Button type="primary" htmlType="submit">
                                    下一步</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Step1 = Form.create()(Step1);