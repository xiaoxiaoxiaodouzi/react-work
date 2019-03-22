import React, { Component } from 'react'
import EditableTableContext from '../../../context/EditableTableContext';
import { Divider, Popconfirm, Table, Card } from 'antd';
import { Button } from 'antd/lib/radio';
import EditableFormRow from '../../../common/EditableTable/EditableRow'
import EditableCell from '../../../common/EditableTable/EditableCell'

export class RouteTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editingKey: '',
			data: [
				{ id: '1', address: 'test', context: '123', name: '/', cookie: 'tt', cookiePath: 'tttt' },
				{ id: '2', address: 'test', context: '123', name: '/', cookie: 'tt', cookiePath: 'tttt' },
				{ id: '3', address: 'test', context: '123', name: '/', cookie: 'tt', cookiePath: 'tttt' },
			],
			loading: false
		};

		this.columns = [
			{
				title: '类型名称',
				dataIndex: 'address',
				width: '20%',
				dataType: 'input',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
				editable: true,
			},
			{
				title: '域名模板',
				dataIndex: 'context',
				width: '15%',
				dataType: 'input',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
				editable: true,
			},
			{
				title: '上下文模板',
				dataIndex: 'name',
				width: '15%',
				dataType: 'input',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
				editable: true,
			}, {
				title: '认证服务地址',
				dataIndex: 'cookie',
				width: '15%',
				dataType: 'select',
				editorOptions: { options: [{ label: 'test', value: '1' }, { label: 'test2', value: '2' }, { label: 'test3', value: '3' },], },
				editable: true,
			}, {
				title: '操作',
				width: '15%',
				dataIndex: 'actions',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
				render: (text, record) => {
					const editable = this.isEditing(record);
					return (
						<div >
							{editable ? (
								<span>
									<EditableTableContext.Consumer>
										{form => (
											<a onClick={() => this.saveRecord(form, record)}>保存</a>
										)}
									</EditableTableContext.Consumer>
									<Divider type="vertical" />
									<a onClick={() => this.cancel(record)}>取消</a>
								</span>
							) : (
									<span>
										<a onClick={() => this.edit(record.id)}>编辑</a>
										<Divider type="vertical" />
										<Popconfirm
											title="确认删除?"
											onConfirm={() => this.routeTemplateDeleteRow(record.id)}
										>
											<a>删除</a>
										</Popconfirm>
									</span>
								)}
						</div>
					);
				}
			},
		]
	}

	isEditing = record => record.id === this.state.editingKey;

	componentDidMount() {
	}

	cancel = (record) => {
		if (record.newRow) {
			this.state.data.pop();
			this.setState({ data: this.state.data, editingKey: '' });
		} else {
			this.setState({ editingKey: '' });
		}
	};

	saveRecord = (form, record) => {
		form.validateFields((error, row) => {
			if (error) {
				return;
			} else {
				// let row = this.state.data.filter(item => item.id = this.state.editingKey);
				this.setState({ data: this.state.data, editingKey: '' })
			}
		});
	}

	edit = (key) => {
		this.setState({ editingKey: key });
	}


	render() {
		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell,
			},
		};
		const columns = this.columns.map((col) => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => {
					return {
						record,
						col,
						editing: this.isEditing(record),
					}
				},
			};
		});

		const routeTitle = <span>路由模板配置<span style={{ fontSize: 12, marginLeft: 50, color: 'rgb(190,190,190)' }}>环境内应用对外开放时可使用的路由地址模板配置，请管理员确保模板中配置的地址能正确的访问到应用路由的业务地址</span></span>

		return (
			<Card title={routeTitle} style={{ margin: '24px 0' }}>
				<Table
					loading={this.state.loading}
					components={components}
					columns={columns}
					dataSource={this.state.data}
					rowKey='id'
					rowClassName="editable-row"
					pagination={false}
				>
				<Button block icon='plus' style={{ marginTop: 24 }} type='dashed'>添加访问地址</Button>
				</Table>
			</Card>
		)
	}
}

export default RouteTemplate
