import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Modal,Table,Alert,message} from 'antd';
import {getSynServices,synServices} from '../../../services/aip'


export class SynService extends Component {
	static propTypes = {
		visible:PropTypes.bool,	//模态框的状态
		title:PropTypes.string,	//模态框标题
	}
	
	constructor(props) {
		super(props);
		this.state={
			total:0,
			tobesync:0,
			services:[],
			loading:false,
			name:'',
			selectedRows:[],
			
		}
	}

	
	componentWillReceiveProps = (nextProps) => {
		if(nextProps.groupId && nextProps.visible &&nextProps!==this.props){
			this.loadData(nextProps.groupId)
		}
	}

	loadData=(groupId)=>{
		getSynServices(groupId).then(res=>{
			this.setState({...res})
		})
	}

	handleOk=()=>{
		let ids=[];
		if(this.state.selectedRows.length>0){
			this.state.selectedRows.forEach(e=>{
				ids.push(e.id);
			})
			synServices(this.props.groupId,ids).then(data=>{
				message.success('同步服务成功')
				this.props.handleOk();
			})
		}else{
			message.info('请至少选择一项')
		}
	}

	handleCancle=()=>{
		this.props.handleOk();
	}

	render() {
		const column=[{
			title:'服务名称',
			dataIndex:'name',
		},{
			title:'服务路径',
			dataIndex:'uri'
		}]

		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({selectedRows})
			},
			getCheckboxProps: record => ({
				disabled: record.name === 'Disabled User', // Column configuration not to be checked
				name: record.name,
			}),
		};

		let title=`服务组${this.state.name}下共有${this.state.total}个服务，以下${this.state.tobesync}个服务在网关中不存在，为不可用状态。请根据需要选择同步或忽略`
		return (
			<Modal
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancle}
				okText='同步'
				destroyOnClose
				title={this.props.title?this.props.title:'同步服务'}
			>
				<Alert message={title} type='info' style={{marginBottom:24}}/>
				<Table
					columns={column}
					 rowKey="id" 
					dataSource={this.state.services}
					loading={this.state.loading}
					pagination={this.state.pagination}
					rowSelection={rowSelection} 
				/>
			</Modal>
		)
	}
}

export default SynService
