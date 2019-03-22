import React, { Component } from 'react'
import { Drawer, Table, Input } from 'antd'
import { getRoleResources } from '../../../services/aip';
import Link from 'react-router-dom/Link';

const Search = Input.Search;
export default class FunctionListDrawer extends Component {
	state = {
		loading: false,
		datas: [],
	}
	allDatas=[];
	componentDidUpdate(prevProps, prevState) {
		if (prevProps.record!==this.props.record) {
			this.loadData(this.props.record.appId,this.props.record.roleId);
		}
	}

	loadData = (appId,roleId,params) => {
		this.setState({loading:true})
		getRoleResources(appId, roleId,params).then(data => {
			this.allDatas = data;
			this.setState({datas:data,loading:false});
		})
	}

	handleSearch = (value) => {
		if(value){
			const searchDatas = this.allDatas.filter(data=>{
				return data.name.includes(value);
			})
			this.setState({datas:searchDatas});
		}else this.setState({datas:this.allDatas});
	}

	render() {
		const columns = [{
			title: '功能名称',
			dataIndex: 'name',
			render:(text,record)=>{
				return <Link to={`/functions/applications/${record.appId}/functional/${record.id}`}>{text}</Link>
			}
		}, {
			title: '描述',
			dataIndex: 'desc',
		}];
		return (
			<Drawer
				title={this.props.title}
				width={480}
				placement="right"
				onClose={this.props.onClose}
				visible={this.props.visible}
				mask={true}
			>
				<Search
					placeholder='功能名称'
					onSearch={this.handleSearch}
					style={{marginBottom:12}}
				/>
				<Table rowKey='id' columns={columns} size='middle' loading={this.state.loading} dataSource={this.state.datas} pagination={false}></Table>
			</Drawer>
		)
	}
}
