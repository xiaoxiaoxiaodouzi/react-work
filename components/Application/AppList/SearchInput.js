import React from 'react';
import { Row, Col, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, message, Divider } from 'antd';
import { queryTags } from '../../../services/apps';
import './index.css';
const FormItem = Form.Item;
const { Option } = Select;

export default class SearchInput extends React.Component {
    state = {
        tags: []
    }
    constructor(props) {
        super(props);
        this.getTags();
    }
    getTags = () => {
        queryTags().then(data => {
            this.setState({
                tags: data
            })
        })
    }
    inputChange = (e) => {
        this.props.searchchange({"name":e.target.value});
    }
    selectChange = (value) => {
        this.props.searchchange({"tagId":value});
    }
    render() {
        return (
            <div className="tableList">
            <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="应用名称">
                        <Input placeholder="请输入" style={{ width: '100%' }}
                            onChange={this.inputChange} 
                            value={this.props.searchparam.name} />
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="应用标签">
                        <Select placeholder="请选择" style={{ width: '100%' }}
                            value={this.props.searchparam.tagId}
                            onChange={this.selectChange}>
                            {
                                this.state.tags.length > 0 ?
                                    this.state.tags.map((value, index) => {
                                        return (
                                            <Option key={index} value={value.id}>{value.name}</Option>
                                        )
                                    }) : null
                            }
                        </Select>
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <Button type="primary" onClick={this.props.handlesearch}>查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.props.restfields}>重置</Button>
                </Col>
            </Row>
            </Form>
            </div>
        )
    }
}