import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
import NavigationList from './NavigationList'


export default class componentName extends Component {
	static propTypes = {
		prop: PropTypes
	}

	render() {
		return (
			<div style={{ margin: '-24px -24px 0' }}>
				<PageHeaderBreadcrumb breadcrumbList={[{ name: '基础数据' }, { name: '全局导航设置' }]} action={<GlobalEnvironmentChange />} />
				<Card bordered={false} style={{ margin: '24px 24px 0' }} >
					<NavigationList />
				</Card>
			</div>
		)
	}
}
