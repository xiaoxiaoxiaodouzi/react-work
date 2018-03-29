import React, { Component } from "react";
import { Row, Tag, Tooltip } from "antd";
import C2Fetch from '../../utils/Fetch';
import ModalUI from './component';

const DefaultColumns = [
	{ title: "姓名", dataIndex: "name", key: "name" },
	{ title: "手机号", dataIndex: "phone", key: "phone" },
	{ title: "工号", key: "workno", dataIndex: "workno" }
];

class UserSelectModal extends Component {

	static defaultProps = {
		title: '设置管理员',
		description: '机构管理员能够看到该机构和机构的所有下级机构人员，并且可以对人员进行应用和角色的权限授予。',
		mark: '管理租户管理员',
		selectedUsers: [],
		disableUsers: [],
		dataIndex: {
			dataIdIndex: 'id', dataNameIndex: 'name'
		}
	}

	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			dataSource: [],
			selectedUsers: [],
			disableUsers: []
		}

		this._updateUserDatas = this._updateUserDatas.bind(this);
		this._onSearch = this._onSearch.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	componentDidMount() {
		this._updateUserDatas(this.props.selectedUsers, this.props.disableUsers);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedUsers !== this.props.selectedUsers || nextProps.disableUsers !== this.props.disableUsers) {
			this._updateUserDatas(nextProps.selectedUsers, nextProps.disableUsers)
		}
	}
	//*********************************************************************** */
	//*********************************EVENT********************************* */
	//*********************************************************************** */
	_updateUserDatas(selectedUsers, disableUsers) {
		var dataIdIndex = this.props.dataIndex.dataIdIndex;
		var dataNameIndex = this.props.dataIndex.dataNameIndex;
		var obj = {}
		if (selectedUsers) {
			var reSelectedUsers = [];
			selectedUsers.forEach((element) => {
				element.id = element[dataIdIndex];
				element.name = element[dataNameIndex];
				reSelectedUsers.push(element);
			})
			obj.selectedUsers = reSelectedUsers;
		}
		if (disableUsers) {
			var reDisableUsers = [];
			disableUsers.forEach((element) => {
				element.id = element[dataIdIndex];
				element.name = element[dataNameIndex];
				reDisableUsers.push(element);
			})
			obj.disableUsers = reDisableUsers;
		}
		this.setState(obj);
	}

	_show() {
		this.setState({
			visible: true
		});
		this._onChange({ current: 1 });
	}

	_onSearch(text) {
		this._onChange({ current: 1 },{name:text});
	}

	_onHandleOk(users = []) {
		this.setState({
			visible: false
		})
		var resultUsers = [];
		var th = this;
		users.forEach((element) => {
			element[th.props.dataIndex.dataIdIndex] = element.id;
			element[th.props.dataIndex.dataNameIndex] = element.name;
			resultUsers.push(element)
		})
		this.props.onOk && this.props.onOk(resultUsers);
	}

	_onChange(pagination, filters = {}) {
		Object.assign(filters, { page: pagination.current, rows: 6 })
		C2Fetch.get(`proxy/uop/v1/users`, filters)
			.then((data) => {
				var pagination = { current: data.pageIndex, total: data.total, pageSize: data.pageSize };
				this.setState({
					dataSource: data.contents,
					pagination: pagination
				});
			})
			.catch((e) => {
				console.error(e);
			})
	}
	//*********************************************************************** */
	//***********************************UI********************************** */
	//*********************************************************************** */
	render() {
		var dom = null;
		var th = this;
		var selectedUsers = this.state.selectedUsers;
		if (this.props.renderButton) {
			//自定义实现Button
			dom = (
				<a onClick={() => { this._show() }}>
					{this.props.renderButton(selectedUsers)}
				</a>
			)
		} else {
			if (selectedUsers.length < 1) {
				dom = (
					<Row>
						<a onClick={() => { this._show() }}><Tooltip title={'点击编辑'}><p>未指定</p></Tooltip></a>
					</Row>
				)
			} else {
				dom = (
					<a onClick={() => { this._show() }}>
						<Tooltip title={'点击编辑'}>
							{selectedUsers.map((element) => {
								return <Tag key={element[th.props.dataIndex.dataIdIndex] || element.id}>{element[th.props.dataIndex.dataNameIndex] || element.name}</Tag>
							})}
						</Tooltip>
					</a>
				)
			}
		}

		return (
			<Row type={'flex'}>
				{dom}
				<ModalUI
					title={this.props.title}
					description={this.props.description}
					mark={this.props.mark}
					visible={this.state.visible}
					columns={DefaultColumns}
					dataSource={this.state.dataSource}
					pagination={this.state.pagination}
					selectData={this.state.selectedUsers.slice(0)}
					disableData={this.state.disableUsers.slice(0)}
					onSearch={this._onSearch}
					onCancel={() => { this.setState({ visible: false }) }}
					onHandleOk={this._onHandleOk.bind(this)}
					onChange={this._onChange}
					width={710} />
			</Row>
		)
	}
}

export default UserSelectModal;
