import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconSelectModal from '../../../common/IconSelectModal'
import { getAllFunctionTags,getFunctionTags, getResources } from '../../../services/aip';
import TagManager from '../../../common/TagManager';
import { Modal, Form, Input, Button, Select, TreeSelect, Checkbox, Icon } from 'antd'
import IconUpload from './IconUpload'
import { TwitterPicker } from 'react-color'
import { base } from '../../../services/base';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const CheckboxGroup = Checkbox.Group
class FunctionModalForm extends Component {
	static propTypes = {
		prop: PropTypes.object,
		onOk: PropTypes.func,			//模态框确认回调方法
		onCancel: PropTypes.func,				//模态框取消回调方法
		visible: PropTypes.bool, 		//模态框的开启状态
		data: PropTypes.object.isRequired,	//当前数据
		datas: PropTypes.array.isRequired,			//所有数据 树结构，
		oriData: PropTypes.array.isRequired,				//所有数据list结构 用来找到父节点
	}

	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			inputVisible: false,
			inputValue: '',
			fontIcon: '',
			previewVisible: false,
			previewImage: '',
			urlFormVisible: '',
			picFormVisible: '',
			codeFormVisible: '',
			methodFormVisible: '',
			fileList: [],
			resource: '',
			type: '',
			pname: '',
			TreeNodeData: [],			//过滤当前数据的树结构数据
			displaynameColor:false,
			displayiconColor:false,
			isShowFType:true,
			funcTags:[],
			allTags:[],
			visible:false,
			newTags:[],
			deleteTags:[],
			appId:''
		}

		this.ftype = '';
		//绑定this对象
		this.handelSelect = this.handelSelect.bind(this);
	}


	initState = () => {

		this.setState({
			urlFormVisible: this.ftype === 'innerservice' || this.ftype === 'outerservice' || this.ftype === 'page' || this.ftype === 'function' || this.appType === 'app' || this.appType === 'all',
			picFormVisible: this.ftype === 'function' || this.appType === 'app' || this.appType === 'all',
			codeFormVisible: true,
			methodFormVisible: this.ftype === 'innerservice' || this.ftype === 'outerservice',
			webFormVisible: (this.appType === 'web' || this.appType === 'all') && this.ftype === 'function',
			appFormVisible: this.appType === 'app' || this.appType === 'all',
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible !== this.props.visible && nextProps.visible) {
			if(nextProps.appId && nextProps.appId !== ''){
				getAllFunctionTags({appId:nextProps.appId}).then(res => {
					if(res && res.length > 0){
						this.setState({allTags:res});
					}
				})
			}
			
			let data = {};
			//如果是添加资源则展示父资源
			if (nextProps.type === 'addResource') {
				//如果传了数据在给表单设置初始值
				this.ftype = 'page';
				data = nextProps.data;
				this.setState({ resource: nextProps.data, type: nextProps.type ,isShowFType:false})
				//如果是添加资源
			} else if (nextProps.type === 'addFunction') {
				this.ftype = 'function';
				this.appType = 'web';
				this.setState({ resource: nextProps.data, type: nextProps.type,isShowFType:true,
					funcTags:[],
					newTags:[],
					deleteTags:[]})
			} else {
				//标记获取功能下的标签
				if(nextProps.data){
					getFunctionTags(nextProps.data.appId,nextProps.data.id,{}).then(data=>{
						if(data && data.length > 0){
							this.setState({
								funcTags:data
							})
						}
					})
				}
				this.ftype = nextProps.data.type;
				let isShowFType = true;
				if(this.ftype !== 'function'){
					isShowFType = false;
				}
			
				if (nextProps.oriData) {
					data = nextProps.oriData.filter(item => item.id === nextProps.data.pid)[0];
				}
				//复制对象数组，采用转JSON格式复制
				let js = JSON.stringify(nextProps.datas);
				let ary = JSON.parse(js);
			
				this.findSelectNode(ary, nextProps.data);
				this.setState({ resource: nextProps.data, type: nextProps.type, TreeNodeData: ary,isShowFType:isShowFType })
			}
			this.initState();
			this.setState({
				nameColor: nextProps.data ? nextProps.data.nameColor : 'ABB8C3',
				iconColor: nextProps.data ? nextProps.data.iconColor : 'ABB8C3',
				fontIcon: nextProps.data ? nextProps.data.fontIcon : null,
				pname: data ? data.id : '0',
				appId:nextProps.appId
			})

		}
	}

	// 标签变化回调  create创建新标签 add绑定已创建标签 remove移除标签{event:'add',value:{id:***,name:*****}}
	onTagsManagerChange=(data) => {
		var tag = data.value;
		tag.tenant = base.tenant;
		tag.appId = this.state.appId;
		console.log(data)
		if (data.event === "add" || data.event === 'create') {
		  //新增标签
		  let newTags = [...this.state.newTags];
		  let funcTags = [...this.state.funcTags];
		  newTags.push(tag);
		  funcTags.push(tag);
		  this.setState({newTags:newTags,funcTags:funcTags});
		} else  {
			//移除标签
			let deleteTags =  [...this.state.deleteTags];
			let newTags = [...this.state.newTags];
		  	let funcTags = [...this.state.funcTags];
			if(tag.id && tag.id !== ''){				
				deleteTags.push(tag.id);
				funcTags.splice(funcTags.indexOf(tag),1);
			}else{
				funcTags.splice(funcTags.indexOf(tag),1);
				newTags.splice(newTags.indexOf(tag),1);
			}			
			this.setState({deleteTags:deleteTags,funcTags:funcTags,newTags:newTags});		  
		}
	}

	  //标签弹窗管理可见回调
	  onVisibleChange=(visible) =>{
		if (visible) {
			getAllFunctionTags({})
			.then((response) => {
			  this.setState({
				allTags: response,
				visible: true
			  })
			})
		} else {
		  this.setState({ visible: false })
		}
	  }

	handleCancle = () => {
		this.appType = '';
		this.props.onCancel();
	}

	handleOk = () => {
		this.setState({ confirmLoading: true })
		const { form } = this.props;
		form.validateFields((err, values) => {
			if (err) {
				/* for(let i in err){
					if(err[i].errors.length>0){
						return;
					}
				} */
				if (!err.name) {
					//根据不同情况 检验规则不一样，
					if (this.state.codeFormVisible && err.code) {
						return;
					}

					if (this.state.urlFormVisible && err.uri) {
						return;
					}
					if (this.state.methodFormVisible && err.method) {
						return;
					}
				} else {
					return
				}
			}
			if (this.state.type === 'addResource' || this.state.type === 'addFunction') {
				/* let roles = this.state.resource.roleList;
				let roleId = [];
				for (let r of roles) {
					roleId.push(r.id);
				}
				let codes = [];
				codes.push(values.code);
				permissionsVerify(codes, { roleCode: roleId }).then(data => {
					if (!data[values.code]) {
						form.setFields({
							code: {
								value: values.code,
								errors: [new Error('编码已存在，请重新输入!')],
							},
						});
					}
				})*/
			}
			values.fontIcon = this.state.fontIcon || this.props.fontIcon;
			//将上传数据分别放入对应的 属性里面去
			/* 	values.icon1 = values.icon.fileList,
					values.icon2 = values.icon.fileList1,
					values.icon3 = values.icon.fileList2,
					delete values.icon; */
			// values.desc ? values.desc : values.desc === ''
			this.setState({ visible: false });
			let newTags = this.state.newTags;
			let deleteTags = this.state.deleteTags;
			this.setState({
				newTags:[],
				deleteTags:[],
				funcTags:[],
				allTags:[]
			})
			values.icon1 = this.state.icon1;
			values.icon2 = this.state.icon2;
			values.icon3 = this.state.icon3;
			this.props.onOk(values,newTags,deleteTags);
		});
	}


	handleClose = (removedTag) => {
		const tags = this.state.tags.filter(tag => tag !== removedTag);
		this.setState({ tags });
	}

	showInput = () => {
		this.setState({ inputVisible: true }, () => this.input.focus());
	}

	handleInputChange = (e) => {
		this.setState({ inputValue: e.target.value });
	}

	handleInputConfirm = () => {
		const state = this.state;
		const inputValue = state.inputValue;
		let tags = state.tags;
		if (inputValue && tags.indexOf(inputValue) === -1) {
			tags = [...tags, inputValue];
		}
		this.setState({
			tags,
			inputVisible: false,
			inputValue: '',
		});
	}

	saveInputRef = input => this.input = input
	handleCancel = () => this.setState({ previewVisible: false })

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

	handelSelect = (value) => {
		if(this.ftype === 'function'){
			if(value.length === 1){
				this.appType = value[0];
			}else if(value.length === 2){
				this.appType = "all";
			}
			
		}else{
			this.ftype = value;
		}
		
		this.initState();
	}

	handleChange = ({ fileList }) => this.setState({ fileList })

	//下拉树选择变化
	onChange = (value) => {
		console.log(value);
	}

	//递归查询找到树下面的子节点
	findSelectNode = (datas, node) => {
		datas.forEach((item, index) => {
			if (item.id === node.id) {
				datas.splice(index, 1)
			} else {
				if (item.children) {
					this.findSelectNode(item.children, node)
				}
			}
		})
	}

	renderTreeNodes = (data) => {
		return data.map((item) => {
			if (item.children) {
				return (
					<TreeNode title={item.name} key={item.id} dataRef={item} value={item.id}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode title={item.name} key={item.id} dataRef={item} value={item.id} />;
		});
	}

	validateParams = (rule, value, callback) => {
		if (rule.field === 'code') {
			if (value) {
				let queryParams = {
					code: value,
					uniquenessCheck: true
				}
				if (this.props.type === 'update') {
					if (value !== this.props.data.code) {
						getResources(queryParams).then(data => {
							if (!data) {
								callback();
							} else {
								callback('编码已存在，请重新输入')
							}
						})
					} else {
						callback();
					}
				} else {
					getResources(queryParams).then(data => {
						if (!data) {
							callback();
						} else {
							callback('编码已存在，请重新输入')
						}
					})
				}
			} else {
				callback('请填写编码')
			}
		} else if (rule.field === 'desc') {
			if (value && value.length > 100) {
				callback('描述信息字数太长，请重新输入！')
			} else {
				callback();
			}
		}
	}
	iconOnchange=(values)=>{
		this.setState({
			icon1:values.icon1,
			icon2:values.icon2,
			icon3:values.icon3		
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
		const options = [
			{ label: 'WEB', value: 'web' },
			{ label: 'APP', value: 'app' },
		  ];
		return (
			<div>
				<Modal
					width={800}
					title={this.state.type === 'update' ? '编辑功能' : this.state.type === 'addResource' ? '新增资源' : '新增功能'}
					visible={this.props.visible}
					onOk={this.handleOk}
					okText='提交'
					onCancel={this.handleCancle}
					destroyOnClose
					confirmLoading={this.props.confirmLoading}
					key='FunctionModalForm'
				>
					<Form>
						{this.state.type === 'update' ?
							<FormItem {...formItemLayout} label='父资源名称'>
								{getFieldDecorator('pid', { initialValue: this.state.pname })(
									<TreeSelect
										treeDefaultExpandedKeys={['0']}
										treeNodeFilterProp='title'
										showSearch
										style={{ width: '100%' }}
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										placeholder="请选择"
										allowClear
										searchPlaceholder='请选择'
										onChange={this.onChange}
									>
										{this.renderTreeNodes([{ name: '功能', id: '0', children: this.state.TreeNodeData }])}
									</TreeSelect>
								)}
							</FormItem> : ''}
						<FormItem {...formItemLayout} label='名称'>
							{getFieldDecorator('name', { rules: [{ required: true, message: '请填写名称！' }] })(
								<Input />
							)}
						</FormItem>

						{this.state.isShowFType?<FormItem {...formItemLayout} label='功能类型'>
							{getFieldDecorator('appType',{ initialValue: ['web'] ,
							rules: [{ required: true, message: '至少选择一个类型！' }]})(
								<CheckboxGroup disabled={this.props.type === 'update'?true:false} onChange={this.handelSelect} options={options} >
								</CheckboxGroup>
							)}
						</FormItem>:''}
						 

						{this.state.webFormVisible &&
							<FormItem {...formItemLayout} label='打开方式'>
								{getFieldDecorator('target', { initialValue: '_self' })(
									<Select>
										<Option key='_self' value='_self'>本窗口</Option>
										<Option key='_blank' value='_blank'>新窗口</Option>
									</Select>
								)}
							</FormItem>
						}

						{this.state.appFormVisible &&
							<div>
								<FormItem {...formItemLayout} label='移动类型'>
									{getFieldDecorator('mobileAppType', { initialValue: 'native' })(
										<Select >
											<Option key='native' value='native'>原生应用</Option>
											<Option key='externalNative' value='externalNative'>小程序</Option>
											<Option key='web' value='web'>web应用</Option>
										</Select>
									)}
								</FormItem>

								<FormItem {...formItemLayout} label='字体颜色'>
									<div>
										<div 
										style={{cursor: 'pointer',textAlign:'center',color:this.state.nameColor,marginTop:4, height: '30px', width: '30px', borderRadius: 4, backgroundColor: this.state.nameColor, float: 'left', position: 'relative' }} 
										onClick={()=>{this.setState({displaynameColor:!this.state.displaynameColor})}}>
										<Icon type='edit'/>
										</div>
										{
											this.state.displaynameColor &&
										<div style={{ position:'absolute',top:'55px',zIndex:10}}>
										<div style={{position: 'fixed',top: '0px', right: '0px', bottom: '0px',left: '0px'}} onClick={()=>{this.setState({displaynameColor:false})}}/>
											<TwitterPicker
												triangle='top-left'
												style={{ width: 300 }}
												color={this.state.nameColor}
												onChangeComplete={(color, event) => { this.setState({ nameColor: color.hex,displaynameColor:false}) }}
											/>
										</div>
										}
									</div>
								</FormItem>

								<FormItem {...formItemLayout} label='图标颜色'>
									<div>
										<div 
										style={{cursor: 'pointer',textAlign:'center',color:this.state.iconColor,marginTop:4, height: '30px', width: '30px', borderRadius: 4, backgroundColor: this.state.iconColor, float: 'left', position: 'relative' }}
										onClick={()=>{this.setState({displayiconColor:!this.state.displayiconColor})}}
										>
										<Icon type='edit'/>
										</div>
										{
											this.state.displayiconColor && 
											<div style={{ position:'absolute',top:'55px',zIndex:10}}>
											<div style={{position: 'fixed',top: '0px', right: '0px', bottom: '0px',left: '0px'}} onClick={()=>{this.setState({displayiconColor:false})}}/>
												<TwitterPicker
													triangle='ltop-lefteft'
													color={this.state.iconColor}
													onChangeComplete={(color, event) => { this.setState({ iconColor: color.hex ,displayiconColor:false}) }}
												/>
											</div>
										}
									</div>
								</FormItem>
							</div>
						}

						{this.state.type === 'addResource' ?
							<FormItem {...formItemLayout} label='类型'>
								{getFieldDecorator('type', { initialValue: 'page' })(
									<Select onSelect={this.handelSelect}>
										<Option key='page' value='page'>页面</Option>
										<Option key='element' value='element'>页面元素</Option>
										<Option key='innerservice' value='innerservice'>内部服务</Option>
										<Option key='outerservice' value='outerservice'>外部服务</Option>
										<Option key='custom' value='custom'>自定义资源</Option>
									</Select>
								)}
							</FormItem>
							: (this.state.type === 'addFunction' ?
								<FormItem {...formItemLayout} label='类型'>
									{getFieldDecorator('type', { initialValue: 'function', rules: [{ required: true, message: '请选择类型！' }] })(
										<Select disabled={true}>
											<Option key='function' value='function'>功能</Option>
										</Select>
									)}
								</FormItem>
								:
								<FormItem {...formItemLayout} label='类型'>
									{getFieldDecorator('type', { rules: [{ required: true, message: '请选择类型！' }] })(
										<Select disabled={true}>
											<Option key='function' value='function'>功能</Option>
											<Option key='page' value='page'>页面</Option>
											<Option key='element' value='element'>页面元素</Option>
											<Option key='innerservice' value='innerservice'>内部服务</Option>
											<Option key='outerservice' value='outerservice'>外部服务</Option>
											<Option key='custom' value='custom'>自定义资源</Option>
										</Select>
									)}
								</FormItem>)
						}
						{this.state.urlFormVisible &&
							<FormItem {...formItemLayout} label='URL'>
								{getFieldDecorator('uri', { rules: [{ required: true, message: '请填写URL！' }] })(
									<Input />
								)}
							</FormItem>}

						{this.state.methodFormVisible &&
							<FormItem {...formItemLayout} label='method'>
								{getFieldDecorator('method', { rules: [{ required: true, message: '请填写方法！' }] })(
									<Select>
										<Select.Option value="get">GET</Select.Option>
										<Select.Option value="post">POST</Select.Option>
										<Select.Option value="put">PUT</Select.Option>
										<Select.Option value="delete">DELETE</Select.Option>
										<Select.Option value="head">HEAD</Select.Option>
										<Select.Option value="patch">PATCH</Select.Option>
										<Select.Option value="options">OPTIONS</Select.Option>
										<Select.Option value="trace">TRACE</Select.Option>
									</Select>
								)}
							</FormItem>}

						{this.state.codeFormVisible &&
							<FormItem {...formItemLayout} label='编码'>
								{getFieldDecorator('code', {
									rules: [{ required: true, validator: this.validateParams }]
								})(
									<Input />
								)}
							</FormItem>}

						<FormItem {...formItemLayout} label='描述'>
							{getFieldDecorator('desc', {
								rules: [{ validator: this.validateParams }]
							})(
								<TextArea minLength='3' />
							)}
						</FormItem>
						{this.state.picFormVisible &&
							<div>
								<FormItem {...formItemLayout} label='标签'> 
									<TagManager style={{ marginLeft: 10 }} visible={this.state.visible} selectedTags={this.state.funcTags} allTags={this.state.allTags} onChange={this.onTagsManagerChange} onVisibleChange={this.onVisibleChange} />
								</FormItem>
								<FormItem {...formItemLayout} label='图标'>
									{getFieldDecorator('fontIcon')(
										<IconSelectModal renderButton={<Button type="dashed" icon={this.state.fontIcon || 'plus'} />} selectIcon={(icon) => this.setState({ fontIcon: icon })} />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="icon">
									<IconUpload data={this.props.data} onChange={this.iconOnchange}/>
								</FormItem>
							</div>
						}
					</Form>
				</Modal>
			</div>
		)
	}
}

const FunctionModal = Form.create({
	mapPropsToFields(props) {
		if (props.type === 'update') {
			return {
				name: Form.createFormField({
					value: props.data.name || '',
				}),
				uri: Form.createFormField({
					value: props.data.uri || ''
				}),
				type: Form.createFormField({
					value: props.data.type || ''
				}),
				fontIcon: Form.createFormField({
					value: props.data.fontIcon
				}),
				desc: Form.createFormField({
					value: props.data.desc || ''
				}),
				tag: Form.createFormField({
					value: props.data.tag || ''
				}),
				icon: Form.createFormField({
					value: props.data.icon || ''
				}),
				icons: Form.createFormField({
					value: props.data.icons || ''
				}),
				code: Form.createFormField({
					value: props.data.code || ''
				}),
				method: Form.createFormField({
					value: props.data.method || ''
				}),
				appType: Form.createFormField({
					value: props.data.appType?props.data.appType.split(","):[]
				}),
				target: Form.createFormField({
					value: props.data.target
				}),
				mobileAppType: Form.createFormField({
					value: props.data.mobileAppType
				}),
			};
		}
	},
})(FunctionModalForm);
export default FunctionModal;


