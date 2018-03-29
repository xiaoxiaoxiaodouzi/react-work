import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Alert, Table, Select } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import ServerManager from './ServerManager';
import { getAccessibilityServicesApis, addAuthorizedServicesApis, removeAuthorizedServicesApis, removeServicesApis } from '../../../services/api'

const OPTIONS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
]

const METHOD_COLORS = {
    "GET": "#0f6ab4",
    "POST": "#10a54a",
    "PUT": "#c5862b",
    "PATCH": "",
    "DELETE": "#a41e22",
    "HEAD": "",
    "OPTIONS": "",
}

export default class ProvidedServices extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            selectedRowKeys: [],
            searchText: null,
            filterMethod: null,
            pagination: { current: 1, total: 1, pageSize: 1, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
        }

        this._removeApi = this._removeApi.bind(this);
        this.rowSelection = this.rowSelection.bind(this);
        this._onChange = this._onChange.bind(this);
        this._clear = this._clear.bind(this);
        this._search = this._search.bind(this);
        this._addServerApis = this._addServerApis.bind(this);
        this._removeServerApis = this._removeServerApis.bind(this);
    }

    componentDidMount() {
        this._pullData(this.props.appId, 1, 10);
    }

    //**************************************************************************** */
    //************************************EVENT*********************************** */
    //**************************************************************************** */
    _pullData(appId, page, rows, condition) {

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
        }

        getAccessibilityServicesApis(appId, page, rows, condition)
            .then((response) => {
                var dataSource = [];
                var contents = response.contents;
                contents.forEach(element => {
                    dataSource.push(element.service);
                });
                var pagination = { current: response.pageIndex, total: response.total, pageSize: response.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, };
                this.setState({
                    dataSource: dataSource,
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
            width: '35%',
            render: (text, record) => {
                return (
                    <Row>
                        <Col span={5} style={{ color: METHOD_COLORS[record.methods] }}>{record.methods}</Col>
                        <Col span={19}><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Col>
                    </Row>
                )
            }
        }, {
            title: '服务公开级别',
            dataIndex: 'visibil ity',
            key: 'visibility',
            width: '130px',
            render: (text, record) => {
                return (
                    <Row type={'flex'} justify="center">
                        <Col>{text == '1' ? '普通' : text == '2' ? '公开' : '私有'}</Col>
                    </Row>
                )
            }
        }, {
            title: '平均响应时长',
            dataIndex: 'grantion',
            key: 'grantion',
            width: '130px',
            render: (text, record) => {
                return (
                    <Row type={'flex'} justify="center">
                        <Col>100ms</Col>
                    </Row>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'options',
            key: 'options',
            width: '147px',
            render: (text, record) => {
                return (
                    <div>
                        <a style={{ marginLeft: 10 }}>文档调试</a>
                    </div>
                )
            }
        }];
    }

    _onChange(pagination, filters, sorter) {
        this._pullData(this.props.appId, pagination.current, pagination.pageSize);
    }

    _removeApi(apiId) {

        removeServicesApis(this.props.appId, apiId)
            .then((response) => {
                this._pullData(this.props.appId, this.page, this.rows)
            })
    }

    _search() {
        this._pullData(this.props.appId, this.page, this.rows, {})
    }

    _clear() {
        this._pullData(this.props.appId, this.page, this.rows)
        this.setState({
            filterMethod: null,
            searchText: null
        })
    }

    //新增授权
    _addServerApis(apiIds = []) {
        var appIdsStr = '';
        apiIds.forEach((element, index, arrays) => {
            appIdsStr += element;
            if (index < arrays.length - 1) {
                appIdsStr += ',';
            }
        });
        addAuthorizedServicesApis(this.props.appId, appIdsStr)
            .then((response) => {
                this._pullData(this.props.appId, this.page, this.rows, {})
            })

    }

    //移除授权
    _removeServerApis() {
        var apiIds = this.state.selectedRowKeys;

        if (apiIds.length < 1) {
            return
        }
        var appIdsStr = '';
        apiIds.forEach((element, index, arrays) => {
            appIdsStr += element;
            if (index < arrays.length - 1) {
                appIdsStr += ',';
            }
        });
        removeAuthorizedServicesApis(this.props.appId, appIdsStr)
            .then((response) => {
                this.setState({
                    selectedRowKeys: []
                })
                this._pullData(this.props.appId, this.page, this.rows, {})
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
                <Row>
                    <Col span={10}>
                        <Row type={'flex'} align='middle'>
                            <Col span={4}>名称/路径:</Col><Col span={18}><Input onChange={(e) => { this.setState({ searchText: e.target.value }) }} value={this.state.searchText} placeholder="请输入" /></Col>
                        </Row>
                    </Col>
                    <Col span={10}>
                        <Row type={'flex'} align={'middle'}>
                            <Col span={4}>Method:</Col>
                            <Col span={18}>
                                <Select style={{ width: '100%' }} value={this.state.filterMethod} onSelect={(value) => { this.setState({ filterMethod: value }) }} placeholder={'请选择'}>
                                    {OPTIONS.map((element) => {
                                        return (<Select.Option value={element}>{element}</Select.Option>)
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row type={'flex'} justify="end">
                            <Col><Button type="primary" onClick={() => this._search()}>查询</Button></Col>
                            <Col><Button style={{ marginLeft: 10 }} onClick={() => this._clear()}>重置</Button></Col>
                        </Row>
                    </Col>
                </Row>
                <Row type={'flex'} style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <ServerManager appId={this.props.appId} apiKey={this.props.apiKey} onChange={this._addServerApis} />
                    <Button onClick={() => { this._removeServerApis() }} style={{ marginLeft: 10, marginRight: 10 }}>删除</Button>
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
            </div>
        )
    }
}