import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Divider, Popconfirm, Icon } from 'antd'
import { getResources } from '../../../services/aip'
import Link from 'react-router-dom/Link';
import constants from '../../../services/constants'
import Authorized from '../../../common/Authorized';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

export default class FunctionTable extends Component {
	static propTypes = {
		datas: PropTypes.array.isRequired,
		selectedRowKeys: PropTypes.array,		//选中的行key
		onChange: PropTypes.func,			//选中之后回调函数onChange(selectedRowKeys,selectedRows) 将选中行ID数组以及行数据全部返回
	}

	state = {
		expandedDatas: [],
		selectedRowKeys: [],			//选中的行id
		selectedRows: [],					//选中行数据
		expandedRowKeys: [],
		loading: false,
	}

	componentDidMount() {
		if (this.props.datas) {
			this.setState({ datas: this.props.datas, selectedRowKeys: this.props.selectedRowKeys })
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.datas !== this.props.datas) {
			this.setState({ datas: nextProps.datas, selectedRowKeys: nextProps.selectedRowKeys })
		}

		if (nextProps.loading !== this.props.loading) {
			this.setState({ loading: nextProps.loading })
		}
	}



	loadDatas = (appId, resourcesId) => {
		let queryParams = {
			appId: appId,
			pid: resourcesId,
			cascaded: true,
		}
		getResources(queryParams).then(data => {
			let datas = this.state.datas;
			datas.forEach(i => {
				if (i.id === resourcesId) {
					i.childs = data;
				}
			})
			this.setState({ datas })
		})
	}

	onRowExpand = (expanded, record) => {
		if (expanded) {
			this.loadDatas(record.appId, record.id);
		}
	}

	handleOnChange = (selectedRowKeys, selectedRows) => {
		if (this.props.onChange) {
			this.props.onChange(selectedRowKeys, selectedRows);
		}

		this.setState({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows })
	}

	render() {
		const columns = [
			{
				title: '名称', dataIndex: 'name', key: 'name',render: (text, record) => {
					if (record.parentId === '0') {
						return (<Link to={`/applications/${record.appId}/functional/${record.id}`}>{text}</Link>)
					} else {
						return text
					}
				}
			},
			{ title: 'URL', dataIndex: 'uri', key: 'uri'},
			/* { title: '标签', dataIndex: 'tag', key: 'tag' }, */
			{
				title: '图标', dataIndex: 'fontIcon', key: 'fontIcon',width:60, render: (text) => {
					return <Icon type={text} />
				}
			},
			{ title: '编码', dataIndex: 'code', key: 'code'},
			{
				title: '关联角色', dataIndex: 'roleList',key: 'roleList', render: (text, record) => {
					let ary = [];
					if (record.roleList && record.roleList.length > 0) {
						record.roleList.forEach(i => {
							ary.push(i.name);
						})
					}
					return <Ellipsis tooltip lines={1} length={200}>{ary.join(',')}</Ellipsis>
				}
			},
			{
				title: '资源类型', dataIndex: 'type', key: 'type',width:100, render: (value, record) => {
					return constants.functionResource.type[value]
				}
			},
			{
				title: '操作', key: 'operation',width:135, render: (record, text) =>
					<Fragment>
						<Authorized authority='app_addFunction' noMatch={<a disabled="true" onClick={e => this.props.ModalVisible('addResource', record)} > 新增</a>}>
							<a onClick={e => this.props.ModalVisible('addResource', record)} > 新增</a>
						</Authorized>
						<Divider type='vertical' />
						<Authorized authority='app_deleteFunction' noMatch={<Popconfirm title='是否删除?' onConfirm={e => {this.props.ModalVisible('delete', record)}} ><a disabled="true">删除</a></Popconfirm>}>
							<Popconfirm title='是否删除?' onConfirm={e => {
								this.props.ModalVisible('delete', record)
							}} >
								<a>删除</a>
							</Popconfirm>
						</Authorized>
						<Divider type='vertical' />
						<Authorized authority='app_editFunction' noMatch={<a disabled="true" onClick={e => this.props.ModalVisible('update', record)}>编辑</a>}>
							<a onClick={e => this.props.ModalVisible('update', record)}>编辑</a>
						</Authorized>
					</Fragment>
			},
		];
		const columnRole = [
			{
				title: '名称', dataIndex: 'name', key: 'name', render: (text, record) => {
					if (record.parentId === '0') {
						return <Link to={`/applications/${record.appId}/functional/${record.id}`}>{text}</Link>
					} else {
						return text
					}
				}
			},
			{ title: 'URL', dataIndex: 'uri', key: 'uri' },
			// { title: '标签', dataIndex: 'tag', key: 'tag' },
			{ title: '字体图标', dataIndex: 'fontIcon', key: 'fontIcon' },
		]

		return (
			<div>
				<Table
					rowKey='id'
					className="components-table-demo-nested"
					columns={this.props.roleId ? columnRole : columns}
					/* onExpand={this.onRowExpand}
					expandedRowRender={expandedRowRender}
					expandedRowKeys={this.state.expandedRowKeys}
					onExpandedRowsChange={(expandedRows) => this.setState({ expandedRowKeys: expandedRows })} */
					dataSource={this.state.datas}
					pagination={false}
					loading={this.state.loading}
				//rowSelection={this.props.showCheckBox ? rowSelection : null}
				/>
			</div>
		);
	}
}
