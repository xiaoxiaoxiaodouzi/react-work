import React, { Component } from 'react'
import { Table, Divider, Popconfirm, Button } from 'antd'
import EditableFormRow from '../../../common/EditableTable/EditableRow'
import EditableCell from '../../../common/EditableTable/EditableCell'
import EditableTableContext from '../../../context/EditableTableContext';

export class ServieAddress extends Component {
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
				title: '服务端地址',
				dataIndex: 'address',
				dataType: 'input',
				editorOptions:{required:true,message:`请输入路由模板名称!`},
				editable: true,
			},
			{
				title: '端口',
				dataIndex: 'context',
				width: '15%',
				dataType: 'input',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
				editable: true,
			},
			{
				title: '权重',
				dataIndex: 'name',
				width: '15%',
				dataType: 'number',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
				editable: true,
			}, {
				title: '健康状态',
				dataIndex: 'cookie',
				width: '15%',
				dataType: 'input',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
			}, {
				title: '操作',
				width: '15%',
				dataIndex: 'actions',
				// editorOptions:{required:true,message:`请输入路由模板名称!`},
				render: (text, record) => {
					const editable = this.isEditing(record);
					return (
						<div>
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

		return (
			<div>
				<Table
					loading={this.state.loading}
					components={components}
					columns={columns}
					dataSource={this.state.data}
					rowKey='id'
					pagination={false}
				/>
				<Button block icon='plus' style={{ marginTop: 24 }} type='dashed'>添加路由版本</Button>
			</div>
		)
	}
	
}

export default ServieAddress