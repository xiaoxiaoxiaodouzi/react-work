import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Modal, Alert, Table, Select, message, Form } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import { getUnAuthorizedServicesApis, getAppsList } from '../../../services/api';
import { base } from '../../../services/base';
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';
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
            pagination: { current: 1, total: 1, pageSize: 1,showTotal:this.showTotal, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
        }

        this._onClick = this._onClick.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onOk = this._onOk.bind(this);
        this.rowSelection = this.rowSelection.bind(this);
        this._onChange = this._onChange.bind(this);
        this._clear = this._clear.bind(this);
        this._search = this._search.bind(this);

        this.appName = '';
    }
	showTotal =() => `共 ${this.state.pagination.total} 条记录  第 ${this.state.pagination.current}/${Math.ceil(this.state.pagination.total/this.state.pagination.pageSize)} 页 `;


    componentDidMount() {
        this._getApps(this.props.appId);
    }

    //**************************************************************************** */
    //************************************EVENT*********************************** */
    //**************************************************************************** */

    _getApps = (appId) =>{
        getAppsList()
            .then((response) => {
                if(appId){
                    this.setState({ apps: response });
                }else{
                    let apps = [];
                    for(let app in response ){
                        if(response[app].id !== appId){
                            apps.push(response[app]);
                        }
                    }
                    this.setState({ apps: apps });
                }
                
            })
    }
    _pullData(appId, page, rows = 10, condition) {
        this.page = page;
        this.rows = rows;
        if (condition) {
            if (this.state.searchText) {
                condition.nameorurl = this.state.searchText;
            }
            if (this.state.filterMethod) {
                condition.method = this.state.filterMethod;
            }
            if (this.state.filterApp) {
                condition.searchAppId = this.state.filterApp;
            }
        }
 
        getUnAuthorizedServicesApis(appId, page, rows, condition)
            .then((response) => {
                let pagination = { current: response.pageIndex, total: response.total, pageSize: response.pageSize, showSizeChanger: true, showQuickJumper: true, };
                //算法计算分页显示数据
                if(0<response.total && response.total<=20){
                    pagination.pageSizeOptions=[response.total]
                }else if(20<response.total && response.total<=30){
                    pagination.pageSizeOptions=['10',response.total]
                }else if(30<response.total && response.total<=50){
                    pagination.pageSizeOptions=['10','20',response.total]
                }else if(50<response.total){
                    pagination.pageSizeOptions=['10','20','30',response.total]
                }
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
            render: (text, record) => <Ellipsis lines={1} tooltip={true}>{text}</Ellipsis>
        }];
    }

    _onChange(pagination, filters, sorter) {
        this._pullData(this.props.appId, pagination.current, pagination.pageSize, {});
    }

    _onClick() {
        let selectedRowKeys = this.props.selectedRowKeys || [];
        this.setState({
            searchText: null,
            filterApp: null,
            filterMethod: null,
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
        if (this.state.selectedRowKeys.length > 0) {
            this.props.onChange && this.props.onChange(this.state.selectedRowKeys);
            this.setState({
                visible: false
            })
        } else {
            message.warn('请选择需要授权的服务');
        }

    }

    _search() {
        this._pullData(this.props.appId, 1, this.rows, {})
    }

    _clear() {
        this._pullData(this.props.appId, this.page, this.rows)
        this.setState({
            filterMethod: null,
            searchText: null,
            filterApp: null
        })
    }

    _handleChange(value) {
        this.appName = value;
    }
    //**************************************************************************** */
    //*************************************UI************************************* */
    //**************************************************************************** */
    rowSelection() {

        let obj = {
            selectedRowKeys: this.state.selectedRowKeys,
            onSelect: (record, selected, selectedRows, nativeEvent) => {
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
            },
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
    };

    render() {
        const Authorized = RenderAuthorized(base.allpermissions);
        return (
            <div>
                <Authorized authority='app_serviceAuthorization' noMatch={null}>
                    <Button type="primary" onClick={() => { this._onClick() }}>+ 授权</Button>
                </Authorized>
                <Modal
                    title={'服务授权'}
                    visible={this.state.visible}
                    onCancel={this._onCancel}
                    onOk={this._onOk}
                    width={1110}
                    destroyOnClose={true} >
                    <Form>

                        <Row style={{ marginBottom: 10 }}>
                            <Col span={6}>
                                <Row type={'flex'} align='middle'>
                                    <Col span={4}>应用:</Col>
                                    <Col span={18}>
                                        <Select
                                            showSearch
                                            value={this.state.filterApp}
                                            allowClear={true}
                                            style={{ width: '100%' }}
                                            optionFilterProp="children"
                                            placeholder={'请选择'}
                                            onSelect={(value) => { this.setState({ filterApp: value }) }}
                                            onChange={(value) => { this.setState({ filterApp: value }) }}
                                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                        >
                                            {this.state.apps.map((element, index) => {
                                                return (<Select.Option key={index} value={element.id}>{element.name}</Select.Option>)
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
                                            {OPTIONS.map((element, index) => {
                                                return (<Select.Option key={index} value={element}>{element}</Select.Option>)
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
                                    <Col><Button type="primary" htmlType="submit" onClick={() => this._search()}>查询</Button></Col>
                                    <Col><Button style={{ marginLeft: 10 }} onClick={() => this._clear()}>重置</Button></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
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
                        size='small'
                        scroll={{ y: 240 }}
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