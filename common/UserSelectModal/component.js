import React from "react";
import { Modal, Table, Button, Row, Col, message, Input, Alert, Tag } from "antd";
import {OrgCategorySelectTree,OrgSelectTree} from 'c2-orguser';
import { base } from "../../services/base";

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
			data: [],
			searchText: '',
			category:'',
			org:'',
			orgId:''
		}
	
		this._onHandleOk = this._onHandleOk.bind(this);
		this._rowSelection = this._rowSelection.bind(this);
		this._onRowClick = this._onRowClick.bind(this);
	}

	componentDidMount() {
		// eslint-disable-next-line
		var selectUsers = this.props.selectUsers && [...this.props.selectUsers] || [];
		let disabledUsers = this.props.disabledUsers || [];
		selectUsers.forEach(u => {
			u.closable = false;
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
			// eslint-disable-next-line
			var selectUsers = nextProps.selectUsers && [...nextProps.selectUsers] || [];
			var disableData = nextProps.disableData || [];
			disableData.forEach(u => {
				u.closable = false;
			})
			var selectedRowKeys = this.getSelectUserIds(selectUsers);
			this.setState({
				selectUsers: selectUsers,
				disabledUsers: disableData,
				selectedRowKeys: selectedRowKeys,
			})
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

	//拉取分页数据
	_tableOnChange(pagination, filters, sorter) {
		this.props.onChange(pagination, Object.assign(filters, { name: this.state.searchText,categoryId:this.state.category,orgId:this.state.orgId}), sorter)
	}

	_onHandleOk() {
		this.setState({ searchText: '' })
		this.props.onHandleOk(this.state.selectUsers);
	}

	//删除已选用户
	_delUser(userId) {

		var users = this.state.selectUsers;
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === userId) {
				users.splice(i, 1);
			}
		}
		var ids = this.getSelectUserIds(users);
		this.setState({
			selectUsers: users,
			selectedRowKeys: ids
		});
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
			onSelectAll: (selected, selectedRows, changeRows) => {
				var rowKeys = [];
				var users = [];
				if (selected) {
					rowKeys = [...this.state.selectedRowKeys];
					users = [...this.state.selectUsers];
					changeRows.forEach((element) => {
						users.push(element);
						rowKeys.push(element.id);
					})
				} else {
					this.state.selectUsers.forEach((element) => {
						var user = element;
						for (var n = 0; n < changeRows.length; n++) {
							if (user.id === changeRows[n].id) {
								user = null;
								break;
							}
						}
						if (user !== null) {
							rowKeys.push(user.id);
							users.push(user)
						}
					})
				}

				this.setState({
					selectedRowKeys: rowKeys,
					selectUsers: users
				})
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

	handleCancle = () => {
		this.setState({ searchText: '' })
		this.props.onCancel();
	}

	_onSearch() {
		this.props.onSearch && this.props.onSearch(this.state.searchText,this.state.category,this.state.org);
	}
	//分类机构下拉树改变后的回调
	_onCategoryChange = (value) => {
		if(value){
			this.setState({ category: value,org:null});
			this.props.onSearch(this.state.searchText,value,this.state.orgId);
		}
		
	}
	//机构下拉树改变后的回调
	_onOrgChange = (value) => {
		if(value){
			this.setState({ org: value,orgId:value.value});
			this.props.onSearch(this.state.searchText,this.state.category,value.value);
		}
		
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
				onCancel={() => this.handleCancle()}
				maskClosable={false}
				width={this.props.width}>
				{this.props.description && <Alert description={this.props.description} type="info" style={{ marginBottom: "10px" }} />}
				<strong style={{ marginRight: 8, marginTop: 15 }}>{this.props.mark}:</strong><br />
				<div className="user-selected-tags" style={{ minHeight: 32 }}>
					{
						this.state.selectUsers.map(u => {
							return <Tag key={u.id} closable={u.closable == null ? true : u.closable} onClose={e => { this._delUser(u.id) }}>{u.name}</Tag>
						})
					}
				</div>
				<Row type={'flex'} align="middle" style={{ paddingTop: 10, paddingBottom: 10 }}>
					<Col><label>机构分类:</label></Col>
					<Col style={{ paddingLeft: 10, paddingRight: 10 }}>
						<OrgCategorySelectTree 
						style={{ width: "160px" }}
						value={this.state.category}
						onSelect={this._onCategoryChange}
						ref="categoryOrgSelect"
						ampEnvId={base.currentEnvironment.id}
						/>
					</Col>
					<Col><label>机构:</label></Col>
					<Col style={{ paddingLeft: 10, paddingRight: 10 }}>
						<OrgSelectTree 
						style={{ width: "160px" }}
						category={this.state.category}
						value={this.state.org}
						onChange={this._onOrgChange}
						ref="orgSelectTree"
						/>
					</Col>
					<Col><label>姓名:</label></Col>
					<Col style={{ paddingLeft: 10, paddingRight: 10 }}><Input value={this.state.searchText} onPressEnter={this._onSearch.bind(this)} onChange={(event) => { this.setState({ searchText: event.target.value }) }} /></Col>
					<Col><Button type="primary" htmlType="submit" onClick={this._onSearch.bind(this)}>查询</Button></Col>
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
