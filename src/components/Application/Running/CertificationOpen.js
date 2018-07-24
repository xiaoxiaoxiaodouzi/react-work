import React, { Component } from 'react';
import { Modal, Card, Switch, Form, Input, Select, InputNumber, message ,Icon,Tooltip} from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import User from './User'
import { updateOrgs, getApp, updateApp, getSso, openSso, closeSso, eidtSso, getOrgs, getCategoryorgs, getOrg, getManagerOrgs } from '../../../services/running'
import WhiteUser from './WhiteUser'
import OrgSelectModal from '../../../common/OrgSelectModal'
import "./running.less";
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
		orgs: [],    //所有的机构详情
		org: [],     //应用可访问的机构
		orgName: "",		//应用可使用的机构名
		editable: false, 		//应用可管理的机构是否可以修改
		isOpen: false,				//判断SSO是否开启
		switch: false,
		status: '',
		help: '',
		doSee:false,			//是否可见
	}

	componentDidMount() {
		const appid = this.props.appid;
		//查询应用访问地址
		getApp(appid).then(data => {
			this.setState({
				clientName: data.name,
				clinetUrl: data.host
			})
		})
		getSso(appid).then(data => {
			if (data) {
				if (data.securityLevel === "0") {
					data.securityLevel = "普通"
				}
				if (data.securityLevel === "1") {
					data.securityLevel = "中级"
				}
				if (data.securityLevel === "2") {
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
			}
		})

		getOrgs(appid).then(data => {
			//出现重复数据是因为分类机构ID不一样 现在还不知道如何处理重复数据的显示问题，先暂时全部显示
			data.forEach((item, i) => {
				if (item.categoryOrgId === item.orgId) {
					//获取分类机构数据
					getCategoryorgs(item.orgId).then(org => {
						if(org){
							item.name = org.name;
							item.categoryOrgName = org.name;
							item.id=item.orgId;
							this.state.orgs.push(item);
							this.setState({
								orgName: this.state.orgName + "," + org.name
							})
						}
					})
				} else {
					//获取机构数据
					getOrg(item.orgId).then(org => {
						getCategoryorgs(item.categoryOrgId).then(datas => {
							if(datas){
								item.name = org.name;
								item.categoryOrgName = datas.name;
								item.id = item.orgId;
								this.state.orgs.push(item);
								this.setState({
									orgName: this.state.orgName + "," + org.name + '(' + datas.name + ')'
								})
							}
						})

					})
				}
				this.setState({
					org: data
				})
			})
		})
		//获取应用可管理的机构
		getManagerOrgs(appid).then(data => {
			this.setState({
				orgNames: data.names,
				editable: data.editable
			})
		})
	}

	handleClick = () => {
		let checked = this.state.isOpen;
		if (!checked) {
			this.setState({
				switch: true
			})
			this.showModal1();
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

	//统一认证权限模态框确认
	handleOk1 = (e) => {
		const appid = this.props.appid;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return
			}
			if (values.securityLevel === "普通") {
				values.securityLevel = "0"
			}
			if (values.securityLevel === "中级") {
				values.securityLevel = "2"
			}
			if (values.securityLevel === "高安全级") {
				values.securityLevel = "1"
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
				//先默认type=2固定
				let queryParams = {
					type: '2'
				}
				let bodyParams = {
					host: values.clinetUrl
				}
				openSso(appid, values).then(val => {
					if (val) {
						if (val.clientType === "1") {
							val.clientType = "web"
						}
						if (val.clientType === "2") {
							val.clientType = "app"
						}
						if (val.securityLevel === '2') {
							val.securityLevel = '中级'
						}
						if (val.securityLevel === '0') {
							val.securityLevel = '普通'
						}
						if (val.securityLevel === '1') {
							val.securityLevel = '高安全级'
						}
						updateApp(appid, queryParams, bodyParams).then(data => {
							if (data) {
							}
						})
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
						message.success('启用成功')
					}
				}).catch(err => {
					if (err) {
						message.error('开启失败，请联系管理员')
					}
				})
			} else {
				eidtSso(appid, values).then(val => {
					if (val) {
						if (val.clientType === "1") {
							val.clientType = "web"
						}
						if (val.clientType === "2") {
							val.clientType = "app"
						}
						if (val.securityLevel === '2') {
							val.securityLevel = '中级'
						}
						if (val.securityLevel === '0') {
							val.securityLevel = '普通'
						}
						if (val.securityLevel === '1') {
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
			this.setState({
				clinetUrl: '',
				visible3: false,
				isOpen: false
			})
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

	//选择机构确定返回数据
	handleOnOk = (orgs) => {
		this.setState({
			orgName: ''
		})
		let orgary = [];
		const appid = this.props.appid;
		if (Array.isArray(orgs)){
			orgs.forEach(item=>{
				item.orgId=item.id;
				orgary.push(item)
			})
		}
		updateOrgs(appid, orgary).then(data => {
			let orgName=''
			orgs.forEach(item => {
				if(item.id===item.categoryOrgId){
					orgName += "," + item.name
				}else{
					orgName += "," + item.name + '(' + item.categoryOrgName + ')'
				}
			})
			this.setState({
				orgs:orgs,
				orgName: orgName
			})
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
	renderOpen = () => {
		const action1 = <a style={{ float: "right", fontSize: 14 }} onClick={this.showModal1}>修改</a>

		return (
			<div>
				<DescriptionList style={{ marginBottom: 24 }} title={action1}>
					<Description term="客户端ID">{this.state.clientId}</Description>
					<Description term="客户端凭证">{this.state.doSee?this.state.clientSecret:'******'} <Icon style={{ marginLeft:8,cursor:'pointer' }}type={this.state.doSee?'eye':'eye-o'} onClick={e=>this.setState({doSee:!this.state.doSee})}/></Description>
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
	render() {
		const title = <span>统一认证  <Switch style={{ marginLeft: 24 }} checkedChildren="开" unCheckedChildren="关" checked={this.state.isOpen} onClick={this.handleClick} /></span>
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
		const orgModal = <OrgSelectModal title={'机构选择'} renderButton={() => { return <a style={{ float: "right", fontSize: 14 }}>修改</a> }} defaultValue={this.state.orgs} onOk={orgs => this.handleOnOk(orgs)} multiple={true} checkableTopOrg={false} checkableCategoryOrg={true} checkableOrg={true}/>;
		const levelLabel= <span><Tooltip overlayStyle={{width:'420px'}} title={<pre style={{fontSize:'10px'}}>
			{`普通：默认等级，应用的用户凭证与用户在
认证服务器的凭证的生命周期一致，
默认为七天(该时间可配置)，
七天内有使用过应用则会自动续期，无需重新登录。
中级：应用的用户凭证在超时后，
在服务器重新进行认证时会需要用户再次输入密码进行身份校验。
一般会配合较短的应用用户凭证有效期配置来使用，
比如应用的凭证有效期设置为10分钟，
如果10分钟内用户没有在应用内进行操作，那么再次使用应用时，
会要求用户输入自己的密码才能继续访问。用户凭证存储在cookie中，
关闭浏览器用户凭证不会失效
高级：有效期策略与中级一致，但是关闭浏览器后用户凭证会立即失效，
关闭后立即打开浏览器也需要重新输入密码验证身份。
			`}</pre>	 } ><Icon type="info-circle-o" /></Tooltip>应用安全等级</span>				 
		return (
			<div>
				<Card title={title} style={{ margin: 24 }} bordered={false}>
					{
						this.state.isOpen ?
							this.renderOpen() : this.renderClose()
					}
				</Card>
				{
					this.state.isOpen ?
						<Card title="设置允许访问应用的用户" style={{ margin: 24 }} bordered={false}>
							<DescriptionList col="1" style={{ marginBottom: 24 }} title={orgModal}>
								<Description term="允许以下机构的用户访问应用">{this.state.orgName.slice(1)}</Description>
							</DescriptionList>
							<User orgs={this.state.orgs} appid={this.props.appid} />

							<div className="sub-title-text" style={{ marginTop: 24 }}>白名单</div>
							<WhiteUser appid={this.props.appid} />
						</Card>
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
						<FormItem {...formItemLayout} label="凭证有效时间(ms)">
							{getFieldDecorator('expirein', { initialValue: this.state.expirein })(
								<InputNumber style={{ width: '100%' }} min={60} placeholder="输入时间" />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="刷新凭证有效时间(ms)">
							{getFieldDecorator('reExpirein', { initialValue: this.state.reExpirein })(
								<InputNumber style={{ width: '100%' }} min={60} placeholder="输入时间" />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label={levelLabel}>
							{getFieldDecorator('securityLevel', { initialValue: this.state.securityLevel })(
								<Select>
									<Option value="0">普通</Option>
									<Option value="2">中级</Option>
									<Option value="1">高安全级</Option>
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout}
							validateStatus={this.state.status}
							help={this.state.help}
							label="应用回调地址">
							{getFieldDecorator('clinetUrl', { initialValue: this.state.clinetUrl })(
								<Input disabled={this.state.isOpen} onBlur={e => this.handleChange(e)} placeholder="输入地址" />
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
			</div>

		)
	}
}

const CertificationOpen = Form.create()(CertificationOpenForm)
export default CertificationOpen;