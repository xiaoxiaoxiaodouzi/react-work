import React from 'react';
import { Form, Input, Button, Select, Alert, Row, Col } from 'antd';
import TagManager from '../../../common/TagManager';
import { queryTags, checkIdName,  } from '../../../services/aip';
import { checkCodeName } from '../../../services/cce';
import { base } from '../../../services/base'
import CreateAppContext from '../../../context/CreateAppContext';

const FormItem = Form.Item;
const Option = Select.Option;

class Step1 extends React.Component {
	state = {
		selectedTags: [],
		allTags: [],
		addbefore: '',       //租户code+环境		
	}

	enviroment=base.environment;

	getTags = () => {
		//if (this.state.allTags.length === 0) {
			queryTags({},{'AMP-ENV-ID':this.enviroment}).then(data => {
				this.setState({
					allTags: data
				})
			})
		//}
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let arr = [];
				let checkIdName1 = checkIdName({ attr: values.name }, { attr: "name", tenant: base.tenant },{'AMP-ENV-ID':values.enviroment});
				arr.push(checkIdName1);
				let checkIdName2 = checkIdName({ attr: values.id }, { attr: "code", tenant: base.tenant },{'AMP-ENV-ID':values.enviroment});
				arr.push(checkIdName2);
				
				if(base.configs.passEnabled){
					arr.push(checkCodeName(values.id));
				}
				Promise.all(arr).then(([flag1, flag2, flag3]) => {
					let checked = true;
					if (flag1) {
						checked = false;
						this.props.form.setFields({
							name: {
								value: values.name,
								errors: [new Error('应用名称已存在！')],
							},
						});
					}
					if (flag2 || flag3) {
						checked = false;
						this.props.form.setFields({
							id: {
								value: values.id,
								errors: [new Error('应用Code已存在！')],
							},
						});
					}
					if (checked) {

						const newDeployment = { ...this.props.deployment };
						newDeployment.metadata.annotations.name = values.name;
						newDeployment.metadata.labels.application = values.id;
						newDeployment.metadata.name = values.id;
				
						const newAppInfo = { ...this.props.appInfo };
						newAppInfo.name = values.name;
						newAppInfo.code = values.id;
				
						if (this.props.type === "middleware") {
							newAppInfo.type = "middleware";
						} else {
							newAppInfo.type = values.type;
						}
						newAppInfo.tags = this.state.selectedTags;
						newAppInfo.enviroment = values.enviroment;
						this.props.stateChange({
							appInfo: newAppInfo,
							current: 1,
							displayStep1: false,
							displayStep2: true,
							displayStep3: false,
							deployment: newDeployment
						})
					}
				})
			}
		});
	};
	onVisibleChange = (visible) => {
		if (visible) {
			this.getTags();
		}
	}
	index = 0;
	onChange = (param) => {
		if (param.event === "add") {
			const newSelected = [{id:param.value.id,name:param.value.name}, ...this.state.selectedTags];
			this.setState({
				selectedTags: newSelected
			})
		} else if (param.event === "create") {
			const newSelected = [{ id: "newSelect" + this.index, name: param.value.name }, ...this.state.selectedTags];
			this.index += 1;
			this.setState({
				selectedTags: newSelected
			})
		} else {
			const newSelected = this.state.selectedTags.filter(item => item.id !== param.value.id);
			this.setState({
				selectedTags: newSelected
			})
		}
	}
	envChange = (e) => {
		this.enviroment = e;
		this.getTags();
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				span: 4,
			},
			wrapperCol: {
				span: 12,
			},
		};
		const formTailLayout = {
			wrapperCol: { span: 4, offset: 13 },
		};
		const labelName = this.props.type === 'app' ? '应用' : '中间件';
		return (
			<div style={{ display: this.props.displayStep1 ? 'block' : 'none' }}>
				<Row>
					<Col span={20} offset={2}>
						<Alert
							showIcon
							message='通常情况下，运行环境可以分为"正式"、"测试"、"开发"环境，甚至更多(根据具体情况而定)，不同运行环境可以对应不同的部署集群'
							style={{ marginBottom: 24 }}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={16} offset={6}>
						<Form layout="horizontal" onSubmit={this.handleSubmit} style={{ marginTop: 24 }} hideRequiredMark>
							<FormItem {...formItemLayout} label={labelName + '名称'}>
								{getFieldDecorator('name', {
									rules: [{ required: true, message: `请输入${labelName}名称！` }],
								})(
									<Input placeholder={labelName + '显示名称'} />
								)}
							</FormItem>
							<FormItem {...formItemLayout} label={labelName + 'CODE:'}>
								{getFieldDecorator('id', {
									rules: [{ required: true, message: `请输入${labelName}CODE！` }, { message: '只支持小写英文、数字、中划线！', pattern: '^[a-z0-9-]+$' }],
								})(
									<Input placeholder="只支持小写英文、数字、中划线" />
								)}
							</FormItem>
							<FormItem {...formItemLayout} label="分类标签：">
								{getFieldDecorator('tags')(
									<TagManager
										selectedTags={this.state.selectedTags}
										onVisibleChange={this.onVisibleChange}
										allTags={this.state.allTags}
										onChange={this.onChange} />
								)}
							</FormItem>
							{this.props.type === 'app' ?
								<FormItem {...formItemLayout} label={labelName + '类型：'}>
									{getFieldDecorator('type', { initialValue: "web" })(
										<Select>
											<Option value="web">web</Option>
											<Option value="app">app</Option>
										</Select>
									)}
								</FormItem> : ''
							}
							<FormItem {...formItemLayout} label="运行环境：">
								{getFieldDecorator('enviroment', { initialValue: base.currentEnvironment.id })(
									// <font>{base.currentEnvironment.name}</font>
									<Select onChange={this.envChange}>
										{base.environments.map(env => {
											return <Option key={env.id} value={env.id}>{env.name}</Option>
										})}
									</Select>
								)}
							</FormItem>
							<FormItem {...formTailLayout}>
								<Button type="primary" htmlType="submit">
									下一步</Button>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</div>
		);
	}
}
const StepOne = Form.create()(Step1);

export default props => (
  <CreateAppContext.Consumer>
    {context => <StepOne {...props} {...context} />}
  </CreateAppContext.Consumer>
)
