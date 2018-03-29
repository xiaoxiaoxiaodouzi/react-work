import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button, Alert, Table, Select, Divider, Icon, Dropdown, Menu, TreeSelect } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import ServerImport from './ServerImport';
import { getServicesApis, removeServicesApis } from '../../../services/api';

const TreeNode = TreeSelect.TreeNode;

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
    static defaultProps = {
        appId: '0',
        editable: true
    };

    static propTypes = {
        appId: PropTypes.string,
        upstream: PropTypes.string,
        editable: PropTypes.bool
    };

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
        this._hasChange = this._hasChange.bind(this);
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
            condition = {};
            if (this.state.searchText != null) {
                condition.nameorurl = this.state.searchText;
            }
            if (this.state.filterMethod != null) {
                condition.method = this.state.filterMethod;
            }
        }

        getServicesApis(appId, page, rows, condition)
            .then((response) => {
                var pagination = { current: response.pageIndex, total: response.total, pageSize: response.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, };
                this.setState({
                    dataSource: response.contents,
                    pagination: pagination
                })

                this.setState({
                    tags: [{
                        label: '应用1',
                        value: '0-0',
                        key: '0-0',
                        children: [{
                            label: '标签1',
                            value: '0-0-1',
                            key: '0-0-1',
                        }, {
                            label: '标签2',
                            value: '0-0-2',
                            key: '0-0-2',
                        }],
                    }, {
                        label: '应用2',
                        value: '0-1',
                        key: '0-1',
                    }]
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
            title: '级别',
            dataIndex: 'visibil ity',
            key: 'visibility',
            width: '70px',
            render: (text, record) => {
                return (
                    <Row>
                        <Col>{text == '1' ? '普通' : text == '2' ? '公开' : '私有'}</Col>
                    </Row>
                )
            }
        }, {
            title: '统计',
            dataIndex: 'grantion',
            key: 'grantion',
            width: '130px',
            align: 'right',
            render: (text, record) => {
                return (
                    <Row>
                        <Col>10万 | 100ms</Col>
                    </Row>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'options',
            key: 'options',
            width: '147px',
            render: (text, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item>
                            <a>配置</a>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item>
                            <a onClick={() => this._removeApi(record.id)}>删除</a>
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <Fragment>
                        <a >文档</a>
                        <Divider type="vertical" />
                        <Dropdown overlay={menu}>
                            <a >
                                更多 <Icon type="down" />
                            </a>
                        </Dropdown>
                    </Fragment>
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

    _hasChange() {
        this._pullData(this.props.appId, 1, 10);
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
                <Row style={{ paddingBottom: 20 }}>
                   
                    <Col span={4} style={{ paddingRight : 12}}>
                        <TreeSelect
                            style={{ width: '100%' }}
                            value={this.state.value}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.state.tags}
                            placeholder="选择应用和标签"
                            treeDefaultExpandAll
                            onChange={this.onChange}
                        />
                    </Col>
                    <Col span={4} style={{ paddingRight : 12}}>
                        <Select style={{ width: '100%' }} value={this.state.filterMethod} onSelect={(value) => { this.setState({ filterMethod: value }) }} placeholder={'请选择'}>
                            {OPTIONS.map((element) => {
                                return (<Select.Option value={element}>{element}</Select.Option>)
                            })}
                        </Select>
                    </Col>
                    <Col span={16}>
                            <Input onChange={(e) => { this.setState({ searchText: e.target.value }) }} value={this.state.searchText} placeholder="请输入" />
                    </Col>
                  
                </Row>
                { 
                    this.props.editable ?
                        <Row>
                            <Row type={'flex'} style={{ paddingBottom: 20 }}>
                                <ServerImport appId={this.props.appId} upstream={this.props.upstream} hasChange={this._hasChange} />
                                <Button style={{ marginLeft: 20, marginRight: 10 }}>添加</Button>
                                <Button onClick={() => { alert('接口暂未支持') }} style={{ marginLeft: 10, marginRight: 10 }}>删除</Button>
                            </Row>
                        <Alert style={{ marginBottom: 10 }} type="info" showIcon message={<Fragment>
                                已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                        <a onClick={() => { this.setState({ selectedRowKeys: [] }) }} style={{ marginLeft: 24 }}>清空</a>
                            </Fragment>} />  
                        </Row>
                                    : null 
                }
        <Table
                    rowKey="id"
                    selection={this.rowSelection()}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            columns={this._getColumn()}
            onChange={this._onChange} />
            </ div>
            )

    }
}