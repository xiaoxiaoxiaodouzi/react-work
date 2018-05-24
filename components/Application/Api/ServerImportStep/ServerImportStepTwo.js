import React, { Fragment } from 'react';
import { Row, Col, Input, Radio, Alert, Table } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import QuickSearch from '../../../../utils/quickSearch';
import SetpBar from './SetpBar';

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

        this.dataSource = props.dataSource.slice();

        this._onClick = this._onClick.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this.rowSelection = this.rowSelection.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onFilterSearchChange = this._onFilterSearchChange.bind(this);
        this._onFilterStatusChange = this._onFilterStatusChange.bind(this);
        this._removeApi = this._removeApi.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource !== this.props.dataSource) {
            this.dataSource = nextProps.dataSource.slice();
            let dataSource = [];
            nextProps.dataSource.forEach((element) => {
                dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
            })
            this.setState({
                dataSource: dataSource,
                pagination: { current: 1, total: Math.ceil(dataSource.length / 1), pageSize: 10, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
            })
        }
    }
    //**************************************************************************** */
    //************************************EVENT*********************************** */
    //**************************************************************************** */
    /**
     * 获取过滤数据结果
     * @param {*} current 当前页面 
     * @param {*} pageSize 分页大小
     * @param {*} searchText 名称关键字
     * @param {*} filterStatus 状态
     */
    _getDataSource(current, pageSize, searchText, filterStatus) {
        current = 1;
        pageSize = this.dataSource.length;
        let dataSource = [];
        let temp;
        let min = pageSize * (current - 1)
        let max = min + pageSize - 1
        if (!searchText) {
            searchText = this.state.searchText;
        }

        if (!filterStatus) {
            filterStatus = this.state.filterStatus;
        }
        if (!searchText && filterStatus === '-1') {//全部
            this.dataSource.forEach((element, index) => {
                if (index >= min && index <= max) {
                    dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                }
            })
            temp = this.dataSource;
        } else if (searchText && filterStatus) {//url搜索且状态过滤
            let condition;
            if (filterStatus === '-1') {
                condition = ['uri', 'like', searchText]
            } else {
                condition = [['uri', 'like', searchText], '&&', ['state', '==', filterStatus]];
            }
            temp = QuickSearch.query(this.dataSource, condition)
            temp.forEach((element, index) => {
                if (index >= min && index <= max) {
                    dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                }
            })
        } else if (searchText) {//url搜索
            temp = QuickSearch.query(this.dataSource, ['uri', 'like', searchText])
            temp.forEach((element, index) => {
                if (index >= min && index <= max) {
                    dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                }
            })
        } else {//状态匹配
            if (filterStatus === '-1') {//全部
                this.dataSource.forEach((element, index) => {
                    if (index >= min && index <= max) {
                        dataSource.push(Object.assign({}, element, { id: element.methods + "|" + element.uri }))
                    }
                })
                temp = dataSource;
            } else {//单个
                temp = QuickSearch.query(this.dataSource, ['state', '==', filterStatus])
                temp.forEach((element, index) => {
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
        let dataSource = this._getDataSource(pagination.current, pagination.pageSize);
        this.setState({
            dataSource: dataSource.dataSource,
            pagination: { current: pagination.current, total: pagination.total, pageSize: pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
        })
    }

    _onClick() {
        let result = [];
        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
            let element = this.state.selectedRowKeys[i];
            let methods = element.split('|')[0];
            let uri = element.split('|')[1];
            for (const key in this.dataSource) {
                const element = this.dataSource[key];
                if (element.methods === methods && element.uri === uri) {
                    result.push(element);
                    break;
                }
            }
        }
        this.props.onNextSetp && this.props.onNextSetp(result);
    }

    _onFilterSearchChange(e) {
        let dataSource = this._getDataSource(1, this.state.pagination.pageSize, e.target.value, null);
        let pagination = { current: 1, total: dataSource.total, pageSize: this.state.pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, }
        this.setState({
            dataSource: dataSource.dataSource,
            pagination: pagination,
            searchText: e.target.value
        })
    }

    _onFilterStatusChange(e) {
        let dataSource = this._getDataSource(1, this.state.pagination.pageSize, null, e.target.value);
        let pagination = { current: 1, total: dataSource.total, pageSize: this.state.pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, }

        this.setState({
            dataSource: dataSource.dataSource,
            pagination: pagination,
            filterStatus: e.target.value
        })
    }

    _removeApi(id) {
        let methods = id.split('|')[0];
        let uri = id.split('|')[1];
        let temp = [];
        for (const key in this.dataSource) {
            const element = this.dataSource[key];
            if (element.methods === methods && element.uri === uri) {
            } else {
                temp.push(element);
            }
        }
        this.dataSource = temp;
        let dataSource = this._getDataSource(this.state.pagination.current, this.state.pagination.pageSize, null, null);
        this.setState({
            dataSource: dataSource.dataSource,
            pagination: { current: this.state.pagination.current, total: dataSource.total, pageSize: this.state.pagination.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, }
        })
    }

    _onSelect(record, selected, selectedRows, nativeEvent) {
        if (selected == null) {
            selected = true;
            for (var n = 0; n < this.state.selectedRowKeys.length; n++) {
                var element = this.state.selectedRowKeys[n];
                if (record.id === element) {
                    selected = false;
                    break;
                }
            }
        }
        if (selected) {
            let isExist = false;
            for (let n = 0; n < this.state.selectedRowKeys.length; n++) {
                if (record.id === this.state.selectedRowKeys[n]) {
                    isExist = true;
                }
            }
            if (isExist) {
                return;
            }
            let selectedRowKeys = this.state.selectedRowKeys.slice();
            selectedRowKeys.push(record.id)
            this.setState({
                selectedRowKeys: selectedRowKeys
            })
        } else {
            let rowsKeys = [];
            for (let n = 0; n < this.state.selectedRowKeys.length; n++) {
                if (record.id !== this.state.selectedRowKeys[n]) {
                    rowsKeys.push(this.state.selectedRowKeys[n]);
                }
            }
            this.setState({
                selectedRowKeys: rowsKeys
            })
        }
    }

    rowSelection() {

        let obj = {
            selectedRowKeys: this.state.selectedRowKeys,
            onSelect: this._onSelect,
            onSelectAll: (selected, selectedRows, changeRows) => {
                let rowKeys = [];
                if (selected) {
                    rowKeys = this.state.selectedRowKeys.slice();
                    for (let n = 0; n < selectedRows.length; n++) {
                        let newSelected = selectedRows[n];
                        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
                            if (this.state.selectedRowKeys[i] === selectedRows[n].id) {
                                newSelected = null
                                break;
                            }
                        }
                        if (newSelected) {
                            rowKeys.push(newSelected.id);
                        }
                    }
                } else {
                    for (let n = 0; n < this.state.selectedRowKeys.length; n++) {
                        let newSelected = null;
                        for (let i = 0; i < changeRows.length; i++) {
                            if (this.state.selectedRowKeys[n] === changeRows[i].id) {
                                newSelected = this.state.selectedRowKeys[n];
                            }
                        }
                        if (!newSelected) {
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
                        columns={this._getColumn()}
                        pagination={false}
                        onRow={(record) => {
                            return {
                                onClick: () => { this._onSelect(record) },       // 点击行
                            }
                        }}
                        onChange={this._onChange}
                        scroll={{ x: true, y: 200 }}
                        size={'small'}
                    />
                </Col>
                <Col span={24}>
                    <SetpBar onPreviousStep={() => {this.props.onPreviousStep()}} onNextStep={() => { this._onClick() }} style={{ marginTop: 20 }} />
                </Col>
            </Col>
        )
    }
}