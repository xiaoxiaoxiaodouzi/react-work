import React, { Component } from 'react'
import { Card, Alert, Switch } from 'antd'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { updateConfigs } from '../../services/amp';
import { base } from '../../services/base';
import UserSelectModal from '../../common/UserSelectModal';



const { Description } = DescriptionList;
export class SystemBasicSetting extends Component {

	state = {
		errorMessage: false,
		messageBell: false,
		errorDisabled: false,
		messageDisabled: false,
	}

	componentDidMount() {
		this.setState({
			errorMessage: base.configs.errorMessage,
			messageBell: base.configs.messageBell,
		})
	}

/* 	static getDerivedStateFromProps(props, state) {
		if (props.errorMessage !== state.errorMessage || props.messageBell !== state.messageBell) {
			return ({ errorMessage: props.errorMessage, messageBell: props.messageBell })
		}
		return null;
	}
 */
	messageChange = (e) => {
		//调用接口 然后禁用掉
		this.setState({ errorDisabled: true })
		updateConfigs({ errorMessage: e }).then(data => {
			this.setState({ errorDisabled: false, errorMessage: data.errorMessage })
		}).catch(e => {
			this.setState({ errorDisabled: false, })
		})
	}

	messageBell = (e) => {
		//调用接口 然后禁用掉
		this.setState({ messageDisabled: true })
		updateConfigs({ messageBell: e }).then(data => {
			this.setState({ messageDisabled: false, messageBell: data.messageBell })
		}).catch(err => {
			this.setState({ messageDisabled: false })
		})
	}

	render() {
		return (
			<div>
				<Card style={{ margin: '24px 0' }} title='基础信息'>
					<DescriptionList col="1" >
						<Description term="平台管理员">
							<UserSelectModal
								title={'设置管理员'}
								mark='系统管理员'
								description=''
								selectedUsers={this.props.managers}
								// disabledUsers={this.state.managers}
								dataIndex={{ dataIdIndex: 'id', dataNameIndex: 'name' }}
								onOk={(users) => { this.props._putUsersByGroup(users) }} />
						</Description>
						<Description term="是否启用超级管理员帐号">否</Description>
						<Description term="License状态">有效，到期时间：2020-08-08 <a>详情</a></Description>
					</DescriptionList>
				</Card>

				<Card style={{ margin: '24px 0' }} title='通知设置'>
					<span>错误消息提示框：</span> <Switch disabled={this.state.errorDisabled} checked={this.state.errorMessage} onChange={this.messageChange} ></Switch>
					<Alert type='info' message='关闭开关则页面错误信息将不提示' style={{ width: '40%', margin: '12px 0' }} />
					<span>消息铃铛：</span> <Switch disabled={this.state.messageDisabled} checked={this.state.messageBell} onChange={this.messageBell} ></Switch>
					<Alert type='info' message='当消息提示框开关开启之后，开启消息铃铛可以将错误消息放入铃铛中' style={{ width: '50%', margin: '12px 0' }} />
				</Card>
			</div>
		)
	}
}

export default SystemBasicSetting
