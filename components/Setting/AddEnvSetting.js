import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Select, Input, Button, Steps, message, Spin } from 'antd'
import { getCreateAppConfig, deployCorecomponents, componentStatus } from '../../services/cce'
import constants from '../../services/constants';
import { base } from '../../services/base';
import { getDatabase } from '../../services/amp';


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
			cluster: [],
			current: 0,
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
			dataBase: {},
			chartList: [],			//chart版本
			nodeName: [],			//node节点
			proxyNodePort: '',
			chartDetail: '',
			nodeDetail: "",
			clusterDetail: '',
			intervals: [],
			btnLoading: false,
			resourcLoading: false,
		}
	}

	initState = () => {
		this.setState({
			cluster: [],
			current: 0,
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
			dataBase: {},
			chartList: [],			//chart版本
			nodeName: [],			//node节点
			proxyNodePort: '',
			chartDetail: '',
			nodeDetail: "",
			clusterDetail: '',
		})
	}

	componentDidUpdate(nextProps, state) {
		if (nextProps.visible !== this.props.visible && this.props.visible) {
			this.initState();
			//获取环境初始化所有数据
			debugger;
			getCreateAppConfig(base.configs.manageTenantCode).then(data => {
				let ary = [];
				data.chartList.forEach(i => {
					ary.push(i.urls[0])
				})
				this.setState({ cluster: data.cluster, nodeName: data.nodeName ? data.nodeName.node : '', proxyNodePort: data.nodePort[0], chartList: ary })
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
			this.setState({ btnLoading: true })
			deployCorecomponents('env', { env: this.state.code }, params).then(data => {
				let env = {
					name: this.state.name,
					code: this.state.code,
					authServerInnerAddress: this.state.code + '-' + constants.NEWENV_PARAMS.sverInnerAddress,
					apiGatewayWayInnerAddress: this.state.code + '-' + constants.NEWENV_PARAMS.apiGatewayAddress
				}
				this.props.addNewEnv(env)
				if (data) {
					message.info('创建环境中！')
					//等待环境创建成功之后调用amp本身创建环境，现在还不知道何时去调自己创建环境
					//this.props.addNewEnv(params)
				}
				this.setState({ current: 2, btnLoading: false, resourcLoading: true })
				componentStatus('env', { env: this.state.code }).then(data => {
					this.reload();
					this.setState({ resources: data.RESOURCES, resourcLoading: false })
				})
			})
		})
	}

	//拼装参数
	formateParams = (values) => {
		let params = {
			charturl: this.state.chartDetail,
			namespace: base.configs.manageTenantCode,
			'global.registry': 'registry.c2cloud.cn',
			'global.env': this.state.code,
			'global.cluster': this.state.clusterDetail,
			'route.route.proxyNodePort': this.state.proxyNodePort,
			'route.pgs.nodeName': this.state.nodeDetail,
			'apigateway.pgs.nodeName': this.state.nodeDetail,
			'ams.database.ip': values.dbIp,
			'ams.database.port': values.dbPort,
			'ams.database.scheme': values.scheme,
			'ams.database.password': values.dbpassword,
			'ams.database.username': values.dbusername
		};
		return params;
	}

	onCancel = () => {
		this.state.intervals.forEach(item => {
			clearInterval(item)
		})
		this.props.onChange()
	}

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

	reload = () => {
		let interval = setInterval(() => {
			componentStatus('env', { env: this.state.code }).then(data => {
				this.setState({ resources: data.RESOURCES })
			})
		}, 5000
		)
		this.state.intervals.push(interval)
	}

	testConnc = () => {
		this.props.form.validateFields((err, values) => {
			if (err) return;
			let params = {
				url:`jdbc:oracle:thin:@${values.dbIp}:${values.dbPort}:${values.scheme}`,
				user:values.dbusername,
				password:values.dbpassword,
			}
			getDatabase(params).then(data => {
				if(data && data.result==='success'){
					message.success('数据库连接成功！')
				}else{
					message.warn('数据库连接失败！'+data.result);
				}
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
										{
											validator: (rule, value, callback) => {
												const reg = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
												if (value !== '' && !reg.test(value)) {
													callback('仅支持数字、小写字母、中划线!');
												}
												callback();
											}
										},
										{
											validator: (rule, value, callback) => {
												base.environments.forEach(env => {
													if (this.state.data.id !== env.id) {
														if (env.code === value) {
															callback("已经存在编码为'" + value + "'的环境！");
														}
													}
												})
												callback();
											}
										}
										],
									})(
										<Input onChange={e => { this.setState({ code: e.target.value }) }} />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label='集群' >
									{getFieldDecorator('cluster', {
										rules: [{ required: true, message: '请选择集群' }]
									})(
										<Select onChange={value => this.setState({ clusterDetail: value })}>
											{this.state.cluster.map(i => {
												return (
													<Option key={i.id} value={i.id}>{i.name}</Option>
												)
											})}
										</Select>
									)}
								</FormItem>

								<FormItem {...formItemLayout} label='网关、路由数据库部署节点 ' >
									{getFieldDecorator('routeNodeName', {
										rules: [{ required: true, message: '请填写调度的节点名称' }],
									})(
										<Select onChange={value => this.setState({ nodeDetail: value })}>
											{this.state.nodeName.map((i, index) => {
												return <Option key={index} value={i}>{i}</Option>
											})}
										</Select>
									)}
								</FormItem>

								<FormItem {...formItemLayout} label='版本 ' >
									{getFieldDecorator('charturl', {
										rules: [{ required: true, message: '请填写调度的节点名称' }],
									})(
										<Select onChange={value => this.setState({ chartDetail: value })}>
											{this.state.chartList.map((i, index) => {
												return <Option key={index} value={i}>{i}</Option>
											})}
										</Select>
									)}
								</FormItem>

								<div style={{ marginTop: 24, float: 'right' }}>
									<Button type='primary' onClick={this.handleOneNext}> 下一步</Button>
								</div>

							</div>
						}
						{this.state.current === 1 &&
							<div>
								<FormItem {...formItemLayout} label='数据库ip' >
									{getFieldDecorator('dbIp', {
										rules: [{ required: true, message: '数据库ip端口号校验不通过' }],
									})(
										<Input />
									)}
								</FormItem>

								<FormItem {...formItemLayout} label='数据库端口号' >
									{getFieldDecorator('dbPort', {
										rules: [{ required: true, message: '数据库端口号校验不通过' }],
									})(
										<Input />
									)}
								</FormItem>

								<FormItem {...formItemLayout} label='数据库scheme' >
									{getFieldDecorator('scheme', {
										rules: [{ required: true, message: '请填写数据库表格' }],
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
									<Button style={{ marginLeft: 8 }} onClick={this.testConnc}>测试连接</Button>
									<Button style={{ marginLeft: 8 }} type='primary' onClick={this.onOk} loading={this.state.btnLoading}>创建</Button>
								</div>
							</div>
						}
						{
							this.state.current === 2 ?
								this.state.resourcLoading ?
									<div style={{ textAlign: 'center' }}>
										<Spin loading={true} />
									</div> : <div>
										<pre className="logs" style={{ height: '480px', overflow: 'auto' }}>{this.state.resources}</pre>
									</div> : ''
						}
					</Form>
				</div>
			</Modal>
		)
	}
}

const AddEnvSetting = Form.create()(AddEnvSettingForm);
export default AddEnvSetting;
