import React, { Component } from 'react';
import { Modal , Card,Switch,Form,Input,Select,InputNumber ,message } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import User from './User'
import {updateOrgs,getApp,getSso,openSso,closeSso,eidtSso,getOrgs,getCategoryorgs,getOrg,getManagerOrgs} from '../../../services/running'
import WhiteUser from './WhiteUser'
import OrgSelectModal from '../../../common/OrgSelectModal'

const { Description } = DescriptionList;
const Option = Select.Option;
const FormItem = Form.Item;
class CertificationOpenForm extends Component{
    state = {
        visible1:false,			//统一认证模态框
				visible3:false,
				clientName:"",
        clientId:"",
        clientSecret:"",
        clientType:"web",
        expirein:"60",
        reExpirein:"604800",
        securityLevel:"普通",
        clinetUrl:"",
        loginUrl:"",
				orgs:[],    //所有的机构详情
				org:[],     //应用可访问的机构
				orgName:"",		//应用可使用的机构名
				editable:false, 		//应用可管理的机构是否可以修改
				isOpen:false,				//判断SSO是否开启
				switch:false,
				status:'',
				help:'',
    }

    componentDidMount(){
				const appid=this.props.appid;
				getApp(appid).then(data=>{
					this.setState({
						clientName:data.name,
						clinetUrl:data.host
					})
				})
        getSso(appid).then(data=>{
					if(data){
						if(data.securityLevel==="0"){
							data.securityLevel="普通"
						}
						if(data.securityLevel==="1"){
								data.securityLevel="中级"
						}
						if(data.securityLevel==="2"){
								data.securityLevel="高安全级"
						}
						this.setState({
							isOpen:true,
							clientId:data.clientId,
							clientSecret:data.clientSecret,
							clientType:data.clientType,
							expirein:data.expirein,
							reExpirein:data.reExpirein,
							securityLevel:data.securityLevel,
							clinetUrl:data.clinetUrl,
							loginUrl:data.loginUrl
						})
					}
				})
				
        getOrgs(appid).then(data=>{
					//出现重复数据是因为分类机构ID不一样 现在还不知道如何处理重复数据的显示问题，先暂时全部显示
          data.forEach((item,i)=>{
						if(item.categoryOrgId===item.orgId){
							//获取分类机构数据
							getCategoryorgs(item.orgId).then(org=>{
								item.name=org.name;
								item.categoryOrgName=org.name
								this.state.orgs.push(item);
								this.setState({
									orgName:this.state.orgName+","+org.name
								})
							})
						}else{
							//获取机构数据
							getOrg(item.orgId).then(org=>{
								getCategoryorgs(item.categoryOrgId).then(datas=>{
									item.name=org.name;
									item.categoryOrgName=datas.name
									this.state.orgs.push(item);
									this.setState({
										orgName:this.state.orgName+","+org.name+'('+datas.name+')'
									})
								})
								
							})
						}
						this.setState({
							org:data
						})
					})
				})
				//获取应用可管理的机构
				 getManagerOrgs(appid).then(data=>{
						this.setState({
							orgNames:data.names,
							editable:data.editable
						})
				 })
		}
		
    handleClick = () => {
			let checked =this.state.isOpen;
			if(!checked){
				this.setState({
					switch:true
				})
				this.showModal1();
			}else{
				this.showModal3();
			}
    }

    showModal1 = () => {
        this.setState({
						visible1: true,
						status:'',
						help:''
						
        });
    }
		
		showModal3 = () => {
			this.setState({
				visible3:true
			})
		}

		//统一认证权限模态框确认
    handleOk1 = (e) => {
			const appid=this.props.appid;
			this.props.form.validateFields((err, values) => {
				if(err){
					return
				}
				if(values.securityLevel==="普通"){
					values.securityLevel="0"
				}
				if(values.securityLevel==="中级"){
					values.securityLevel="2"
				}
				if(values.securityLevel==="高安全级"){
					values.securityLevel="1"
				}
				if(!values.clinetUrl){
					this.setState({
						status:'error',
						help:'请输入应用回调地址'
					})
				}
				//如果有错误信息的都会返回
				if(this.state.help){
					return
				}
				if(this.state.switch){
					openSso(appid,values).then(val=>{
						if(val){
							if(val.clientType==="1"){
								val.clientType="web"
							}
							if(val.clientType==="2"){
								val.clientType="app"
							}
							if(val.securityLevel==='2'){
								val.securityLevel='中级'
							}
							if(val.securityLevel==='0'){
								val.securityLevel='普通'
							}
							if(val.securityLevel==='1'){
								val.securityLevel='高安全级'
							}
							this.setState({
								switch:false,
								visible1: false,
								clientId:val.clientId,
								clientSecret:val.clientSecret,
								clientType:val.clientType,
								expirein:val.expirein,
								reExpirein:val.reExpirein,
								securityLevel:val.securityLevel,
								clinetUrl:val.clinetUrl,
								loginUrl:val.loginUrl,
								isOpen:true,
								status:'',
								help:''
							});
							message.success('启用成功')
						}
					}).catch(err=>{
						if(err){
							message.error('开启失败，请联系管理员')
						}
					})
				}else{
					eidtSso(appid,values).then(val=>{
						if(val){
							if(val.clientType==="1"){
								val.clientType="web"
							}
							if(val.clientType==="2"){
								val.clientType="app"
							}
							if(val.securityLevel==='2'){
								val.securityLevel='中级'
							}
							if(val.securityLevel==='0'){
								val.securityLevel='普通'
							}
							if(val.securityLevel==='1'){
								val.securityLevel='高安全级'
							}
							this.setState({
								switch:false,
								visible1: false,
								clientId:val.clientId,
								clientSecret:val.clientSecret,
								clientType:val.clientType,
								expirein:val.expirein,
								reExpirein:val.reExpirein,
								securityLevel:val.securityLevel,
								clinetUrl:val.clinetUrl,
								loginUrl:val.loginUrl,
								isOpen:true,
								status:'',
								help:''
							});
							message.success('修改成功')
						}
					})
				}
			})
        
		}
		
		
		handleOk3 = (e) => {
			const appid=this.props.appid;
			closeSso(appid).then(val=>{
				this.setState({
					clinetUrl:'',
					visible3:false,
					isOpen:false
				})
			})
		}
    handleCancel1 = (e) => {
        this.setState({
            visible1: false,
						status:'',
						help:''
        });
		}
		

		handleCancel3 = (e) => {
			this.setState({
				visible3:false
			})
		}

		//选择机构确定返回数据
		handleOnOk=(orgs)=>{
			this.setState({
				orgName:''
			})
			console.log("orgs",orgs)
			const appid=this.props.appid;
			updateOrgs(appid,orgs).then(data=>{
				orgs.forEach(item=>{
					this.setState({
						orgName:this.state.orgName+","+item.name+'('+item.categoryOrgName+')',
						orgs:orgs
					})
				})
			})
		}

		//应用回调地址input框值修改
		handleChange=(e)=>{
			let url=e.target.value;
			if(url){
				let regex=/^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig;
				if(!regex.test(url)){
					this.setState({
						status:'error',
						help:'应用回调地址格式错误'
					})
				}else{
					this.setState({
						status:'',
						help:'',
					})
				}
			}else{
				this.setState({
					status:'error',
					help:'请输入应用回调地址'
				})
			}
		}
		renderOpen = ()=>{
			const action1=<a style={{float:"right",fontSize:14}} onClick={this.showModal1}>修改</a>
			const a=<OrgSelectModal  title={'机构选择'} renderButton={()=> {return <a style={{float:"right",fontSize:14}}>修改</a>}} defaultValue={this.state.orgs} onOk={orgs=>this.handleOnOk(orgs)}/>

			return(
					<div>
						<DescriptionList style={{ marginBottom: 24 }} title={action1}>
						<Description term="客户端ID">{this.state.clientId}</Description>
						<Description term="客户端凭证">{this.state.clientSecret}</Description>
						<Description term="应用类型">{this.state.clientType}</Description>
						<Description term="凭证有效时长(秒)">{this.state.expirein}</Description>
						<Description term="刷新凭证有效时长(秒):">{this.state.reExpirein}</Description>
						<Description term="应用安全等级">{this.state.securityLevel}</Description>
						<Description term="应用回调地址"><div title={this.state.clinetUrl} style={{textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap',width:'120px'}}>{this.state.clinetUrl}</div> </Description>
						<Description term="自定义登录页">{this.state.loginUrl}</Description>
						</DescriptionList>
						<h4 style={{ marginBottom: 16 }}>权限配置</h4>
						<Card type="inner" title="应用权限" style={{marginBottom:16}}>
							<DescriptionList col="1" style={{ marginBottom: 24 }} title={a}>
								<Description term="可使用应用的机构">{this.state.orgName.slice(1)}</Description>
							</DescriptionList>
						</Card>
						<Card type="inner" title="用户管理" style={{marginBottom:16}}>
										<User orgs={this.state.orgs}  appid={this.props.appid}/>			
						</Card>
						<Card type="inner" title="白名单管理" >
										<WhiteUser appid={this.props.appid}/>			
						</Card>
					</div>
			)
		}
		renderClose = ()=>{
			return (
				<DescriptionList style={{ margin: 24 }}>
						<span>温馨提示：如需使用平台提供的“统一认证及权限”服务、“统一门户集成服务”，请先启用统一认证。</span>
				</DescriptionList>
			)
		}
    render(){
			const title = <span>统一认证&权限配置  <Switch style={{marginLeft:24}} checkedChildren="开" unCheckedChildren="关" checked={this.state.isOpen} onClick={this.handleClick}/></span>
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
        return(
					<div>
						<Card title={title} style={{ margin: 24 }} bordered={false}>
							{
								this.state.isOpen?
								this.renderOpen():this.renderClose()
							}
						</Card>
						
							<Modal
							title="统一认证&权限配置"
							visible={this.state.visible1}
							onOk={this.handleOk1}
							onCancel={this.handleCancel1}
							>
							<Form >
								<FormItem {...formItemLayout} label="应用名称"
								>
										{getFieldDecorator('clientName',{initialValue:this.state.clientName})(
												<Input placeholder="输入名称" disabled />
										)}
								</FormItem>
									<FormItem {...formItemLayout} label="应用类型">
									{getFieldDecorator('clientType',{initialValue:this.state.clientType})(
											<Select>
													<Option value="1">web</Option>
													<Option value="2">app</Option>
											</Select>
									)}
									</FormItem>
									<FormItem {...formItemLayout} label="凭证有效时间">
											{getFieldDecorator('expirein',{initialValue:this.state.expirein})(
													<InputNumber style={{width: '100%'}} min={60} placeholder="输入时间" />
											)}
									</FormItem>
									<FormItem {...formItemLayout} label="刷新凭证有效时间">
											{getFieldDecorator('reExpirein',{initialValue:this.state.reExpirein})(
													<InputNumber style={{width: '100%'}} min={60} placeholder="输入时间" />
											)}
									</FormItem>
									<FormItem {...formItemLayout} label="应用安全等级">
											{getFieldDecorator('securityLevel',{initialValue:this.state.securityLevel})(
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
										{getFieldDecorator('clinetUrl',{initialValue:this.state.clinetUrl})(
												<Input onChange={e=>this.handleChange(e)} placeholder="输入地址" />
										)}
									</FormItem>
									<FormItem {...formItemLayout} label="自定义登录页">
											{getFieldDecorator('loginUrl',{initialValue:this.state.loginUrl})(
													<Input placeholder="输入地址" />
											)}
									</FormItem>
							</Form>
							</Modal>
							<Modal
							title="取消统一认证"
							visible={this.state.visible3}
							onOk={this.handleOk3}
							onCancel={this.handleCancel3}
							>	
							<p>即将关闭当前应用的统一认证功能，应用将不能继续使用统一认证提供的单点登录、访问权限控制等功能，确认继续？</p>
							</Modal>			
					</div>
           
        )
    }
}

const CertificationOpen=Form.create()(CertificationOpenForm)
export default CertificationOpen;