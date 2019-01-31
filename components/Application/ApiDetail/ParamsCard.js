import React from 'react'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Table, Card, Modal, Form, Input, message, Select, Row, Col } from 'antd';
import { getApiParameters, changeApiProperty } from '../../../services/aip'
import { base } from '../../../services/base';

const grade = ['私有', '普通', '公开']

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option
class PermissionCardForm extends React.Component {

	constructor(props) {
		super(props)
		this.upstream = '';
		this.code = '';
		this.state = {
			paramsDataSource: [],
			responseDataSource: [],
			visible: false,
		}


	}

	componentDidMount() {
		this._getApiPramas(this.props.appId, this.props.apiId);
		this.setState(this.props.obj)
	}

	componentWillReceiveProps(nextProps){
		if(nextProps!==this.props ){
			this.setState(nextProps.obj)
		}
	}


	//*************************************************************************** */
	//**********************************EVENT************************************ */
	//*************************************************************************** */

	_getApiPramas(appId,apiId){
		getApiParameters(appId,apiId)
			.then((response) => {
				var obj = {};
				var httpParams = response.parameters || [];
				for (var n = 0; n < httpParams.length; n++) {
					Object.assign(httpParams[n], httpParams[n].schema);
				}
				obj.paramsDataSource = httpParams;

				var httpRsp = [];
				var httpResponse = response.responses || {};
				for (const key in httpResponse) {
					if (httpResponse.hasOwnProperty(key)) {
						const element = httpResponse[key];
						Object.assign(element, { id: key }, element.schema);
						httpRsp.push(element)
					}
				}
				obj.responseDataSource = httpRsp;
				this.setState(obj);
				console.log(obj);
				console.log(this.state);
			})
	}

	_getParamsColumn() {
		return [{
			title: '来源',
			dataIndex: 'in',
			key: 'in',
			width: '20%',
		}, {
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
		}, {
			title: '必填',
			dataIndex: 'required',
			key: 'required',
			width: '20%',
			render: (value) => {
				return value ? '是' : '否'
			}
		}, {
			title: '说明',
			dataIndex: 'description',
			key: 'description',
			width: '20%',
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			width: '20%',
		}];
	}

	_getResponseColumn() {
		return [{
			title: 'HTTP代码',
			dataIndex: 'id',
			key: 'id',
			width: '20%',
		}, {
			title: '说明',
			dataIndex: 'description',
			key: 'description',
			width: '20%',
		}, {
			title: '类型',
			dataIndex: 'simpleRef',
			key: 'simpleRef',
			width: '20%',
		}];
	}
	//打开模态框
	showModal = () => {
		this.setState({
			visible: true,
		})
	}

	handleCancle = () => {
		const form = this.props.form;
		form.resetFields();
		this.setState({
			visible: false,
		})
	}

	handleOk = () => {
		const form = this.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let params = {
				upstreamConnectTimeout: values.upstreamConnectTimeout,
				upstreamSendTimeout: values.upstreamSendTimeout,
				upstreamReadTimeout: values.upstreamReadTimeout,
				desc: values.desc,
				upstream: this.state.upstream,
				code: this.state.code,
				uri: this.state.uri,
				methods: this.state.httpMethod,
				visibility: values.visibility,
			}
			changeApiProperty(this.props.appId, this.props.apiId, params)
				.then((response) => {
					if (values.tags != null) {
						return
					}
					this.setState(values)
					message.success('修改成功')
				})
			this.setState({ visible: false })
		})
	}

	//*************************************************************************** */
	//************************************UI************************************* */
	//*************************************************************************** */
	render() {
		const action = <a style={{ float: "right", fontSize: 14 }} onClick={this.showModal}>修改</a>
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
			<div style={{ margin: 24 }}>
				<Card bordered={false} title={'基本信息'} style={{ marginBottom: 24 }}>
					<DescriptionList size="small" col="2" title={base.allpermissions.includes('service_edit') && this.state.owned?action:''}>
						{/* <Description term="HTTP Method">{this.state.httpMethod}</Description>
									<Description term="请求路径">{this.state.uri}</Description> */}
						<Description term="开放等级">{grade[this.state.visibility]}</Description>
						<Description term="连接超时时间">{this.state.upstreamConnectTimeout} ms</Description>
						<Description term="发送超时时间">{this.state.upstreamSendTimeout} ms</Description>
						<Description term="读取超时时间">{this.state.upstreamReadTimeout} ms</Description>
						{/* <Description term="描述">{this.state.desc}</Description> */}
					</DescriptionList>
					<Row style={{marginTop:8}}><Col span={16}>描述：{this.state.desc}</Col></Row>
				</Card>

				<Card bordered={false} title={'请求参数'} style={{ marginBottom: 24 }}>
					<Table
						rowKey='name'
						dataSource={this.state.paramsDataSource}
						columns={this._getParamsColumn()}
						pagination={false} />
				</Card>
				<Card bordered={false} title={'响应'}>
					<Table
						rowKey='id'
						dataSource={this.state.responseDataSource}
						columns={this._getResponseColumn()}
						pagination={false} />
				</Card>
				<Modal
					width={720}
					visible={this.state.visible}
					title='修改基本信息'
					onOk={this.handleOk}
					onCancel={this.handleCancle}
				>
					<Form>
						<FormItem {...formItemLayout} label="开放等级">
							{
								getFieldDecorator('visibility', { initialValue: this.state.visibility })(
									<Select>
										<Option value='0'>私有</Option>
										<Option value='1'>普通</Option>										
										<Option value='2'>公开</Option>
									</Select>
								)}
						</FormItem>
						<FormItem {...formItemLayout} label="连接超时时间(ms)">
							{
								getFieldDecorator('upstreamConnectTimeout', { initialValue: this.state.upstreamConnectTimeout })(
									<Input />
								)}
						</FormItem>

						<FormItem {...formItemLayout} label="发送超时时间(ms)">
							{
								getFieldDecorator('upstreamSendTimeout', { initialValue: this.state.upstreamSendTimeout })(
									<Input />
								)}
						</FormItem>

						<FormItem {...formItemLayout} label="读取超时时间(ms)">
							{
								getFieldDecorator('upstreamReadTimeout', { initialValue: this.state.upstreamReadTimeout })(
									<Input />
								)}
						</FormItem>

						<FormItem {...formItemLayout} label="描述">
							{
								getFieldDecorator('desc', { initialValue: this.state.desc })(
									<TextArea autosize={{ minRows: 3 }} />
								)}
						</FormItem>
					</Form>
				</Modal>
			</div>
		)
	}
}
const PermissionCard = Form.create()(PermissionCardForm)
export default PermissionCard;