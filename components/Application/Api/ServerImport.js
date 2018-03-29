import React from 'react';
import { Row, Col, Modal, Button, Steps ,message} from 'antd';
import ServerImportStepOne from './ServerImportStep/ServerImportStepOne';
import ServerImportStepTwo from './ServerImportStep/ServerImportStepTwo';
import ServerImportStepThree from './ServerImportStep/ServerImportStepThree';

export default class ServerImport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            step: 0,
            dataSource: [],
            swaggertext:'',
            resultDataSource:[],
        }

        this.hasChange = false;

        this._onClick = this._onClick.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onOk = this._onOk.bind(this);
        this._toSetpTwo = this._toSetpTwo.bind(this);
        this._toSetpThree = this._toSetpThree.bind(this);
        this._hasChange = this._hasChange.bind(this);
    }

    //********************************************************************* */
    //*******************************EVENT********************************* */
    //********************************************************************* */
    _onClick() {
        if(this.props.upstream === null){
            message.warning('请先填写内网地址');
            return;
        }
        this.hasChange = false;
        this.setState({
            visible: true,
            step:0
        })
    }

    _onCancel() {
        if(this.hasChange === true){
            this.hasChange = false;
            this.props.hasChange && this.props.hasChange();
        }
        this.setState({
            visible: false,
            step:0
        })
    }

    _onOk() {
        this.setState({
            visible: false,
            step:0
        })
    }

    _toSetpTwo(swagger,swaggertext) {
        this.setState({
            step: 1,
            dataSource: swagger,
            swaggertext:swaggertext
        })
    }

    _toSetpThree(dataSource){
        this.setState({
            step: 2,
            resultDataSource: dataSource
        })
    }

    _hasChange(){
        this.hasChange = true;
    }
    //********************************************************************* */
    //********************************UI*********************************** */
    //********************************************************************* */
    render() {

        return (
            <div>
                <Button type="primary" onClick={this._onClick}>+ 导入</Button>
                <Modal
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
                            </Steps>
                        </Col>
                        <Col>
                            <ServerImportStepOne onNextSetp={this._toSetpTwo} display={this.state.step === 0 ? true : false} />
                            <ServerImportStepTwo dataSource={this.state.dataSource} onNextSetp={this._toSetpThree} display={this.state.step === 1 ? true : false} />
                            <ServerImportStepThree appId={this.props.appId} dataSource={this.state.resultDataSource} swaggertext={this.state.swaggertext} upstream={this.props.upstream} display={this.state.step == 2 ? true : false} hasChange={this._hasChange}/>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}