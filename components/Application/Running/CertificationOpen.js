import React, { Component } from 'react';
import { Modal, Card, Switch, Form, Input, Select, InputNumber, message, Icon, Tooltip } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import User from './User'
import {updateApp,closeSso,eidtSso,openSso,getApp,getSso,getManagerOrgs} from '../../../services/aip'
import "./running.less";
import { addAppEnvs, deleteAppEnvs } from '../../../services/cce';
import { queryBaseConfig, existEnvs, editEnvs } from '../../../services/cce';
import { queryEnvById} from '../../../services/amp'
import { base } from '../../../services/base';
import OrgModal from './OrgModal'
import Authorized from '../../../common/Authorized';
import constants from '../../../services/constants';
import SettingTable from '../../../components/Application/Setting/SettingTable';
import SettingClusterList from '../../../components/Application/Setting/SettingClusterList'

const { Description } = DescriptionList;
const Option = Select.Option;
const FormItem = Form.Item;
class CertificationOpenForm extends Component {
	state = {
		visible1: false,			//统一认证模态框
		visible3: false,
		clientName: "",
		clientId: "",
		clientSecret: "",
		clientType: "web",
		expirein: "60",
		reExpirein: "604800",
		securityLevel: "普通",
		clinetUrl: "",
		loginUrl: "",
		orgName: "",		//应用可使用的机构名
		editable: false, 		//应用可管理的机构是否可以修改
		isOpen: false,				//判断SSO是否开启
		switch: false,
		status: '',
		help: '',
		doSee: false,			//是否可见
		appUpstream:'',
		appDatas:{},		//应用数据
		appId:'',
		checked:false			//是否支持https
	}


	loadData = () => {
		const appId = this.props.appid;
		getApp(appId).then(data => {
			//应用upstream
			let appUpstream = ''
			let upstream = data.upstream ? data.upstream.split('//') : '';
			if (upstream.length > 1) {
				appUpstream = upstream[1]
			} else {
				appUpstream = upstream[0]
			}
			this.setState({ appType: data.type, appDatas: data, type: data.type === 'middleware' ? '中间件' : '应用', springCloud: data.springcloud ? true : false })
			this.setState({
				clientName: data.name,
				code: data.code,
				appUpstream: appUpstream,
				ctx: data.ctx,
				appId: data.id,
				APMChecked: data.apm,
				name: data.name,
				host: data.host,
				isK8s:data.deployMode==='k8s'?true:false
			})
		})
	}


	componentDidMount() {
		this.loadData();
		const appId = this.props.appid;
		getSso(appId).then(data => {
			if (data) {
				if (data.securityLevel === "0") {
					data.securityLevel = "普通"
				} else {
					data.securityLevel = "高安全级"
				}
				this.setState({
					isOpen: true,
					clientId: data.clientId,
					clientSecret: data.clientSecret,
					clientType: data.clientType,
					expirein: data.expirein,
					reExpirein: data.reExpirein,
					securityLevel: data.securityLevel,
					clinetUrl: data.clinetUrl,
					loginUrl: data.loginUrl
				})
				//获取应用可管理的机构
				getManagerOrgs(appId).then(data => {
					this.setState({
						orgNames: data.names,
						editable: data.editable
					})
				})
			}
		})
	}

	handleClick = () => {
		let checked = this.state.isOpen;
		if (!checked) {
			this.setState({
				switch: true
			})
			//查询应用访问地址
			getApp(this.props.appid).then(data => {
				this.setState({
					clientName: data.name,
				});
				this.showModal1();
			})

		} else {
			this.showModal3();
		}
	}

	showModal1 = () => {
		this.setState({
			visible1: true,
			status: '',
			help: ''
		});
	}

	showModal3 = () => {
		this.setState({
			visible3: true
		})
	}

	//开启统一认证注入环境变量,values 为开启sso接口返回的参数
	handleENV = (values) => {
		let code = this.state.code;
		let envId = base.currentEnvironment.id;
		let appid = this.props.appid
		queryEnvById(envId).then(res => {
			queryBaseConfig(code).then(data => {
				let pro = [];
				let pros = [];
				let containers = [];//用于将容器名存储以便后面做新增接口调用
				let params = [{
					key: constants.SSO_KEY[0],
					value: base.currentEnvironment.authServerInnerAddress,
					source: '1',
				}, {
					key: constants.SSO_KEY[1],
					value: base.currentEnvironment.authServerAddress,
					source: '1',
				}, {
					key: constants.SSO_KEY[2],
					value: values.clientId || '',
					source: '1',
				}, {
					key: constants.SSO_KEY[3],
					value: values.clientSecret || '',
					source: '1',
				}, {
					key: constants.SSO_KEY[4],
					value: values.clinetUrl,
					source: '1',
				}]
				if (data.length > 0) {
					data.forEach(item => {
						//先调查询接口，如果数据存在，则调删除接口，否则不处理
						pros.push(existEnvs(code, item.name, constants.SSO_KEY[0]));
						pros.push(existEnvs(code, item.name, constants.SSO_KEY[1]));
						pros.push(existEnvs(code, item.name, constants.SSO_KEY[2]));
						pros.push(existEnvs(code, item.name, constants.SSO_KEY[3]));
						pros.push(existEnvs(code, item.name, constants.SSO_KEY[4]));
						containers.push(item.name);
					})
					Promise.all(pros).then(response => {
						response.forEach((item, i) => {
							//如果是开启状态
							if (this.state.isOpen) {
								if (item) {
									pro.push(deleteAppEnvs(code, item.name, item.id))
								}
							} else {
								//如果是关闭状态
								if (item) {
									//如果数据存在则修改环境变量
									if (item.key === constants.SSO_KEY[0]) {
										pro.push(editEnvs(code, item.containerName, params[0], item.id));
									}
									if (item.key === constants.SSO_KEY[1]) {
										pro.push(editEnvs(code, item.containerName, params[1], item.id));
									}
									if (item.key === constants.SSO_KEY[2]) {
										pro.push(editEnvs(code, item.containerName, params[2], item.id));
									}
									if (item.key === constants.SSO_KEY[3]) {
										pro.push(editEnvs(code, item.containerName, params[3], item.id));
									}
									if (item.key === constants.SSO_KEY[4]) {
										pro.push(editEnvs(code, item.containerName, params[4], item.id));
									}
								} else {
									containers.forEach(items => {
										pro.push(addAppEnvs(code, items, params[i]))
									})
								}
							}
						})
						//当有存在的key才去调接口
						Promise.all(pro).then(response => {
							//先默认type=2固定
							let queryParams = {
								type: '2'
							}
							let bodyParams = {
								host: values.clinetUrl || ''
							}
							updateApp(appid, queryParams, bodyParams).then(data => {
								if (values.clientId) {
									this.setState({
										//visible1: this.state.isOpen,
										clientId: values.clientId,
										clientSecret: values.clientSecret,
										clientType: values.clientType,
										expirein: values.expirein,
										reExpirein: values.reExpirein,
										securityLevel: values.securityLevel,
										clinetUrl: values.clinetUrl,
										loginUrl: values.loginUrl,
										//isOpen: !this.state.isOpen,
										status: '',
										help: ''
									});
									message.success('启用成功')
								} else {
									this.setState({
										clinetUrl: '',
										visible3: false,
										isOpen: false
									})
								}
							})
						})
					})
				}
			})
		})
	}

	//统一认证权限模态框确认
	handleOk1 = (e) => {
		const appid = this.props.appid;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return
			}
			if (values.securityLevel === "普通") {
				values.securityLevel = "0"
			} else {

				values.securityLevel = "2"
			}
			if (!values.clinetUrl) {
				this.setState({
					status: 'error',
					help: '请输入应用回调地址'
				})
			}
			//如果有错误信息的都会返回
			if (this.state.help) {
				return
			}
			if (this.state.switch) {
				openSso(appid, values).then(val => {
					if (val) {
						getManagerOrgs(appid).then(data => {
							this.setState({
								orgNames: data.names,
								editable: data.editable,
								visible1: false,
								isOpen: true,
								clientId: val.clientId,
								clientSecret: val.clientSecret,
							})
						});
						if (val.clientType === "1") {
							val.clientType = "web"
						}
						if (val.clientType === "2") {
							val.clientType = "app"
						}
						if (val.securityLevel === '0') {
							val.securityLevel = '普通'
						}
						if (val.securityLevel === '2') {
							val.securityLevel = '高安全级'
						}
						//注入环境变量已经修改app
						this.handleENV(val);
					}
				}).catch(e => {
					if (e) {
						base.ampMessage('统一权限开启失败' );
					}
				})
			} else {
				eidtSso(appid, values).then(val => {
					if (val) {
						getManagerOrgs(appid).then(data => {
							this.setState({
								orgNames: data.names,
								editable: data.editable,
								visible1: false,
								isOpen: true,
							})
						});
						if (val.clientType === "1") {
							val.clientType = "web"
						}
						if (val.clientType === "2") {
							val.clientType = "app"
						}
						if (val.securityLevel === '0') {
							val.securityLevel = '普通'
						}
						if (val.securityLevel === '2') {
							val.securityLevel = '高安全级'
						}
						this.setState({
							switch: false,
							visible1: false,
							clientId: val.clientId,
							clientSecret: val.clientSecret,
							clientType: val.clientType,
							expirein: val.expirein,
							reExpirein: val.reExpirein,
							securityLevel: val.securityLevel,
							clinetUrl: val.clinetUrl,
							loginUrl: val.loginUrl,
							isOpen: true,
							status: '',
							help: ''
						});
						message.success('修改成功')
					}
				})
			}
		})
	}


	handleOk3 = (e) => {
		const appid = this.props.appid;
		closeSso(appid).then(val => {
			this.setState({ visible3: false, isOpen: false });
			//先暂时传空对象过去，
			this.handleENV({ clientId: '', clinetUrl: '', clientSecret: '' });
		})
	}

	handleCancel1 = (e) => {
		this.setState({
			visible1: false,
			status: '',
			help: ''
		});
	}

	handleCancel3 = (e) => {
		this.setState({
			visible3: false
		})
	}

	//应用回调地址input框值修改
	handleChange = (e) => {
		let url = e.target.value;
		if (url) {
			if (!url.startsWith('http://')) {
				this.setState({
					status: 'error',
					help: '应用回调地址格式错误'
				})
			} else {
				this.setState({
					status: '',
					help: '',
				})
			}
		} else {
			this.setState({
				status: 'error',
				help: '请输入应用回调地址'
			})
		}
	}

	//机构读写取消modal
	handleCancel = (e) => {
		const appid = this.props.appid
		getManagerOrgs(appid).then(data => {
			this.setState({
				orgNames: data.names,
				editable: data.editable,
				visible: false
			})
		})
	}
	//是否支持https
	handleHttpChange = (value) => {
    let id = this.state.appId;
    let queryParams = {
      type: '2'
    }
    let schema = '';
    if (value) {
      schema = 'https'
    } else {
      schema = 'http'
    }

    let bodyParams = {
      schema: schema
    }
    updateApp(id, queryParams, bodyParams).then(data => {
      this.loadData();
    })
    this.setState({
      checked: value
    })
  }

	renderOpen = () => {
		return (
			<div>
				<DescriptionList style={{ marginBottom: 24 }}>
					<Description term="客户端ID">{this.state.clientId}</Description>
					<Description term="客户端凭证">{this.state.doSee ? this.state.clientSecret : '******'} <Icon style={{ marginLeft: 8, cursor: 'pointer' }} type={this.state.doSee ? 'eye' : 'eye-o'} onClick={e => this.setState({ doSee: !this.state.doSee })} /></Description>
					<Description term="应用类型">{this.state.clientType}</Description>
					<Description term="凭证有效时长(秒)">{this.state.expirein}</Description>
					<Description term="刷新凭证有效时长(秒)">{this.state.reExpirein}</Description>
					<Description term="应用安全等级">{this.state.securityLevel}</Description>
					<Description term="应用回调地址"><div title={this.state.clinetUrl} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '120px' }}>{this.state.clinetUrl}</div> </Description>
					<Description term="自定义登录页">{this.state.loginUrl}</Description>
				</DescriptionList>
			</div>
		)
	}
	renderClose = () => {
		return (
			<DescriptionList style={{ margin: 24 }}>
				<span>温馨提示：如需使用平台提供的“统一认证及权限”服务、“统一门户集成服务”，请先启用统一认证。</span>
			</DescriptionList>
		)
	}

	showModal = () => {
		this.setState({
			visible: true
		});
	}
	render() {
		let { appUpstream,appDatas} = this.state;
		let action1;
		if (base.allpermissions.includes('app_editUnifiedCertification')) {
			action1 = <a style={{ float: "right", fontSize: 14 }} onClick={this.showModal1}>修改</a>;
		}
		const action = <a style={{ float: "right", display: this.state.editable ? '' : 'none' }} onClick={this.showModal}>修改</a>
		const title = <span>统一认证 <Authorized authority='app_unifiedCertification' noMatch={<Switch disabled='true' style={{ marginLeft: 24 }} checkedChildren="开" unCheckedChildren="关" checked={this.state.isOpen} onClick={this.handleClick} />}>  <Switch style={{ marginLeft: 24 }} checkedChildren="开" unCheckedChildren="关" checked={this.state.isOpen} onClick={this.handleClick} /> </Authorized></span>
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 10 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 12 },
				md: { span: 13 },
			},
		};
		const levelLabel = <span><Tooltip overlayStyle={{ width: '420px' }} title={<pre style={{ fontSize: '10px' }}>
			{}</pre>} ><Icon type="info-circle-o" /></Tooltip>应用安全等级</span>
		return (
			<div>
				<Card bordered={false} style={{ margin: 24 }} title='路由'>
					{base.currentEnvironment.routerSwitch ? <SettingTable appDatas={appDatas} checked={this.state.checked} />
						: <span>动态路由配置已关闭</span>
					}
				</Card> 

				<Card bordered={false} style={{ margin: 24 }} title='集群'>
					<SettingClusterList appDatas={appDatas} appUpstream={appUpstream} checked={(e) => this.handleHttpChange(e)} />
				</Card>

				<Card title={title} style={{ margin: 24 }} bordered={false} extra={this.state.isOpen?action1:''}>
					{
						this.state.isOpen ?
							this.renderOpen() : this.renderClose()
					}
				</Card>
				{
					this.state.isOpen ?
						<div>
							<Card title='应用的机构用户数据权限' style={{ margin: 24 }} bordered={false} extra={action}>
								<DescriptionList col='1'>
									<Description>
										{this.state.orgNames ? this.state.orgNames : '无数据'}
									</Description>
								</DescriptionList>
							</Card>
							<Card title="可访问应用的用户列表" style={{ margin: 24 }} bordered={false}>
								<User appId={this.props.appid} />
							</Card>
						</div>
						: null
				}

				<Modal
					title="统一认证配置"
					visible={this.state.visible1}
					onOk={this.handleOk1}
					onCancel={this.handleCancel1}
				>
					<Form >
						<FormItem {...formItemLayout} label="应用名称"
						>
							{getFieldDecorator('clientName', { initialValue: this.state.clientName })(
								<Input placeholder="输入名称" disabled />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="应用类型">
							{getFieldDecorator('clientType', { initialValue: this.state.clientType })(
								<Select>
									<Option value="1">web</Option>
									<Option value="2">app</Option>
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="凭证有效时间(s)">
							{getFieldDecorator('expirein', { initialValue: this.state.expirein })(
								<InputNumber style={{ width: '100%' }} min={1} placeholder="输入时间" />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="刷新凭证有效时间(s)">
							{getFieldDecorator('reExpirein', { initialValue: this.state.reExpirein })(
								<InputNumber style={{ width: '100%' }} min={1} placeholder="输入时间" />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label={levelLabel}>
							{getFieldDecorator('securityLevel', { initialValue: this.state.securityLevel })(
								<Select>
									<Option value="0">普通</Option>
									<Option value="2">高安全级</Option>
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout}
							validateStatus={this.state.status}
							help={this.state.help}
							label="应用回调地址">
							{getFieldDecorator('clinetUrl', { initialValue: this.state.clinetUrl })(
								<Input onBlur={e => this.handleChange(e)} placeholder="输入地址" />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="自定义登录页">
							{getFieldDecorator('loginUrl', { initialValue: this.state.loginUrl })(
								<Input placeholder="输入地址" />
							)}
						</FormItem>
					</Form>
				</Modal>
				<Modal
					title="关闭统一认证"
					visible={this.state.visible3}
					onOk={this.handleOk3}
					onCancel={this.handleCancel3}
				>
					<p>关闭统一认证功能后，统一权限管理也将无法使用，确认要关闭吗？</p>
				</Modal>

				<Modal
					style={{ minHeight: 600, overflow: 'auto', width: 600 }}
					title="机构与读写权限设置"
					visible={this.state.visible}
					onCancel={this.handleCancel}
					footer={null}   //将底部按钮取消掉
					destroyOnClose={true}
				>
					<OrgModal appid={this.props.appid} />
				</Modal>
			</div>
		)
	}
}

const CertificationOpen = Form.create()(CertificationOpenForm)
export default CertificationOpen;