import React, { Component } from "react";
import { Button, Row, Col, message } from "antd";
import Storages from '../Deploy/Storages'
import Settingfiles from '../Deploy/Settingfiles'
import CreateAppContext from "../../../context/CreateAppContext";
import AddContainerContext from "../../../context/AddContainerContext";

class AdvanceConfig extends Component {
	state = {
		storageData: [],
		settingData: [],
	}
	storageFlag = false;
	componentDidMount() {
		if (this.props.check) {
			let { volumeMounts, config } = this.props.container;
			let storageData = volumeMounts.filter(v => !v.fromConfigFile);
			config.forEach((c, i) => {
				c.name = c.key;
				c.mountPath = c.path;
				c.additionalProperties = { config: c.contents };
			})
			let settingData = [...config];
			this.setState({ storageData, settingData });
		}
	}
	afterStorage = (data, flag) => {
		if (flag) {
			this.storageFlag = true;
		} else {
			this.setState({
				storageData: data,
			})
			this.storageFlag = false;
		}
	}
	afterSetting = (data) => {
		this.setState({
			settingData: data,
		})
	}
	onOk = () => {
		if (this.storageFlag) {
			message.error('存储卷表格中存在未保存数据，请先保存')
			return;
		}
		this.props.onok(this.state.storageData, this.state.settingData);
	}
	onForward = () => {
		if (this.storageFlag) {
			message.error('存储卷表格中存在未保存数据，请先保存')
			return;
		}
		this.props.containerStateChange({
			current: 1,
			displayChoose: false,
			displayDeploy: true,
			displayAdvance: false,
		});
	}
	render() {
		return (
			<Row style={{ display: this.props.displayAdvance ? 'block' : 'none' }}>
				<Col span={24}>
					<div style={{ margin: '40px 0 10px 10px' }}>
						<div>
							<Storages isAddApp={true}
								volumes={this.state.storageData}
								afterstorage={this.afterStorage} />
						</div>
						<div style={{ marginTop: '40px' }}>
							<Settingfiles isAddApp={true} operationkey={this.props.container.name}
								configs={this.state.settingData}
								hidecmd={true}
								aftersetting={this.afterSetting} />
						</div>
						<div style={{ marginTop: '40px', marginLeft: '720px' }}>
							<Button onClick={() => this.onForward() /* this.props.stepback */}>上一步</Button>
							<Button style={{ marginLeft: '20px' }} type="primary"
								onClick={this.onOk}>确定</Button>
							{/* <Button style={{ marginLeft: '20px' }} onClick={this.props.cancel}>取消</Button> */}
						</div>
					</div>
				</Col>
			</Row>
		)
	}
}
export default props => (
	<CreateAppContext.Consumer>
		{appContext =>
			<AddContainerContext.Consumer>
				{containerContext => <AdvanceConfig  {...appContext} {...props} {...containerContext} />}
			</AddContainerContext.Consumer>
		}
	</CreateAppContext.Consumer>
);