import React, { Component } from 'react'
import { Card } from 'antd'
import SettingTable from '../../Application/Setting/SettingTable';
import SettingClusterList from '../../Application/Setting/SettingClusterList';
import { updateApp } from '../../../services/aip';

export class AuthenticationService extends Component {
	static propTypes = {
	}

state={
	checked:false,
	appUpstream:'',
	appDatas:{},
}


	componentDidMount() {
	}

	//是否支持https
	handleHttpChange = (value) => {
    let id = '';
    let queryParams = {
      type: '2'
    }
    let schema = '';
    if (value) {
      schema = 'https'
    } else {
      schema = 'http'
    }

    let bodyParams = {
      schema: schema
    }
    updateApp(id, queryParams, bodyParams).then(data => {
      this.loadData();
    })
    this.setState({
      checked: value
    })
  }

	render() {
		const {appDatas,appUpstream}=this.state;
		const authenticationTitle = <span>认证服务配置<span style={{ fontSize: 12, marginLeft: 50, color: 'rgb(190,190,190)' }}>应用路由与统一认证对接的配置</span></span>
		return (
			<Card title={authenticationTitle} style={{ margin: '24px 0' }}>

				<Card title='访问地址配置' type='inner' style={{ margin: '24px 0' }}>
					<SettingTable appCode={this.state.code} appDatas={appDatas} checked={this.state.checked} />
				</Card>

				<Card title='服务端配置' type='inner' style={{ margin: '24px 0' }}>
					<SettingClusterList appDatas={appDatas} appUpstream={appUpstream} checked={(e) => this.handleHttpChange(e)} />
				</Card>

			</Card>
		)
	}
}

export default AuthenticationService
