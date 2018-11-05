import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BaseTree from '../../../common/BaseTree'
import { Modal,message } from 'antd'
import { updateRoleResource,getResourceTree,getRoleResources } from '../../../services/functional'

class FunctionRoleModal extends Component {
	static propTypes = {
		role: PropTypes.object,
		onCancel: PropTypes.func,				//模态框取消回调方法
		visible: PropTypes.bool  		//模态框的开启状态
	}

	constructor(props) {
		super(props);
		this.state = {
			visible:this.props.visible,
			role:{},
			treeNode:[],
			selectedKeys:[]
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.role !== this.props.role){
			let params = {pid: 0,cascade: true}
			this.setState({role:nextProps.role});
			getResourceTree(nextProps.role.appId,params).then(data => {
				this.setState({ treeNode: data })
			}).catch(err => {
				this.setState({ treeNode: [] })
			})
			getRoleResources(nextProps.role.appId, nextProps.role.id, { pid: 0 }).then(data=>{
				this.setState({selectedKeys:data})
			}).catch(err => {
				this.setState({ selectedKeys: [] })
			})
		}
	}

	onSelectKeys = (selectKeys, selectNodes) => {
		this.setState({ selectedKeys: selectNodes })
	}

	handleFunctionOk = () => {
		//调用角色授权功能
		let ids = [];
		this.state.selectedKeys.forEach(i => {
		  ids.push(i.id)
		})
		updateRoleResource(this.props.role.appId, this.props.role.id, ids).then(data => {
		  message.success('角色授权功能成功')
		  this.props.handleModal();
		})
	}

	render() {
		return (
			<div>
				<Modal
					bodyStyle={{ overflow: 'auto', height: '500px' }}
					title={'角色['+this.props.title+']权限详情'} width={1000} visible={this.props.visible}
					onCancel={this.props.handleModal} destroyOnClose
					onOk={this.handleFunctionOk}
				>
					<BaseTree onSelectKeys={(selectKeys, selectNodes) => this.onSelectKeys(selectKeys, selectNodes)} treeNodes={this.state.treeNode} pidName="parentId" selectedNodes={this.state.selectedKeys} />
				</Modal>
			</div>
		)
	}
}

export default FunctionRoleModal;


