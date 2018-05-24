import React from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import { queryTags } from '../../../services/apps';
import './index.css';
const FormItem = Form.Item;
const { Option } = Select;
const statusMap = [
    { key:'pending',status:'processing',text:'等待' },
    { key:'succeeded',status:'success',text:'运行中' },
    { key:'stop',status:'default',text:'停止' },
    { key:'failed',status:'error',text:'失败' },
    { key:'running',status:'processing',text:'启动中' },
    { key:'exception',status:'warning',text:'异常' },
]

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
    statusChange = (value) => {
        this.props.searchchange({"status":value});
    }
    render() {
        return (
            <div className="tableList">
            <Form layout="inline">
            <Row gutter={24}>
                <Col md={6} sm={24}>
                    <FormItem label="应用名称">
                        <Input placeholder="请输入" style={{ width: '100%' }}
                            onChange={this.inputChange} 
                            value={this.props.searchparam.name} />
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
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
                <Col md={6} sm={24}>
                    <FormItem label="应用状态">
                        <Select placeholder="请选择" style={{ width: '100%' }}
                            value={this.props.searchparam.status}
                            onChange={this.statusChange}>
                            {
                                statusMap.map((value, index) => {
                                    return (
                                        <Option key={index} value={value.key}>{value.text}</Option>
                                    )
                                }) 
                            }
                        </Select>
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <Button type="primary" onClick={this.props.handlesearch}>查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.props.restfields}>重置</Button>
                </Col>
            </Row>
            </Form>
            </div>
        )
    }
}