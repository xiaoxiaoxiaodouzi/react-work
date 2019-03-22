import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import  { Popconfirm,Row, Col, Input, Button, Table, Select, Divider, Icon, Dropdown, Menu, TreeSelect, Form, Modal, Radio, message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import ServerImport from './ServerImport';
import ServerAddModal from '../../../components/Application/Api/ServerAddModal';
import { removeServicesApis,clearAllApis, queryAllGroups, queryAllServices, queryAppTags, removeServicesApisBatch } from '../../../services/aip';
import TreeHelp from '../../../utils/TreeHelp';
import { base } from '../../../services/base';
import { GlobalHeaderContext } from '../../../context/GlobalHeaderContext'
import SynService from '../../../components/Application/Api/SynService'
import Authorized from '../../../common/Authorized';

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
	key: '0', name: '所有服务'
}, {
	key: '1', name: '普通服务'
}, {
	key: '2', name: '公开服务'
}];
//props.editable=false表示是全局服务列表，true是应用详情中对外提供服务列表，
//由于添加服务组件modal组件中全局列表应用名称可选择，而应用详情中应用名称为当前应用名称，无法修改
class ProvidedServices extends React.Component {

	gourpId = '';
	data = [];
	static propTypes = {
		appId: PropTypes.string,
		upstream: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			loading: false,
			treeData: [],
			dataSource: [],
			selectedRowKeys: [],
			name: '',
			isOpen: '0',
			uri: '',
			filterMethod: '',
			isServerAddModalShow: false,
			expandForm: false,
			clearAllLoading:false,
			synLoading:false,
			pagination: { current: 1, total: 1, showTotal: this.showTotal, pageSize: 1, totalPage: 1, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
		}

		this._removeApi = this._removeApi.bind(this);
		this.rowSelection = this.rowSelection.bind(this);
		this._onChange = this._onChange.bind(this);
		this._clear = this._clear.bind(this);
		this._search = this._search.bind(this);
		this._hasChange = this._hasChange.bind(this);
	}
	componentDidMount() {
		if (this.props.editable) {
			this.groupId = this.props.appId;
			this.getTags(this.groupId)
			this._pullData(this.groupId, 1, 10, this.props.tenant);
		} else {
			this.getAllTags(this.props.tenant);
			this._pullData(null, 1, 10, this.props.tenant);
		}
	}
	componentWillReceiveProps(nextProps) {
		if ((!nextProps.editable && nextProps.tenant && nextProps.tenant !== this.props.tenant) || (nextProps.environment !== this.props.environment)) {
			this.getAllTags(nextProps.tenant);
			this._pullData(null, 1, 10, nextProps.tenant);
		}
	}
	getTags = (groupId) => {
		queryAppTags(groupId)
			.then((response) => {
				response.forEach(element => {
					element.name = element.desc;
				})
				let treeData = TreeHelp.toChildrenStruct(response);
				this.setState({ treeData })
			})
	}

	getAllTags = (tenant) => {
		queryAllGroups(tenant).then(data => {
			this.data = data.slice();
			let treeData = TreeHelp.toChildrenStruct(data);
			this.setState({ treeData });
		}).catch(() => {
			this.setState({ treeData: [] });
		});
	}

	//**************************************************************************** */
	//************************************EVENT*********************************** */
	//**************************************************************************** */
	showTotal = () => {
		if (this.state.pagination) {
			const { total, current, totalPage } = this.state.pagination;
			return `共 ${total} 条记录  第 ${current}/${totalPage} 页 `;
		} else {
			return '';
		}
	}
	_pullData(groupId, page, rows, tenant) {
		let { filterMethod, name, uri, value } = this.state;
		if (!this.props.editable) {
			if (value && this.data.filter(element => element.id === value)[0].isParent === true) {
				groupId = value;
				value = null;
			} else if (value) {
				groupId = this.data.filter(element => element.id === value)[0].pid;
			}
		}
		this.setState({ loading: true });
		queryAllServices(groupId, page, rows, value, filterMethod, name.replace(/(^\s+)|(\s+$)/g,""), uri.replace(/(^\s+)|(\s+$)/g,""), tenant).then(response => {
			let pagination = { current: response.pageIndex, showTotal: this.showTotal, totalPage: response.totalPage, total: response.total, pageSize: response.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, };
			this.setState({
				dataSource: response.contents,
				pagination: pagination,
				loading: false,
			});
			let names = [];
			response.contents.forEach(element => {
				names.push(element.code)
			})
			//服务统计
			// queryServiceData(names.toString()).then((data) => {
			// 	//this.setState({dataSource:data});
			// 	response.contents.forEach(element => {
			// 		data.forEach(item => {
			// 			if (element.serviceName === item.serviceName) {
			// 				element.count = item.count;
			// 				element.time = item.time;
			// 			}
			// 		})
			// 		/* element.count = 12;
			// 		element.time = 222; */
			// 	})
			// 	this.setState({ dataSource: response.contents })
			// })
		}).catch(err => {
			this.setState({ loading: false, dataSource: [], pagination: false });
		})
	}

	_getColumn() {
		return [{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				return (
					<Link to={this.props.appId?`/applications/${this.props.appId}/apis/${record.id}`:`/apis/${record.id}`}><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Link>
				)
			}
		}, {
			title: '方法',
			dataIndex: 'methods',
			key: 'methods',
			width: '78px',
			render: (text, record) => {
				return (
					<Row>
						<span style={{ color: METHOD_COLORS[record.methods] }}>{record.methods}</span>
					</Row>
				)
			}
		}, {
			title: '路径',
			dataIndex: 'uri',
			key: 'uri',
			render: (text, record) => {
				return <Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis>
			}
		}, {
			title: '级别',
			dataIndex: 'visibility',
			key: 'visibility',
			width: '64px',
			render: (text, record) => {
				return text === '1' ? '普通' : text === '0' ? '私有' : '公开'
			}
		// }, {
		// 	title: '统计',
		// 	dataIndex: 'grantion',
		// 	key: 'grantion',
		// 	width: '80px',
		// 	align: 'right',
		// 	render: (text, record) => {
		// 		if (!record.count && !record.time) {
		// 			return '--'
		// 		}
		// 		return (record.count ? record.count + '次' : '--') + ' | ' + (record.time ? record.time + 'ms' : '--')
		// 	}
		}, {
			title: '操作',
			dataIndex: 'options',
			key: 'options',
			width: '150px',
			render: (text, record) => {
				let disabled = !base.checkPermission('service_delete') && !record.owned
				const menu = (
					<Menu>
						<Menu.Item>
							<Link to={this.props.appId?`/applications/${this.props.appId}/apis/${record.id}`:`/apis/${record.id}`}>配置</Link>
						</Menu.Item>
						<Menu.Divider />
						<Menu.Item disabled={disabled} onClick={() => {
							if (record.appNumber) {
								message.error(`[${record.name}]服务已经授权，不可删除`)
								return;
							}
							this.showDeleteConfirm(record)
						}}>
							删除
						</Menu.Item>
					</Menu>
				);

				return (
					<Fragment>
						<a href={`${base.currentEnvironment.authServerAddress}/ext/swagger/index.html?group=${record.groupId}&id=${record.id}`} target="_blank">在线文档</a>
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
		this._pullData(this.groupId, pagination.current, pagination.pageSize, this.props.tenant);
	}

	_removeApi(apiId) {
		removeServicesApis(this.props.appId, apiId)
			.then((response) => {
				this._pullData(this.groupId, this.page, this.rows, this.props.tenant)
			})
	}

	_removeApis(apiIds) {
		let appIdsStr = apiIds.join('&ids=');
		removeServicesApisBatch(this.props.appId, appIdsStr)
			.then((response) => {
				this.setState({
					selectedRowKeys: []
				})
				this._pullData(this.groupId, this.page, this.rows, this.props.tenant)
			})
	}

	_search() {
		this._pullData(this.groupId, this.page, this.rows, this.props.tenant)
	}

	_clear() {
		this._pullData(this.groupId, this.page, this.rows, this.props.tenant)
		this.setState({
			filterMethod: null,
			name: null
		})
	}

	_hasChange() {
		this._pullData(this.groupId, 1, 10, this.props.tenant);
	}
	//**************************************************************************** */
	//*************************************UI************************************* */
	//**************************************************************************** */
	showDeleteConfirm = (record) => {
		confirm({
			title: '是否删除此服务?',
			content: `待删除服务：${record.name}`,
			okText: '删除',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => {
				this._removeApi(record.id)
			},
			onCancel: () => {
			},
		});
	}
	showDeleteConfirms = () => {
		let selectedRowKeys = this.state.selectedRowKeys;
		confirm({
			title: '是否删除选中服务?',
			okText: '删除',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => {
				this._removeApis(selectedRowKeys)
			},
			onCancel: () => {
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
	onCloseModal = (flag) => {
		if (flag) {
			if (this.props.editable) {
				this.getTags(this.props.groupId)
			} else {
				this.getAllTags(this.props.tenant)
			}
			this._pullData(this.groupId, 1, 10, this.props.tenant);
		}
		this.setState({ isServerAddModalShow: false });
	}
	onDebugger = () => {
		if (this.state.treeData && this.state.treeData.length > 0 && this.state.treeData[0].id) {
			this.setState({
				visibleFile: true,
				group: this.state.treeData[0].id
			})
		} else {
			message.error(this.props.editable ? '未获取到标签数据，无法根据标签查看在线文档' : '未获取到应用&标签数据，无法根据应用&标签查看在线文档')
		}
	}
	renderExpandForm = () => {
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		return (
			<Form >
				<Row gutter={{ md: 4, lg: 12, xl: 18 }} >
					<Col span={6}>
						<FormItem {...formItemLayout} label={!this.props.editable ? "应用&标签" : "标签"}>
							<TreeSelect treeDefaultExpandAll
								showSearch={true}
								filterTreeNode={(input, option) => option.props.name.indexOf(input) >= 0}
								style={{ width: '100%' }}
								value={this.state.value}
								dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
								treeData={this.state.treeData}
								placeholder={!this.props.editable ? "请选择应用&标签" : "请选择标签"}
								onChange={(value) => this.setState({ value })}
							/>
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem {...formItemLayout} label="服务名称">
							<Input
								onChange={(e) => { this.setState({ name: e.target.value }) }} value={this.state.name}
								placeholder="请输入服务名称" />
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem {...formItemLayout} label="服务路径">
							<Input
								onChange={(e) => { this.setState({ uri: e.target.value }) }} value={this.state.uri}
								placeholder="请输入服务路径" />
						</FormItem>
					</Col>
					<Col span={4}>
						<FormItem {...formItemLayout} label="请求方法">
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
					<Col style={{ float: 'right' }} span={4}>
						<span style={{ float: 'right' }} >
							<Button
								htmlType="submit"
								onClick={() => {
									this._pullData(this.groupId, 1, 10, this.props.tenant)
								}}
								style={{ marginRight: 8 }} type='primary'>查询</Button>
							<Button
								onClick={() => this.setState({ uri: '', name: '', filterMethod: '', value: '' }, () => this._pullData(this.groupId, 1, 10, this.props.tenant))}
							>重置</Button>
						</span>
					</Col>
				</Row>
			</Form>
		)
	}

	//同步按钮操作
	showModal = () => {
		this.setState({synLoading:true});
		if (this.props.editable) {
			this.setState({ synGroupId: this.props.appId, visible: true })
		} else {
			if (this.state.value) {
				this.data.forEach(element => {
					if (this.state.value === element.id && element.isParent) {
						this.setState({ synGroupId: element.id, visible: true })
					} else if (this.state.value === element.id && !element.isParent) {
						this.setState({
							synGroupId: element.pid, visible: true
						})
					}
				})
			} else {
				this.setState({synLoading:false})
				message.error('请先选择应用标签')
			}
		}
	}
	clearAllApis = () => {
		this.setState({clearAllLoading:true})
		clearAllApis(this.props.appId).then(data => {
			this.setState({clearAllLoading:false});
			this._pullData(this.groupId, 1, 10, this.props.tenant);
		}).catch(err =>{
			this.setState({clearAllLoading:false});
		})
	}
	handleOk = () => {
		this.setState({ visible: false,synLoading:false })
	}
	render() {
		let tempData = [];
		this.state.treeData.forEach(element => {
			tempData.push({ ...element, children: null });
		})
		return (
			<div>
				<ServerAddModal
					groups={this.data.filter(element => element.isParent === true)}
					editable={this.props.editable}
					appId={this.props.appId}
					appData={this.props.appData}
					tenant={this.props.tenant}
					onCloseModal={this.onCloseModal}
					isServerAddModalShow={this.state.isServerAddModalShow} />
				<div className="tableList">
					{this.renderExpandForm()}
				</div>
				<Row>
					<Row type={'flex'} style={{ marginBottom: 16 }}>
						<Authorized authority='service_import' noMatch={null}>
							<ServerImport appId={this.props.appId} upstream={this.props.upstream} hasChange={this._hasChange} />
						</Authorized>
						<Authorized authority='service_add' noMatch={null}>
							<Button onClick={() => this.setState({ isServerAddModalShow: true })} style={{ marginLeft: 8}}>添加</Button>
						</Authorized>
						<Button onClick={() => this.onDebugger()} style={{ marginLeft: 8 }}>在线文档</Button>
						<Authorized authority='service_synchronize' noMatch={null}>
							<Button onClick={() => this.showModal()} loading={this.state.synLoading} style={{ marginLeft: 8 }}>同步</Button>
						</Authorized>
						{this.props.appId?<Popconfirm title="是否确定清空当前应用下的所有服务？" onConfirm={this.clearAllApis}><Button loading={this.state.clearAllLoading} style={{ marginLeft: 8 }}>清空所有服务</Button></Popconfirm>:""}
						
						<Modal
							title="文档预览"
							okText='预览'
							visible={this.state.visibleFile}
							onOk={() => {
								if (this.props.editable) {
									this.setState({ visibleFile: false });
									window.open(`${base.currentEnvironment.authServerAddress}/ext/swagger/index.html?group=${this.props.appId}&visibility=${this.state.isOpen}`, '_blank');
								} else if (this.state.group) {
									this.setState({ visibleFile: false });
									window.open(`${base.currentEnvironment.authServerAddress}/ext/swagger/index.html?group=${this.state.group}&visibility=${this.state.isOpen}`, '_blank');
								} else {
									message.error('请先选择应用')
								}
							}}
							onCancel={() => this.setState({ visibleFile: false })} >
							{!this.props.editable ?
								<Row style={{ marginBottom: 24 }} type={'flex'} align='middle'>
									<Col style={{ textAlign: 'right', paddingRight: 8 }} span={6}>应用:</Col><Col span={18}>
										<TreeSelect
											style={{ width: '100%' }}
											value={this.state.group}
											dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
											treeData={tempData}
											placeholder="选择应用"
											onChange={(value) => this.setState({ group: value })}
										/>
									</Col>
								</Row> : ''
							}
							<Row type={'flex'} align='middle'>
								<Col style={{ textAlign: 'right', paddingRight: 8 }} span={6}>服务类型:</Col><Col span={18}>
									<RadioGroup value={this.state.isOpen} onChange={(e) => this.setState({ isOpen: e.target.value })}>
										{isOpenList.map((element, index) => {
											return <Radio key={index} value={element.key}>{element.name}</Radio>
										})}
									</RadioGroup>
								</Col>
							</Row>
						</Modal>
					</Row>
				</Row>
				<SynService groupId={this.state.synGroupId} handleOk={() => this.handleOk()} visible={this.state.visible} />
				<Table
					loading={this.state.loading}
					rowKey="id"
					dataSource={this.state.dataSource}
					pagination={this.state.pagination}
					columns={this._getColumn()}
					onChange={this._onChange} />

			</div>
		)
	}
}

export default props => (
	<GlobalHeaderContext.Consumer>
		{context => <ProvidedServices tenant={context.tenant} {...props}  environment={context.environment} />}
	</GlobalHeaderContext.Consumer>
);