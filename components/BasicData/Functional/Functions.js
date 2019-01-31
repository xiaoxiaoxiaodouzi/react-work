import React, { Component, } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Select, message, Modal } from 'antd';
import FunctionTable from './FunctionTable'
import FunctionModal from '../../BasicData/Functional/FunctionModal'
import { deleteFunctional,getResourceTree,postFunctionTags,deleteFunctionTags,updateResource,addResource,getRoleResources } from '../../../services/aip'
import TreeHelp from '../../../utils/TreeHelp'
import BaseTree from '../../../common/BaseTree'
import Authorized from '../../../common/Authorized';
import EntrancePreview from './EntrancePreview';
const Option = Select.Option
const FormItem = Form.Item

let originData = [];
// eslint-disable-next-line
let origin = {};
class FunctionsForm extends Component {
	static propTypes = {
		prop: PropTypes.object,
		showSearchInput: PropTypes.bool,	//是否显示搜索框及新建按钮
		showAddButton: PropTypes.bool,				//是否显示新建导入按钮
		showUnionButton: PropTypes.bool,        //是否显示功能关联按钮
		showCheckBox: PropTypes.bool,				//是否显示checkbox勾选功能
	}

	static defaultProps = {
		showSearchInput: false,
		showAddButton: false,
		showUnionButton: false,
		showCheckBox: false,
	}


	state = {
		roleList: [],
		datas: [],
		record: {},			//选中功能对象
		visible: false, 			//模态框的开合
		visibleModal: false,
		type: '',
		options: [],					//下拉搜索框的选项
		loading: false,
		oriData: [],			//未做处理的数据
		confirmLoading: false,			//确定按钮 loading
		previewVisible:false
	}

	componentDidMount() {
		this.setState({
			roleList: this.props.roleList
		});
		if(this.props.roleId){
			this.loadDatas();
		}
		
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.roleList && nextProps.roleList.length > 0) {
			if ((nextProps.roleList !== this.props.roleList) || (nextProps.refreshFlag !== this.props.refreshFlag)) {
				this.setState({
					roleList: nextProps.roleList
				});
				this.loadDatas();
			}

		}

	}

	loadDatas = (params) => {
		//有可能是从角色进来的资源列表 也有可能是应用下面进来的资源列表，所以这里要区分下查询
		this.setState({ loading: true })
		if (this.props.roleId) {
			
			//调用角色查询资源的接口
			getRoleResources(this.props.appId, this.props.roleId, Object.assign({}, { page: 1, rows: 10, cascade: true }, params)).then(res => {
				if (res.length > 0) {
					res.forEach(i => {
						i.pid = i.parentId
					})
				}
				let r=JSON.parse(JSON.stringify(res));
				originData = [];
				originData = originData.concat(r);
				this.setState({ oriData: res, datas: TreeHelp.toChildrenStruct(res), loading: false })
			}).catch(err => {
				this.setState({ loading: false })
			})
		} else {
			let queryParams = Object.assign({}, {
				pid: 0,
				cascade: true,
			}, params);
			getResourceTree(this.props.appId, queryParams).then(res => {
				if (res.length > 0) {
					res.forEach(i => {
						i.pid = i.parentId
					});
					let r=JSON.parse(JSON.stringify(res));
					originData = [];
					originData = originData.concat(r);
					let funcs = TreeHelp.toChildrenStruct(res);
					this.setState({ oriData: res, datas: funcs });
				}

				this.setState({ loading: false })
			}).catch(err => {
				this.setState({ loading: false })
			})
		}
	}

	//新增修改数据
	updateDatas = (values,newTags,deleteTags) => {
		let record = this.state.record;
		let type = this.state.type;
		let dataSource = this.state.datas;
		if (type === 'update') {
			//调用修改接口
			values.parentId = values.pid;
			if (values.pid === '0') {
				values.type = 'function'
			}
			updateResource(record.appId, record.id, values).then(data => {
				if(record.type === 'function'){
					if(newTags && newTags.length > 0){
						postFunctionTags(record.appId,record.id,newTags).then(resTags =>{
							//新增tags成功
							console.log("新增标签成功！");
						})
					}
					if(deleteTags && deleteTags.length > 0){
						deleteFunctionTags(record.appId,record.id,{tagIds:deleteTags}).then(res =>{
							//删除标签成功
							console.log("删除标签成功！");
						})
					}
				}
				this.setState({ visible: false, record: '', confirmLoading: false })
				message.success('修改资源成功')
				for (let i in data) {
					record[i] = data[i]
				}
				//不调用查询接口，直接修改STATE。
				//先找到它要移动的父数据
				if (values.pid !== '0') {
					this.findSelectData(dataSource, values.pid);
					if (this.origin.children) {
						this.origin.children.push(record)
					} else {
						this.origin.children = [];
						this.origin.children.push(record)
					}
				} else {//如果移动的父Id为0，则直接加在跟目录下面
					//如果修改的是功能则不需要push进去
					if (record.type !== 'function') dataSource.push(record);
				}
				//然后找到原来的父，将children里面的当前数据清除掉
				this.findSelectData(dataSource, record.pid);
				this.origin.children.forEach((i, index) => {
					if (i.id === record.id) {
						this.origin.children.splice(index, 1)
					}
				})
				this.setState({ datas: dataSource })
				if (this.props.resourceChange()) {
					this.props.resourceChange();
				}
			}).catch(err => {
				this.setState({ visible: false, record: '', confirmLoading: false })
			})
		} else if (type === 'delete') {
			deleteFunctional(record.appId, record.id).then(data => {
				if(deleteTags && deleteTags.length > 0){
					deleteFunctionTags(record.appId,record.id,{tagIds:deleteTags}).then(res =>{
						//删除标签成功
						console.log("删除标签成功！");
					})
				}
				if (this.props.resourceChange()) {
					this.props.resourceChange();
				}
				this.setState({ datas: dataSource.filter(elemnt => elemnt.id !== record.id) })
			})
		} else {
			//新增看是加在顶级节点还是某个功能下面
			let params = {};
			if (record) {
				params.parentId = record.id;
			} else {
				params.parentId = '0';
			}
			let queryParams = Object.assign({}, params, values)
			addResource(this.props.appId, queryParams).then(data => {
				//没有则是加功能
				if (!record) {
					dataSource.push(data);
					if(newTags && newTags.length > 0){
						postFunctionTags(this.props.appId,data.id,newTags).then(resTags =>{
							//新增tags成功
							console.log("新增标签成功！");
						})
					}
					
				} else {
					if (!record.children) record.children = [];
					record.children.push(data)
				}
				this.setState({ visible: false, datas: dataSource, confirmLoading: false })
				if (this.props.resourceChange()) {
					this.props.resourceChange();
				}
				message.success('新增资源成功')
			}).catch(err => {
				this.setState({ visible: false, record: '', confirmLoading: false })
			})
		}
	}

	//找到指定树数据中的某条数据
	findSelectData = (datas, id) => {
		datas.forEach(item => {
			if (item.id !== id) {
				if (item.children) {
					this.findSelectData(item.children, id)
				}
			} else {
				this.origin = item;
			}
		})
	}

	//打开模态框
	ModalVisible = (type, record) => {
		this.setState({ type: type, record: record }, () => {
			if (type === 'delete') {
				this.updateDatas();
			} else {
				this.setState({ visible: true })
			}
		})
	}

	//模态框确认按钮传入数据
	onOk = (values,newTags,deleteTags) => {	
		if(values.appType){
			let appType = values.appType;	
			let atstr = appType[0];
			if(appType.length === 2){
				atstr += "," + appType[1];
			}
			values.appType = atstr;
		}
	
		this.setState({ confirmLoading: true })
		this.updateDatas(values,newTags,deleteTags);
	}

	onCancel = () => {
		this.setState({
			visible: false,
			record: ''
		})
	}

	handleSearch = (e) => {
		e.preventDefault();
		let form = this.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			// if(!values.name && !values.roles){
			// 	return;
			// }
			let ary = originData.filter(i => i.name.includes(values.name));
			this.setState({ datas: TreeHelp.toChildrenStruct(ary) })
		})
	}

	onSearch = (values) => {
		let ary = originData.filter(i => i.name.includes(values));
		this.setState({ options: ary })
	}

	//名称选择
	handleSelect = (value, option) => {
		this.findSelectData(originData, option.key);
		this.setState({ datas: [this.origin] })
	}

	//角色选择
	roleSelect = (value, option) => {
		let ary = [];
		originData.forEach(i => {
			if (i.roleList.length > 0) {
				i.roleList.forEach(item => {
					if (item.id === value) ary.push(Object.assign({},i));
				})
			}
		})
		this.setState({ datas: TreeHelp.toChildrenStruct(ary) })
	}

	handleFormReset = () => {
		const { form } = this.props;
		form.resetFields();
		let data = TreeHelp.toChildrenStruct(JSON.parse(JSON.stringify(originData)));
		this.setState({ datas: data })
	}

	handleOk = () => {

	}

	resourcesync = () => {
		//预览入口数据
		// previewSync(this.props.appId).then(datas => {
			
		// })
		this.setState({
			previewVisible:true
		})
	}

	renderSimple = () => {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		return (
			<div className='tableList'>
				<Form>
					<Row gutter={{ md: 4, lg: 12, xl: 18 }}>
						<Col span={6}>
							<FormItem label="名称">
								{getFieldDecorator('name')(
									<Select placeholder="请输入"
									style={{width:'100%'}}
										showSearch
										filterOption={(inputValue, option) => option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
										onSearch={this.onSearch}
										onSelect={this.handleSelect}
										notFoundContent={null} >
										{this.state.options.map(i => {
											return <Option key={i.id}>{i.name}</Option>
										})}
									</Select>
								)}
							</FormItem>
						</Col>

						{/* <Col md={6} sm={24}>
							<FormItem label="标签">
								{getFieldDecorator('tag')(
									<Input placeholder="请输入" />
								)}
							</FormItem>
						</Col> */}
						<Col span={6}>
							<FormItem {...formItemLayout} label="角色">
								{getFieldDecorator('roles', { initialValue: this.props.selectedTag })(
									<Select placeholder="请选择"
										style={{ width: '100%' }}
										onSelect={this.roleSelect}
									>
										{
											this.state.roleList ?
												this.state.roleList.map((value, index) => {
													return (
														<Option key={value.id} value={value.id}>{value.name}</Option>
													)
												}) : null
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={6}>
							{/* <Button type="primary" htmlType="submit">查询</Button> */}
							<Button style={{ marginLeft: 8,marginTop:3 }} onClick={this.handleFormReset}>重置</Button>
						</Col>
					</Row>
				</Form>
			</div>
		)
	}
	render() {
		return (
			<div>
				{/*  {this.props.showUnionButton ? <Button type='primary' style={{ marginBottom: 12 }} onClick={() => this.setState({visibleModal:true})} >功能关联</Button> : ''} */}
				{this.props.showSearchInput ? this.renderSimple() : ''}
				{this.props.showAddButton ? <div style={{ marginBottom: 12, marginTop: 12 }}>
					{/* <Button type="primary" >导入</Button> */}
					<Authorized authority='app_addFunction' noMatch={null}>
						<Button type="primary" icon='plus' style={{ marginLeft: 8 }} onClick={e => this.ModalVisible('addFunction')}>新增功能</Button>
					</Authorized>

					<Authorized authority="functional_resourcesync" noMatch={null}>
						<Button icon="global" style={{ marginLeft: 8 }} onClick={e => this.resourcesync()}>同步入口数据</Button>
					</Authorized>
				</div> : ''}
				<FunctionModal confirmLoading={this.state.confirmLoading} oriData={this.state.oriData} datas={this.state.datas} type={this.state.type} data={this.state.record}
				 visible={this.state.visible} onOk={this.onOk} onCancel={this.onCancel} appId={this.props.appId}/>
				<FunctionTable loading={this.state.loading} showCheckBox={this.props.showCheckBox} roleId={this.props.roleId} datas={this.state.datas} updateDatas={this.updateDatas} ModalVisible={this.ModalVisible} />

				<EntrancePreview visible={this.state.previewVisible} appId={this.props.appId} onCancel={()=>{this.setState({previewVisible:false})}}/>
				<Modal
					width='800px'
					title='功能关联'
					visible={this.state.visibleModal}
					onOk={this.handleOk}
					onCancel={() => this.setState({ visibleModal: false })}
				>
					<BaseTree onSelectKeys={(selectKeys, selectNodes) => this.onSelectKeys(selectKeys, selectNodes)} treeNodes={this.state.treeNode} pidName="parentId" />
				</Modal>
			</div>
		)
	}
}

const Functions = Form.create()(FunctionsForm);
export default Functions;
