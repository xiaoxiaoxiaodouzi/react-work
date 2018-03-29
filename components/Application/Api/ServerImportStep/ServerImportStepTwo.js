import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Radio, Alert, Table, Select } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import QuickSearch from '../../../../utils/quickSearch';
import { getUnAuthorizedServicesApis } from '../../../../services/api'

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

const SERVER_STATUS = {
    0: '已存在',
    1: '重复',
    2: '可导入',
    3: '可更新'
}

export default class ServerImportStepTwo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            apps: [],
            dataSource: [],
            selectedRowKeys: [],
            deleteRowKeys: {},
            searchText: null,
            filterStatus: '-1',
            pagination: { current: 1, total: 1, pageSize: 10, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
        }

        this.total = 1;
        this.pageSize = 10;
        this.dataSource = props.dataSource.slice();

        this._onClick = this._onClick.bind(this);
        this.rowSelection = this.rowSelection.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onFilterSearchChange = this._onFilterSearchChange.bind(this);
        this._onFilterStatusChange = this._onFilterStatusChange.bind(this);
        this._removeApi = this._removeApi.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource !== this.props.dataSource) {
            this.dataSource = nextProps.dataSource.slice();
            var dataSource = [];
            nextProps.dataSource.map((element) => {
                dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
            })
            this.total = dataSource.length;
            this.pageSize = 10;
            this.setState({
                dataSource: dataSource,
                pagination: { current: 1, total: Math.ceil(dataSource.length / 1), pageSize: 10, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
            })
        }
    }
    //**************************************************************************** */
    //************************************EVENT*********************************** */
    //**************************************************************************** */
    _getDataSource(current, pageSize, searchText, filterStatus) {
        var dataSource = [];
        var temp;
        var min = pageSize * (current - 1)
        var max = min + pageSize - 1
        if (searchText == null) {
            searchText = this.state.searchText;
        }

        if (filterStatus == null) {
            filterStatus = this.state.filterStatus;
        }
        if ((searchText == null || searchText == '') && filterStatus == '-1') {//全部
            this.dataSource.map((element, index) => {
                if (index >= min && index <= max) {
                    dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                }
            })
            temp = this.dataSource;
        } else if (searchText != null && filterStatus != null) {//url搜索且状态过滤
            var condition;
            if (filterStatus == '-1') {
                condition = ['uri', 'like', searchText]
            } else {
                condition = [['uri', 'like', searchText], '&&', ['state', '==', filterStatus]];
            }
            temp = QuickSearch.query(this.dataSource, condition)
            temp.map((element, index) => {
                if (index >= min && index <= max) {
                    dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                }
            })
        } else if (searchText != null) {//url搜索
            temp = QuickSearch.query(this.dataSource, ['uri', 'like', searchText])
            temp.map((element, index) => {
                if (index >= min && index <= max) {
                    dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                }
            })
        } else {//状态匹配
            if (filterStatus == '-1') {//全部
                this.dataSource.map((element, index) => {
                    if (index >= min && index <= max) {
                        dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                    }
                })
                temp = dataSource;
            } else {//单个
                temp = QuickSearch.query(this.dataSource, ['state', '==', filterStatus])
                temp.map((element, index) => {
                    if (index >= min && index <= max) {
                        dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                    }
                })
            }
        }
        return { dataSource: dataSource, total: temp.length };
    }

    _getColumn() {
        return [{
            title: '服务名称',
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
                        <Col span={6} style={{ color: METHOD_COLORS[record.methods] }}>{record.methods}</Col>
                        <Col span={18}><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Col>
                    </Row>
                )
            }
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            width: '20%',
            render: (text, record) => {
                return (
                    <Row>
                        <Col span={24}><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Col>
                    </Row>
                )
            }
        }, {
            title: '服务状态',
            dataIndex: 'state',
            key: 'state',
            width: '15%',
            render: (text, record) => {
                return (
                    <Row>
                        <Col span={24}><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{SERVER_STATUS[text] || text}</Ellipsis></Col>
                    </Row>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'options',
            key: 'options',
            width: '10%',
            render: (text, record) => {
                return (
                    <div>
                        <a onClick={() => this._removeApi(record.id)}>删除</a>
                    </div>
                )
            }
        }];
    }

    _onChange(pagination, filters, sorter) {
        var dataSource = this._getDataSource(pagination.current, pagination.pageSize);
        this.setState({
            dataSource: dataSource.dataSource,
            pagination: { current: pagination.current, total: pagination.total, pageSize: pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
        })
    }

    _onClick() {
        var result = [];
        for (var i = 0; i < this.state.selectedRowKeys.length; i++) {
            var element = this.state.selectedRowKeys[i];
            var methods = element.split('|')[0];
            var uri = element.split('|')[1];
            for (const key in this.dataSource) {
                const element = this.dataSource[key];
                if (element.methods == methods && element.uri == uri) {
                    result.push(element);
                    break;
                }
            }
        }
        this.props.onNextSetp && this.props.onNextSetp(result);
    }

    _onFilterSearchChange(e) {
        var dataSource = this._getDataSource(1, this.state.pagination.pageSize, e.target.value, null);
        var pagination = { current: 1, total: dataSource.total, pageSize: this.state.pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, }
        this.setState({
            dataSource: dataSource.dataSource,
            pagination: pagination,
            searchText: e.target.value
        })
    }

    _onFilterStatusChange(e) {
        var dataSource = this._getDataSource(1, this.state.pagination.pageSize, null, e.target.value);
        var pagination = { current: 1, total: dataSource.total, pageSize: this.state.pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, }

        this.setState({
            dataSource: dataSource.dataSource,
            pagination: pagination,
            filterStatus: e.target.value
        })
    }

    _removeApi(id) {
        var methods = id.split('|')[0];
        var uri = id.split('|')[1];
        var temp = [];
        for (const key in this.dataSource) {
            const element = this.dataSource[key];
            if (element.methods == methods && element.uri == uri) {
            } else {
                temp.push(element);
            }
        }
        this.dataSource = temp;
        var dataSource = this._getDataSource(this.state.pagination.current, this.state.pagination.pageSize, null, null);
        this.setState({
            dataSource: dataSource.dataSource,
            pagination: { current: this.state.pagination.current, total: dataSource.total, pageSize: this.state.pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, }
        })
    }

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
    //**************************************************************************** */
    //*************************************UI************************************* */
    //**************************************************************************** */


    render() {
        if (this.props.display == false) {
            return null;
        }
        return (
            <Col span={22} offset={1} style={{ paddingTop: 30 }}>
                <Row type={'flex'} span={24} align='middle' style={{ marginBottom: 10 }}>
                    <Col span={8} >服务预览列表</Col>
                    <Col span={10}>
                        <Radio.Group value={this.state.filterStatus} onChange={this._onFilterStatusChange} size="default">
                            <Radio.Button value="0">已存在</Radio.Button>
                            <Radio.Button value="3">可更新</Radio.Button>
                            <Radio.Button value="2">可导入</Radio.Button>
                            <Radio.Button value="-1">全部</Radio.Button>
                        </Radio.Group>
                    </Col>
                    <Col span={6}>
                        <Col span={24}><Input onChange={this._onFilterSearchChange} value={this.state.searchText} placeholder="请输入" /></Col>
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
                    onChange={this._onChange}
                    scroll={{x: true, y: 200}}
                    size={'small'}
                />
                <Row type="flex" justify={'center'} style={{ marginTop: 20 }}><Col><Button onClick={() => { this._onClick() }} type="primary">下一步</Button></Col></Row>

            </Col>
        )
    }
}