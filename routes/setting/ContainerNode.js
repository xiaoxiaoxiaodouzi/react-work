import React, { Component,Fragment } from 'react'
import { Modal ,Row,Col,Badge,Tooltip,Divider} from 'antd'
import { getClusterNode } from '../../services/monit'
import constants from '../../services/constants';

export class ContainerNode extends Component {

	state = {
		activeKey: '1',
		appDatas: [],
		k8sDatas: [],
		containerName: ''
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.containerName !== prevState.containerName) {
			return ({ containerName: nextProps.containerName, appDatas: [], k8sDatas: [] })
		}
		return null;
	}

	componentDidUpdate() {
		if (this.state.appDatas.length === 0 && this.state.k8sDatas.length === 0 && this.state.containerName) {
			getClusterNode(this.state.containerName).then(data => {
				this.setState({ appDatas: data.apps, k8sDatas: data.k8scontainers })
			})
		}
	}

	tabChange = (key) => {
		this.setState({ activeKey: key })
	}

	render() {

		return (
			<Modal
				width='700px'
				title='容器节点信息'
				footer={null}
				visible={this.props.visible}
				onCancel={this.props.onCancel}
				destroyOnClose
			>
				<Fragment>
					{this.state.k8sDatas &&
						<Row>
							{
								this.state.k8sDatas.map((element, index) => {
									let status = 'success';
									let title = (
										<p key={index}>
											<span>CPU限值：{element.cpuTotal ? element.cpuTotal / 1000 + '核' : '未限定'}</span><br />
											<span>内存限值：{element.memoryTotal ? (element.memoryTotal / 1024 / 1024 / 1024).toFixed(0) + 'GB' : '未限定'}</span><br />
											<span>CPU使用率：{element.cpu}%</span><br />
											<span>内存使用率：{element.memory}%</span><br />
										</p>
									)
									if ((element.cpu >= constants.PROGRESS_STATUS[0]
										&& element.cpu < constants.PROGRESS_STATUS[1])
										|| (element.memory >= constants.PROGRESS_STATUS[0]
											&& element.memory < constants.PROGRESS_STATUS[1])) {
										status = 'warning';
									} else if (element.cpu > constants.PROGRESS_STATUS[1]
										|| element.memory > constants.PROGRESS_STATUS[1]) {
										status = 'error';
									}
									return (
										<Col key={index} span={12}>
											<Badge status={status} />
											<Tooltip title={title}>
												<span style={{ marginRight: 48 }}>{element.name}</span>
											</Tooltip>
										</Col>
									)
								})
							}
						</Row>
					}
					<Divider style={{ marginBottom: 8, marginTop: 8 }} />
					{this.state.appDatas &&
						<Row>
							{
								this.state.appDatas.map((element, index) => {
									let status = 'success';
									let title = null;
									let flag = false;
									let name = element.containers[0].name.split('#')[0];
									element.containers.forEach(item => {
										if (item.name.split('#')[0] !== name) {
											flag = true;
										}
										if (status !== 'error' &&
											((item.cpu >= constants.PROGRESS_STATUS[0]
												&& item.cpu < constants.PROGRESS_STATUS[1])
												|| (item.memory >= constants.PROGRESS_STATUS[0]
													&& item.memory < constants.PROGRESS_STATUS[1]))
										) {
											status = 'warning';
										} else if (item.cpu > constants.PROGRESS_STATUS[1]
											|| item.memory > constants.PROGRESS_STATUS[1]) {
											status = 'error';
										}
									})
									if (!flag) {
										title = (
											<p>
												{element.containers.map((item, index) => {
													return (
														<span key={index} >{item.name.split('#')[1]}：<br />
															<span style={{ marginLeft: 24 }}>CPU限值：{item.cpuTotal ? item.cpuTotal / 1000 + '核' : '未限定'}</span><br />
															<span style={{ marginLeft: 24 }}>内存限值：{item.memoryTotal ? (item.memoryTotal / 1024 / 1024 / 1024).toFixed(0) + 'GB' : '未限定'}</span><br />
															<span style={{ marginLeft: 24 }}>CPU使用率：{item.cpu}%</span><br />
															<span style={{ marginLeft: 24 }}>内存使用率：{item.memory}%</span><br />
														</span>
													)
												})
												}
											</p>
										)
									} else {
										title = (
											<p>
												{element.containers.map((item, index) => {
													return (
														<span key={index} >{item.name.split('#')[1]}(实例{index + 1})：<br />
															<span style={{ marginLeft: 24 }}>CPU限值：{item.cpuTotal ? item.cpuTotal / 1000 + '核' : '未限定'}</span><br />
															<span style={{ marginLeft: 24 }}>内存限值：{item.memoryTotal ? (item.memoryTotal / 1024 / 1024 / 1024).toFixed(0) + 'GB' : '未限定'}</span><br />
															<span style={{ marginLeft: 24 }}>CPU使用率：{item.cpu}%</span><br />
															<span style={{ marginLeft: 24 }}>内存使用率：{item.memory}%</span><br />
														</span>
													)
												})
												}
											</p>
										)
									}
									return (
										<Col key={index} span={12}>
											<Badge status={status} />
											<Tooltip title={title}>
												<span onClick={() => this.onAppDetail(element.appCode, element)} style={{ marginRight: 48, cursor: 'pointer' }}>{element.appName}</span>
											</Tooltip>
										</Col>
									)
								})
							}
						</Row>
					}
				</Fragment>
			</Modal>
		)
	}
}

export default ContainerNode
