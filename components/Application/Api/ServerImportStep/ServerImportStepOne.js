import React from 'react';
import { Col, Row, Radio, Input, Button } from 'antd';
import { getSwaggerComparison } from '../../../../services/api'

export default class ServerImportStepOne extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            radioValue: 1
        }

        this.swaggerurl = null;
        this.swaggergrouptext = null;
        this.renderJsonImportUrlContainer = this.renderJsonImportUrlContainer.bind(this);
        this.renderJsonTextContainer = this.renderJsonTextContainer.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onClick = this._onClick.bind(this);
    }


    //******************************************************************* */
    //********************************EVENT****************************** */
    //******************************************************************* */

    _onChange(e) {
        this.setState({
            radioValue: e.target.value
        })
    }

    _onClick() {
        if (this.state.radioValue == 1) {
            if (this.swaggergrouptext == null) { return }
            var obj = JSON.parse(this.swaggergrouptext);
            getSwaggerComparison(obj)
                .then((response) => {
                    this.props.onNextSetp && this.props.onNextSetp(response,this.swaggergrouptext);
                })
        } else {
            if (this.swaggerurl == null) { return }

        }
    }
    //******************************************************************* */
    //*********************************UI******************************** */
    //******************************************************************* */
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
        if(this.props.display == false){
            return null;
        }
        return (
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
                    {this.state.radioValue == 1 ? this.renderJsonTextContainer() : this.renderJsonImportUrlContainer()}
                </Row>
                <Row type="flex" justify={'center'} style={{ marginTop: 20 }}><Col><Button onClick={() => { this._onClick() }} type="primary">下一步</Button></Col></Row>
            </Col>
        )
    }
}