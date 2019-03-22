import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'antd'
import { DynamicFormEditor } from 'c2-antd-plus';

export class ComponentDeploy extends Component {
	static propTypes = {
		props:PropTypes.object,
		visible:PropTypes.bool.isRequired,
		title:PropTypes.string.isRequired
	}

	state={
		name:'',
		code:'',
	}

	static getDerivedStateFromProps(props,state){
		if(props.name!==state.name || props.code!==state.code){
			return ({code:props.code,name:props.name})
		}
		return null;
	}

	onCancel=()=>{
		this.props.onCancel();
	}

	renderItems=()=>{
		let name=this.state.name;
		if(name==='monitor'){
			let Items=[
				{label:'registry',name:'镜像仓库',initialValue:'registry.c2cloud.cn'},
				{label:'appNode',name:'k8s环境监控应用节点'},
				{label:'masterNode',name:'k8s环境主节点'},
			]
			return <DynamicFormEditor item={Items} />
		}
	}

	onOk=()=>{

	}

	render() {
		
		return (
			<Modal
				visible={this.props.visible}
				onOk={this.onOk}
				onCancel={this.onCancel}
				title={this.props.title}
			>
				{this.renderItems()}
			</Modal>
		)
	}
}

export default ComponentDeploy
