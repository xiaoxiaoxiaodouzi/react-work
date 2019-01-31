import React, { Component } from "react";
import { Modal, Form, Select, Button, Radio } from "antd";
import { queryClusters } from "../../services/cce";
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ClusterSelectModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clusterName: this.props.clusterName,
			clusters: [],
			clusterSelect: {},
			loading: false,
			defaultValue: ''
		}
		this.clusterName = '';
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.clusterName) {
			this.setState({
				clusterName: nextProps.clusterName
			})
		}
		if (nextProps.clusterId !== this.props.clusterId && nextProps.clusterId){
			this.setState({
				clusterId: nextProps.clusterId
			},()=>{
				this._getClusters();
			})
		}
	}

	_getClusters = () => {
		let clusterId=this.state.clusterId;
		queryClusters().then(data => {
			let clusters = [];
			data.forEach((dt, i) => {
				if (dt.id !== clusterId) {
					let cluster = {};
					cluster.value = dt.id;
					cluster.label = dt.name;
					clusters.push(cluster);
				}
			})
			if(clusters.length>0){
				this.setState({
					clusters: clusters,
					defaultValue: clusters[0].value,
					clusterSelect: clusters[0].value
				});
				this.clusterName = clusters[0].label;
			}
		});
	}

	_selectChange = (e) => {
		this.state.clusters.forEach(dt => {
			if (dt.value === e.target.value) {
				this.clusterName = dt.label;
			}
		})
		this.setState({
			clusterSelect: e.target.value
		})
	}
	_handleCancel = () => {
		this.props.onCancel();
	}
	_onOk = () => {
		this.setState({
			loading: true
		})
		this.props.onOk(this.state.clusterSelect, this.clusterName, this);

	}

	selectView = () => {
		let option = this.state.clusters.map((cluster, i) => {
			if (cluster.id === this.state.clusterId) {
				return null;
			} else {
				return <Option key={cluster.id}>
					{cluster.name}
				</Option>
			}
		})
		return option;
	}

	render() {
		const formItemLayout = {
			labelCol: {
				span: 5,
			},
			wrapperCol: {
				span: 14,
			}
		}
		return <Modal
			title="选择集群"
			visible={this.props.visible}
			destroyOnClose={true}
			onCancel={this._handleCancel}
			footer={
				[
					<Button key="cancel" onClick={this._handleCancel}>取消</Button>,
					<Button key="submit" loading={this.state.loading} type="primary" onClick={this._onOk}>确定</Button>
				]
			}
		>
			<Form layout="horizontal">
				<Form.Item {...formItemLayout} label="当前集群:">
					{this.state.clusterName}
				</Form.Item>

				<Form.Item {...formItemLayout} label="目标集群:">

					<RadioGroup options={this.state.clusters}
						defaultValue={this.state.defaultValue} onChange={this._selectChange}></RadioGroup>
				</Form.Item>
			</Form>

		</Modal>
	}
}

export default ClusterSelectModal;