import React from 'react';
import { Col, Row, Radio, Input, Select, message } from 'antd';
import SetpBar from './SetpBar';
import { getSwaggerComparison, getRemoteSwagger, queryAllGroups } from '../../../../services/api'
import { getAppInfo } from '../../../../services/appdetail'

export default class ServerImportStepOne extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            radioValue: 1,
            groups: [],
            showServerGroup: this.props.upstream === undefined ? true : false
        }

        this.appId = null;
        this.upstream = null;
        this.swaggerurl = null;
        this.swaggergrouptext = null;

        this._onSelect = this._onSelect.bind(this);
        this.renderJsonImportUrlContainer = this.renderJsonImportUrlContainer.bind(this);
        this.renderJsonTextContainer = this.renderJsonTextContainer.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    componentDidMount() {
        if (this.props.upstream == null) {
            queryAllGroups()
                .then((response) => {
                    this.setState({
                        groups: response
                    })
                });
        }
    }
    //******************************************************************* */
    //********************************EVENT****************************** */
    //******************************************************************* */
    _onSelect(appId) {
        getAppInfo(appId)
            .then((response) => {
                this.appId = appId;
                this.upstream = response.upstream;
            })
    }

    _onChange(e) {
        this.setState({
            radioValue: e.target.value
        })
    }

    _onClick() {
        if (this.props.upstream == null) {
            if (this.upstream == null) {
                message.warn('请选择需要导入的服务组')
                return
            }
        }
        if (this.state.radioValue === 1) {
            if (!this.swaggergrouptext) { return }
            var obj = JSON.parse(this.swaggergrouptext);
            getSwaggerComparison(obj)
                .then((response) => {
                    this.props.onNextSetp && this.props.onNextSetp(response, this.swaggergrouptext, this.upstream,this.appId);
                })
        } else {
            if (!this.swaggerurl) { return }
            getRemoteSwagger(this.swaggerurl)
                .then((response) => {
                    return getSwaggerComparison(response)
                })
                .then((response) => {
                    this.props.onNextSetp && this.props.onNextSetp(response, JSON.stringify(response), this.upstream,this.appId);
                })
        }
    }
    //******************************************************************* */
    //*********************************UI******************************** */
    //******************************************************************* */
    renderServiceGroupSelectTree() {
        if (this.state.showServerGroup) {
            return (
                <Col span={18} offset={3} style={{ paddingTop: 30 }}>
                    <Row span={12} >
                        <Col span={5}>目标服务组:</Col>
                        <Col>
                            <Select onSelect={this._onSelect} size={'large'} style={{ width: 300 }} placeholder={'目标服务组'}>
                                {this.state.groups.map((element) => {
                                    if (element.isParent === false) {
                                        return null
                                    }
                                    return (
                                        <Select.Option value={element.id}>{element.name}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                </Col>
            )
        }
    }

    renderJsonImportUrlContainer() {
        return (
            <Row style={{ marginTop: 20 }}>
                <Col span={5}>接口路径:</Col>
                <Col span={16}><Input onChange={(e) => { this.swaggerurl = e.target.value }} /></Col>
            </Row>
        )
    }

    renderJsonTextContainer() {
        return (
            <Row style={{ marginTop: 20 }}>
                <Col span={5}>JSON字符串:</Col>
                <Col span={16}><Input.TextArea onChange={(e) => { this.swaggergrouptext = e.target.value }} rows={15} /></Col>
            </Row>
        )
    }

    render() {
        if (!this.props.display) {
            return null;
        }
        return (
            <Col>
                {this.renderServiceGroupSelectTree()}
                <Col span={18} offset={3} style={{ paddingTop: 30 }}>
                    <Row span={12}>
                        <Col span={5}>导入方式:</Col>
                        <Col span={16}>
                            <Radio.Group onChange={this._onChange} value={this.state.radioValue}>
                                <Radio value={1}>Swagger.json字符串</Radio>
                                <Radio value={2}>Swagger.json访问地址</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row span={12}>
                        {this.state.radioValue === 1 ? this.renderJsonTextContainer() : this.renderJsonImportUrlContainer()}
                    </Row>
                </Col>
                <Col span={24}>
                    <SetpBar onNextStep={() => { this._onClick() }} style={{ marginTop: 20 }} />
                </Col>
            </Col>
        )
    }
}