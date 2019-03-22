import React, { PureComponent } from 'react'
import FuncRoleList from './FuncRoleList'
import NavigationList from './NavigationList'
import PageHeaderLayout from '../setting/layouts/PageHeaderLayout';
import { Route } from 'react-router-dom';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
import { Card } from 'antd';
import FuncList from './FuncList';

export default class FuncNavigation extends PureComponent {
	state = {
		tabActiveKey: 'roles',
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const tabActiveKey = window.location.href.split('funcs/');
		if (tabActiveKey.length > 1) {
			if (tabActiveKey[1] !== prevState.tabActiveKey) {
				return { tabActiveKey: tabActiveKey[1] }
			}
			return null;
		}
		return null;
	}

	onTabChange = (key) => {
		let { history, match } = this.props;
		history.push({ pathname: `${match.url}/${key}` })
		this.setState({ tabActiveKey: key })
	}

	render() {
		let { match } = this.props;
		const breadcrumbTitle = [
			{ title: '功能' }
		];
		const tabList = [{
			key: 'roles',
			tab: '功能角色',
		}, {
			key: 'navigation',
			tab: '全局导航',
		}, {
			key: 'funcList',
			tab: '功能清单'
		}];

		return (
			<PageHeaderLayout
				title='功能权限与导航管理'
				content="集中展示和管理所有我有权管理的功能角色和功能导航"
				tabList={tabList}
				tabActiveKey={this.state.tabActiveKey}
				onTabChange={this.onTabChange}
				breadcrumbList={breadcrumbTitle}
				action={<GlobalEnvironmentChange />}
			>
				<Card bordered={false}>
					<Route path={`${match.url}`} component={FuncRoleList} exact={true} />
					<Route path={`${match.url}/roles`} component={FuncRoleList} />
					<Route path={`${match.url}/navigation`} component={NavigationList} />
					<Route path={`${match.url}/funcList`} component={FuncList} />
				</Card>
			</PageHeaderLayout>
		)
	}
}
