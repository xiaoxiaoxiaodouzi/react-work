import React from 'react';
import { Row, Col, Modal, Button, Steps } from 'antd';
import ServerImportStepOne from './ServerImportStep/ServerImportStepOne';
import ServerImportStepTwo from './ServerImportStep/ServerImportStepTwo';
import ServerImportStepThree from './ServerImportStep/ServerImportStepThree';
import ServerImportComplete from './ServerImportStep/ServerImportComplete';
// import { base } from '../../../services/base';
// import RenderAuthorized from 'ant-design-pro/lib/Authorized';

export default class ServerImport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            appId: props.appId,
            step: 0,
            dataSource: [],
            upstream: null,
            swaggertext: '',
            resultDataSource: [],
            completeData:{}
        }

        this.hasChange = false;

        this._onClick = this._onClick.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onOk = this._onOk.bind(this);
        this._toSetpTwo = this._toSetpTwo.bind(this);
        this._toSetpThree = this._toSetpThree.bind(this);
        this._toComplete = this._toComplete.bind(this);
        // this._toSetpFour = this._toSetpFour.bind(this);
        this._hasChange = this._hasChange.bind(this);
    }

    //********************************************************************* */
    //*******************************EVENT********************************* */
    //********************************************************************* */
    _onClick() {

        this.hasChange = false;
        this.setState({
            visible: true,
            step: 0
        })
    }

    _onCancel() {
        if (this.hasChange) {
            this.hasChange = false;
            this.props.hasChange && this.props.hasChange();
        }
        this.setState({
            visible: false,
            step: 0
        })
    }

    _onOk() {
        this.setState({
            visible: false,
            step: 0
        })
    }

    _toSetpTwo(swagger, swaggertext, upstream, appId) {
        var state = {
            step: 1,
            dataSource: swagger,
            swaggertext: swaggertext,
            upstream: upstream
        };

        if (appId != null) {
            Object.assign(state, { appId: appId })
        }
        this.setState(state)
    }

    _toSetpThree(dataSource) {
        this.setState({
            step: 2,
            resultDataSource: dataSource
        })
        console.log(this.state.step);
    }

    _toSetpFour=(updateNum,importNum)=>{
        this.setState({
            step: 3,
            completeData:{updateNum:updateNum,importNum:importNum}
        })
        console.log(this.state.step);
        this.hasChange();

    }

    _toComplete(){
        this._onCancel();
    }

    _hasChange() {
        this.hasChange = true;
    }
    //********************************************************************* */
    //********************************UI*********************************** */
    //********************************************************************* */
    render() {
        // const Authorized = RenderAuthorized(base.allpermissions);
        return (
            <div>
                <Button type="primary" onClick={this._onClick}>+ 导入</Button>
                <Modal
                    style={{ top: 20 }}
                    title={'服务导入'}
                    onCancel={this._onCancel}
                    visible={this.state.visible}
                    width={880}
                    destroyOnClose={true}
                    footer={null}>
                    <Row>
                        <Col span={20} offset={2}>
                            <Steps current={this.state.step}>
                                <Steps.Step title="服务录入" />
                                <Steps.Step title="服务预览" />
                                <Steps.Step title="导入/更新服务" />
                                <Steps.Step title="完成" />
                            </Steps>
                        </Col>
                        <Col>
                            <ServerImportStepOne onNextSetp={this._toSetpTwo} display={this.state.step === 0 ? true : false} upstream={this.props.upstream} appId={this.state.appId} />
                            <ServerImportStepTwo onPreviousStep={() => { this.setState({ step: 0 }) }} onNextSetp={this._toSetpThree} dataSource={this.state.dataSource} display={this.state.step === 1 ? true : false} />
                            <ServerImportStepThree onPreviousStep={() => { this.setState({ step: 1 }) }} onNextSetp={this._toSetpFour} appId={this.state.appId} dataSource={this.state.resultDataSource} swaggertext={this.state.swaggertext} upstream={this.state.upstream || this.props.upstream} display={this.state.step === 2 ? true : false} hasChange={this._hasChange} />
                            <ServerImportComplete display={this.state.step === 3 ? true : false} data={this.state.completeData}  onNextSetp={this._toComplete}/>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}