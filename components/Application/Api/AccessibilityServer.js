import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Alert, Table, Select, Modal ,Form} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis'
import ServerManager from './ServerManager';
import { getAccessibilityServicesApis, addAuthorizedServicesApis, removeAuthorizedServicesApis, removeServicesApis } from '../../../services/api'
import { base } from '../../../services/base';
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';
const confirm = Modal.confirm;
// const RadioGroup = Radio.Group;
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
// const isOpenList = [{
//     key:'0',name:'所有服务'
//   },{
//     key:'1',name:'普通服务'
//   },{
//     key:'2',name:'公开服务'
//   }];
export default class ProvidedServices extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			dataSource: [],
			isOpen: '0',
			selectedRowKeys: [],
			searchText: null,
			filterMethod: null,
			pagination: { current: 1, total: 1, pageSize: 1, pageSizeOptions: ['10', '20', '30', '50'],showTotal:this.showTotal, showSizeChanger: true, showQuickJumper: true, },
		}

		this._removeApi = this._removeApi.bind(this);
		this.rowSelection = this.rowSelection.bind(this);
		this._onChange = this._onChange.bind(this);
		this._clear = this._clear.bind(this);
		this._search = this._search.bind(this);
		this._addServerApis = this._addServerApis.bind(this);
		this._removeServerApis = this._removeServerApis.bind(this);
	}
	showTotal =() => `共 ${this.state.pagination.total} 条记录  第 ${this.state.pagination.current}/${Math.ceil(this.state.pagination.total/this.state.pagination.pageSize)} 页 `;

	componentDidMount() {
		this._pullData(this.props.appId, 1, 10);
	}

	//**************************************************************************** */
	//************************************EVENT*********************************** */
	//**************************************************************************** */
	_pullData(appId, page, rows) {

		this.page = page;
		this.rows = rows;
		let condition = {};
		if (this.state.searchText != null) {
			condition.nameorurl = this.state.searchText;
		}
		if (this.state.filterMethod != null) {
			condition.method = this.state.filterMethod;
		}
		this.setState({ loading: true });
		getAccessibilityServicesApis(appId, page, rows, condition)
			.then((response) => {
				let dataSource = [];
				let contents = response.contents;
				contents.forEach(element => {
					dataSource.push(element.service);
				});
				let pagination = { current: response.pageIndex, total: response.total, pageSize: response.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, };
				this.setState({
					dataSource: dataSource,
					pagination: pagination,
					loading: false
				})
			}).catch(() => {
				this.setState({ loading: false });
			})
	}

	_getColumn() {
		const Authorized = RenderAuthorized(base.allpermissions);
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
			title: '服务公开级别',
			dataIndex: 'visibility',
			key: 'visibility',
			width: '130px',
			render: (text, record) => {
				return (
					<Row type={'flex'} justify="center">
						<Col>{text==='1'?'普通':(text==='0'?'私有':'公开')}</Col>

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
					<Authorized authority='app_serviceDebug' noMatch={<a disabled="true" href={`${base.currentEnvironment.authServerAddress}/ext/swagger/index.html?group=${record.groupId}&id=${record.id}`} target="_blank">文档调试</a>}>
						<a href={`${base.currentEnvironment.authServerAddress}/ext/swagger/index.html?group=${record.groupId}&id=${record.id}`} target="_blank">文档调试</a>
					</Authorized>
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
		this._pullData(this.props.appId, this.page, this.rows)
	}

	_clear() {
		this.setState({
			filterMethod: null,
			searchText: null
		}, () => this._pullData(this.props.appId, this.page, this.rows))
	}

	//新增授权
	_addServerApis(apiIds = []) {
		let appIdsStr = '';
		apiIds.forEach((element, index, arrays) => {
			appIdsStr += element;
			if (index < arrays.length - 1) {
				appIdsStr += ',';
			}
		});
		addAuthorizedServicesApis(this.props.appId, appIdsStr)
			.then((response) => {
				this._pullData(this.props.appId, this.page, this.rows)
			})

	}

	//移除授权
	_removeServerApis() {
		let apiIds = this.state.selectedRowKeys;
		let dataSource=this.state.dataSource;
		let pagination=this.state.pagination;
		//如果删除的是最后一行 并且删除了所有数据就往前一页查询
		if(dataSource.length===apiIds.length && pagination.current>1 && (pagination.total-pagination.current*pagination.pageSize <= 0)){
			this.page = pagination.current-1;
		}
		if (apiIds.length < 1) {
			return
		}
		let appIdsStr = '';
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
				this._pullData(this.props.appId, this.page, this.rows)
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
	showDeleteConfirms = () => {
		confirm({
			title: '是否删除选中服务?',
			okText: '删除',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => {
				this._removeServerApis()
			},
			onCancel: () => {
			},
		});
	}
	render() {
		const Authorized = RenderAuthorized(base.allpermissions);
		return (
			<div>
				<Form>


					<Row>
						<Col span={10}>
							<Row type={'flex'} align='middle'>
								<Col span={4}>名称/路径:</Col><Col span={18}><Input onChange={(e) => { this.setState({ searchText: e.target.value }) }} value={this.state.searchText} placeholder="请输入" /></Col>
							</Row>
						</Col>
						<Col span={10}>
							<Row type={'flex'} align={'middle'}>
								<Col span={4}>服务方法:</Col>
								<Col span={18}>
									<Select style={{ width: '100%' }} value={this.state.filterMethod} onSelect={(value) => { this.setState({ filterMethod: value }) }} placeholder={'请选择'}>
										{OPTIONS.map((element, index) => {
											return (<Select.Option key={index} value={element}>{element}</Select.Option>)
										})}
									</Select>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row type={'flex'} justify="end">
								<Col><Button type="primary" htmlType="submit" onClick={() => this._search()}>查询</Button></Col>
								<Col><Button style={{ marginLeft: 8 }} onClick={() => this._clear()}>重置</Button></Col>
							</Row>
						</Col>
					</Row>
					<Row type={'flex'} style={{ paddingTop: 16, paddingBottom: 16 }}>
						<ServerManager appId={this.props.appId} apiKey={this.props.apiKey} onChange={this._addServerApis} />
						<Authorized authority='app_deleteExternalService' noMatch={null}>
							<Button onClick={() => { this.showDeleteConfirms() }} style={{ marginLeft: 8, marginRight: 8 }}>删除</Button>
						</Authorized>
						{/* <Button onClick={() => this.setState({visibleFile:true}) }>文档调试</Button>
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
                    </Modal> */}
					</Row>
				</Form>
				<Alert
					style={{ marginBottom: 8 }}
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
					loading={this.state.loading}
					rowSelection={this.rowSelection()}
					dataSource={this.state.dataSource}
					pagination={this.state.pagination}
					columns={this._getColumn()}
					onChange={this._onChange} />
			</div>
		)
	}
}