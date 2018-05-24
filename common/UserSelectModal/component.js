import React from "react";
import { Modal, Table, Button, Row, Col, message, Input, Alert, Tag } from "antd";

class UserSelectModal extends React.Component {

	static defaultProps = {
		onCancel: () => null,
		onHandleOk: () => null,
		width: 700
	}

	constructor(props) {
		super(props);

		this.state = {
			selectUsers: [],
			disabledUsers: [],
			data: []
		}

		this._onHandleOk = this._onHandleOk.bind(this);
		this._rowSelection = this._rowSelection.bind(this);
		this._onRowClick = this._onRowClick.bind(this);
	}

	componentDidMount() {
		let selectUsers = [];
		if (this.props.selectData) selectUsers = [...this.props.selectData];
		let disabledUsers = this.props.disabledUsers || [];
		selectUsers.forEach(u => {
			u.closable = true;
		})
		let selectedRowKeys = this.getSelectUserIds(selectUsers);
		this.setState({
			selectUsers: selectUsers,
			disabledUsers: disabledUsers,
			selectedRowKeys: selectedRowKeys,
		})
	}

	componentWillReceiveProps(nextProps) {

		if (!this.props.visible && nextProps.visible) {
			this._updateSelectUsers(nextProps.selectData, nextProps.disableData);
		}

		if (nextProps.disableData !== this.props.disableData) {
			this.setState({
				disabledUsers: nextProps.disableData
			})
		}

	}
	//*********************************************************************** */
	//*********************************EVENT********************************* */
	//*********************************************************************** */
	_updateSelectUsers(selectData = [], disableData = []) {
		selectData.forEach(u => {
			u.closable = true;
		})
		var selectedRowKeys = this.getSelectUserIds(selectData);
		this.setState({
			selectUsers: selectData,
			disabledUsers: disableData,
			selectedRowKeys: selectedRowKeys,
		})
	}

	//拉取分页数据
	_tableOnChange(pagination, filters, sorter) {
		this.props.onChange(pagination, filters, sorter)
	}

	_onHandleOk() {
		this.props.onHandleOk(this.state.selectUsers);
	}

	//删除已选用户
	_delUser(userId) {
		var users = this.state.selectUsers;
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === userId) {
				users.splice(i, 1);
				break;
			}
		}
		var ids = this.getSelectUserIds(users);
		this.setState({ selectUsers: users, selectedRowKeys: ids });
	}

	//拿到数组ids
	getSelectUserIds = selectUsers => {
		let ids = [];
		selectUsers.forEach(v => {
			ids.push(v.id);
		})
		return ids;
	}

	//行选中
	_rowSelection() {
		let obj = {
			selectedRowKeys: this.state.selectedRowKeys,
			onSelect: (record, selected, selectedRows) => {
				let selectedRowKeys = this.state.selectedRowKeys;
				let closable = !this.state.disabledUsers.map(u => u.id).includes(record.id);
				record.closable = closable;
				if (selected) {
					this.state.selectUsers.push(record);
					selectedRowKeys.push(record.id);
				} else {
					for (let i = 0; i < this.state.selectUsers.length; i++) {
						let u = this.state.selectUsers[i];
						if (u.id === record.id) {
							this.state.selectUsers.splice(i, 1);
							break;
						}
					}
					selectedRowKeys = this.state.selectUsers.map(u => u.id);
				}
				this.setState({ selectUsers: this.state.selectUsers, selectedRowKeys: selectedRowKeys });
			},
			getCheckboxProps: record => {
				let disabled = false;
				this.state.disabledUsers.forEach(du => {
					if (du.id === record.id) {
						disabled = true;
					}
				});
				return { disabled: disabled };
			}
		}
		return obj;
	}

	//行点击
	_onRowClick(record, index, event) {
		let unselect = true;
		//禁用行忽略
		let disabledRow = false;
		this.state.disabledUsers.forEach(du => {
			if (record.id === du.id) disabledRow = true;
		})
		if (disabledRow) {
			message.info('该用户不能进行操作。');
			return;
		}

		let closable = !this.state.disabledUsers.map(u => u.id).includes(record.id);
		record.closable = closable;

		for (let i = 0; i < this.state.selectUsers.length; i++) {
			let u = this.state.selectUsers[i];
			if (u.id === record.id) {
				unselect = false;
				this.state.selectUsers.splice(i, 1);
				break;
			}
		}
		if (unselect) {
			this.state.selectUsers.push(record);
		}

		let ids = this.getSelectUserIds(this.state.selectUsers);
		this.setState({ selectUsers: this.state.selectUsers, selectedRowKeys: ids });
	}

	_onSearch() {
		this.props.onSearch && this.props.onSearch(this.searchText);
	}
	//*********************************************************************** */
	//***********************************UI********************************** */
	//*********************************************************************** */

	render() {

		return (
			<Modal
				title={this.props.title}
				style={this.props.style}
				visible={this.props.visible}
				onOk={this._onHandleOk}
				onCancel={this.props.onCancel}
				maskClosable={false}
				width={this.props.width}>
				{this.props.description && <Alert description={this.props.description} type="info" style={{ marginBottom: "10px" }} />}
				<strong style={{ marginRight: 8, marginTop: 15 }}>{this.props.mark}:</strong><br />
				<div className="user-selected-tags" style={{ minHeight: 32 }}>
					{
						this.state.selectUsers.map(u => {
							return <Tag key={u.id} closable={u.closable} onClose={e => { this._delUser(u.id) }}>{u.name}</Tag>
						})
					}
				</div>
				<Row type={'flex'} align="middle" style={{ paddingTop: 10, paddingBottom: 10 }}>
					<Col><label>姓名:</label></Col>
					<Col style={{ paddingLeft: 10, paddingRight: 10 }}><Input onPressEnter={this._onSearch.bind(this)} onChange={(event) => { this.searchText = event.target.value }} /></Col>
					<Col><Button type="primary" onClick={this._onSearch.bind(this)}>查询</Button></Col>
				</Row>
				<Table
					rowKey="id"
					size="small"
					columns={this.props.columns}
					dataSource={this.props.dataSource}
					pagination={this.props.pagination}
					loading={this.state.loading}
					rowSelection={this._rowSelection()}
					onRowClick={this._onRowClick}
					onChange={this._tableOnChange.bind(this)} />
			</Modal>
		);
	}
}

export default UserSelectModal;
