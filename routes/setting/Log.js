import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageHeaderLayout from './layouts/PageHeaderLayout';
import { Card } from 'antd'
import LogTable from '../../components/Application/Log/LogTable'
import {BreadcrumbTitle} from '../../common/SimpleComponents'

export default class componentName extends Component {
	static propTypes = {
		prop: PropTypes
	}

	render() {
		const breadcrumbTitle = BreadcrumbTitle([{name:'高级设置'},{name:'全局日志'}]);
		return (
			<PageHeaderLayout
				title={breadcrumbTitle}
				content="全局日志操作记录"
			>
				<Card
					bordered={false}
					title='全局日志'>
					<LogTable readyable={true}/>
				</Card>
			</PageHeaderLayout>
		)
	}
}
