import React,{Component} from 'react';
import { Modal, Form, Input, Button, message, Select, Icon} from 'antd';
import {deleteApp,deleteAppDeploy,updateApp,getApp} from '../../../services/running';
import {queryRoutes,queryNetwork} from '../../../services/deploy'
import './Setting.css'
const FormItem=Form.Item;
const Option=Select.Option

let uuid=0

class SettingForm extends Component{
  state={
		inner: [],   //从应用中获取的内部地址
    visible:false,
		urls: [],      //应用访问地址
		url3s: [],				//内部地址
    code:'',
		deleteLoading:false,
		host: [],			//从应用中获取的访问地址
		ctx:'',				//从应用中获取的外部地址
		id:'',			//应用ID
	}

  componentWillReceiveProps (nextProps){
		if(nextProps.appCode!==this.state.code || nextProps.appId!==this.state.id){
			this.setState({ code: nextProps.appCode, id: nextProps.appId})
			let code=nextProps.appCode;
    //如果有code的话则刷新
			if(code){
				getApp(nextProps.appId).then(res=>{
					//判断应用的部署方式是否是k8s
					if(res.deployMode==='k8s'){
						queryRoutes(code).then(data=>{
							if(data){
								let array=[];
								data.forEach(item=>{
									array.push(item.ip);
								})
								this.setState({urls:array})
								queryNetwork(code).then(datas=>{
									if(datas.contents){
										let arrays=[];
										datas.contents.forEach(items=>{
											arrays.push(items.ip+':'+items.targetPort)
										})
										let url3s=this.state.url3s;
										url3s=[...array,...arrays]
										this.setState({url3s})
									}
								})
							}
						})
					}
				})
			}
		}
		if(this.state.ctx.length===0){
			if (nextProps.urls.ctx) {
				this.setState({
					ctx: nextProps.urls.ctx
				})
			} else {
				this.setState({ ctx: '' })
			}
		}
		if(this.state.host.length===0){
			if (nextProps.urls.host) {
				this.setState({
					host: nextProps.urls.host.split(','),
				})
			}
		}
  }
  showModals=()=>{
    this.setState({
      visible:true
    })
  }

  handleOk=()=>{
		let appId=this.state.id;
		this.props.form.validateFields((err, values) => {
			if(!err){
				let url='';	//应用访问地址
				let array=[];
				let arrays=[];//判断是否有重复数据的数组
				//遍历所有values里面的属性，并且吧ips开头的全部存入数组中
				for(let key in values){
					if (key.startsWith('ips')) {
						array.push(key);
					}
				}
				let b=true;
				array.forEach(i=>{
					//判断是否是对象，获取对象里面的值
					if (typeof (values[i]) ==='object'){
						for (let key in values[i]){
							if (arrays.indexOf(values[i][key])===-1){
								arrays.push(values[i][key])
							}else{
								message.error('有重复数据，请先删除重复数据再提交');
								b=false;
								return false;
							}
							url += values[i][key]+','
						}
					}else{
						if(arrays.indexOf(values[i])===-1){
							arrays.push(values[i])
						}else{
							message.error('有重复数据，请先删除重复数据再提交');
							b=false;
							return false;
						}
						url+=values[i]+','
					}
				})
				if(b){
					let queryParams = {
						type: '2'
					}
					let a=url.substring(url.length-1)===','?url.substring(0,url.length-1):url;
					let bodyParams = {
						host: a,
						ctx: values.ctx,
					}
					updateApp(appId,queryParams,bodyParams).then(data=>{
						if(data){
							this.props.onOk();
							this.setState({
								visible:false
							})
						}
					}) 
				}
			}
		})
  }

  handleCancle=()=>{
    const form=this.props.form;
    form.resetFields();
    this.setState({visible:false})
  }

  //输入框删除
  handleClose = (removedUrl) => {
			const {form} =this.props;
			const ip=form.getFieldValue('ip');
			//当input框是最后一个 则只是清除input框的值
			form.setFieldsValue({
				ip: ip.filter(key => key !== removedUrl)
			})
  }
  handleDelete=()=>{
    this.setState({deleteLoading:true});
    const appid=this.props.appId;
    const appCode = this.props.appCode;
    if(appCode){
      deleteAppDeploy(appCode).then(data=>{
        this.deleteApp(appid);
      }).catch(error=>{
          message.error("删除应用部署失败");
      });
    }else{
      this.deleteApp(appid);
    }
  }

  deleteApp = (appid)=>{
    deleteApp(appid).then(data=>{
      this.setState({deleteLoading:false});
      message.success('删除应用成功')
      window.location.href='/#/apps';
    }).catch(error=>{
      message.error("删除应用失败");
      this.setState({deleteLoading:false});
  	});
  }
	addUrls=()=>{
		const {form}=this.props;
		const keys=	form.getFieldValue('ip');
		const nextKeys = keys.concat(uuid);
		uuid++
		form.setFieldsValue({
			ip: nextKeys
		})
	}
  render(){
		const {  urls, host,ctx}=this.state;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		getFieldDecorator('ip',{initialValue:host});
		const ip = getFieldValue('ip');

		const OptionUrls=urls.map((item,index)=>{
			return <Option key={index} value={item}>{item}</Option>
		})

		const formItemLayoutWithOutLabel = {
			wrapperCol: {
				xs: { span: 24, offset: 0 },
				sm: { span: 12, offset: 4 },
				md: {span:16,offset:7}
			},
		};


		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 7 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 12 },
				md: { span: 16 },
			},
		};

		const formItems = ip.map((k, index) => {
			return (
				<FormItem
					{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
					label={index === 0 ? '应用访问地址' : ''}
					key={k}
					required={false}
					>
					{getFieldDecorator(`ips${k}`, {
						initialValue: host.indexOf(k) > -1 ? k : '',
						validateTrigger: ['onChange', 'onBlur'],
						rules:[
						/* 	{pattern: /^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig,
							message:'应用地址输入有误'
							},  */
							{
								required: true,
								whitespace: true,
								message: '请输入地址或者删除该行',
							}
						]
					})(
						<Select
							style={{ width: '60%', marginRight: 8 }}
							mode='combobox'
							filterOption={e=>{return true}}
							>
								{OptionUrls}
						</Select>
						)
						 }
						<Icon
						className="dynamic-delete-button"
						type="minus-circle-o"
						onClick={e => this.handleClose(k)}
						/>
					
				</FormItem>
			);
		})

		var dom = null;
    if (this.props.renderButton) {
        dom = 
        (<a style={{float:"right",fontSize:14}} onClick={this.showModals}>
            {this.props.renderButton}
        </a>)
    }else{
      dom=(<a style={{float:"right",fontSize:14}} onClick={this.showModals}>修改</a>)
    }
    return(
			<div>
				{dom}
				<Modal
					title='应用访问地址修改'
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancle}
					>
					<Form>
						{formItems}

						<FormItem {...formItemLayoutWithOutLabel}>
							<Button type="dashed" onClick={this.addUrls} style={{ width: '60%' }}>
								<Icon type="plus" />添加应用访问地址
          		</Button>
						</FormItem>

						<FormItem {...formItemLayout} label='上下文'>
							{getFieldDecorator('ctx',{initialValue:ctx})(
								<Input style={{ width: '60%', marginRight: 8 }}/>
							)}
						</FormItem>
					</Form>
				</Modal>
			</div>
    )
  }
}
const Setting=Form.create()(SettingForm);
export default Setting;