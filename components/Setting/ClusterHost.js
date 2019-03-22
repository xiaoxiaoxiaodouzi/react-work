import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Table,Card,Button} from 'antd';
import {SearchForm} from 'c2-antd-plus'


export default class ClusterHost extends Component {
	static propTypes = {
		prop: PropTypes
	}

	state={
		data:[]
	}



	render() {

		const items=[
			{label:'IP',name:'ip',type:'input'},
			{label:'状态',name:'status',type:'select',options:[{label:'在线',key:'',value:'1'},{label:'离线',key:'',value:'2'},{label:'维护',key:'',value:'3'},]},
		]

		const columns=[
			{title:'IP',dataIndex:''},
			{title:'主机名',dataIndex:''},
			{title:'Docker版本',dataIndex:''},
			{title:'CPU数',dataIndex:''},
			{title:'内存(GB)',dataIndex:''},
			{title:'已分配CPU数',dataIndex:''},
			{title:'已分配内存(GB)',dataIndex:''},
			{title:'容器数',dataIndex:''},
			{title:'状态',dataIndex:''},
			{title:'操作',dataIndex:''},
		]

		return (
			<Card>
				<SearchForm labelSpan={3} items={items} colNum={3}/>

				<Button type='primary' icon='plus' style={{marginBottom:'12px'}}>新增</Button>

				<Table
					columns={columns}
					dataSource={this.state.data}
					rowKey='id'
				/>
			</Card>
		)
	}
}
