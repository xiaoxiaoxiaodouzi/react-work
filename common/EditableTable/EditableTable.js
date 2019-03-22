import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Divider, Popconfirm } from 'antd'
import EditableFormRow from './EditableRow';
import EditableCell from './EditableCell'
import EditableTableContext from '../../context/EditableTableContext';

export class EditableTable extends Component {

	static propTypes = {
		columns: PropTypes.array.isRequired,  	//将数据传输到父组建,
		data: PropTypes.array.isRequired,
		addNewRow: PropTypes.object,		//添加新数据
		addNewRowButtonText: PropTypes.string,			//新增按钮文字
		recordSave: PropTypes.func,   		//操作列保存方法,有两个参数（type,record）
		rowKey: PropTypes.string,				//表格主键
		// recordCancel: PropTypes.func,   		//操作列取消方法
		// recordEdit: PropTypes.func,   		//操作列编辑方法
		recordDeleteRow: PropTypes.func,   		//操作列删除方法
		editCol: PropTypes.bool,				//是否需要操作列
		// editingKey:''
	}

	constructor(props) {
		super(props);
		this.state = {
			columns: props.columns,
			data: props.data,
			editingKey: '',
			rowKey: this.props.rowKey || 'id',
			loading:false
		}
	}

	componentDidMount() {
		let row = {
			title: '操作',
			dataIndex: 'actions',
			width: 100,
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
									<a onClick={() => this.edit(record)}>编辑</a>
									<Divider type="vertical" />
									<Popconfirm
										title="确认删除?"
										onConfirm={() => this.TemplateDeleteRow(record)}
									>
										<a>删除</a>
									</Popconfirm>
								</span>
							)}
					</div>
				);
			},
		}
		if (this.props.editCol) this.state.columns.push(row);
		this.setState({ columns: this.state.columns })
	}

	componentDidUpdate(props) {
		if (JSON.stringify(props.data) !== JSON.stringify(this.props.data)) {
			this.setState({ data: this.props.data,editingKey:""})
		}
	}


	addTemplateRow = e => {
		const newId = Math.random();
		if (this.props.addNewRow) {
			this.state.data.push(this.props.addNewRow);
		}
		this.setState({ editingKey: newId, data: this.state.data });
	}

	isEditing = record => record.id === this.state.editingKey;

	edit = (record) => {
		this.setState({ editingKey: record[this.state.rowKey] });
	}

	cancel = (record) => {
		if (record.newRow) {
			this.state.data.pop();
			this.setState({ data: this.state.data, editingKey: '' });
		} else {
			this.setState({ editingKey: '' });
		}
	};

	TemplateDeleteRow = record => {
		/* let rowKey = this.state.rowKey;
		const data = this.state.data.filter(d => d[rowKey] !== record[rowKey]);
		this.setState({ data }); */
		this.props.recordSave('delete', record)
	}

	saveRecord = (form, record) => {
		form.validateFields((error, row) => {
			if (error) return;
			let obj = Object.assign(record, row)
			this.setState({editingKey:""})
			this.props.recordSave('save', obj);
		})
	}

	render() {
		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell,
			},
		};

		const columns = this.state.columns.map((col) => {
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
			<Table
				components={components}
				dataSource={this.state.data}
				columns={columns}
				rowKey={this.state.rowKey}
				size={this.props.size || "middle"}
				loading={this.state.loading}
			>
				{this.props.addNewRow && <Button type="dashed" icon="plus" style={{ width: '100%', margin: '12px 0 24px' }} onClick={this.addTemplateRow}>{this.props.addNewRowButtonText}</Button>}
			</Table>
		)
	}
}

export default EditableTable
