import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd';
import { getPagination } from '../../utils/utils';
import { getResources, queryAppAIP } from '../../services/aip';
import Link from 'react-router-dom/Link';
import { SearchForm } from 'c2-antd-plus';
import Authorized from '../../common/Authorized';

export default class FuncList extends Component {
	static propTypes = {
		prop: PropTypes
	}

	state = {
		current: 1,
		pageSize: 10,
		apps: [],
		result: {}
	}

	componentDidMount() {
		this.pageChange(1, 10);
		queryAppAIP().then(data => {
			this.setState({ apps: data });
		})
	}

	pageChange = (page, rows) => {
		let params = {
			page: page,
			rows: rows,
			type: 'function',
			simpleMode: true,
			appId: this.state.appId || '',
			name: this.state.name || ''
		};
		getResources(params).then(data => {
			this.setState({ result: data, data: data.contents, current: data.pageIndex, pageSize: data.pageSize })
		})
	}

	onSearch = (e, values) => {
		this.setState({ ...values }, () => {
			this.pageChange(1, 10)
		})
	}

	onChange = (page, rows) => {
		this.pageChange(page, rows)
	}
	render() {

		const columns = [
			{
				dataIndex: 'name',
				title: "功能名称",
				render: (text, record) => {
					return <Link to={`/applications/${record.appId}/functional/${record.id}`}>{text}</Link>
				}
			},
			{
				dataIndex: 'appName',
				title: "所属应用",
				render: (text, record) => {
					return (
						<Authorized authority='functional_appRedirect' noMatch={<span style={{ whiteSpace: 'nowrap' }}>{text}</span>}>
							<Link style={{ whiteSpace: 'nowrap' }} to={`/functions/apps/${record.appId}`}>{text}</Link>
						</Authorized>
					)
				}
			},
			{
				dataIndex: 'desc',
				title: "描述",
				render: (text, record) => {
					return text ? text : '--';
				}
			}
		]

		const items = [
			{ label: '功能名称', name: 'name' },
			{
				label: '所属应用', name: 'appId', type: 'select', 
				options: this.state.apps.map(app => { return { label: app.name, value: app.id } })
			}

		]

		const pagination = getPagination(this.state.result, (page, rows) => this.onChange(page, rows));
		return (
			<div>
				<SearchForm items={items} onSearch={this.onSearch} />
				<Table
					columns={columns}
					dataSource={this.state.data}
					pagination={pagination}
				>
				</Table>
			</div>
		)
	}
}
