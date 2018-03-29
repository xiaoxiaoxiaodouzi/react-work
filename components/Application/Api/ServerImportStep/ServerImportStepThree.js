import React, { Fragment } from 'react';
import { Row, Col, Radio, Button, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import QuickSearch from '../../../../utils/quickSearch';
import { addServers, updateServers } from '../../../../services/api'


export default class ServerImportStepTwo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            updateServer: [],
            importServer: [],
            grade: 1
        }

        this._onUpdate = this._onUpdate.bind(this);
        this._onImport = this._onImport.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource !== this.props.dataSource) {
            var updateServer = [];
            var importServer = [];
            var dataSource = nextProps.dataSource;
            dataSource.forEach(element => {
                if (element.state == 3) {
                    updateServer.push(element);
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
        updateServers(this.props.appId, this.state.updateServer, this.props.swaggertext)
            .then((response) => {
                this.props.hasChange && this.props.hasChange()
                message.success('更新成功');
            })
    }

    _onImport() {
        addServers(this.props.appId, this.props.upstream, this.state.importServer, this.props.swaggertext, this.state.grade)
            .then((response) => {
                this.props.hasChange && this.props.hasChange()
                message.success('导入成功');
            })
    }

    //**************************************************************************** */
    //*************************************UI************************************* */
    //**************************************************************************** */

    render() {
        if (this.props.display == false) {
            return null;
        }
        return (
            <Col span={18} offset={3} style={{ paddingTop: 30 }}>
                <Row type={'flex'} align="middle" style={{ marginBottom: 20 }}>
                    <Col span={4}>可更新服务数:</Col>
                    <Col span={15}>{this.state.updateServer.length}</Col>
                    <Col span={5}><Button type="primary" onClick={() => { this._onUpdate() }}>更新</Button></Col>
                </Row>
                <Row type={'flex'} align="middle" style={{ marginBottom: 20 }}>
                    <Col span={4}>可导入服务:</Col>
                    <Col span={15}>{this.state.importServer.length}</Col>
                    <Col span={5}><Button type="primary" onClick={() => { this._onImport() }}>导入</Button></Col>
                </Row>
                <Row type={'flex'}>
                    <Col span={4}> 开放等级:</Col>
                    <Col span={20}>
                        <Row type={'flex'}>
                            <Row type={'flex'} style={{ marginLeft: 10, marginRight: 10 }}><Col><Radio checked={this.state.grade == 0 ? true : false} onChange={() => { this.setState({ grade: 0 }) }} /></Col><Col><Col>私有服务</Col><Col>内部服务</Col></Col></Row>
                            <Row type={'flex'} style={{ marginLeft: 10, marginRight: 10 }}><Col><Radio checked={this.state.grade == 1 ? true : false} onChange={() => { this.setState({ grade: 1 }) }} /></Col><Col><Col>普通服务</Col><Col>申请后可调用</Col></Col></Row>
                            <Row type={'flex'} style={{ marginLeft: 10, marginRight: 10 }}><Col><Radio checked={this.state.grade == 2 ? true : false} onChange={() => { this.setState({ grade: 2 }) }} /></Col><Col><Col>公开服务</Col><Col>可直接调用</Col></Col></Row>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
}