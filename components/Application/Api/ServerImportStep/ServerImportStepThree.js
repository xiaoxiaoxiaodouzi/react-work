import React from 'react';
import { Row, Col, Radio, message } from 'antd';
import { addServers, updateServers } from '../../../../services/aip'
import SetpBar from './SetpBar';

export default class ServerImportStepTwo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            updateServer: [],
            importServer: [],
            grade: 1,
            updateLoading:false,
            importLoading:false,
            importDisabled:false
        }

        this._onUpdate = this._onUpdate.bind(this);
        this._onImport = this._onImport.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        // eslint-disable-next-line
        if (nextProps.dataSource != this.props.dataSource) {
            var updateServer = [];
            var importServer = [];
            var dataSource = nextProps.dataSource;
            dataSource.forEach(element => {
                // eslint-disable-next-line
                if (element.state == 3) {
                    updateServer.push(element);
                    // eslint-disable-next-line
                } else if (element.state == 2) {
                    importServer.push(element)
                }
            });
            this.setState({
                updateServer: updateServer,
                importServer: importServer,
            })
        }
    }
    //**************************************************************************** */
    //************************************EVENT*********************************** */
    //**************************************************************************** */
    _onUpdate() {
        this.setState({updateLoading:true})
        updateServers(this.props.appId, this.state.updateServer, this.props.swaggertext)
            .then((response) => {
                this.setState({updateLoading:false})
                this.props.hasChange && this.props.hasChange()
                message.success('更新成功');
            }).catch(err=>{this.setState({updateLoading:false})})
    }

    _onImport() {
        this.setState({importLoading:true})
        addServers(this.props.appId, this.props.upstream, this.state.importServer, this.props.swaggertext, this.state.grade)
            .then((response) => {
                this.setState({importLoading:false,importDisabled:true})
                this.props.hasChange && this.props.hasChange()
                message.success('导入成功');
            }).catch(err=>{this.setState({importLoading:false,importDisabled:false})})
    }

    onNextStep=()=>{
        let requests = [];
        this.setState({importLoading:true})
        requests.push(updateServers(this.props.appId, this.state.updateServer, this.props.swaggertext));
        requests.push(addServers(this.props.appId, this.props.upstream, this.state.importServer, this.props.swaggertext, this.state.grade));
        Promise.all(requests).then(responses =>{
           
            this.setState({importLoading:false,importDisabled:true})
            this.props.onNextSetp && this.props.onNextSetp(this.state.updateServer.length,this.state.importServer.length);
           // message.success('导入成功');
        }).catch(err =>{
            this.setState({importLoading:false,importDisabled:false});
        })
    }

    //**************************************************************************** */
    //*************************************UI************************************* */
    //**************************************************************************** */

    render() {
        if (!this.props.display) {
            return null;
        }
        return (
            <Col>
                <Col span={18} offset={3} style={{ paddingTop: 30 }}>
                    <Row type={'flex'} align="middle" style={{ marginBottom: 20 }}>
                        <Col span={4}>可更新服务数:</Col>
                        <Col span={15}>{this.state.updateServer.length}</Col>
                        {/* <Col span={5}><Button loading={this.state.updateLoading} disabled={this.state.updateServer.length>0?this.state.importDisabled:true} type="primary" onClick={() => { this._onUpdate() }}>更新</Button></Col> */}
                    </Row>
                    <Row type={'flex'} align="middle" style={{ marginBottom: 20 }}>
                        <Col span={4}>可导入服务:</Col>
                        <Col span={15}>{this.state.importServer.length}</Col>
                        {/* <Col span={5}><Button type="primary" loading={this.state.importLoading} disabled={this.state.importServer.length>0?this.state.importDisabled:true} onClick={() => { this._onImport() }}>导入</Button></Col> */}
                    </Row>
                    <Row type={'flex'}>
                        <Col span={4}> 开放等级:</Col>
                        <Col span={20}>
                            <Row type={'flex'}>
                                <Row type={'flex'} style={{ marginLeft: 10, marginRight: 10 }}><Col><Radio checked={this.state.grade === 0 ? true : false} onChange={() => { this.setState({ grade: 0 }) }} /></Col><Col><Col>私有服务</Col><Col>内部服务</Col></Col></Row>
                                <Row type={'flex'} style={{ marginLeft: 10, marginRight: 10 }}><Col><Radio checked={this.state.grade === 1 ? true : false} onChange={() => { this.setState({ grade: 1 }) }} /></Col><Col><Col>普通服务</Col><Col>申请后可调用</Col></Col></Row>
                                <Row type={'flex'} style={{ marginLeft: 10, marginRight: 10 }}><Col><Radio checked={this.state.grade === 2 ? true : false} onChange={() => { this.setState({ grade: 2 }) }} /></Col><Col><Col>公开服务</Col><Col>可直接调用</Col></Col></Row>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <SetpBar importStep={()=>{this.onNextStep()}} importLoading={this.state.importLoading} onPreviousStep={() => { this.props.onPreviousStep() }} style={{ marginTop: 20 }} />
                </Col>
            </Col>

        )
    }
}