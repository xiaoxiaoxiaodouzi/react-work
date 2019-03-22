import React, { Component } from 'react'
import { Modal, Input, Checkbox ,message} from 'antd'
import { addCluster } from '../../services/cce';
import { base } from '../../services/base';

export default class AddCluster extends Component {

	state = {
		showPublicCluster: false,
		isPublicCluster: false,
	}

	componentDidMount() {
		let config = base.configs;

		//判断当前租户是否是管理租户
		if (config.manageTenantCode === base.tenant) {
			//是管理租户
			this.setState({
				showPublicCluster: true
			})
		} else {
			this.setState({
				showPublicCluster: false
			})
		}
	}


	handleOk = () => {
		let bodyParams = {
			name: this.state.name
		}
		if (this.state.isPublicCluster) {
			bodyParams.isPublic = true
		}
		if (this.state.name) {
			addCluster(bodyParams).then(data => {
				if (data) {
					this.props.initDatas();
					this.props.onCancel();
					this.setState({ visibleAdd: false })
					message.success('新建服务器成功')
				}
			})
		} else {
			message.error('请输入服务器名称')
		}
	}
	handleCancle = () => {
		this.props.onCancel();
	}

	render() {
		return (
			<Modal
				title='新建服务器'
				visible={this.props.visibleAdd}
				onOk={this.handleOk}
				onCancel={this.handleCancle}
				destroyOnClose
			>
				<div style={{ marginLeft: 24 }}>
					服务器名称:   <Input style={{ width: 300 }} value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
				</div>
				{this.state.showPublicCluster && <div style={{ marginLeft: 24, marginTop: 24 }}>
					公共服务器:   <Checkbox checked={this.state.isPublicCluster} onChange={(e) => this.setState({ isPublicCluster: e.target.checked })}></Checkbox>
				</div>}
			</Modal>
		)
	}
}
