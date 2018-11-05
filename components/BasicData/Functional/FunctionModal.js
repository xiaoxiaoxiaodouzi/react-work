import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconSelectModal from '../../../common/IconSelectModal'
import { getResources } from '../../../services/functional'
import { Modal, Form, Input, Button, Select, TreeSelect } from 'antd'
import IconUpload from './IconUpload'

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
class FunctionModalForm extends Component {
	static propTypes = {
		prop: PropTypes.object,
		onOk: PropTypes.func,			//模态框确认回调方法
		onCancel: PropTypes.func,				//模态框取消回调方法
		visible: PropTypes.bool, 		//模态框的开启状态
		data: PropTypes.array.isRequired,	//当前数据
		datas: PropTypes.array.isRequired,			//所有数据 树结构，
		oriData: PropTypes.array.isRequired,				//所有数据list结构 用来找到父节点
	}

	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			inputVisible: false,
			inputValue: '',
			fontIcon: this.props.data.fontIcon,
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
		}
		this.ftype = '';
		//绑定this对象
		this.handelSelect = this.handelSelect.bind(this);
	}


	initState = () => {
		this.setState({
			urlFormVisible: this.ftype === 'innerservice' || this.ftype === 'outerservice' || this.ftype === 'page' || this.ftype === 'function',
			picFormVisible: this.ftype === 'function',
			codeFormVisible: true,
			methodFormVisible: this.ftype === 'innerservice' || this.ftype === 'outerservice',
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible !== this.props.visible && nextProps.visible) {
			let data = {};
			//如果是添加资源则展示父资源
			if (nextProps.type === 'addResource') {
				//如果传了数据在给表单设置初始值
				this.ftype = 'page';
				data = nextProps.data;
				this.setState({ resource: nextProps.data, type: nextProps.type })
				//如果是添加资源
			} else if (nextProps.type === 'addFunction') {
				this.ftype = 'function';
				this.setState({ resource: nextProps.data, type: nextProps.type })
			} else {
				//this.findSelectNode(this.props.datas,this.props.data)
				this.ftype = nextProps.data.type;
				if (nextProps.oriData) {
					data = nextProps.oriData.filter(item => item.id === nextProps.data.pid)[0];
				}
				//复制对象数组，采用转JSON格式复制
				let js = JSON.stringify(nextProps.datas);
				let ary = JSON.parse(js);
				this.findSelectNode(ary, nextProps.data);
				this.setState({ resource: nextProps.data, type: nextProps.type, TreeNodeData: ary })
			}
			this.initState();
			this.setState({ fontIcon: nextProps.data ? nextProps.data.fontIcon : null, pname: data ? data.id : '0' })
		}
	}

	handleCancle = () => {
		this.props.onCancel();
	}

	handleOk = () => {
		const { form } = this.props;
		form.validateFields((err, values) => {
			if (err) {
				if (this.state.codeFormVisible && err.code) {
					return;
				}

				if (this.state.urlFormVisible && err.uri) {
					return;
				}
				if (this.state.methodFormVisible && err.method) {
					return;
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
			values.desc ? values.desc : values.desc === ''
			this.props.onOk(values);
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
		this.ftype = value;
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
		} else if (rule.field === 'desc') {
			if (value && value.length > 100) {
				callback('描述信息字数太长，请重新输入！')
			} else {
				callback();
			}
		}
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
			<div>
				<Modal
					width={800}
					title={this.state.type === 'update' ? '编辑功能' : this.state.type === 'addResource' ? '新增资源' : '新增功能'}
					visible={this.props.visible}
					onOk={this.handleOk}
					okText='提交'
					onCancel={this.handleCancle}
					destroyOnClose
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
						{/* <FormItem {...formItemLayout} label='标签'>
							{getFieldDecorator('tag')(
								<div>
									{this.state.tags.map((tag, index) => {
										const isLongTag = tag.length > 20;
										const tagElem = (
											<Tag closable key={tag} afterClose={() => this.handleClose(tag)}>
												{isLongTag ? `${tag.slice(0, 20)}...` : tag}
											</Tag>
										);
										return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
									})}
									{this.state.inputVisible && (
										<Input
											ref={this.saveInputRef}
											type="text"
											size="small"
											style={{ width: 78 }}
											value={this.state.inputValue}
											onChange={this.handleInputChange}
											onBlur={this.handleInputConfirm}
											onPressEnter={this.handleInputConfirm}
										/>
									)}
									{!this.state.inputVisible && (
										<Tag
											onClick={this.showInput}
											style={{ background: '#fff', borderStyle: 'dashed' }}
										>
											<Icon type="plus" />新标签
											</Tag>
									)}
								</div>
							)}
						</FormItem> */}
						{this.state.picFormVisible &&
							<div>
								<FormItem {...formItemLayout} label='图标'>
									{getFieldDecorator('fontIcon')(
										<IconSelectModal renderButton={<Button type="dashed" icon={this.state.fontIcon || 'plus'} />} selectIcon={(icon) => this.setState({ fontIcon: icon })} />
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="icon">
									{getFieldDecorator('icon')(<IconUpload />)}
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
			};
		}
	},
})(FunctionModalForm);
export default FunctionModal;


