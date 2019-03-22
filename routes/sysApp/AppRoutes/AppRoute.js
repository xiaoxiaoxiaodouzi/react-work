import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageHeaderLayout from '../../setting/layouts/PageHeaderLayout';
import { Route } from 'react-router-dom';
import { PlatForm } from '../../setting/PlatForm';
import DomainList from '../../setting/DomainList';
import AppRoutesSetting from './AppRoutesSetting';
import Log from '../../Application/Log';
import AppDeploy from '../../Application/Deploy'
import { base } from '../../../services/base';


const tabList = [
	{ key: 'overview', tab: '概览' },
	{ key: 'routelist', tab: '路由清单' },
	{ key: 'deploy', tab: '部署管理' },
	{ key: 'setting', tab: '设置' },
	{ key: 'log', tab: '日志' },
	// { key: 'certificate', tab: '证书管理' },
]

export default class AppRoute extends Component {
	appid = ''

	static propTypes = {
		prop: PropTypes.any
	}

	state = {
		tabActiveKey: 'overview'
	}

	componentDidMount() {
		let path = window.location.href.split('/');
		if (path.length > 10) {
			this.setState({ tabActiveKey: path[path.length - 1] })
		}
	}

	onTabChange = (key) => {
		const { history, match } = this.props;
		history.push({ pathname: `/setting/systemsetting/env/${match.params.env}/apps/route/${key}` })
		console.log(base)
		this.setState({ tabActiveKey: key })
	}

	render() {
		return (
			<PageHeaderLayout
				title='应用路由管理'
				content='应用路由是访问应用的唯一网络入口，提供访问地址映射、用户身份认证与鉴权能力'
				tabList={tabList}
				tabActiveKey={this.state.tabActiveKey}
				onTabChange={this.onTabChange}
			>
				<Route path={`${this.props.match.url}`} exact />
				<Route path={`${this.props.match.url}/overview`} />
				<Route path={`${this.props.match.url}/routelist`} component={DomainList} />
				<Route path={`${this.props.match.url}/deploy`} render={() => <AppDeploy appId='route' type='chart' env={this.props.match.params.env} />} />
				<Route path={`${this.props.match.url}/setting`} component={AppRoutesSetting} />
				<Route path={`${this.props.match.url}/log`} component={Log} />
				<Route path={`${this.props.match.url}/certificate`} component={PlatForm} />
			</PageHeaderLayout>
		)
	}
}
