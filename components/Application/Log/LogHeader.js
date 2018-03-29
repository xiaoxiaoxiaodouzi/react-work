import React,{Component} from 'react'
import {Form,Select,Checkbox,Row,Col,Button} from 'antd'
import './LogHeader.css'
import {getApplications,getApplicationBase,getApplicationLog} from '../../../services/log'
import {getAppInfo} from '../../../services/appdetail'
import fetch from "isomorphic-fetch";


const { Option } = Select;
const FormItem = Form.Item;
class LogForm extends Component{

	state={
		podNames:[],				//副本数
		name:[],
		log:'',
		datas:[],						//应用数据
		pod:{},
		check:true,
		intervals:[]
	}

	componentDidMount(){
		const appId=this.props.appid;
		getAppInfo(appId).then((data)=>{
			getApplications(data.code).then(datas=>{
				if(datas){
					this.setState({
						replicas:datas.replicas
					})
				}
			})
			getApplicationBase(data.code).then(datas=>{
				if(datas){
					let podArray=[];
					let nameArray=[];
					datas[0].podNameList.forEach(pods=>{
						podArray.push(pods)
					})
					datas.forEach(item=>{
						nameArray.push(item.name)
					})
					this.setState({
						podNames:podArray,
						name:nameArray,
						datas:datas
					})
					this.handleClick(true);
				}
			})
		});
		
	}
componentWillUnmount(){
	this.state.intervals.forEach(item=>{
		clearInterval(item)
	})
}

dataFormate=(data)=>{
	if (!data || data.length < 1) {
		return '无日志内容'
	} else {
		let content = data.split('\n');
		return content.map(c=>{
			let a=c.split('\t');
			if(a.lengt>=2){
				return <div><span class="logful"> {c}</span><br /></div>
			}else{
				return <div><span class="logtime"> {c}</span><br /></div>
			}
			return 
		})
	}
}

	handleClick=(check)=>{
		const form=this.props.form;
		form.validateFields((err,values)=>{
			//只要数据发生改变，则将之前的定时器关闭
			this.state.intervals.forEach(item=>{
				clearInterval(item)
			})
			if(err){
				return;
			}
			let queryParams={
				lines:values.lines,
				type:'map'
			}
				//如果checkBox没被勾选则不出发定时器
			if(check){
				let interval =setInterval(()=>{
					getApplicationLog(values.podName,values.name,queryParams).then(data=>{
					if(data){
						let logs=this.dataFormate(data.content);
						this.setState({
							log:logs
						})
					}
				})},2000)
				this.state.intervals.push(interval)
			}
		})
	}
	//checkbox点选
	checkChange=(e)=>{
		let sss=e.target.checked;
		this.setState({
			check:sss
		})
		this.handleClick(sss);
	}

	handleChange=(e,name)=>{
		console.log("e",e)
		const form=this.props.form;
		if(name==='name'){
			form.setFieldsValue({
				name:e
			})
		}
		if(name==='podName'){
			form.setFieldsValue({
				nampodName:e
			})
		}
		if(name==='lines'){
			form.setFieldsValue({
				lines:e
			})
		}
		this.handleClick(this.state.check);
	}

  render(){
    const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
					sm: { span: 8 },
			},
			wrapperCol: {
					sm: { span: 16 },
			},
		};
    return(
      <div>
				<div >
						<Form >
							<Row style={{paddingTop:16}} gutter={{ span:24 }}>
								<Col span={6}>
									<FormItem {...formItemLayout} label="容器" 
									>
											{getFieldDecorator('name',{initialValue:this.state.name[0]})(
													<Select onChange={e=>this.handleChange(e,'name')}>
													{this.state.name.map(item=>
														<Option key={item} value={item}>{item}</Option>
													)}
													</Select>
											)}
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="副本" 
									>
											{getFieldDecorator('podName',{initialValue:this.state.podNames[0]})(
													<Select onChange={e=>this.handleChange(e,'podName')}>
													{this.state.podNames.map((item,i)=>
														<Option key={item} value={item}>{i+1}</Option>
													)}
													</Select>
											)}
									</FormItem>
								</Col>
								<Col span={6}>
									<FormItem {...formItemLayout} label="行数"
									>
											{getFieldDecorator('lines',{initialValue:'100'})(
													<Select onChange={e=>this.handleChange(e,'lines')}>
														<Option value='100'>100</Option>
														<Option value='500'>500</Option>
														<Option value='1000'>1000</Option>
														<Option value='2000'>2000</Option>
														<Option value='5000'>5000</Option>
														<Option value='10000'>10000</Option>
													</Select>
											)}
									</FormItem>
								</Col> 
								<Col span={6} style={{paddingTop:8,paddingLeft:36}}>
									<Checkbox defaultChecked={this.state.check} onChange={e=>this.checkChange(e)}/><span >定时刷新</span>
								</Col>
							</Row>
						</Form>
					
				</div>
				<div style={{backgroundColor:'black',color:'white',height:700,paddingLeft:25,overflow:'auto',paddingTop:15}}>
					{this.state.log}
				</div>
      </div>
    )
  }
}
const LogHeader = Form.create()(LogForm);
export default LogHeader;