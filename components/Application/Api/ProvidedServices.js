import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { Row,Col,Input,Button,Alert,Table,Select,Divider,Icon,Dropdown,Menu,TreeSelect,Form,Modal,Radio,message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import ServerImport from './ServerImport';
import ServerAddModal from '../../../components/Application/Api/ServerAddModal';
import { removeServicesApis,queryAllGroups,queryAllServices,queryTags,removeServicesApisBatch } from '../../../services/api';
import TreeHelp from '../../../utils/TreeHelp';
import constants from '../../../services/constants';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
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
const isOpenList = [{
    key:'0',name:'所有服务'
  },{
    key:'1',name:'普通服务'
  },{
    key:'2',name:'公开服务'
  }];
export default class ProvidedServices extends React.Component {
    static defaultProps = {
        appId: '0',
        editable: true
    };
    gourpId = '';
    data = [];
    static propTypes = {
        appId: PropTypes.string,
        upstream: PropTypes.string,
        editable: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            loading:false,
            treeData: [],
            dataSource: [],
            selectedRowKeys: [],
            name: '',
            isOpen:'0',
            uri:'',
            filterMethod:'',
            isServerAddModalShow:false,
            expandForm:false,
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
        if(this.props.editable){
            this.groupId = this.props.appId;
            queryTags(this.groupId)
                .then((response) => {
                    let treeData = TreeHelp.toChildrenStruct(response);
                    this.setState({treeData})
                })
            this._pullData(this.groupId, 1, 10);
        }else{ 
            this.groupId = '0';
            queryAllGroups().then(data=>{
                this.data = data.slice();
                console.log('servicemanagement',data);
                let treeData = TreeHelp.toChildrenStruct(data);
                this.setState({treeData});
            });
            this._pullData(this.groupId, 1, 10);
        }
    }
    //**************************************************************************** */
    //************************************EVENT*********************************** */
    //**************************************************************************** */
    _pullData(groupId, page, rows) {
        let { filterMethod,name,uri,value} = this.state;
        if(!this.props.editable){
            if(value && this.data.filter(element=>element.id===value)[0].pid === '0'){
                groupId = value;
                value = '';
            }else if(value){
                groupId = this.data.filter(element=>element.id===value)[0].pid;
            }
        }
        this.setState({loading:true});
        queryAllServices(groupId,page,rows,value,filterMethod,name,uri).then(response=>{
            let pagination = { current: response.pageIndex, total: response.total, pageSize: response.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, };
            this.setState({
                dataSource: response.contents,
                pagination: pagination,
                loading:false,
            })
        }).catch(()=>{
            this.setState({loading:false});
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
            title: '方法',
            dataIndex: 'methods',
            key: 'methods',
            width: '10%',
            render: (text, record) => {
                return (
                    <Row>
                        <Col style={{ color: METHOD_COLORS[record.methods] }}>{record.methods}</Col>
                    </Row>
                )
            }
        }, {
            title: '路径',
            dataIndex: 'uri',
            key: 'uri',
            width: '25%',
            render: (text, record) => {
                return (
                    <Row>
                        <Col><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Col>
                    </Row>
                )
            }
        }, {
            title: '级别',
            dataIndex: 'visibility',
            key: 'visibility',
            width: '70px',
            render: (text, record) => {
                return (
                    <Row>
                        <Col>{text === '1' ? '普通' : text === '2' ? '公开' : '私有'}</Col>
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
                            <Link to={`/apps/${this.props.appId}/apis/${record.id}`}>配置</Link>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item>
                            <a onClick={() => {
                                if(record.appNumber){
                                    message.error(`[${record.name}]服务已经授权，不可删除`)
                                    return;
                                }
                                this.showDeleteConfirm(record)
                                
                            }}>删除</a>
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <Fragment>
                        <a href={`${constants.SWAGGER_URL}?group=${record.groupId}&id=${record.id}`} target="_blank">文档调试</a>
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
        this._pullData(this.groupId, pagination.current, pagination.pageSize);
    }

    _removeApi(apiId) {
        removeServicesApis(this.props.appId, apiId)
            .then((response) => {
                this._pullData(this.groupId, this.page, this.rows)
            })
    }

    _removeApis(apiIds) {
        let appIdsStr = apiIds.join('&ids=');
        removeServicesApisBatch(this.props.appId, appIdsStr)
            .then((response) => {
                this.setState({
                    selectedRowKeys: []
                })
                this._pullData(this.groupId, this.page, this.rows)
            })
    }

    _search() {
        this._pullData(this.groupId, this.page, this.rows, {})
    }

    _clear() {
        this._pullData(this.groupId, this.page, this.rows)
        this.setState({
            filterMethod: null,
            name: null
        })
    }

    _hasChange() {
        this._pullData(this.groupId, 1, 10);
    }
    //**************************************************************************** */
    //*************************************UI************************************* */
    //**************************************************************************** */
    showDeleteConfirm = (record)=> {
        confirm({
          title: '是否删除此服务?',
          content: `待删除服务：${record.name}`,
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          onOk:()=> {
            this._removeApi(record.id)
          },
          onCancel:()=> {
          },
        });
    }
    showDeleteConfirms = ()=> {
        let selectedRowKeys = this.state.selectedRowKeys;
        confirm({
          title: '是否删除选中服务?',
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          onOk:()=> {
            this._removeApis(selectedRowKeys)
          },
          onCancel:()=> {
          },
        });
    }
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
                        if (newSelected != null) {
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
    onCloseModal = (flag)=>{
        if(flag){
            if(this.props.editable){
                queryTags(this.groupId)
                    .then((response) => {
                        let treeData = TreeHelp.toChildrenStruct(response);
                        this.setState({treeData})
                    })
            }else{ 
                queryAllGroups().then(data=>{
                    this.data = data.slice();
                    console.log('servicemanagement',data);
                    let treeData = TreeHelp.toChildrenStruct(data);
                    this.setState({treeData});
                });
            }
            this._pullData(this.groupId,1,10);
        }
        this.setState({isServerAddModalShow:false});
    }
    renderSimpleForm= ()=>{
        return (

            <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ paddingBottom: 16 }}>
                    <Col md={8} sm={24}>
                    <FormItem label="组&标签">
                        <TreeSelect
                            style={{ width: '100%' }}
                            value={this.state.value}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.state.treeData}
                            placeholder="选择服务组和标签"
                            onChange={(value)=> this.setState({ value })}
                        />
                    </FormItem>
                    </Col>

                    <Col md={8} sm={24}>
                    <FormItem label="服务名称">
                        <Input 
                            onChange={(e) => { this.setState({ name: e.target.value.trim() }) }} value={this.state.name} 
                            placeholder="请输入服务名称" />
                    </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                    <span style={{ float: 'right'}}>
                        <Button 
                            onClick={()=>{
                                this._pullData(this.groupId,1,10)}} 
                            style={{marginRight:8}} type='primary'>查询</Button>
                        <Button 
                            onClick={() => this.setState({uri:'',name:'',filterMethod:'',value:''},()=>this._pullData(this.groupId,1,10)) } 
                        >重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={() => {
                                this.setState({
                                expandForm: true,
                                });
                            }}>
                            展开 <Icon type="down" />
                        </a>
                    </span>
                    </Col>
                </Row>
            </Form>
        )
    }
    renderExpandForm = ()=>{
        return (
            <Form >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ paddingBottom: 16 }}>
                    <Col md={8} sm={24}>
                    <FormItem label="组&标签">
                        <TreeSelect
                            style={{ width: '100%' }}
                            value={this.state.value}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.state.treeData}
                            placeholder="选择服务组和标签"
                            onChange={(value)=> this.setState({ value })}
                        />
                    </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                    <FormItem label="服务名称">
                        <Input 
                            onChange={(e) => { this.setState({ name: e.target.value.trim() }) }} value={this.state.name} 
                            placeholder="请输入服务名称" />
                    </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                    <FormItem label="服务路径">
                        <Input 
                            onChange={(e) => { this.setState({ uri: e.target.value.trim() }) }} value={this.state.uri} 
                            placeholder="请输入服务路径" />
                    </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ paddingBottom: 20 }}>
                    <Col md={8} sm={24}>
                    <FormItem label="请求方法">
                        <Select style={{ width: '100%' }} 
                            placeholder="选择服务请求方法"
                            value={this.state.filterMethod} 
                            onChange={(value) => { 
                                this.setState({ filterMethod: value })
                            }} >
                            {OPTIONS.map((element) => {
                                return (<Select.Option key={element} value={element}>{element}</Select.Option>)
                            })}
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right',marginBottom: 16}}>
                        <Button 
                            onClick={()=>{
                                this._pullData(this.groupId,1,10)}} 
                            style={{marginRight:8}} type='primary'>查询</Button>
                        <Button 
                            onClick={() => this.setState({uri:'',name:'',filterMethod:'',value:''},()=>this._pullData(this.groupId,1,10)) } 
                        >重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={() => {
                                this.setState({
                                    expandForm: false,
                                });
                            }}>
                            收起 <Icon type="up" />
                        </a>
                    </span>
                </div>
            </Form>
        )
    }
    render() {
        return (
            <div>
                <ServerAddModal 
                    groups={this.data.filter(element=>element.isParent===true)}
                    editable={this.props.editable}
                    appId={this.props.appId}
                    onCloseModal={this.onCloseModal} 
                    isServerAddModalShow={this.state.isServerAddModalShow} />
                <div className="tableList">
                {this.state.expandForm?this.renderExpandForm():this.renderSimpleForm()}
                </div>
                <Row>
                    <Row type={'flex'} style={{ marginBottom: 16 }}>
                        <ServerImport appId={this.props.appId} upstream={this.props.upstream} hasChange={this._hasChange} />
                        <Button onClick={()=>this.setState({isServerAddModalShow:true})} style={{ marginLeft: 8, marginRight: 8 }}>添加</Button>
                        {this.props.editable?
                            <Fragment>
                                {/* <Button onClick={() => this.showDeleteConfirms()} style={{ marginRight: 8 }}>删除</Button> */}
                                <Button onClick={() => this.setState({visibleFile:true}) }>文档调试</Button>
                                <Modal
                                    title="文档预览"
                                    okText='预览'
                                    visible={this.state.visibleFile}
                                    onOk={()=>{
                                        this.setState({visibleFile:false});
                                        window.open(`${constants.SWAGGER_URL}?group=${this.props.appId}&visibility=${this.state.isOpen}`,'_blank');
                                    }}
                                    onCancel={ () => this.setState({visibleFile:false}) }
                                    >
                                    <Row type={'flex'} align='middle'>
                                        <Col span={4}>服务类型:</Col><Col span={18}>
                                        <RadioGroup value={this.state.isOpen} onChange={(e)=>this.setState({isOpen:e.target.value})}>
                                            {isOpenList.map((element,index)=> {
                                                return <Radio key={index} value={element.key}>{element.name}</Radio>
                                            })}
                                        </RadioGroup>
                                        </Col>
                                    </Row>
                                </Modal>
                            </Fragment>
                        :''
                        }
                    </Row>
                <Alert style={{ marginBottom: 16 }} type="info" showIcon message={<Fragment>
                        已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={() => { this.setState({ selectedRowKeys: [] }) }} style={{ marginLeft: 24 }}>清空</a>
                    </Fragment>} />  
                </Row>
                <Table
                    loading={this.state.loading}
                    rowKey="id"
                    rowSelection={this.rowSelection()}
                    dataSource={this.state.dataSource}
                    pagination={this.state.pagination}
                    columns={this._getColumn()}
                    onChange={this._onChange} />
            </ div>
        )
    }
}