import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Select, Input, Button, Steps, Alert, message } from 'antd'
import { getCreateAppConfig } from '../../services/cce'
import { createEnv } from '../../services/tiller';
import constants from '../../services/constants';
import EnvStatus from './EnvStatus'
import { base } from '../../services/base';


const Step = Steps.Step;
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

	constructor(props) {
		super(props);
		this.state = {
			charts: [],
			cluster: [],
			current: 0,
			nodePort: '',
			chartDesc: '',
			code: '',
			imageUrl: '',
			nfsServerIp: '',
			nfsrootPath: '',
			data: {},
			tabs: [],
			ip: '',
			flag: false,   //环境是否创建成功状态标志
			name: '',
			dataBase: {}
		}
	}

	initState = () => {
		this.setState({
			charts: [],
			cluster:[],
			current: 0,
			nodePort: '',
			chartDesc: '',
			code: '',
			imageUrl: '',
			nfsServerIp: '',
			nfsrootPath: '',
			data: {},
			tabs: [],
			ip: '',
			flag: false,   //环境是否创建成功状态标志
			name: '',
			dataBase: {}
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible !== this.props.visible && nextProps.visible) {
			this.initState();
			//获取环境初始化所有数据
			getCreateAppConfig().then(data => {
				this.setState({ charts: data.charts, cluster: data.cluster, imageUrl: data.imageUrl.url, nodePort: data.nodePort[0], nfsServerIp: data.nfs.server, nfsrootPath: data.nfs.path })
				this.props.form.setFieldsValue({
					nodePort: data.nodePort[0]
				})
			});
		}
	}

	onOk = (e, value) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let params = this.formateParams(values);
			//调用创建环境，然后查询环境状态
			createEnv(this.state.code, params).then(data => {
				let env = {
					apiGatewayHost: this.state.code + '-' + constants.NEWENV_PARAMS.apiGatewayHost,
					name: this.state.name,
					code: this.state.code,
					authServerAddress: constants.NEWENV_PARAMS.apiGatewaySchema + '://' + this.state.ip + ':' + this.state.nodePort,
					authServerInnerAddress: constants.NEWENV_PARAMS.apiGatewaySchema + '://' + this.state.ip + ':' + this.state.nodePort,
					apiGatewayPort: constants.NEWENV_PARAMS.apiGatewayPort,
					apiGatewayManagePort: constants.NEWENV_PARAMS.apiGatewayManagePort,
					apiGatewaySchema: constants.NEWENV_PARAMS.apiGatewaySchema
				}
				this.props.addNewEnv(env)
				this.setState({ current: 2 })
				if (data) {
					message.info('创建环境中！')
					//等待环境创建成功之后调用amp本身创建环境，现在还不知道何时去调自己创建环境
					//this.props.addNewEnv(params)
				}
			})
		})
	}

	//拼装参数
	formateParams = (values) => {
		let params = {
			values: []
		};
		params.chart_url = '/' + this.state.chartUrl;
		params.namespace = 'admin';
		params.reuse_name = true;
		params.values.push(`database.dbusername=${values.dbusername}`)
		params.values.push(`database.dbpassword=${values.dbpassword}`)
		params.values.push(`database.dbIpPort=${values.dbIpPort}`)
		params.values.push(`database.dbDatabaseName=${values.dbDatabaseName}`)
		params.values.push(`cce.nfsServerIp=${this.state.nfsServerIp}`)
		params.values.push(`cce.nfsrootPath=${this.state.nfsrootPath}`)
		params.values.push(`global.host=${this.state.ip}`)
		params.values.push(`global.env=${this.state.code}`)
		params.values.push(`global.mainenv=false`)
		params.values.push(`global.nodePort.ams=${this.state.nodePort}`)
		params.values.push(`global.registryhost=${this.state.imageUrl.split('://')[1]}`)
		/* 	params.values.push(`global.uop.nodePort=${''}`)
			params.values.push(`global.amsredis.nodePort=${''}`)
			params.values.push(`global.gateway.adminPort=${''}`)
			params.values.push(`global.gateway.datanasePort=${''}`) */
		return params;
	}


	onCancel = () => {
		this.props.onChange()
	}

	//查询环境状态
	/* getEnvStatus = () => {
		getEnvStatus(this.state.code).then(datas => {
			let tab = [];
			let flag = true;
			datas.info.status.resources.forEach(i => {
				if (i.name.includes('v1/Pod')) {
					//重构列对象
					let column = [];
					//重构table数据
					let dataSource = [];
					//确认status所在index位置以便下面判断是不是判断成功
					let statuIndex = '';
					i.title.forEach((item, index) => {
						let columnIndex = {};
						columnIndex.title = item;
						columnIndex.dataIndex = item;
						column.push(columnIndex);
						if (item === 'STATUS') statuIndex = index
					})
					i.values.forEach(n => {
						let dataOri = {};
						n.forEach((item, index) => {
							//判断环境是否创建成功，在v1/Pod下面判断是不是所有status都是Running 或者Completed
							if (index === statuIndex) {
								if (item !== 'Running' && item !== 'Completed') flag = false;
							}
							dataOri[i.title[index]] = item
						})
						dataSource.push(dataOri)
					})
					tab.push({ name: i.name, column: column, data: dataSource })
				}
			})
			this.setState({ tabs: tab, flag: flag })
		}).catch(err => {
			this.setState({ flag: true, tabs: [] })
		})
	} */

	handleOneNext = () => {
		const { form } = this.props;
		form.validateFields((err, values) => {
			if (err) return;
			this.setState({ current: 1, data: values }, () => {
				form.setFieldsValue({
					...this.state.dataBase
				})
			})
		})
	}

	stepback = () => {
		const { form } = this.props;
		form.validateFields((err, values) => {
			if (err) return;
			this.setState({ dataBase: values })
		})
		this.setState({ current: 0 }, () => {
			form.setFieldsValue({
				...this.state.data
			})
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
				width={800}
				destroyOnClose
				bodyStyle={{ height: '600px', overflow: 'auto' }}
				visible={this.props.visible}
				title={this.props.title || '新增环境'}
				onCancel={this.onCancel}
				footer={null}
				maskClosable={false}
			>

				<Steps current={this.state.current} >
					<Step title="环境基本信息" />
					<Step title="数据库配置" />
					<Step title="完成" />
				</Steps>

				<div style={{ margin: 16 }}>
					<Form>
						{this.state.current === 0 &&
							<div>
								<FormItem {...formItemLayout} label='名称' >
									{getFieldDecorator('name', {
										rules: [{ required: true, message: '请输入环境名称' }],
									})(
										<Input onChange={e => { this.setState({ name: e.target.value }) }} />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='编码' >
									{getFieldDecorator('code', {
										rules: [{ required: true, message: '请输入环境code' },
												{validator:(rule, value, callback) => {
													const reg = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
													if(value !=='' && !reg.test(value)){
														callback('仅支持数字、小写字母、中划线!');
													}
													callback();
												}},
												{validator:(rule, value, callback) => {
													base.environments.forEach(env => {
													
														if(this.state.data.id !== env.id){
															if(env.code === value){
																callback("已经存在编码为'"+value+"'的环境！");
															}
														}
														
													})
													callback();
												}}
										],
									})(
										<Input onChange={e => { this.setState({ code: e.target.value }) }} />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='IP' >
									{getFieldDecorator('ip', {
										rules: [{ required: true, message: '请输入IP 或者IP不规范', pattern: constants.reg.ip }],
									})(
										<Input onChange={e => { this.setState({ ip: e.target.value }) }} />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='chart' >
									{getFieldDecorator('chart', {
										rules: [{ required: true, message: '请选择chart' }]
									})(
										<Select
											onSelect={(e, option) => { this.setState({ chartDesc: option.key, chartUrl: e }) }}
										>
											{this.state.charts.map(i => {
												return (
													<Option key={i.description} value={i.urls[0]}>{i.version}</Option>
												)
											})}
										</Select>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='集群' >
									{getFieldDecorator('cluster', {
										rules: [{ required: true, message: '请选择集群' }]
									})(
										<Select>
											{this.state.cluster.map(i => {
												return (
													<Option key={i.id} value={i.id}>{i.name}</Option>
												)
											})}
										</Select>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='ams对外端口'>
									{getFieldDecorator('nodePort', {
										rules: [{ required: true, message: '请填写ams端口' }]

									})(
										<Input disabled/>
									)}
								</FormItem>
								{
									this.state.chartDesc &&
									<FormItem>
										<Alert message={this.state.chartDesc} type="info" />
									</FormItem>
								}
								<div style={{ marginTop: 24, float: 'right' }}>
									<Button type='primary' onClick={this.handleOneNext}> 下一步</Button>
								</div>

							</div>
						}
						{this.state.current === 1 &&
							<div>
								<FormItem {...formItemLayout} label='数据库ip端口号' >
									{getFieldDecorator('dbIpPort', {
										rules: [{ required: true, message: '数据库ip端口号校验不通过', pattern: constants.reg.port }],
									})(
										<Input />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='数据库实例' >
									{getFieldDecorator('dbDatabaseName', {
										rules: [{ required: true, message: '数据库实例必填' }],
									})(
										<Input />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='数据库用户名' >
									{getFieldDecorator('dbusername', {
										rules: [{ required: true, message: '数据库用户名必填' }],
									})(
										<Input />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='数据库密码' >
									{getFieldDecorator('dbpassword', {
										rules: [{ required: true, message: '数据库密码必填' }],
									})(
										<Input />
									)}
								</FormItem>

								<div style={{ marginTop: 24, float: 'right' }}>
									<Button onClick={this.stepback}>上一步</Button>
									<Button style={{ marginLeft: 8 }} >测试连接</Button>
									<Button style={{ marginLeft: 8 }} type='primary' onClick={this.onOk}>创建</Button>
								</div>
							</div>
						}
						{
							this.state.current === 2 && <EnvStatus id={this.props.id} code={this.state.code} history={this.props.history} onCancel={this.onCancel}/>
						}
					</Form>
				</div>
			</Modal>
		)
	}
}

const AddEnvSetting = Form.create()(AddEnvSettingForm);
export default AddEnvSetting;
