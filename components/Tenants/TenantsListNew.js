import React, { Component } from 'react'
import PageHeaderLayout from '../../routes/setting/layouts/PageHeaderLayout';
import { Card, List, Button ,Input, Row, Col,Statistic,message,Divider,Popconfirm} from 'antd';
// import { Pie, yuan } from 'ant-design-pro/lib/Charts';
import { getTenant,DeleteTenant } from '../../services/tp';
import { getApplicationRes } from '../../services/cce';
import constants from '../../services/constants';
import AddTenantModal from './AddTenantModal';
import {base} from '../../services/base'
import {getPagination,urlParamToObj,pushUrlParams} from '../../utils/utils'
import Authorized from '../../common/Authorized';

export class TenantsListNew extends Component {
	static propTypes = {

	}
	state ={
		data: [],
		visible: false,  //选择机构开关
		loading: true,
		addVisible: false,
		tenantCodes: [],
		tenantIds: [],
		result:{},
		page:1,
		pageSize:10
	}
	componentDidMount(){
		const urlSearch = urlParamToObj(this.props.history.location.search)		
		this.setState({searchData:urlSearch})
		this.loadData(1,10,urlSearch && urlSearch.tenantName ? urlSearch.tenantName:'');
	}
	
	name = '';
	loadData = (page, rows, name) => {
		this.setState({
			loading: true,
		})
		//默认写死租户code
		let queryParams = {
			code: constants.TENANT_CODE[0],
			page: page,
			rows: rows,
			name:name
		}
		getTenant(queryParams).then(data => {
			let getApplicationResAry = [];
			
			// let tenants = [];
			let tenantCodes = [];
			let tenantIds = []
			if (data.contents instanceof Array) {
				
				data.contents.forEach(item => {
					//过滤掉没有tenent_type的数据
					if (item.tenant_type && item.tenant_code) {
						// tenants.push(item)
						tenantCodes.push(item.tenant_code);
						tenantIds.push(item.id);
						if (base.configs.passEnabled) {
							
							getApplicationResAry.push(getApplicationRes(item.tenant_code));
							
						}
						// getTenantAppsAry.push(getTenantApps({ tenant: item.tenant_code }));
						// getTenentUsercountAry.push(getTenentUsercount(item.id));
						
					}
				})
				
				if(base.configs.passEnabled){
					Promise.all(getApplicationResAry).then(response => {
						data.contents.forEach((item,i) => {
							item.apps = response[i].apps.length;
							item.cpus = response[i].cpuUsedTotal;
							item.rams = parseFloat(response[i].memoryUsedTotal) / (1024 * 1024 * 1024).toFixed(2);
						})

						this.setState({page:data.pageIndex,pageSize:data.pageSize,loading:false,result:data ,data:data.contents,tenantIds:tenantIds,tenantCodes:tenantCodes});

					}).catch(err =>{
						this.setState({page:data.pageIndex,pageSize:data.pageSize,loading:false,result:data ,data:data.contents,tenantIds:tenantIds,tenantCodes:tenantCodes});

					});
				}
				
			}

			this.setState({loading:false,page:data.pageIndex,pageSize:data.pageSize,result:data ,data:data.contents,tenantIds:tenantIds,tenantCodes:tenantCodes});

		}).catch(err => {
			this.setState({ loading:false});
		})
	}

	//确认删除租户
	_deleteConfirm=(tenant)=>{
		DeleteTenant(tenant.id,constants.TENANT_CODE[0]).then(data => {
		  message.success("删除成功！");
		  this.loadData(1,1000);
		});
	}
	
	handleClick = (item)=>{
		const {history}=this.props;
		history.push({ pathname: `tenants/${item.id}`}) 
	}

	onChange = (page,rows) => {
		this.setState({
			page:page,
			pageSize:rows
		})
		this.loadData(page,rows,this.name);
	}
	onClick = () => {
		this.setState({addVisible:true})
	}
	transferAddVisible= (visible) =>{
		this.setState({addVisible:false});
		this.loadData(this.state.page,this.state.pageSize);
	}
	onSearch=(value)=>{
		this.name = value;
		pushUrlParams(this.props.history,{tenantName:value});
		this.loadData(this.state.page,this.state.pageSize,value);
	}

	onChange=(e,value)=>{
		this.setState({searchData:{tenantName:e.target.value}})
	}

	itemView = (item)=>{
		// const cpuData = [{x: 'CPU',y: item.cpus?item.cpus:0},{x: 'rest',y: item.cpus?100-parseFloat(item.cpus):100}];
		// const apiData = [{x: 'API',y: item.api?item.api:0},{x: 'rest',y: item.api?100-parseFloat(item.api):100}];
		// const appData = [{x: '应用',y: item.apps?item.apps:0},{x: 'rest',y: item.apps?100-parseFloat(item.apps):100}];
		// const memData = [{x: '内存',y: item.rams?item.rams:0},{x: 'rest',y: item.rams?100-parseFloat(item.rams):100}];
		return <Row style={{width:'80%'}}>
			 {/* <Col span={6}><Pie padding={[0,0,0,]} title="CPU" subTitle="CPU" total={item.cpus?item.cpus:0} data={cpuData} height={80} /></Col> */}
			 {/* <Col span={6}><Pie padding={[0,0,0,0]} title="API" subTitle="API" total={item.api?item.api:0}  data={apiData} height={80} /></Col> */}
			 {/* <Col span={6}><Pie padding={[0,0,0,0]} title="应用" subTitle="应用" total={item.apps?item.apps:0}  data={appData} height={80} /></Col> */}
			 {/* <Col span={6}><Pie padding={[0,0,0,0]} title="内存" subTitle="内存" total={item.rams?item.rams:0}  data={memData} height={80} /></Col> */}
			<Col span={5}> <Statistic title="应用（个）" value={item.apps} precision={0}   /></Col>
			<Col span={5}> <Statistic title="CPU（核）" value={item.cpus} precision={2}   /></Col>
			<Col span={5}> <Statistic title="内存(GB)" value={item.rams} precision={2}  /></Col>
			<Col span={4} offset={5} style={{textAlign:'center',marginTop:20}}>
				<a onClick={e=>this.handleClick(item)}>查看</a>
				<Divider type="vertical"/>
				<Authorized authority={'tenant_delete'} noMatch={<a disabled={true}>删除</a>}>
					<Popconfirm title={"确认是否删除租户【"+item.name+"】?"} onConfirm={()=>{this._deleteConfirm(item)}} okText="删除" cancelText="取消">

					<a>删除</a>
				</Popconfirm>
				</Authorized>
			</Col>
		</Row>
	}

	render() {
		const breadCrumbList = [{ title: '平台管理' }, { title: '租户列表' }]
		const content = (
			<span>租户可以使用平台分配的资源来部署和管理自己的应用</span>
		)
		const extra = (
			<Input.Search value={this.state.searchData?this.state.searchData.tenantName:''} placeholder="请输入名称搜索" onChange={this.onChange} onSearch={this.onSearch} style={{ width: 200 }}/>
		)
		return (
			<PageHeaderLayout
			breadcrumbList={breadCrumbList}
			title="租户列表"
			content={content}
		  >
				<Card title="租户列表" extra={extra}>
					<Button type='dashed' block icon='plus' onClick={this.onClick}>添加</Button>
					<List
						itemLayout="horizontal"
						dataSource={this.state.data}
						loading={this.state.loading}
						pagination={getPagination(this.state.result,this.onChange)}
						renderItem={item => (
							<List.Item key={item.id}>
								<List.Item.Meta style={{paddingTop:20}} title={<a style={{marginLeft:50,marginTop:20}} onClick={e=>this.handleClick(item)}><b>{item.name}</b></a>}/>
								{this.itemView(item)}
							</List.Item>
						)}
					/>
					<AddTenantModal visible={this.state.addVisible}
					tenantCodes={this.state.tenantCodes}
					tenantIds={this.state.tenantIds}
					onCancle={e => { this.setState({ addVisible: false }) }}
					transferVisible={(visible) => this.transferAddVisible(visible)} />
				</Card>
				
				</PageHeaderLayout>
		)
	}
}

export default TenantsListNew
