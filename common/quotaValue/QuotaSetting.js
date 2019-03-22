import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { queryContainerConfig } from '../../services/cce'
import {
	InputNumber, message, Radio, Row, Col, Divider
} from 'antd'
import constants from '../../services/constants';
import DepolyContext from '../../context/DepolyContext'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
export class QuotaSetting extends Component {
	static propTypes = {
		submitData: PropTypes.func.isRequired,  	//将数据传输到父组建,
		cpuLimit: PropTypes.number,
		memLimit: PropTypes.number,
		cpuRequest: PropTypes.number,
		memRequest: PropTypes.number,
	}

	state = {
		cpuLimit: this.props.cpuLimit || '',
		memLimit: this.props.memLimit || '',
		cpuRequest: this.props.cpuRequest || '',
		memRequest: this.props.memRequest || '',
		quotaValue: 0,
		quotaList: []
	}

	quotaValue = 0;

	componentDidMount() {
		this.getContainerConfig();
	}

	/* static getDerivedStateFromProps(props,state){
		if(props.dockerConfig!==state.dockerConfig){
			return ({dockerConfig:props.dockerConfig})
		}
		return null;
	}

	componentDidUpdate(){

	} */

	onSelectChange = (e) => {
		this.quotaValues(e.target.value)
		this.setState({ quotaValue: e.target.value }, () => {
			this.submitData();
		})
	}

	//根据选项对应配额value
	quotaValues = (value) => {
		let quota = constants.QUOTA_LIMIT[value];
		this.setState({ cpuLimit: quota.cpu, memLimit: quota.mem, cpuRequest: quota.cpu, memRequest: quota.mem })
	}

	//获取容器配置选项
	getContainerConfig = () => {
		queryContainerConfig().then(data => {
			let quotaValue = 0;
			if (Array.isArray(data)) {
				// let flag = false;//记录当前配置是否在选项中
				// let customize = false;
				data.forEach((element, index) => {
					let cpu = '';
					if (element.cpu.indexOf('m') !== -1) {
						cpu = parseInt(element.cpu.substring(0, element.cpu.length - 1), 10) / 1000;
					} else {
						cpu = element.cpu;
					}
					let quota = cpu + '-' + element.memory + element.memoryUnit;
					if (quota === this.props.dockerConfig[0]) {
						quotaValue = index;
						this.quotaValue = quotaValue;
						this.quotaValues(quotaValue);
						// flag = true;
					}else{
						this.quotaValue='-1';
					}
				});
				/* if (this.state.dockerConfig && !flag) {
					quotaValue = '-1';
					// let dockerConfig = this.props.limit + "-" + this.props.memory;
					this.setState({
						limit: this.props.limit,
						request: this.props.request,
						// dockerConfig: dockerConfig,
						// memory: this.props.memory.substring(0, this.props.memory.length - 2)
					})
				} */
				this.props.quotaList(data)
				this.setState({ quotaList: data, quotaValue });
			}
		});
	}

	submitData = () => {
		this.props.submitData(({
			cpuLimit: this.state.cpuLimit,
			memLimit: this.state.memLimit,
			cpuRequest: this.state.cpuRequest,
			memRequest: this.state.memRequest,
			quotaValue: this.state.quotaValue,
		}))
	}

	render() {
		return (
			<Fragment>
				<Row>
					<Col span={3} style={{ lineHeight: '64px' }}><b>预设</b></Col>
					<Col span={21}>
						<RadioGroup onChange={this.onSelectChange} size="default" value={this.state.quotaValue} >
							{
								this.state.quotaList.map((element, index) => {
									return <RadioButton style={{ textAlign: 'left', height: 64, padding: '14px 16px' }} key={index} value={index}>
										<div style={{ lineHeight: '16px' }}>CPU<span style={{ marginLeft: 12 }}>{element.cpu}核</span>	</div>
										<div style={{ lineHeight: '16px' }}>内存<span style={{ marginLeft: 12 }}>{element.memory + element.memoryUnit}</span></div>
									</RadioButton>
								})
							}
							<RadioButton style={{ textAlign: 'left', height: 64, padding: '23px 16px' }} key={-1} value='-1'>
								<div>自定义</div>	
							</RadioButton>
							{/* <RadioButton style={{textAlign:'left',height:64,padding:'14px 16px'}}>
						<div style={{lineHeight:'16px'}}>自定义</div>
						<div style={{lineHeight:'16px'}}> </div>
						</RadioButton> */}
						</RadioGroup>
					</Col>
				</Row>
				<Divider />
				<Row style={{ marginBottom: 24 }}>
					<Col span={3} style={{ lineHeight: '32px' }}><b>最小需求</b></Col>
					<Col span={21}>
						<div>
							<span style={{ marginRight: 12 }}>CPU:</span>
							<InputNumber value={this.state.cpuRequest} precision={1} onChange={
								(value) => {
									if (value > this.state.cpuLimit) {
										message.info("request值不能大于limit！")
									} else {
										this.setState({ cpuRequest: value, quotaValue: '-1' }, () => {
											this.submitData()
										});
									}
								}}
								min={0.1} max={this.state.cpuLimit} step={0.1} /> 核
						<span style={{ margin: '0 12px 0 24px' }}>内存:</span>
							<InputNumber value={this.state.memRequest} precision={1}
								onChange={(value) => {
									if (value > this.state.memLimit) {
										message.info("request值不能大于limit！")
									} else {
										this.setState({ memRequest: value, quotaValue: '-1' }, () => {
											this.submitData()
										});
									}
								}}
								min={0.1} max={this.state.memLimit} step={0.1} /> G
					</div>
						<div style={{ marginTop: 6, color: 'rgb(190,190,190)' }}>平台会为该容器分配至少这么多资源，如果剩余资源无法满足该需求，则容器不会启动</div>
					</Col>
				</Row>
				<Row>
					<Col span={3} style={{ lineHeight: '32px' }}><b>最大限制</b></Col>
					<Col span={21}>
						<div>
							<span style={{ marginRight: 12 }}>CPU:</span>
							<InputNumber value={this.state.cpuLimit} precision={1} onChange={
								(value) => {
									this.setState({ cpuLimit: value, quotaValue: '-1' }, () => {
										this.submitData()
									});
								}}
								min={this.state.cpuRequest} step={0.1} /> 核
						<span style={{ margin: '0 12px 0 24px' }}>内存:</span>
							<InputNumber value={this.state.memLimit} precision={1}
								onChange={(value) => {
									this.setState({ memLimit: value, quotaValue: '-1' }, () => {
										this.submitData()
									});
								}}
								min={this.state.memRequest} step={0.1} /> G
					</div>
						<div style={{ marginTop: 6, color: 'rgb(190,190,190)' }}>容器运行过程中能使用的资源不会超过该配置</div>
					</Col>
				</Row>
			</Fragment>
		)
	}
}

export default props => (
	<DepolyContext.Consumer>
		{context => <QuotaSetting {...props} {...context} />}
	</DepolyContext.Consumer>
);
