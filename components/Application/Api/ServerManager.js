import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Modal, Alert, Table, Select } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { getUnAuthorizedServicesApis, getAppsKeyList } from '../../../services/api'

const OPTIONS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
]

export default class ServerManager extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            apps: [],
            dataSource: [],
            selectedRowKeys: [],
            filterApp: null,
            searchText: null,
            filterMethod: null,
            pagination: { current: 1, total: 1, pageSize: 1, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
        }

        this._onClick = this._onClick.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onOk = this._onOk.bind(this);
        this.rowSelection = this.rowSelection.bind(this);
        this._onChange = this._onChange.bind(this);
        this._clear = this._clear.bind(this);
        this._search = this._search.bind(this);
    }

    componentDidMount() {
        getAppsKeyList()
            .then((response) => {
                this.setState({ apps: response.contents })
            })
    }

    //**************************************************************************** */
    //************************************EVENT*********************************** */
    //**************************************************************************** */
    _pullData(appId, page, rows = 5, condition) {
        this.page = page;
        this.rows = rows;
        if (condition != null) {
            var condition = {};
            if (this.state.searchText != null) {
                condition.nameorurl = this.state.searchText;
            }
            if (this.state.filterMethod != null) {
                condition.method = this.state.filterMethod;
            }
            if (this.state.filterApp != null) {
                condition.searchAppId = this.state.filterApp;
            }
        }
        getUnAuthorizedServicesApis(appId, page, rows, condition)
            .then((response) => {
                var pagination = { current: response.pageIndex, total: response.total, pageSize: response.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, };
                this.setState({
                    dataSource: response.contents,
                    pagination: pagination
                })
            })
    }

    _getColumn() {
        return [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (text, record) => {
                return (
                    <Row>
                        <Col span={24}><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Col>
                    </Row>
                )
            }
        }, {
            title: '路径',
            dataIndex: 'uri',
            key: 'uri',
            width: '40%',
            render: (text, record) => {
                return (
                    <Row>
                        <Col span={5}>{record.methods}</Col>
                        <Col span={19}><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Col>
                    </Row>
                )
            }
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            width: '40%',
        }];
    }

    _onChange(pagination, filters, sorter) {
        this._pullData(this.props.appId, pagination.current, pagination.pageSize);
    }

    _onClick() {
        var selectedRowKeys = this.props.selectedRowKeys || [];
        this.setState({
            visible: true,
            selectedRowKeys: selectedRowKeys,
        })
        this._pullData(this.props.appId, 1);
    }

    _onCancel() {
        this.setState({
            visible: false
        })
    }

    _onOk() {
        this.props.onChange && this.props.onChange(this.state.selectedRowKeys);
        this.setState({
            visible: false
        })
    }

    _search() {
        this._pullData(this.props.appId, this.page, this.rows, {})
    }

    _clear() {
        this._pullData(this.props.appId, this.page, this.rows)
        this.setState({
            filterMethod: null,
            searchText: null,
            filterApp: null
        })
    }
    //**************************************************************************** */
    //*************************************UI************************************* */
    //**************************************************************************** */
    rowSelection() {

        let obj = {
            selectedRowKeys: this.state.selectedRowKeys,
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                if (selected) {
                    var isExist = false;
                    for (var n = 0; n < this.state.selectedRowKeys.length; n++) {
                        if (record.id == this.state.selectedRowKeys[n]) {
                            isExist = true;
                        }
                    }
                    if (isExist) {
                        return;
                    }
                    var selectedRowKeys = this.state.selectedRowKeys.slice();
                    selectedRowKeys.push(record.id)
                    this.setState({
                        selectedRowKeys: selectedRowKeys
                    })
                } else {
                    var rowsKeys = [];
                    for (var n = 0; n < this.state.selectedRowKeys.length; n++) {
                        if (record.id != this.state.selectedRowKeys[n]) {
                            rowsKeys.push(this.state.selectedRowKeys[n]);
                        }
                    }
                    this.setState({
                        selectedRowKeys: rowsKeys
                    })
                }
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                var rowKeys = [];
                if (selected) {
                    rowKeys = this.state.selectedRowKeys.slice();
                    for (var n = 0; n < selectedRows.length; n++) {
                        var newSelected = selectedRows[n];
                        for (var i = 0; i < this.state.selectedRowKeys.length; i++) {
                            if (this.state.selectedRowKeys[i] == selectedRows[n].id) {
                                newSelected = null
                                break;
                            }
                        }
                        if (newSelected != null) {
                            rowKeys.push(newSelected.id);
                        }
                    }
                } else {
                    for (var n = 0; n < this.state.selectedRowKeys.length; n++) {
                        var newSelected = null;
                        for (var i = 0; i < changeRows.length; i++) {
                            if (this.state.selectedRowKeys[n] == changeRows[i].id) {
                                newSelected = this.state.selectedRowKeys[n];
                            }
                        }
                        if (newSelected == null) {
                            rowKeys.push(this.state.selectedRowKeys[n])
                        }
                    }
                }

                this.setState({
                    selectedRowKeys: rowKeys
                })
            }
        }
        return obj;
    };

    render() {
        return (
            <div>
                <Button type="primary" onClick={() => { this._onClick() }}>+ 授权</Button>
                <Modal
                    title={'服务授权'}
                    visible={this.state.visible}
                    onCancel={this._onCancel}
                    onOk={this._onOk}
                    width={1110}>
                    <Row style={{ marginBottom: 10 }}>
                        <Col span={6}>
                            <Row type={'flex'} align='middle'>
                                <Col span={4}>应用:</Col>
                                <Col span={18}>
                                    <Select style={{ width: '100%' }} placeholder={'请选择'} value={this.state.filterApp} onSelect={(value) => { this.setState({ filterApp: value }) }}>
                                        {this.state.apps.map((element) => {
                                            return (<Select.Option value={element.id}>{element.name}</Select.Option>)
                                        })}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row type={'flex'} align={'middle'}>
                                <Col span={6}>Method:</Col>
                                <Col span={16}>
                                    <Select style={{ width: '100%' }} placeholder={'请选择'} value={this.state.filterMethod} onSelect={(value) => { this.setState({ filterMethod: value }) }}>
                                        {OPTIONS.map((element) => {
                                            return (<Select.Option value={element}>{element}</Select.Option>)
                                        })}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row type={'flex'} align='middle'>
                                <Col span={6}>名称/路径:</Col>
                                <Col span={18}><Input onChange={(e) => { this.setState({ searchText: e.target.value }) }} value={this.state.searchText} placeholder="请输入" /></Col>
                            </Row>
                        </Col>
                        <Col span={4}>
                            <Row type={'flex'} justify="end">
                                <Col><Button type="primary" onClick={() => this._search()}>查询</Button></Col>
                                <Col><Button style={{ marginLeft: 10 }} onClick={() => this._clear()}>重置</Button></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Alert
                        style={{ marginBottom: 10 }}
                        message={(
                            <Fragment>
                                已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                            <a onClick={() => { this.setState({ selectedRowKeys: [] }) }} style={{ marginLeft: 24 }}>清空</a>
                            </Fragment>
                        )}
                        type="info"
                        showIcon
                    />
                    <Table
                        rowKey="id"
                        rowSelection={this.rowSelection()}
                        dataSource={this.state.dataSource}
                        pagination={this.state.pagination}
                        columns={this._getColumn()}
                        onChange={this._onChange} />

                </Modal>
            </div>
        )
    }
}