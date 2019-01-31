import React, { Component } from "react";
import { Row, Tag, Tooltip } from "antd";
import C2Fetch from '../../utils/Fetch';
import ModalUI from './component';
import { base } from "../../services/base";

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
			disableUsers: [],
			pagination:{ current: 1, total: 0, pageSize: 6}
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
			var selectUsers = [];
			var tmp = {};
			//var reSelectedUsers = [];
			selectedUsers.forEach((element) => {
				element.id = element[dataIdIndex];
				element.name = element[dataNameIndex];
				if (tmp[element.id] !== true) {
					tmp[element.id] = true;
					selectUsers.push(element);
				}
			})
			obj.selectedUsers = selectUsers;
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
	}

	_onSearch(text,categoryId,orgId,cascadeCheck) {
		this._onChange({ current: 1 }, { name: text ,categoryId:categoryId,orgId:orgId,cascade:cascadeCheck},6);
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

	_onChange(pagination, filters ,pageSize) {
		if (!this.props.tenantId) {
			if(filters.orgId && filters.orgId !== ''){
				Object.assign(filters, { page: pagination.current, rows: pageSize })
				C2Fetch.get(`proxy/uop/v1/orgs/${filters.orgId}/users`, filters,true,{'AMP-ENV-ID': "1"})
				.then((data) => {
					var pagination = { current: data.pageIndex, total: data.total, pageSize: pageSize};
					pagination.showSizeChanger = true;
					
					pagination.pageSizeOptions=this._getPageSize(data.total);
					this.setState({
						dataSource: data.contents,
						pagination: pagination
					});
				})
				.catch((e) => {
					console.error(e);
					base.ampMessage('获取用户失败' );
				})
			}
			
		} else {//兼容租户数据源
			Object.assign(filters, { page: pagination.current, rows: pageSize },{userName:filters.name});
			C2Fetch.get(`tp/v1/tenants/${this.props.tenantId}/users`, filters, '获取租户下的所有用户失败',{'AMP-ENV-ID': "1"})
				.then(data => {
					var pagination = { current: data.pageIndex, total: data.total, pageSize: pageSize};
					pagination.showSizeChanger = true;
					pagination.pageSizeOptions=this._getPageSize(data.total);
					this.setState({
						dataSource: data.contents,
						pagination: pagination
					});
				});
		}
	}

	//计算页面大小
	_getPageSize = (total) =>{
		let options = ['6'];
		if(total > 6 && total <=50){
			options.push(total);
		}else if(total > 50 && total <= 100){
			options.push('50');
			options.push(total);
		}else if(total > 100){
			options.push('50');
			options.push('100');
			options.push(total);
		}

		return options;
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
						<a onClick={() => { this._show() }}><Tooltip title={'点击编辑'}>未指定</Tooltip></a>
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
					selectUsers={this.state.selectedUsers.slice(0)}
					disableData={this.state.disableUsers.slice(0)}
					onSearch={this._onSearch}
					onCancel={() => { this.setState({ visible: false }) }}
					onHandleOk={this._onHandleOk.bind(this)}
					onChange={this._onChange}
					width={800} />
			</Row>
		)
	}
}

export default UserSelectModal;
