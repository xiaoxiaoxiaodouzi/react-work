import React, { Component } from 'react'

import { Table, Card, Button } from 'antd'

export class ClusterAuthorized extends Component {
	state = {
		data: [],
	}

	render() {
		const columns = [
			{ title: '租户名称', dataIndex: '' },
			{ title: '环境数', dataIndex: '' },
			{ title: '应用数', dataIndex: '' },
			{ title: 'API数', dataIndex: '' },
			{ title: 'CPU数', dataIndex: '' },
			{ title: '内存(GB)', dataIndex: '' },
			{ title: '容器数', dataIndex: '' },
			{ title: '操作', dataIndex: '' },
		]
		return (
			<Card bordered={false}>

				<Button type='primary' icon='plus'>租户授权</Button>
				<Table
					dataSource={this.state.data}
					columns={columns}
				/>
			</Card>
		)
	}
}

export default ClusterAuthorized
