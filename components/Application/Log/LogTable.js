import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Input, Select, Row, Col, Button, DatePicker, Icon } from 'antd'
import { getOTY, getTY, getLogs } from '../../../services/log'
import { queryAppAIP } from '../../../services/aip'
import moment from 'moment';
import LogInputs from './LogInputs'
import constants from '../../../services/constants';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { base } from '../../../services/base';

const { RangePicker } = DatePicker;
const Option = Select.Option
class LogTableForm extends Component {
	static propTypes = {
		prop: PropTypes.object,
		type: PropTypes.string,
		id: PropTypes.string,
		params: PropTypes.object,			//父对象查询参数
	}

	constructor(props) {
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
	}

	state = {
		data: [],
		current: 1,
		total: '',
		pageSize: 10,
		params: {},
		loading: false,
		expandForm: true,
		otys: [],//操作对象类型数组
		tys: [],	//操作类型数组
		apps: [],
	}

	componentDidMount() {
		//查询操作对象类型
		getOTY({ appid: this.props.id }, { 'AMP-ENV-ID': 1 }).then(data => {
			let ary = [];
			if (data) {
				data.forEach(i => {
					if (ary.indexOf(i.type) === -1) {
						ary.push(i.type)
					}
				})
				this.setState({ otys: ary })
			}

		})
		//查询操作类型
		getTY({ 'AMP-ENV-ID': 1 }).then(data => {
			let ary = [];
			if (data) {
				data.forEach(i => {
					if (ary.indexOf(i.opType) === -1) {
						ary.push(i.opType)
					}
				})
				this.setState({ tys: ary })
			}

		})

		if (!this.props.id) {
			queryAppAIP(null, {'AMP-ENV-ID':1}).then(data => {
				this.setState({ apps: data })
			})
		}
		if(this.props.readyable){
			this.loadDatas(1, 10)
		}		
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.readyable && nextProps.params &&  nextProps.params !== this.props.params){
			this.loadDatas(1, 10,nextProps.params);
		}
	}
	loadDatas = (current, page, params) => {

		let queryparams = Object.assign({}, {
			page: current,
			rows: page
		}, this.props.params)

		if (this.props.type === 'web') {
			queryparams = Object.assign({}, queryparams, { ap: [this.props.id] });
		}

		this.setState({ loading: true })
		getLogs(Object.assign({}, queryparams, params), { 'AMP-ENV-ID': 1 }).then(data => {
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
		this.props.form.validateFields((err, values) => {
			/* 	if (err) {
					return
				} */
			let params = {
				opn: values.opn,
				co: values.co,
				ips: [],
				oty: values.oty?values.oty:this.props.params?(this.props.params.oty?this.props.params.oty:''):'',
				ty: values.ty,
				obn: values.obn,
				ap: values.ap?values.ap:this.props.params?(this.props.params.ap?this.props.params.ap:''):'',
				env:values.env
			}
			if (values.Ip) {
				if (values.Ip.IP1) params.ips.push(values.Ip.IP1);
				if (values.Ip.IP2) params.ips.push(values.Ip.IP2);
			}
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

	handleChange = (value) => {
		console.log(value);
	}

	backupRender = () => {
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
			<div className="tableList">
				<Form onSubmit={this.handleSearch} >
					<Row style={{ marginBottom: 12 }} gutter={{ md: 4, lg: 12, xl: 18 }}>
					<Col span={8}>
							<Form.Item {...formItemLayout} label="操作类型">
								{getFieldDecorator('ty')(
									<Select allowClear>
										{this.state.tys.map(i => {
											return <Option key={i} value={i}>{constants.ty[i.toLowerCase()] ? constants.ty[i.toLowerCase()] : i}</Option>
										})}
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item {...formItemLayout} label="操作人">
								{getFieldDecorator('opn')(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
						</Col>
						<div style={{ float: 'right', marginBottom: 12 }}>
							<Button type="primary" htmlType="submit" >查询</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
							<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
								展开 <Icon type="down" />
							</a>
						</div>
					</Row>
				</Form>
			</div>
		)
	}


	searchSimpleInput = () => {
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
			<div className="tableList">
				<Form onSubmit={this.handleSearch} >
					<Row style={{ marginBottom: 12 }} gutter={{ md: 4, lg: 12, xl: 18 }}>
						{!this.props.id &&
							<Col span={8}>
								<Form.Item {...formItemLayout} label="应用名称">
									{getFieldDecorator('ap')(
										<Select allowClear>
											{this.state.apps.map(i => {
												return <Option key={i.id} value={i.id}>{i.name}</Option>
											})}
										</Select>
									)}
								</Form.Item>
							</Col>
						}
						{!this.props.params || !this.props.params.oty?<Col span={8}>
						<Form.Item {...formItemLayout} label="操作对象类型">
							{getFieldDecorator('oty')(
								<Select allowClear>
									{this.state.otys.map(i => {
										return <Option key={i} value={i}>{constants.oty[i] ? constants.oty[i] : i}</Option>
									})}
								</Select>
							)}
						</Form.Item>
					</Col>:""}
					{!this.props.params || !this.props.params.obn? <Col span={8}>
						<Form.Item {...formItemLayout} label="操作对象名称">
							{getFieldDecorator('obn')(
								<Input placeholder="请输入" />
							)}
						</Form.Item>
					</Col> :""}
						<div style={{ float: 'right', marginBottom: 12 }}>
							<Button type="primary" htmlType="submit" >查询</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
							<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
								展开 <Icon type="down" />
							</a>
						</div>
					</Row>
				</Form>
			</div>
		)

	}

	//校验数据
	validateParams = (rule, value, callback) => {
		let reg = constants.reg.ip;
		if (rule.field === 'Ip') {
			if (value) {
				if (value.IP1 && !reg.test(value.IP1)) {
					callback('IP格式错误,请参考xxx.xxx.xx.xx')
					return;
				} else if (value.IP2 && !reg.test(value.IP1)) {
					callback('IP格式错误,请参考xxx.xxx.xx.xx')
					return;
				} else {
					callback();
				}
			} else {
				callback();
			}
		}
	}

	searchInput = () => {
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
			<div className="tableList">
				<Form onSubmit={this.handleSearch} >
					<Row style={{ marginBottom: 12 }} gutter={{ md: 4, lg: 12, xl: 18 }}>
						{!this.props.id &&
							<Col span={8}>
								<Form.Item {...formItemLayout} label="应用名称">
									{getFieldDecorator('ap')(
										<Select allowClear>
											{this.state.apps.map(i => {
												return <Option key={i.id} value={i.id}>{i.name}</Option>
											})}
										</Select>
									)}
								</Form.Item>
							</Col>
						}
						{!this.props.params || !this.props.params.oty?<Col span={8}>
							<Form.Item {...formItemLayout} label="操作对象类型">
								{getFieldDecorator('oty')(
									<Select allowClear>
										{this.state.otys.map(i => {
											return <Option key={i} value={i}>{constants.oty[i] ? constants.oty[i] : i}</Option>
										})}
									</Select>
								)}
							</Form.Item>
						</Col>:""}
						{!this.props.params || !this.props.params.obn? <Col span={8}>
							<Form.Item {...formItemLayout} label="操作对象名称">
								{getFieldDecorator('obn')(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
						</Col> :""}
						<Col span={8}>
							<Form.Item {...formItemLayout} label="操作类型">
								{getFieldDecorator('ty')(
									<Select allowClear>
										{this.state.tys.map(i => {
											return <Option key={i} value={i}>{constants.ty[i.toLowerCase()] ? constants.ty[i.toLowerCase()] : i}</Option>
										})}
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item {...formItemLayout} label="操作人">
								{getFieldDecorator('opn')(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item {...formItemLayout} label="操作内容">
								{getFieldDecorator('co')(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
						</Col>

						<Col span={8}>
							<Form.Item {...formItemLayout} label="状态">
								{getFieldDecorator('st')(
									<Select >
										<Select.Option key='0' value='0'>失败</Select.Option>
										<Select.Option key='1' value='1'>成功</Select.Option>
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item {...formItemLayout} label="IP范围">
								{getFieldDecorator('Ip', {
									validateTrigger: ['onChange', 'onBlur'],
									rules: [{ validator: this.validateParams }]
								})(
									<LogInputs />
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item {...formItemLayout} label="时间范围选择">
								{getFieldDecorator('rangePickerValue')(
									<RangePicker />
								)}
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item {...formItemLayout} label="环境">
								{getFieldDecorator('env')(
									<Select>
										{base.environments.map(env =>{
											return <Select.Option key={env.code} value={env.code}>{env.name}</Select.Option>
										})}
									</Select>
								)}
							</Form.Item>
						</Col>
						<div style={{ float: 'right', marginBottom: 12 }}>
							<Button type="primary" htmlType="submit" >查询</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
							<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
								收缩 <Icon type="up" />
							</a>
						</div>
					</Row>
				</Form>
			</div>
		)
	}

	render() {
		const { current, total, pageSize } = this.state;
		let columns = [];
		if (!this.props.id) {
			columns.push({
				title: '应用名称',
				key: 'apn',
				dataIndex: 'apn'
			})
		}
		if (!this.props.params) {
			columns.push(
				{
					title: '操作对象类型',
					dataIndex: 'oty',
					render: (text, value) => {
						return constants.oty[text] ? constants.oty[text] : text
					}
				}, {
					title: '操作对象名称',
					dataIndex: 'obn',
					key: 'obn'
				},
				{
					title: '操作类型',
					dataIndex: 'ty',
					render: (text, value) => {

						return constants.ty[text.toLowerCase()] ? constants.ty[text.toLowerCase()] : text
					}
				}, )
		}
		columns.push(
			{
				title: '操作内容',
				dataIndex: 'co',
				width:200,
				render:(text) => {
					return <div><Ellipsis tooltip lines={1} length={200}>{text}</Ellipsis></div>
				}
			}, {
				title: '操作人',
				dataIndex: 'opn',
			}, {
				title: 'IP',
				dataIndex: 'ip',
			}, {
				title: '时间',
				dataIndex: 'time',
				render: (text, record) => {
					return moment(text).format("YYYY-MM-DD HH:mm")
				}
			}, {
				title: '状态',
				dataIndex: 'st',
				width:80,
				render: (text, record) => {
					return text === '1' ? '成功' : '失败'
				}
			}
		);

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
				{this.state.expandForm ? (this.props.backupRender?this.backupRender():this.searchSimpleInput()) : this.searchInput()}
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
