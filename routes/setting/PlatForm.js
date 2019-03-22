import React, { Component } from 'react'
import { Form, Card, Switch, Tooltip} from 'antd'
import { base } from '../../services/base'
import SysAppList from '../../components/Setting/SysAppList';
import { updateConfigs } from '../../services/amp';


export class PlatForm extends Component {
	state = {
		passEnabled:base.configs.passEnabled
	}
	passEnabledChange = (checked,e)=>{
		updateConfigs({passEnabled:checked}).then(data=>{
			base.configs.passEnabled = checked;
			this.setState({passEnabled:checked});
		});
	}
	render() {
		return (
			<div>
				{/* <Card style={{ marginBottom: 24, border: 0 }} title="基础信息">
					<DescriptionList col={1} size="large">
						<Description term="管理租户">
							{this.state.tenant}
						</Description>
						<Description term="kubemetes版本">
							{this.state.versin}
						</Description>
					</DescriptionList>
				</Card> */}
				<Card title={<div>引擎组件 <Tooltip title={this.state.passEnabled?'关闭平台引擎':'启用平台引擎'}><Switch style={{float:'right'}} checked={this.state.passEnabled} onChange={this.passEnabledChange}></Switch></Tooltip></div>}>
					{this.state.passEnabled?
						<SysAppList envId='cep' history={this.props.history}/>:''
					}
				</Card>

			</div>
		)
	}
}

const PlatSetting = Form.create()(PlatForm);
export default PlatSetting;

