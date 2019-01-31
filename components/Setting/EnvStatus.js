import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Table, message, Spin, Tooltip, Button, Modal } from 'antd'
import { getEnvStatus, tiller } from '../../services/tiller'
import { queryAppAIP } from '../../services/aip'
import { base } from '../../services/base';
let interval = ''
const envStatus = { Running: '运行中', Completed: '运行中', pending: '准备中', error: '失败' }
const confirm = Modal.confirm
export default class EnvStatus extends Component {
	static propTypes = {
		prop: PropTypes.object
	}

	state = {
		code: '',
		tabs: [],
		flag: false,
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.code !== this.props.code){
			this.getEnvStatus();
			interval = setInterval(() => {
				this.getEnvStatus();
			}, 5000);
		}
	}

	componentWillUnmount() {
		clearInterval(interval)
	}

	//查询环境状态
	getEnvStatus = () => {
		getEnvStatus(this.props.code).then(datas => {
			let tab = [];
			let flag = true;
			datas.info.status.resources.forEach(i => {
				if (i.name.includes('v1/Pod')) {
					//重构列对象
					let column = [];
					//重构table数据
					let dataSource = [];
					//确认status所在index位置以便下面判断是不是判断成功
					let statuIndex = '';
					i.title.forEach((item, index) => {
						let columnIndex = {};
						columnIndex.title = item;
						columnIndex.dataIndex = item;
						column.push(columnIndex);
						if (item === 'STATUS') statuIndex = index
					})
					i.values.forEach(n => {
						let dataOri = {};
						n.forEach((item, index) => {
							//判断环境是否创建成功，在v1/Pod下面判断是不是所有status都是Running 或者Completed
							if (index === statuIndex) {
								if (item !== 'Running' && item !== 'Completed') flag = false;
							}
							dataOri[i.title[index]] = item
						})
						dataSource.push(dataOri)
					})
					tab.push({ name: i.name, column: column, data: dataSource })
				}
			})
			this.setState({ tabs: tab, flag: flag })
		}).catch(err => {
			this.setState({ flag: true, tabs: [] })
		})
	}

	handleClick = (record) => {
		let code = record.NAME.split('-').slice(0, record.NAME.split('-').length - 2).join('-');
		//调用查询应用详情接口获取应用ID，然后跳转到应用详情里面去
		if (code) {
			//要传环境ID
			queryAppAIP({ code: code }, {'AMP-ENV-ID':this.props.id}).then(data => {
				if (data.length > 0 && data[0].id) {
					base.environment=this.props.id;
					base.currentEnvironment=
					this.props.history.push("/apps/" + data[0].id)
				} else {
					message.info('查询不到当前环境下的应用!')
				}
			}).catch(e => {
				base.ampMessage('查询环境下的应用出错!' );
			})
		}
	}

	showConfirm = () => {
		let that = this;
		confirm({
			title: '确认删除？',
			content: '此操作会回退在此环境部署的所有应用?',
			onOk() {
				tiller(that.props.code).then(data => {
					message.success('回退成功！');
					this.props.onCancel();
				})
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}


	render() {
		const columns = [
			{
				title: '应用名称',
				dataIndex: 'NAME',
			/* 	render: (text, record) => {
					return text.split('-').slice(0, record.NAME.split('-').length - 2).join('-')
				} */
			}, {
				title: 'READY',
				dataIndex: 'READY'
			}, {
				title: '',
				dataIndex: 'STATUS',
				render: (text, record) => {
					return <Tooltip title={envStatus[text] ? envStatus[text] : '其他'}>
						{text}
					</Tooltip>
				}
			}, {
				title: '重启次数',
				dataIndex: 'RESTARTS'
			}, {
				title: '运行时长',
				dataIndex: 'AGE'
			}, /* {
				title: '操作',
				render: (text, record) => {
					return <a onClick={() => this.handleClick(record)}>查看应用详情</a>
				}
			} */
		]
		return (
			<div>
				{this.state.tabs.length > 0 ?
					<div>
						<Spin spinning={!this.state.flag}>
							<Alert message={this.state.flag ? <span>环境创建成功！ <Button style={{ marginLeft: 6 }} type='danger' onClick={this.showConfirm}>回退</Button></span>: <span>正在创建环境中，请勿关闭模态框<Button style={{ marginLeft: 6 }} type='danger' onClick={this.showConfirm}>回退</Button></span>} type='info' />
							
						</Spin>
						<Table
							size='small'
							dataSource={this.state.tabs[0].data}
							columns={columns}
							style={{ marginTop: 24 }}
						/>
					</div>
					: <Spin spinning={false}>
						<Alert message={'查询环境状态失败，请联系管理员'} type='warning' />
					</Spin>
				}
				
			</div>
		)
	}
}
