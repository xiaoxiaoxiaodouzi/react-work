import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Dropdown, Icon, Menu} from 'antd'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { DynamicFormEditorModal } from 'c2-antd-plus';
import AuthenticationService from '../../../components/sysApp/AppRoutes/AuthenticationService';
import { base } from '../../../services/base';
import { getRouteTemplate } from '../../../services/amp';
import EnvRouteTemplateTable from '../../../components/Setting/EnvRouteTemplateTable';

const Description = DescriptionList.Description;
export default class AppRoutesSetting extends Component {

	static propTypes = {
		prop: PropTypes.any
	}

	state = {
		visible: false,
		data: {}
	}

	componentDidMount() {
		getRouteTemplate().then(data => {
			let env = Object.assign(base.currentEnvironment, {
				routeTemplate: data
			})
			this.setState({ data: env })
		})
	}

	onClick = (menu) => {
		if (menu.key === 'set') this.setState({ visible: true });
	}

	onOk = (value) => {
		this.setState({ visible: false })
	}

	onCancel = (value) => {
		this.setState({ visible: false })
	}


	isEditing = record => record.id === this.state.editingKey;

	render() {
		const { data } = this.state
		let basicItems = [
			{ label: '应用路由管理地址', name: 'routes', type: 'input' },
			{ label: '管理凭证', name: 'authori', type: 'input' },
			{ label: '应用路由业务地址', name: 'address', type: 'input' },
		]

		let menu = (
			<Menu onClick={this.onClick}>
				<Menu.Item key='set'>配置</Menu.Item>
			</Menu>
		)

		let clusterExtra =
			(
				<Dropdown overlay={menu}>
					<a><Icon type="ellipsis" /></a>
				</Dropdown>
			)
		const basicTitle = <span>基础信息<span style={{ fontSize: 12, marginLeft: 50, color: 'rgb(190,190,190)' }}>版本：v1.0</span></span>
		const routeTitle = <span>路由模板配置<span style={{ fontSize: 12, marginLeft: 50, color: 'rgb(190,190,190)' }}>环境内应用对外开放时可使用的路由地址模板配置，请管理员确保模板中配置的地址能正确的访问到应用路由的业务地址</span></span>

		return (
			<div>
				<Card title={basicTitle} style={{ margin: '24px 0' }} extra={clusterExtra}>
					<DescriptionList col={2}>
						<Description term='应用路由管理地址'>https://172.xx.xx.xx.:8001</Description>
						<Description term='管理凭证'>******</Description>
					</DescriptionList>
					<DescriptionList col={1}>
						<Description term='应用路由业务地址'>http://172.xx.xx.xx:8000</Description>
						<Description term='登录页面'>
							<a style={{ marginLeft: 5 }}>预览</a>
							<a style={{ marginLeft: 5 }}>切换</a>
							<a style={{ marginLeft: 5 }}>下载源文件</a>
						</Description>
					</DescriptionList>
					<DynamicFormEditorModal title='应用路由基础设置修改' items={basicItems} visible={this.state.visible} onOk={this.onOk} onCancel={this.onCancel} />
				</Card>

				<AuthenticationService />

				<Card title={routeTitle} style={{ margin: '24px 0' }}>
					<EnvRouteTemplateTable rowKey="id" data={data.routeTemplate} environmentId={data.id} />
				</Card>

			</div>
		)
	}
}
