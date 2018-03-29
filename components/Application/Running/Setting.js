import React,{Component} from 'react';
import { Card ,Modal,Form,Input,Button,Row,Col,message,Alert,Select} from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import {deleteApp,deleteAppDeploy} from '../../../services/running';
import {queryRoutes,queryNetwork} from '../../../services/deploy'


const TextArea=Input.TextArea;
const FormItem=Form.Item;
const Option=Select.Option
const { Description } = DescriptionList;
class SettingForm extends Component{
  state={
    url1s:['xxx1','xxxx1'],   //域名绑定
    visible:false,
		urls: [],      //内部地址
		url3s:[],				//外部地址
    code:'',
    url2s:['xxx2','xxxx2'],      //上下文
    inputVisible: false,
    inputVisible1: false,
    inputVisible2: false,
    inputValue: '',
    deleteLoading:false,
	}

  componentWillReceiveProps (nextProps){
		if(nextProps.appCode!==this.state.code){
			this.setState({code:nextProps.appCode})
			let code=nextProps.appCode;
    //如果有code的话则刷新
			if(code){
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
		}
  }
  showModals=()=>{
		//每次模态框打开时重新调接口
		let code=this.state.code;
  	if(code){
  		queryRoutes(code).then(data=>{
					if(data){
						let array=[];
						data.forEach(item=>{
							array.push(item.ip);
						})
						this.setState({urls:array})
					}
				})
  	}
    this.setState({
      visible:true
    })
  }

  handleOk=()=>{
    this.setState({visible:false})
	/* 	const form=this.props.form;
		let array=form.getFieldsValue(); */
		let urls=this.state.urls;
		let url3s=this.state.url3s;
		console.log('urls',urls,'url3s',url3s)
		this.props.onOk();
  }

  handleCancle=()=>{
    const form=this.props.form;
    form.resetFields();
    this.setState({visible:false})
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value});
  }

  handleSelectChange=(e)=>{
    console.log(e)
    this.setState({inputValue: e})
  }

  //输入框删除
  handleClose = (removedUrl,name) => {
    if(name==='urls'){
      const urls = this.state.urls.filter(url => url !== removedUrl);
      this.setState({ urls });
    }
    if(name==='url1s'){
      const url1s = this.state.url1s.filter(url => url !== removedUrl);
      this.setState({ url1s });
    }
    if(name==='url2s'){
      const url2s = this.state.url2s.filter(url => url !== removedUrl);
      this.setState({ url2s });
		}
		if(name==='url3s'){
      const url3s = this.state.url3s.filter(url => url !== removedUrl);
      this.setState({ url3s });
    }
  }

  //输入框确认,根据传过来的属性判断是确认哪里的输入框
  handleInputConfirm = (name) => {
    const state = this.state;
    const inputValue = state.inputValue;
    if(name==='urls'){
      let urls = state.urls;
      if (inputValue && urls.indexOf(inputValue) === -1) {
        urls = [...urls, inputValue];
      }
      this.setState({
        urls,
        inputVisible: false,
        inputValue: '',
      })
    }
    if(name==='url1s'){
      let url1s = state.url1s;
      if (inputValue && url1s.indexOf(inputValue) === -1) {
        url1s = [...url1s, inputValue];
      }
      this.setState({
        url1s,
        inputVisible1: false,
        inputValue: '',
      })
    }
    if(name==='url2s'){
      let url2s = state.url2s;
      if (inputValue && url2s.indexOf(inputValue) === -1) {
        url2s = [...url2s, inputValue];
      }
      this.setState({
        url2s,
        inputVisible2: false,
        inputValue: '',
      })
		}
		if(name==='url3s'){
      let url3s = state.url3s;
      if (inputValue && url3s.indexOf(inputValue) === -1) {
        url3s = [...url3s, inputValue];
      }
      this.setState({
        url3s,
        inputVisible3: false,
        inputValue: '',
      })
    }
  }

  addInput=(name)=>{
    if(name==='urls'){
      this.setState({
        inputVisible:true
      })
    }
    if(name==='url1s'){
      this.setState({
        inputVisible1:true
      })
    }
    if(name==='url2s'){
      this.setState({
        inputVisible2:true
      })
		}
		if(name==='url3s'){
      this.setState({
        inputVisible3:true
      })
    }
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
  saveInputRef = input => this.input = input
  
  saveSelectRef = select => this.select = select
  render(){
		const {inputVisible,urls,inputValue,url1s,url2s,inputVisible1,inputVisible2,url3s,inputVisible3}=this.state;
    const action=<a style={{float:"right",fontSize:14}} onClick={this.showModals}>修改</a>
    const { getFieldDecorator } = this.props.form;
			const formItemLayout = {
					labelCol: {
							xs: { span: 24 },
							sm: { span: 7 },
					},
					wrapperCol: {
							xs: { span: 18 },
							sm: { span: 12 },
							md: { span: 14 },
					},
			};

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
						<FormItem {...formItemLayout} label='应用访问地址'>
						{getFieldDecorator('ip')(
							<div>
								{urls.map((url,index)=>{
									return <Row >
										<Col span={19}>
											<Input defaultValue={url} onChange={this.handleInputChange}/>
										</Col>
										<Col>
										<Button onClick={e=>this.handleClose(url,'urls')}>-</Button>
										</Col>
									</Row>  
								})}
								{inputVisible && (
									<Select 
										mode="combobox"
										ref={this.saveSelectRef}
										style={{width:216}}
										optionFilterProp="children"
										placeholder='请输入'
										onChange={this.handleSelectChange}
										onBlur={e=>this.handleInputConfirm('urls')}
										onPressEnter={e=>this.handleInputConfirm('urls')}
										>
											{urls.map(items=>{
													return <Option key={items}>{items}</Option>
											})}
										</Select>
								)}
								<Button onClick={e=>this.addInput('urls')}>+</Button>
								</div>
						)}
						
					</FormItem>

					<FormItem {...formItemLayout} label='外部地址'>
						{getFieldDecorator('outIp')(
							<div>
								{url3s.map((url,index)=>{
									return <Row >
										<Col span={19}>
											<Input defaultValue={url} onChange={this.handleInputChange}/>
										</Col>
										<Col>
										<Button onClick={e=>this.handleClose(url,'url3s')}>-</Button>
										</Col>
									</Row>  
								})}
								{inputVisible3 && (
									<Select 
										mode="combobox"
										ref={this.saveSelectRef}
										style={{width:216}}
										optionFilterProp="children"
										placeholder='请输入'
										onChange={this.handleSelectChange}
										onBlur={e=>this.handleInputConfirm('url3s')}
										onPressEnter={e=>this.handleInputConfirm('url3s')}
										>
											{url3s.map(items=>{
													return <Option key={items}>{items}</Option>
											})}
										</Select>
								)}
								<Button onClick={e=>this.addInput('url3s')}>+</Button>
								</div>
						)}
						
					</FormItem>
	
						<FormItem {...formItemLayout} label='域名绑定'>
							{url1s.map((url,index)=>{
								return <Row >
									<Col span={19}>
										<Input defaultValue={url} onChange={this.handleInputChange}/>
									</Col>
									<Col>
									<Button onClick={e=>this.handleClose(url,'url1s')}>-</Button>
									</Col>
									
								</Row>  
							})}
							{inputVisible1 && (
								<Input
								ref={this.saveInputRef}
								type="text"
								style={{width:255}}
								onChange={this.handleInputChange}
								onBlur={e=>this.handleInputConfirm('url1s')}
								onPressEnter={e=>this.handleInputConfirm('url1s')}
							/>
							)}
							<Button onClick={e=>this.addInput('url1s')}>+</Button>
						</FormItem>
	
						<FormItem {...formItemLayout} label='上下文'>
							{url2s.map((url,index)=>{
								return <Row >
									<Col span={19}>
										<Input defaultValue={url} onChange={this.handleInputChange}/>
									</Col>
									<Col>
									<Button onClick={e=>this.handleClose(url,'url2s')}>-</Button>
									</Col>
								</Row>  
							})}
							{inputVisible2 && (
								<Input
								ref={this.saveInputRef}
								type="text"
								style={{width:255}}
								onChange={this.handleInputChange}
								onBlur={e=>this.handleInputConfirm('url2s')}
								onPressEnter={e=>this.handleInputConfirm('url2s')}
							/>
							)}
							<Button onClick={e=>this.addInput('url2s')}>+</Button>
						</FormItem>
					</Form>
				</Modal>
			</div>
    )
  }
}
const Setting=Form.create()(SettingForm);
export default Setting;