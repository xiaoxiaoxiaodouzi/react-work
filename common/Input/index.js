import React from 'react';

import { Row, Col, Button, Input, Dropdown, Menu, Tooltip, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const CONTENT_CONTAINER_HEIGHT = 32;
const DESCRIPTION_CONTAINER_HEIGHT = 18;
export default class EditContainer extends React.PureComponent {

    static defaultProps = {
        mode: 'common',
        editing: false,
        defaultNullValue: ' '
    }

    constructor(props) {
        super(props)

        this.state = {
            mode: props.mode,
            editing: props.editing,
            title: props.title,
            value: props.value,
            dataType: props.dataType,
            options: props.options,
            status: 'normal',//normal,warn,error
            tipVisible: false
        }

        this._onChangeProperty = this._onChangeProperty.bind(this);
        this._onCommit = this._onCommit.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this.renderEditContent = this.renderEditContent.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps)
        // if (nextProps.editing != this.props.editing) {
        //     this.setState({
        //         editing: nextProps.editing
        //     })
        // }
    }


    //*************************************************************************** */
    //*********************************EVENT************************************* */
    //*************************************************************************** */
    _onChangeProperty(value) {
        this.value = value;
    }

    _onCommit() {
        if (!this.value) {
            this.setState({ editing: false })
            return;
        }
        if (!this.value && this.props.rule && this.props.rule.required) {
            this.message = "值不能为空";
            this.setState({ tipVisible: true });
            return;
        }
        if (this.props.length && this.value.length > this.props.length) {
            message.warn(`请将内容缩减至${this.props.length}以内,当前${this.value.length}字`);
            return;
        }
        this.props.onChange && this.props.onChange(this.value)
        this.setState({
            tipVisible: false,
            editing: false
        })
    }

    _onCancel() {
        this.setState({
            tipVisible: false,
            editing: false
        })
    }
    //*************************************************************************** */
    //**********************************UI*************************************** */
    //*************************************************************************** */
    //渲染编辑模式
    renderEditContent() {
        var dom = null;
        switch (this.state.dataType) {
            case 'Dictionary':
                var title = '';
                this.state.options.forEach((item) => {
                    if (this.state.value === item.value) {
                        title = item.name;
                    }
                })
                var menu = (
                    <Menu onClick={(event) => { this._onChangeProperty(event.key) }}>
                        {this.state.options.map((item) => {
                            return (<Menu.Item key={item.id}>{item.name}</Menu.Item>)
                        })}
                    </Menu>
                )
                dom = (
                    <Row type={'flex'} >
                        <Col>
                            <Dropdown.Button overlay={menu} >
                                {title}
                            </Dropdown.Button >
                        </Col>
                        <Col>
                            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => { this._onCommit() }} >保存</Button>
                            <Button style={{ marginLeft: 10 }} onClick={() => { this._onCancel() }} >取消</Button>
                        </Col>
                    </Row>
                )
                break;
            case 'TextArea':
                dom = (
                    <Col type={'flex'} >
                        <Col span={24}>
                            <Input.TextArea autosize={{ minRows: 1, maxRows: 3 }} defaultValue={this.state.value} onChange={(event) => { this._onChangeProperty(event.target.value) }} />
                        </Col>
                        <Col span={24} style={{ marginTop: 10 }} >
                            <Row type={'flex'} justify="end">
                                <Button type="primary" onClick={() => { this._onCommit() }} >保存</Button>
                                <Button style={{ marginLeft: 10 }} onClick={() => { this.setState({ editing: false }) }} >取消</Button>
                            </Row>
                        </Col>
                    </Col>
                )
                break;
            default:
                dom = (
                    <Row type={'flex'}>
                        <Col>
                            <Input defaultValue={this.state.value} onChange={(event) => { this._onChangeProperty(event.target.value) }} style={{ width: this.props.inputWidth || 172 }} />
                        </Col>
                        <Col>
                            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => { this._onCommit() }} >保存</Button>
                            <Button style={{ marginLeft: 10 }} onClick={() => { this.setState({ editing: false }) }} >取消</Button>
                        </Col>
                    </Row>
                )
                break;
        }
        return dom;
    }

    //渲染非编辑模式
    renderContent() {
        var dom
        if (this.state.dataType === 'Dictionary') {
            this.state.options.forEach((item) => {
                if (this.state.value === item.value) {
                    dom.push(
                        <Col style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                            {item.name}
                        </Col>
                    )
                }
            })
        } else {
            dom.push(
                <Col style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                    <p style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                        {this.state.value || this.props.defaultNullValue}
                    </p>
                </Col>
            )
        }
    }

    //渲染行内编辑模式
    renderInline() {
        var dom = [];
        //编辑状态
        if (this.state.editing) {
            dom.push(
                <Col style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                    <Tooltip title={this.message} visible={this.state.tipVisible}>
                        {this.renderEditContent()}
                    </Tooltip>
                </Col>
            )
            if (this.props.rule && this.props.rule.message) {
                dom.push(
                    <Col style={{ height: DESCRIPTION_CONTAINER_HEIGHT }}></Col>
                )
            }
        } else {
            //不可编辑状态
            if (this.state.dataType === 'Dictionary') {
                //下拉菜单显示文字类型
                this.state.options.forEach((item) => {
                    if (this.state.value === item.value) {
                        dom.push(
                            <Button style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                                {item.name}
                            </Button>
                        )
                    }
                })
            } else {
                //普通显示文字类型
                if (this.state.dataType === 'TextArea') {
                    dom.push(
                        <a key={Math.random()} onClick={() => { this.setState({ editing: true }) }}>
                            <Tooltip placement='topLeft' title={this.state.value || this.props.defaultNullValue}>
                                <Ellipsis lines={3} style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{this.state.value || this.props.defaultNullValue}</Ellipsis>
                            </Tooltip>
                        </a>
                    )
                } else {
                    dom.push(
                        <a key={Math.random()} onClick={() => { this.setState({ editing: true }) }}>
                            <Tooltip placement='topLeft' title={'点击编辑'}>
                                <div style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                                    <p style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{this.state.value || this.props.defaultNullValue}</p>
                                </div>
                            </Tooltip>
                        </a>
                    )
                }
            }
            if (this.props.rule && this.props.rule.message) {
                dom.push(
                    <Col style={{ height: DESCRIPTION_CONTAINER_HEIGHT }} />
                )
            }
        }
        return dom;
    }

    //渲染普通模式
    renderCommon() {
        var dom = [];
        //编辑状态
        if (this.state.editing) {
            dom.push(
                <Col style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                    {this.renderEditContent()}
                </Col>
            )
            if (this.props.rule && this.props.rule.message) {
                dom.push(
                    <Col style={{ height: DESCRIPTION_CONTAINER_HEIGHT }}></Col>
                )
            }
        } else {
            //不可编辑状态
            if (this.state.dataType === 'Dictionary') {
                this.state.options.forEach((item) => {
                    if (this.state.value === item.value) {
                        dom.push(
                            <Col style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                                {item.name}
                            </Col>
                        )
                    }
                })
            } else {
                dom.push(
                    <Col style={{ height: CONTENT_CONTAINER_HEIGHT }}>
                        {this.state.value || this.props.defaultNullValue}
                    </Col>
                )
            }
            if (this.props.rule && this.props.rule.message) {
                dom.push(
                    <Col style={{ height: DESCRIPTION_CONTAINER_HEIGHT }} />
                )
            }
        }
        return dom;
    }

    //渲染标题
    renderTitle() {
        if (this.state.title) {
            return (
                <Col style={{ marginRight: 10, height: CONTENT_CONTAINER_HEIGHT }}>
                    <p style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{this.state.title}:</p>
                </Col>
            )
        }
    }

    render() {
        return (
            <Row type={'flex'}>
                {this.renderTitle()}
                <Col style={{ flex: 1, marginRight: 10 }}>
                    {this.state.mode === 'common' ? this.renderCommon() : this.renderInline()}
                </Col>
            </Row>
        )
    }
}