import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AuthorizeRoleModal from '../../../common/FunctionalSelectModal/AuthorizeRoleModal'
import CollectionUsersModal from '../../../common/FunctionalSelectModal/CollectionUsersModal'
import FunctionRoleModal from './FunctionRoleModal'
import { Modal, Radio, message, Button, Table } from 'antd'
import {getRoleListResources,getRoleUserCollection,deleteRoleManager,updateUserCollection, deleteUserCollection,roleManagerUsers,getRoleManagerUsers} from '../../../services/aip'
import constants from '../../../services/constants'
import moment from 'moment'
import Authorized from '../../../common/Authorized';


const RadioGroup = Radio.Group
export class RoleResourceModal extends Component {
	static propTypes = {
		record: PropTypes.object.isRequired,			//选中的功能
		visible: PropTypes.bool,
		title: PropTypes.string,				//模态框标题
		handleAuthorizeModal: PropTypes.func.isRequired,  //第一个参数为是否是确定 第二个参数返回的用户集合，第三个参数是选择的角色
		type: PropTypes.string,			//判断是添加用户集合还是授权管理员 'addUsers':'addManagers'
	}

	state = {
		RoleResources: [],
		onSelectedKeys: [],
		visible: false,
		userVisible: false,
		functionVisible: false,
		dataSource: this.props.record.userCollections || [],
		checkedValues: '',			//选中的角色
		loading: false,
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible) {
			//如果有角色
			if (nextProps.record.roleList && nextProps.record.roleList.length > 0) {
				this.setState({ loading: true })
				if (nextProps.type === 'addUsers') {
					getRoleListResources({ roleId: nextProps.record.roleList[0].id, type: 'function' }).then(datas => {
						getRoleUserCollection(nextProps.record.roleList[0].appId, nextProps.record.roleList[0].id).then(data => {
							this.setState({ dataSource: data, checkedValues: nextProps.record.roleList[0], loading: false })
						}).catch(err => {
							this.setState({ dataSource: [], loading: false })
						})
					})
				} else {
					getRoleManagerUsers(nextProps.record.roleList[0].appId, nextProps.record.roleList[0].id).then(data => {
						this.setState({ dataSource: data, checkedValues: nextProps.record.roleList[0], loading: false })
					}).catch(err => {
						this.setState({ dataSource: [], loading: false })
					})
				}
			}
		}

	}


	//下拉选择
	onChange = (e) => {
		this.setState({ loading: true })
		let checkedValues = this.props.record.roleList.filter(i => i.id === e.target.value)[0];
		//获取当前角色所拥有的用户集合
		let req1;
		if (this.props.type === 'addUsers') {
			req1 = getRoleUserCollection(checkedValues.appId, checkedValues.id);
		} else {
			req1 = getRoleManagerUsers(checkedValues.appId, checkedValues.id)
		}
		//先暂时隐藏掉，后续新功能在打开
		let req2 = getRoleListResources({ roleId: e.target.value, type: 'function' });
		Promise.all([req1, req2]).then(res => {
			this.setState({ dataSource: res[0], RoleResources: res[1], checkedValues, loading: false })
		}).catch(err => {
			this.setState({ dataSource: [], loading: false })
		})
	}

	handleModal = (flag, onSelectedKeys) => {
		if (flag) {
			//如果是授权用户集合
			if (this.props.type === 'addUsers') {
				updateUserCollection(this.state.checkedValues.appId, this.state.checkedValues.id, onSelectedKeys).then(data => {
					message.success('修改角色授权用户集合成功')
					this.setState({ dataSource: data, visible: false })
				})
			} else {
				//调授权管理员接口
				roleManagerUsers(this.state.checkedValues.appId, this.state.checkedValues.id, onSelectedKeys).then(data => {
					message.success('角色授权管理员用户集合成功')
					this.setState({ dataSource: data, visible: false })
				})
			}
		} else {
			this.setState({ visible: false })
		}
	}

	onDeleteUserCollection = (id) => {
		if (this.props.type === 'addUsers') {
			deleteUserCollection(this.state.checkedValues.appId, this.state.checkedValues.id, id).then(data => {
				let ary = this.state.dataSource.filter(i => i.userCollectionId !== id);
				message.success('取消授权用户集合成功');
				this.setState({ dataSource: ary })
			})
		} else {
			deleteRoleManager(this.state.checkedValues.appId, this.state.checkedValues.id, id).then(data => {
				message.success('取消角色授权管理员用户集合成功')
				let ary = this.state.dataSource.filter(i => i.userCollectionId !== id)
				this.setState({ dataSource: ary })
			})
		}
	}

	handleClick = () => {
		this.setState({ visible: true })
	}

	render() {
		const columns = [{
			title: '名称',
			dataIndex: 'userCollectionName'
		}, {
			title: '类型',
			dataIndex: 'userCollectionType',
			width: 75,
			render: (value, record) => constants.functionResource.userCollectionType[value]
		}, {
			title: '用户数',
			dataIndex: 'userCount',
			width: 75
		}, {
			title: '授权者',
			dataIndex: 'creator'
		}, {
			title: '授权时间',
			dataIndex: 'createtime',
			width: 140,
			render: (value) => moment(value).format('YYYY-MM-DD HH:mm')
		}, {
			title: '操作',
			width: 100,
			key: 'action',
			render: (text, record) => {
				return (
					<Authorized authority={this.props.type === 'addUsers' ? 'functional_roleUser_delAuthorization' : 'functional_setManager_delAuthorization'} noMatch={<a disabled='true'  >取消授权</a>}>
						<a onClick={(record) => { this.onDeleteUserCollection(text.userCollectionId) }} >取消授权</a>
					</Authorized>
				)
			}
		}];

		return (
			<Modal
				width={800}
				title={this.props.title ? this.props.title : '功能管理员设置'}
				visible={this.props.visible}
				onCancel={() => this.props.handleAuthorizeModal()}
				footer={[<Button key='ok' onClick={() => this.props.handleAuthorizeModal()}>关闭</Button>,]}
				destroyOnClose
			>
				<div>
					<strong>以下角色都可以使用功能[{this.props.record.name}]，请问{this.props.type === 'addUsers' ? '将哪一个授权给用户' : '为哪一个指定管理员'}？</strong>
					<p style={{ marginTop: '12px' }}><RadioGroup defaultValue={(this.props.record.roleList && this.props.record.roleList.length > 0) ? this.props.record.roleList[0].id : ''} options={this.props.record.roleList} onChange={this.onChange} />
						<strong><a onClick={() => { this.setState({ functionVisible: true }) }}>查看角色权限详情</a></strong>
					</p>
					<p><strong>角色[{this.state.checkedValues ? this.state.checkedValues.name : ''}]已授权的{this.props.type === 'addUsers' ? '用户集合' : '管理员'}  <a onClick={() => { this.setState({ userVisible: true }) }}>查看{this.props.type === 'addUsers' ? '影响的用户' : '管理员用户详情'}</a></strong></p>
					<Authorized authority={this.props.type === 'addUsers' ? 'functional_roleUser_addAuthorization' : 'functional_setManager_addAuthorization'} noMatch={null}>
						<Button type='primary' style={{ marginButton: '8px', marginTop: '8px' }} onClick={this.handleClick}>添加授权</Button>
					</Authorized>
					<Table
						loading={this.state.loading}
						style={{ marginTop: 12 }}
						size={'small'}
						dataSource={this.state.dataSource}
						columns={columns} />
				</div>

				<AuthorizeRoleModal title={this.props.title} visible={this.state.visible} selectTitle={'功能管理员'} style={{ marginTop: 12 }} selectedKeys={this.state.dataSource} handleModal={(flag, onSelectedKeys) => this.handleModal(flag, onSelectedKeys)} />
				<CollectionUsersModal title={this.state.checkedValues.name} visible={this.state.userVisible} collections={this.state.dataSource} handleModal={() => { this.setState({ userVisible: false }) }} />
				<FunctionRoleModal title={this.state.checkedValues.name} role={this.state.checkedValues} visible={this.state.functionVisible} handleModal={() => { this.setState({ functionVisible: false }) }} />
			</Modal>
		)
	}
}

export default RoleResourceModal
