import React from 'react';
import {Table,Divider,message,
	Form,
	Button,
	Select,
	Radio,
	Row,
	Col,
	InputNumber,
	Modal
} from 'antd';
import AddContainer from './AddContainer';
import {queryClusters} from '../../../services/apps';
import Cluster from './Cluster'
import {getTaskById} from '../../../services/images'
import LogModal from '../../../components/Setting/Images/LogModal'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
	labelCol: {
		span: 3,
	},
	wrapperCol: {
		span: 12,
	},
};
const formTailLayout = {
	wrapperCol: {
		span: 6,
		offset: 17
	},
};
class Step2 extends React.Component {
		state = {
			check: false, //弹框是否为点击的查看
			loading: false,
			selectedRowKeys: null,
			buttonValue: "1",
			addConVisible: false,
			clusters: null,
			containers: [],
			container: null,
			disable: true ,
			ids:[],				//镜像ID数组
			visible:false,			//模态框可见属性
		}
		componentDidMount() {
			this.getClusters();
		}
		getClusters() {
			queryClusters().then(data => {
				this.setState({
					clusters: data
				})
			})
		}
		handleButtonChange = (e) => {
			this.setState({
				buttonValue: e.target.value
			})
		}
		deleteContainer = (e, name) => {
			this.setState({
				loading: true
			})
			e.preventDefault();
			const newData = this.state.containers.filter(item => item.name !== name);
			this.setState({
				containers: newData,
				selectedRowKeys: null,
				loading: false
			});
		}
		deleteContainers = () => {
			if (!this.state.selectedRowKeys) {
				message.warning("请选择要删除的容器！");
				return;
			}
			this.setState({
				loading: true
			})
			const newContainers = [...this.state.containers];
			this.state.selectedRowKeys.forEach((item, index) => {
				delete newContainers[item];
			})
			let newContainers2 = [];
			for (let i = 0; i < newContainers.length; i++) {
				if (newContainers[i]) {
					newContainers2.push(newContainers[i])
				}
			}
			this.setState({
				containers: newContainers2,
				selectedRowKeys: null,
				loading: false
			});
		}
		//添加的容器id
		index = 0
		afterAddContainer = (container) => {
			if (container) {
				let ids=[];
				if (this.state.check) {
					const newContainers = this.state.containers.filter(item => item.id !== container.id);
					newContainers.push(container);
					newContainers.forEach(item=>{
						//如果有镜像任务ID，则去查询任务状态
					if(item.imageTaskId){
							ids.push(item.imageTaskId)
						}
					})
					if(ids.length>0){
						this.setState({
							ids
						})
						this.getStatus(newContainers,ids)
					}else{
						this.setState({containers:newContainers})
					}
				} else {
					container.id = "newContainer" + this.index;
					this.index += 1;
					this.state.containers.push(container);
					this.state.containers.forEach(item=>{
					//如果有镜像任务ID，则去查询任务状态
					if(item.imageTaskId){
							ids.push(item.imageTaskId)
						}
					})
					if(ids.length>0){
						this.setState({
							ids
						})
						this.getStatus(this.state.containers,ids)
					}else{
						this.setState({containers:this.state.containers})
					}
				}
			}
			this.setState({
				addConVisible: false
			})
		}

		//如果存在镜像任务iD则进行查询状态
		getStatus=(containers,ids)=>{
			if(ids.length>0 && containers.length>0){
				let ary=[];
				ids.forEach(id=>{
					ary.push(getTaskById(id));
				})
				Promise.all(ary).then(res=>{
					//遍历所有返回的任务状态，如果有跟镜像匹配上的则将状态组装起来
					containers.forEach((item,i)=>{
							res.forEach(s=>{
								//如果任务ID相同，则匹配
								if(item.imageTaskId===s.packid){
									containers[i].status=s.status;
								}
							})
					})
					this.setState({
						containers: containers
					})
				})
			}else{
				this.setState({
					containers: []
				});
			}
		}
		handleSubmit = (e) => {
			if(e)e.preventDefault();
			this.props.form.validateFields((err, values) => {
				if (!err) {
					this.props.submitstep2(values, this.state.containers);
				}
			});
		}
		onSelectChange = (selectedRowKeys) => {
			this.setState({
				selectedRowKeys
			});
		}
		//点击查看弹框，直接跳到部署配置
		check = (record) => {
			this.setState({
				check: true,
				addConVisible: true,
				container: record
			})
		}

		//点击添加容器，弹框
		add = () => {
			this.setState({
				check: false,
				addConVisible: true
			})
		}
		//查询所有镜像打包情况
		handleClick=()=>{
			let ids=this.state.ids;
			let queryStatus=[];
			let flag=false;
			if(ids.length>0){
				ids.forEach(id=>{
					queryStatus.push(getTaskById(id));
				})
				Promise.all(queryStatus).then(res=>{
					res.forEach(item=>{
						if(item.status!==4){
							flag=true
						}
					})
					//如果有状态不为4的，则打开模态框
					if(flag){
						this.setState({
							visible:true,
						})
					}else{
						this.handleSubmit();
					}
				})
			}else{
				this.handleSubmit();
			}
		}

		//模态框确认
		handleOk=()=>{
			this.handleSubmit();
			this.setState({
				visible:false
			})
		}

		handleCancel=()=>{
			this.setState({
				visible:false
			})
		}

		render() {
			const {getFieldDecorator}=this.props.form;
			const containerColumns = [{
					title: '容器名称',
					dataIndex: 'name',
					key: 'name',
					width: '25%',
				}, {
					title: '镜像',
					dataIndex: 'image',
					key: 'image',
					width: '40%',
				}, {
					title: '计算资源',
					dataIndex: 'resources',
					key: 'resources',
					width: '15%',
					render: (text, record) => {
						return text ? text.limits.cpu.amount + "核/" + text.limits.memory.amount : '';
					}
				}, {
					title: '操作',
					dataIndex: 'id',
					key: 'id',
					width: '20%',
					render: (text, record) => ( 
						<span>
							<Divider type = "vertical" />
							<a onClick = {() => this.check(record)} > 查看 </a>  
							<a onClick = {(e) => this.deleteContainer(e, record.name)}> 删除 </a>  
						</span>
					) 
				}];

				const containerImagesColumns = [{
					title: '容器名称',
					dataIndex: 'name',
					key: 'name',
					width: '20%',
				}, {
					title: '镜像',
					dataIndex: 'image',
					key: 'image',
					width: '35%',
				}, {
					title: '计算资源',
					dataIndex: 'resources',
					key: 'resources',
					width: '15%',
					render: (text, record) => {
						return text ? text.limits.cpu.amount + "核/" + text.limits.memory.amount : '';
					}
				}, 
				{
					title: '状态',
					dataIndex: 'status',
					key: 'status',
					width: '10%',
					render:(text,record)=>{
						if(text===1){
							return  <LogModal  id={record.imageTaskId} name={record.imageName}/> 
						}
						if(text===2){
							return <LogModal  id={record.imageTaskId} name={record.imageName}/> 
						}
						if(text===3){
							return <LogModal  id={record.imageTaskId} name={record.imageName}/> 
						}
						if(text===4){
							return <LogModal  id={record.imageTaskId} name={record.imageName}/> 
						}
						if(text===5){
							return <LogModal  id={record.imageTaskId} name={record.imageName}/> 
						}
					}
				},
				{
					title: '操作',
					dataIndex: 'id',
					key: 'id',
					width: '20%',
					render: (text, record) => ( 
						<span>
							<Divider type = "vertical" />
							<a onClick = {() => this.check(record)} > 查看 </a>  
							<a onClick = {(e) => this.deleteContainer(e, record.name)}> 删除 </a>  
						</span>
					) 
				}];
				const containerRowSelection = {
					selectedRowKeys: this.state.selectedRowKeys,
					onChange: this.onSelectChange,
				};
				return ( 
					<div style = {{display: this.props.display ? 'block' : 'none'}}>
						<Row>
							<Col span = {24} offset = {1}>
								<Form layout = "horizontal" onSubmit = {this.handleSubmit} style = {{marginTop: 24}} hideRequiredMark >
									<FormItem { ...formItemLayout} label = "部署方式：" > {
										( 
									<Radio.Group value = {this.state.buttonValue} onChange = {this.handleButtonChange} >
										<Radio.Button size='large' value = "1" > 镜像 </Radio.Button>  
										<Radio.Button size='large' value = "2" > 程序包 </Radio.Button> 
										<Radio.Button size='large' value = "3" > 外部应用接入 </Radio.Button> 
									</Radio.Group> )
									} 
									</FormItem>  
								</Form> 
						{this.state.buttonValue === '3' ?
							<Cluster stepback={this.props.stepback} onOk={arrays=>this.props.otherSubmitstep2(arrays)}/>
							: 
							<Form layout = "horizontal" onSubmit = {this.handleSubmit} style = {{marginTop: 24}} hideRequiredMark >
								<FormItem { ...formItemLayout} label = "部署集群：" > 
									{getFieldDecorator('cluster', {
											rules: [{
												required: true,
												message: '请选择部署集群！'
											}],
										})( 
										<Select placeholder = "请选择应用部署的集群" > 
										{this.state.clusters ? this.state.clusters.map((item) => {
												return (
													<Option value = {item.id} key = {item.id}> 
														{item.name} 
													</Option>
												)
											}) 
											: ""} 
											</Select>)}  
									</FormItem>
									<FormItem { ...formItemLayout} label = "部署副本数：" > {getFieldDecorator('replicas', {initialValue: 1}, {
											rules: [{
												required: true,
												message: '请输入部署副本数！'
											}],
										})(<InputNumber min = {1} onChange = {this.onChange}/>)
										} 
										</FormItem>  
										<Row style = {{marginTop: '80px'}} >
											<Col span = {24} offset = {1}>
												<Button type = "primary" icon = "plus" onClick = {this.add} > 
													{this.state.buttonValue === '2' ? '自定义镜像' : '添加容器'} 
												</Button> 
											<Button style = {{marginLeft: '10px'}} onClick = {this.deleteContainers} > 删除 </Button>  
											<AddContainer transferVisible = {this.afterAddContainer}
												visible = {this.state.addConVisible}
												type = {	this.props.type}
												check = {this.state.check}
												container = {this.state.container}
												containers = {this.state.containers}
												buttonValue={this.state.buttonValue}
											/>  
											</Col> 
										</Row> 
										<Row style = {{marginTop: '10px'}} >
											<Col span = {21} offset = {1} >
											<Table 
												rowSelection = {containerRowSelection}
												columns = {this.state.buttonValue==='2'?containerImagesColumns:containerColumns}
												dataSource = {this.state.containers}
												rowKey = {	(record, index) => index}
												loading = {this.state.loading	}/>  
											</Col> 
										</Row> 
										<br/>
										<br/>
										<FormItem { ...formTailLayout}>
											<Button onClick = {this.props.stepback} > 上一步 </Button>  
											<Button type = "primary" 	onClick={this.handleClick} style = {{marginLeft: '20px'}} > 创建 </Button>  
											</FormItem> 
										</Form>
						} 
							</Col>  
						</Row> 
						<Modal
						title='确认？'
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						visible={this.state.visible}
						>
							<p>还有镜像未打包成功是否继续创建?</p>
						</Modal>
					</div>
				)
		}
}
export default Step2 = Form.create()(Step2);