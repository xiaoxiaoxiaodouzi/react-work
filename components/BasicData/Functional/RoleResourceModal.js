import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import AuthorizeRoleModal from '../../../common/FunctionalSelectModal/AuthorizeRoleModal'
import CollectionUsersModal from '../../../common/FunctionalSelectModal/CollectionUsersModal'
import { Modal, message, Button, Table, Alert } from 'antd'
import { getRoleUserCollection, deleteRoleManager, updateUserCollection, deleteUserCollection, roleManagerUsers, getRoleManagerUsers } from '../../../services/aip'
import constants from '../../../services/constants'
import moment from 'moment'
import Authorized from '../../../common/Authorized';

export class RoleResourceModal extends PureComponent {
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
		dataSource: this.props.record?this.props.record.userCollections : [],
		loading: false,
		role:{}
	}

	componentDidUpdate(prevProps,prevState){
		if(this.props.visible && ((this.props.role && prevProps.role !== this.props.role)|| (this.props.type !== prevProps.type))){
			this.setState({loading:true,role:this.props.role});
			if(this.props.type === 'addUsers'){
				getRoleUserCollection(this.props.role.appId,this.props.role.roleId).then(data =>{
					this.setState({dataSource: data,loading:false});
				})
			}else{
				getRoleManagerUsers(this.props.role.appId,this.props.role.roleId).then(data=>{
					this.setState({dataSource: data,loading:false});
				})

			}
		}
		return true;
	}

	handleModal = (flag, onSelectedKeys) => {
		if (flag) {
			//如果是授权用户集合
			if (this.props.type === 'addUsers') {
				updateUserCollection(this.props.role.appId, this.props.role.roleId,  onSelectedKeys).then(data => {
					message.success('修改角色授权用户集合成功')
					this.setState({ dataSource: data, visible: false })
				})
			} else {
				//调授权管理员接口
				roleManagerUsers(this.props.role.appId, this.props.role.roleId, onSelectedKeys).then(data => {
					message.success('角色授权管理员用户集合成功')
					this.setState({ dataSource: data, visible: false })
				})
			}
		} else {
			this.setState({ visible: false })
		}
	}

	onDeleteUserCollection = (id) => {
		debugger;
		if (this.props.type === 'addUsers') {
			deleteUserCollection(this.props.role.appId, this.props.role.roleId, id).then(data => {
				let ary = this.state.dataSource.filter(i => i.userCollectionId !== id);
				message.success('取消授权用户集合成功');
				this.setState({ dataSource: ary })
			})
		} else {
			deleteRoleManager(this.props.role.appId, this.props.role.roleId, id).then(data => {
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
			title: '用户集合名称',
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
						<a onClick={(record) => { this.onDeleteUserCollection(text.userCollectionId) }} >移除</a>
					</Authorized>
				)
			}
		}];

		return (
			<Modal
				width={constants.MODAL_STYLE.DEFAULT_WIDTH} maskClosable={false} bodyStyle={{maxHeight:constants.MODAL_STYLE.BODY_HEIGHT,overflow:'auto'}}
				title={this.props.title ? this.props.title : '设置功能管理员'}
				visible={this.props.visible}
				onCancel={() => this.props.handleAuthorizeModal()}
				footer={[<Button key='ok' onClick={() => this.props.handleAuthorizeModal()}>关闭</Button>,]}
			>
				<div>
					{this.props.type === 'addManagers' && <Alert showIcon message='功能角色的管理员是指能管理功能角色授权的人，他们并不一定可以使用这些功能。' type='warning' style={{marginBottom:10}}></Alert>}
					<Authorized authority={this.props.type === 'addUsers' ? 'functional_roleUser_addAuthorization' : 'functional_setManager_addAuthorization'}>
						<Button type='primary' style={{ marginButton: '12px'}} onClick={this.handleClick}>添加</Button>
					</Authorized>
					<Button style={{ marginLeft: '6px' }} onClick={() => { this.setState({ userVisible: true }) }} > {this.props.type === 'addManagers'?'查看管理员清单':'查看已授权的用户'}</Button>
					<Table
						loading={this.state.loading}
						style={{ marginTop: 12 }}
						size={'small'}
						dataSource={this.state.dataSource}
						columns={columns} />
				</div>
				<AuthorizeRoleModal title={this.props.title} visible={this.state.visible} selectTitle={'功能管理员'} style={{ marginTop: 12 }} selectedKeys={this.state.dataSource} handleModal={(flag, onSelectedKeys) => this.handleModal(flag, onSelectedKeys)} />
				<CollectionUsersModal title={this.props.role?this.props.role.roleName:''} visible={this.state.userVisible} collections={this.state.dataSource} handleModal={() => { this.setState({ userVisible: false }) }} />
			</Modal>
		)
	}
}

export default RoleResourceModal
