import React, { Component } from "react";
import {Modal,Table,message,Alert,Tag} from "antd";

class DataSelectModal extends Component{

	constructor(props) {
		super(props);

		this.state = {
			selectUsers: [],
			disabledUsers: [],
			data: [],
			searchText: '',
			category:'',
			org:'',
			orgId:'',
            cascadeCheck:false,
            pagination:{ pageSize: 6},
			loading:true,
			dataSource:[],
		}

		this.tagId = "id";
		this.tagName = "name";
	
		this._onHandleOk = this._onHandleOk.bind(this);
		this._rowSelection = this._rowSelection.bind(this);
		this._onRowClick = this._onRowClick.bind(this);
		this.getColumns = this.getColumns.bind(this);
		this.getSelectUserIds = this.getSelectUserIds.bind(this);
		this.handleCancle = this.handleCancle.bind(this);
		this._onHandleOk = this._onHandleOk.bind(this);
		this._tableOnChange = this._tableOnChange.bind(this);
		this._delUser = this._delUser.bind(this);

	}

	componentDidMount() {
		// eslint-disable-next-line
		var selectUsers = this.props.selectDatas && [...this.props.selectDatas] || [];
		let disabledUsers = this.props.disableData || [];
		selectUsers.forEach(u => {
			var id = u[this.tagId];
			let comUsers = disabledUsers.filter(d => id === u[this.tagId]);
			if(comUsers && comUsers.length > 0){
				u.closable = false;
			}else{
				u.closable = true;
			}	
		})
		disabledUsers.forEach(d => {
			d.closable = false;
		})
		let selectedRowKeys = this.getSelectUserIds(selectUsers);
		if(this.props.pagination){
			this.setState({
				pagination:this.props.pagination,

			})
		}
		this.setState({
			selectUsers: selectUsers,
			disabledUsers: disabledUsers,
			selectedRowKeys: selectedRowKeys,
            dataSource:this.props.dataSource,
            loading:this.props.loading
		})
		this.tagId = this.props.id?this.props.id:"id";
		this.tagName = this.props.name?this.props.name:'name';
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible) {
			// eslint-disable-next-line
			var selectUsers = nextProps.selectDatas && [...nextProps.selectDatas] || [];
			var disableData = nextProps.disableData || [];
			selectUsers.forEach(u => {
				var id = u[this.tagId];
				let comUsers = disableData.filter(d => d[this.tagId]=== id);
			if(comUsers && comUsers.length > 0){
				u.closable = false;
			}else{
				u.closable = true;
			}
			
			})
			disableData.forEach(u => {
				u.closable = false;
			})
			var selectedRowKeys = this.getSelectUserIds(selectUsers);
		
			if(nextProps.pagination){
				this.setState({
					pagination:nextProps.pagination,
	
				})
			}
			this.tagId = nextProps.id?nextProps.id:"id";
			this.tagName = nextProps.name?nextProps.name:'name';
			this.setState({
				selectUsers: selectUsers,
				disabledUsers: disableData,
				selectedRowKeys: selectedRowKeys,
                dataSource:nextProps.dataSource,
                loading:nextProps.loading
			})
		}
		if (nextProps.disableData !== this.props.disableData) {
			this.setState({
				disabledUsers: nextProps.disableData
			})
		}

    }
    
    //拿到数组ids
	getSelectUserIds(selectUsers) {
		let ids = [];
		selectUsers.forEach(v => {
			ids.push(v[this.tagId]);
		})
		return ids;
	}

    //行选中
	_rowSelection() {
		let obj = {
			selectedRowKeys: this.state.selectedRowKeys,
			onSelect: (record, selected, selectedRows) => {
				let selectedRowKeys = this.state.selectedRowKeys;
				let closable = !this.state.disabledUsers.map(u => u[this.tagId]).includes(record[this.tagId]);
				record.closable = closable;
				if (selected) {
					this.state.selectUsers.push(record);
					selectedRowKeys.push(record[this.tagId]);
				} else {
					for (let i = 0; i < this.state.selectUsers.length; i++) {
						let u = this.state.selectUsers[i];
						if (u[this.tagId] === record[this.tagId]) {
							this.state.selectUsers.splice(i, 1);
							break;
						}
					}
					selectedRowKeys = this.state.selectUsers.map(u => u[this.tagId]);
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
						rowKeys.push(element[this.tagId]);
					})
				} else {
					this.state.selectUsers.forEach((element) => {
						var user = element;
						for (var n = 0; n < changeRows.length; n++) {
							if (user[this.tagId] === changeRows[n][this.tagId]) {
								user = null;
								break;
							}
						}
						if (user !== null) {
							rowKeys.push(user[this.tagId]);
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
					if (du[this.tagId] === record[this.tagId]) {
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
			if (record[this.tagId] === du[this.tagId]) disabledRow = true;
		})
		if (disabledRow) {
			message.info('该用户不能进行操作。');
			return;
		}

		let closable = !this.state.disabledUsers.map(u => u[this.tagId]).includes(record[this.tagId]);
		record.closable = closable;

		for (let i = 0; i < this.state.selectUsers.length; i++) {
			let u = this.state.selectUsers[i];
			if (u[this.tagId]=== record[this.tagId]) {
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
    //拉取分页数据
	_tableOnChange(pagination) {
		if(this.props.tableOnChange){
			this.props.tableOnChange(pagination)
		}	
	}

    handleCancle () {
		if(this.props.onCancel){
			this.props.onCancel();
		}
	}
    _onHandleOk() {
		if(this.props.onOk){
			this.props.onOk(this.state.selectUsers);
		}
	}
	//删除已选用户
	_delUser(userId) {

		var users = this.state.selectUsers;
		for (var i = 0; i < users.length; i++) {
			if (users[i][this.tagId] === userId) {
				users.splice(i, 1);
			}
		}
		var ids = this.getSelectUserIds(users);
		this.setState({
			selectUsers: users,
			selectedRowKeys: ids
		});
	}
    getColumns(){
        
        if(this.props.columns){
            let columns = [];
            this.props.columns.forEach(element => {
                columns.push({
                    key:element.key,
                    title:element.title,
                    dataIndex:element.dataIndex,
                    width:element.width
                })
            });

            return columns;
        }else{
            return [
                { title: "姓名", dataIndex: "name", key: "name" },
                { title: "手机号", dataIndex: "phone", key: "phone" },
                { title: "工号", key: "workno", dataIndex: "workno" }
            ];
            
        }
    }
    render(){

        return <Modal 
        title={this.props.title}
        style={this.props.style}
        visible={this.props.visible}
        onOk={this._onHandleOk}
        onCancel={() => this.handleCancle()}
        destroyOnClose={true}
        maskClosable={false}
        width={this.props.width?this.props.width : 600}>
        {this.props.description && <Alert description={this.props.description} type="info" style={{ marginBottom: "10px" }} />}
        <strong style={{ marginRight: 8, marginTop: 15 }}>{this.props.mark?this.props.mark:"已选数据"}:</strong><br />
        <div className="user-selected-tags" style={{ minHeight: 32 }}>
            { 
                this.state.selectUsers.length ?
                this.state.selectUsers.map(u => {
                    return <Tag key={this.props.id?u[this.props.id]:u.id} closable={u.closable == null ? true : u.closable} onClose={e => { this._delUser(this.props.id?u[this.props.id]:u.id) }}>{this.props.name?u[this.props.name]:u.name}</Tag>
                }):
                 <div style={{marginTop:10}}><a disabled='true'>还未选择数据</a></div>
                //<Alert description={'请选择用户！'} type="info" />
            }
        </div>
       
        <Table
            rowKey={this.props.id}
            size="small"
            showSizeChanger={true}
            columns={this.getColumns()}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            loading={this.state.loading}
            rowSelection={this._rowSelection()}
            onRowClick={this._onRowClick}
            onChange={this._tableOnChange.bind(this)}
            />
            </Modal>
    }
}

export default DataSelectModal;