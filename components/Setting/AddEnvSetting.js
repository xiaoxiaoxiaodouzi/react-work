import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Select, Input, Button, Row, Col } from 'antd'
import {base} from '../../services/base'
import {getClusters } from '../../services/cluster' 
//import {getChartList} from '../../services/setting'

const FormItem = Form.Item
const Option = Select.Option
class AddEnvSettingForm extends Component {
	static propTypes = {
		prop: PropTypes.object,
		visible: PropTypes.bool.isRequired,
		onChange: PropTypes.func.isRequired,
		addNewEnv: PropTypes.func.isRequired,
		title: PropTypes.string
	}

	state = {
		charts: [],
		cluster:[],
	}

	componentDidMount() {
		getClusters().then(data=>{
			this.setState({cluster:data})
		})
	}

	onOk = (e, value) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let params=this.formateParams(values);
			this.props.addNewEnv(params)
		})
	}
	
	//拼装参数
	formateParams=(values)=>{
		let configs=base.configs;
		let params={
			values:[]
		};
		params.chart_url=`http://${values.host}/api/charts/amp`;
		params.namespace='admin';
		params.reuse_name='true';
		params.values.push(`database.dbusername=${values.dbusername}`)
		params.values.push(`database.dbpassword=${values.dbpassword}`)
		params.values.push(`database.dblpPort=${values.dblpPort}`)
		params.values.push(`database.dbDatabaseName=${values.dbDatabaseName}`)
		params.values.push(`cce.nfsServerIp=${configs['cce.nfsServerIp']}`)
		params.values.push(`cce.nfsrootPath=${configs['cce.nfsrootPath']}`)
		params.values.push(`global.registryhost=${configs['global.registryhost']}`)
		params.values.push(`global.env=${values.code}`)
		params.values.push(`global.mainenv=false`)
		params.values.push(`global.gateway.proxyPort=${values.proxyPort}`)
		params.values.push(`global.ams.nodePort=${values.nodePort}`)
		params.values.push(`global.uop.nodePort=${''}`)
		params.values.push(`global.amsredis.nodePort=${''}`)
		params.values.push(`global.gateway.adminPort=${''}`)
		params.values.push(`global.gateway.datanasePort=${''}`)
		return params;
	}

	onCancel = () => {
		this.props.onChange()
	}

	getChart = () => {
		//调用查询未用过的端口号 然后分别放入proxyPort跟ams nodeport里面
		/* getChartList(this.state.host).then(data=>{
			debugger;
		}) */
		this.props.form.setFieldsValue({
			proxyPort:'--',
			nodePort:'--'
		})
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 7 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 12 },
				md: { span: 13 },
			},
		};
		return (
			<Modal
				bodyStyle={{ height: '500px', overflow: 'auto' }}
				visible={this.props.visible}
				title={this.props.title || '新增环境'}
				onOk={this.onOk}
				onCancel={this.onCancel}
			>
				<Form>
					<FormItem {...formItemLayout} label='名称' >
						{getFieldDecorator('name', {
							rules: [{ required: true, message: '请输入环境名称' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='编码' >
						{getFieldDecorator('code', {
							rules: [{ required: true, message: '请输入环境code' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='数据库ip端口号' >
						{getFieldDecorator('dblpPort', {
							rules: [{ required: true, message: '数据库ip端口号' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='数据库实例' >
						{getFieldDecorator('dbDatabaseName', {
							rules: [{ required: true, message: '数据库实例' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='数据库用户名' >
						{getFieldDecorator('dbusername', {
							rules: [{ required: true, message: '数据库用户名' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='数据库密码' >
						{getFieldDecorator('dbpassword', {
							rules: [{ required: true, message: '数据库密码' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='masterIp' >
						{getFieldDecorator('host', {
							rules: [{ required: true, message: '请输入masterIp' }],
						})(
							<Row>
								<Col span={16}>
									<Input onChange={e=>{this.setState({host:e.target.value})}} value={this.state.host}/>
								</Col>

								<Col span={6} style={{marginLeft:8}}>
									<Button type='primary' onClick={this.getChart}>获取chart</Button>
								</Col>
							</Row>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='chart' >
						{getFieldDecorator('chart', {
							rules:[{required: true, message: '请选择chart' }]
						})(
							<Select>
								{this.state.charts.map(i => {
									return (
										<Option key={i.id} value={i.id}>{i.name}</Option>
									)
								})}
							</Select>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='集群' >
						{getFieldDecorator('cluster', {
							rules:[{required: true, message: '请选择集群' }]
						})(
							<Select>
								{this.state.cluster.map(i=>{
									return (
										<Option key={i.id} value={i.id}>{i.name}</Option>		
									)
								})}
							</Select>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='网关端口' >
						{getFieldDecorator('proxyPort')(
							<Input disabled={true}/>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label='ams对外端口' >
						{getFieldDecorator('nodePort', {
						})(
							<Input disabled='true'/>
						)}
					</FormItem>
					
				</Form>


			</Modal>
		)
	}
}

const AddEnvSetting = Form.create()(AddEnvSettingForm);
export default AddEnvSetting;
