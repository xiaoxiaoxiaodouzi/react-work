import React from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import { queryTags } from '../../../services/aip';
import './index.css';
const FormItem = Form.Item;
const { Option } = Select;
// let statusMap = [];
// for (let key in constants.APP_STATE_CN) {
// 	statusMap.push({
// 		key,
// 		text: constants.APP_STATE_CN[key]
// 	})
// }
// statusMap.forEach(element => {
// 	element.status = constants.APP_STATE_EN[element.key]
// })

/* const statusMap = [
    { key:'pending',status:'processing',text:'待启动' },
    { key:'succeeded',status:'success',text:'运行中' },
    { key:'stop',status:'default',text:'停止' },
    { key:'failed',status:'error',text:'失败' },
    { key:'running',status:'processing',text:'启动中' },
    { key:'exception',status:'warning',text:'异常' },
] */

export default class SearchInput extends React.Component {
	state = {
		tags: [],
		statusMap:[]
	}
	constructor(props) {
		super(props);
		this.getTags(props.tenant);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.allStatus){
			let statusMap = [];
			let allStatus = nextProps.allStatus;
			for (let key in allStatus) {
					statusMap.push({
						key,
						text: allStatus[key].statusName
					})
			}

			this.setState({statusMap});
		}
		
		if ((nextProps.tenant && nextProps.tenant !== this.props.tenant) || (nextProps.environment && nextProps.environment !== this.props.environment)) {
			this.getTags(nextProps.tenant);
		}
	}
	getTags = (tenant) => {
		queryTags({ tenant: tenant }).then(data => {
			this.setState({
				tags: data
			})
		})
	}
	inputChange = (e) => {
		this.props.searchchange({ "name": e.target.value });
	}
	selectChange = (value) => {
		this.props.searchchange({ "tagId": value });
	}
	statusChange = (value) => {
		this.props.searchchange({ "status": value });
	}
	render() {
		console.log(this.props);
		return (
			<div className="tableList">
				<Form>
					<Row gutter={24}>
						<Col md={6} sm={24}>
							<FormItem label="名称">
								<Input placeholder="请输入" style={{ width: '100%' }}
									onChange={this.inputChange}
									value={this.props.searchparam.name} />
							</FormItem>
						</Col>
						<Col md={6} sm={24}>
							<FormItem label="标签">
								<Select placeholder="请选择" style={{ width: '100%' }}
									value={this.props.searchparam.tagId} mode="multiple"
									onChange={this.selectChange} >
									{
										this.state.tags.length > 0 ?
											this.state.tags.map((value, index) => {
												return (
													<Option key={index} value={value.id}>{value.name}</Option>
												)
											}) : null
									}
								</Select>
							</FormItem>
						</Col>
						<Col md={6} sm={24}>
							<FormItem label="状态">
								<Select placeholder="请选择" style={{ width: '100%' }}
									value={this.props.searchparam.status}
									onChange={this.statusChange}>
									{
										this.state.statusMap.map((value, index) => {
											return (
												<Option key={index} value={value.key}>{value.text}</Option>
											)
										})
									}
								</Select>
							</FormItem>
						</Col>
						<Col md={6} sm={24}>
							<Button type="primary" htmlType="submit" onClick={this.props.handlesearch}>查询</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.props.restfields}>重置</Button>
						</Col>
					</Row>
				</Form>
			</div>
		)
	}
}