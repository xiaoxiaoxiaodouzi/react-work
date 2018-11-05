import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Input, Select, Row, Col, Button, DatePicker, Icon } from 'antd'
import { getLogs } from '../../../services/log'
import moment from 'moment';
import LogInputs from './LogInputs'
import constants from '../../../services/constants'

const { RangePicker } = DatePicker;
class LogTableForm extends Component {
	static propTypes = {
		prop: PropTypes.object,
		type: PropTypes.string,
		id: PropTypes.string,
	}

	state = {
		data: [],
		current: 1,
		total: '',
		pageSize: 10,
		params: {},
		loading: false,
		expandForm: false,
	}

	componentDidMount() {
		this.loadDatas(1, 10)

	}


	loadDatas = (current, page, params) => {
		let queryparams = {
			page: current,
			rows: page
		};
		if (this.props.type === 'app') {
			queryparams = {
				aps: [this.props.id]
			}
		} 

		this.setState({ loading: true })
		getLogs(Object.assign({}, queryparams, params)).then(data => {
			this.setState({ data: data.contents, current: data.pageIndex, pageSize: data.pageSize, total: data.total, loading: false })
		}).catch(err => {
			this.setState({ loading: false })
		})
	}

	//重置表格查询条件
	handleFormReset = () => {
		const { form } = this.props;
		form.resetFields();
		this.setState({ params: {} }, () => {
			this.loadDatas(1, 10)
		})
	}

	handleSearch = (e) => {
		e.preventDefault();
		const { form } = this.props;
		form.validateFields((err, values) => {
			if (err) {
				return
			}
			let params = {
				opn: values.opn,
				co: values.co,
				ips:[],
			}
			if(values.Ip.IP1) params.ips.push(values.Ip.IP1);
			if(values.Ip.IP2) params.ips.push(values.Ip.IP2);
			if (values.rangePickerValue) {
				params.starttime = moment(values.rangePickerValue[0]).format('x');
				params.endtime = moment(values.rangePickerValue[1]).format('x');
			}

			this.setState({ params }, () => {
				this.loadDatas(1, 10, params)
			})
		})
	}

	toggleForm = () => {
		this.setState({
			expandForm: !this.state.expandForm,
		});
	}

	searchSimpleInput = () => {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				sm: { span: 8 },
			},
			wrapperCol: {
				sm: { span: 16 },
			},
		};
		if (this.props.type === 'app') {
			return (
				<div className="tableList">
					<Form onSubmit={this.handleSearch} layout="inline">
						<Row style={{ marginBottom: 12 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
							<Col md={6} sm={24}>
								<Form.Item {...formItemLayout} label="操作人">
									{getFieldDecorator('opn')(
										<Input placeholder="请输入" />
									)}
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item {...formItemLayout} label="操作内容">
									{getFieldDecorator('co')(
										<Input placeholder="请输入" />
									)}
								</Form.Item>
							</Col>

							<Col md={6} sm={24}>
								<Form.Item {...formItemLayout} label="状态">
									{getFieldDecorator('st')(
										<Select >
											<Select.Option key='0' value='0'>失败</Select.Option>
											<Select.Option key='1' value='1'>成功</Select.Option>
										</Select>
									)}
								</Form.Item>
							</Col>

							<Col md={6} sm={24}>
								<Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
								<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
								<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
									展开 <Icon type="down" />
								</a>
							</Col>
						</Row>
					</Form>
				</div>
			)
		}
	}

	//校验数据
	validateParams=(rule, value, callback)=>{
		let reg = constants.reg.ip;
		if(rule.field==='Ip'){
			if (value.IP1 && !reg.test(value.IP1)) {
				callback('IP格式错误,请参考xxx.xxx.xx.xx')
				return;
			}else if(value.IP2 && !reg.test(value.IP1)){
				callback('IP格式错误,请参考xxx.xxx.xx.xx')
				return;
			}else{
				callback();
			}
		}
	}

	searchInput = () => {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				sm: { span: 8 },
			},
			wrapperCol: {
				sm: { span: 16 },
			},
		};
		if (this.props.type === 'app'){
			return (
				<div className="tableList">
					<Form onSubmit={this.handleSearch} layout="inline">
						<Row style={{ marginBottom: 12 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
							<Col md={8} sm={24}>
								<Form.Item {...formItemLayout} label="操作人">
									{getFieldDecorator('opn')(
										<Input placeholder="请输入" />
									)}
								</Form.Item>
							</Col>
							<Col md={8} sm={24}>
								<Form.Item {...formItemLayout} label="操作内容">
									{getFieldDecorator('co')(
										<Input placeholder="请输入" />
									)}
								</Form.Item>
							</Col>

							<Col md={8} sm={24}>
								<Form.Item {...formItemLayout} label="状态">
									{getFieldDecorator('st')(
										<Select >
											<Select.Option key='0' value='0'>失败</Select.Option>
											<Select.Option key='1' value='1'>成功</Select.Option>
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row style={{ marginBottom: 12 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
							<Col md={8} sm={24}>
								<Form.Item {...formItemLayout} label="IP范围">
									{getFieldDecorator('Ip', {
										validateTrigger: ['onChange', 'onBlur'],
										rules: [{validator: this.validateParams}]
									})(
										<LogInputs />
									)}
								</Form.Item>
							</Col>
							<Col md={8} sm={24}>
								<Form.Item {...formItemLayout} label="时间范围选择">
									{getFieldDecorator('rangePickerValue')(
										<RangePicker />
									)}
								</Form.Item>
							</Col>
							<Col md={8} sm={24}>
								<Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
								<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
								<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
									收缩 <Icon type="up" />
								</a>
							</Col>
						</Row>
					</Form>
				</div>
			)
		}
	}

	render() {

		const { current, total, pageSize } = this.state;

		const columns = [
			{
				title: '操作类型',
				dataIndex: 'ty',
			}, {
				title: '操作内容',
				dataIndex: 'co',
			}, {
				title: '操作人名称',
				dataIndex: 'opn',
			}, {
				title: 'IP段',
				dataIndex: 'ips',
			}, {
				title: '时间',
				dataIndex: 'time',
				render: (text, record) => {
					return moment(text).format("YYYY-MM-DD HH:mm")
				}
			}, {
				title: '时长(ms)',
				dataIndex: 'latency',
			}, {
				title: '状态',
				dataIndex: 'st',
				render:(text,record)=>{
					return text === '1' ? '成功':'失败'
				}
			}
		];

		const pagination =
			{
				total: total,
				current: current,
				pageSize: pageSize,
				showTotal: total => `共有${total}条数据  第 ${this.state.current} 页`,
				onChange: (current, pageSize) => {
					this.loadDatas(current, pageSize, this.state.params)
				},
				showQuickJumper: true
			}

		return (
			<div>
				{this.state.expandForm ? this.searchSimpleInput() : this.searchInput()}
				<Table
					dataSource={this.state.data}
					columns={columns}
					rowKey={record => record.code}
					pagination={pagination}
					loading={this.state.loading}
				/>
			</div>
		)
	}
}

const LogTable = Form.create()(LogTableForm);
export default LogTable
