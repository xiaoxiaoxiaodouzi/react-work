import React from 'react';
import { Row, Col, Form, Input, Select, Icon, Button, InputNumber } from 'antd';
import { queryTags } from '../../../services/aip';

const FormItem = Form.Item;
const { Option } = Select;

class SearchForm extends React.Component {
    state = {
        expandForm: false,
        formValues: {},
        tags:[]
    }
    constructor(props) {
        super(props);
        this.getTags();
    }
    getTags = () => {
        queryTags({tenant:this.props.tenant}).then(data => {
            this.setState({
                tags:data
            })
        })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err){
                this.props.handlesearch(fieldsValue);
            };
        });
    }
    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.props.restfields();
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="应用名称：">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="应用标签：">
                            {getFieldDecorator('tagId',{initialValue:this.props.selectedTag})(
                                <Select placeholder="请选择" 
                                    style={{ width: 165 }}>
                                    {
                                        this.state.tags.length>0?
                                        this.state.tags.map((value,index)=>{
                                            return (
                                                <Option key={index} value={value.id}>{value.name}</Option>
                                            )
                                        }):null
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={5} sm={24} offset={3}>
                        <span>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                            {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a> */}
                        </span>
                    </Col>
                </Row>
            </Form>
        )
    }
    renderAdvancedForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="应用名称">
                            {getFieldDecorator('no')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="应用标签">
                            {getFieldDecorator('status')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="集群名称：">
                            {getFieldDecorator('number')(
                                <Select placeholder="请选择" style={{ width: 165 }}>
                                    <Option value="0">集群1</Option>
                                    <Option value="1">集群2</Option>
                                    <Option value="2">集群3</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="副本数量">
                            {getFieldDecorator('status3')(
                                <InputNumber style={{ width: '100%' }} placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="应用状态">
                            {getFieldDecorator('status3')(
                                <Select placeholder="请选择" style={{ width: 165 }}>
                                    <Option value="0">运行中</Option>
                                    <Option value="1">异常</Option>
                                    <Option value="2">停止</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="运行时间">
                            {getFieldDecorator('status3')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginTop: 16 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                        </a>
                    </span>
                </div>
            </Form>
        );
    }
    renderForm() {
        return this.renderSimpleForm();
    }
    render() {
        return (
            <div>
                {this.renderForm()}
            </div>
        )
    }
}
export default SearchForm = Form.create()(SearchForm);