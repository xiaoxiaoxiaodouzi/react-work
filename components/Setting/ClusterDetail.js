import React, { Component } from 'react'
import PageHeaderLayout from '../../routes/setting/layouts/PageHeaderLayout';
import { Route } from 'react-router-dom'
import ClusterHost from './ClusterHost';
import InputInline from '../../common/Input'
import TagManager from '../../common/TagManager'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Button } from 'antd';
import ClusterAuthorized from './ClusterAuthorized';



const { Description } = DescriptionList;
export default class ClusterDetail extends Component {
	static propTypes = {
		// prop: PropTypes
	}

	state = {
		tabActiveKey: 'host',
		visible: false,
	}

	componentDidMount() {
		let ary = window.location.hash.split('/');
		let key = ary[4];
		if(key){
			this.setState({ tabActiveKey: key })
		}
		// getClusterList()
	}

	initData = () => {
	}




	tabChange = (key) => {
		this.setState({ tabActiveKey: key })
		const { history } = this.props;
		history.push({ pathname: `/setting/cluster/${this.props.match.params.id}/${key}` })
	}

	onTagsManagerChange = (data) => {

	}
	//标签弹窗管理可见回调
	onVisibleChange = (visible) => {
		if (visible) {
      /* getAppsTags()
        .then((response) => {
          this.setState({
            allTags: response,
            visible: true
          })
        }) */
		} else {
			this.setState({ visible: false })
		}
	}

	renderTitle = () => {
		return (
			<InputInline
				title={`服务器名称`}
				onCommit={this.onAppNameChangeCommit}
				value={this.state.clusterName}
				dataType={'Input'}
				mode={'inline'}
				defaultNullValue={'暂无'}
				rule={{ required: true }}
				renderExtraContent={() => {
					return (<TagManager key={"testkeytetewt"} style={{ marginLeft: 10 }} visible={this.state.visible} selectedTags={this.state.tags} allTags={this.state.allTags} onChange={this.onTagsManagerChange} onVisibleChange={this.onVisibleChange} />)
				}}
			/>
		)
	}

	render() {

		const breadcrumbList = [{ title: '平台管理' }, { title: '服务器' }, { title: '服务器详情' }];
		const tabList = [
			{ key: 'host', tab: '主机' },
			{ key: 'permission', tab: '权限' },
			{ key: 'monitor', tab: '监控' },
			{ key: 'logs', tab: '操作日志' },
		]
		const extra=(
			<span>状态</span>	
		)

		const action=(
			<Button	type='danger'>删除集群</Button>
		)

		const content = (
			<DescriptionList size="small" col="3" >
				<Description term="创建者">{this.state.upstreamConnectTimeout} ms</Description>
				<Description term="所有者">{this.state.upstreamSendTimeout} ms</Description>
				<Description term="创建时间">{this.state.upstreamReadTimeout} ms</Description>
				<Description term="主机数">{this.state.upstreamSendTimeout} ms</Description>
				<Description term="容器数">{this.state.upstreamReadTimeout} ms</Description>
				<Description term="容器密度">{this.state.upstreamSendTimeout} ms</Description>
				<Description term="主机CPU质量">{this.state.upstreamReadTimeout} ms</Description>
				<Description term="容器CPU质量">{this.state.upstreamSendTimeout} ms</Description>
				<Description term="超分比">{this.state.upstreamReadTimeout} ms</Description>
				<Description term="主机内存总量">{this.state.upstreamReadTimeout} ms</Description>
				<Description term="容器内存总量">{this.state.upstreamReadTimeout} ms</Description>
				<Description term="超分比">{this.state.upstreamReadTimeout} ms</Description>
			</DescriptionList>
		);
		return (
			<PageHeaderLayout
				title={this.renderTitle()}
				// content={content}
				// extraContent={extra}
				breadcrumbList={breadcrumbList}
				tabList={tabList}
				tabActiveKey={this.state.tabActiveKey}
				onTabChange={this.tabChange}
				content={content}
				extraContent={extra}
				action={action}
			>
				<Route path="/setting/cluster/:id" component={ClusterHost} exact />
				<Route path="/setting/cluster/:id/host" component={ClusterHost} />
				<Route path="/setting/cluster/:id/permission" component={ClusterAuthorized} />
				<Route path="/setting/cluster/:id/monitor" component={ClusterHost} />
				<Route path="/setting/cluster/:id/logs" component={ClusterHost} />

			</PageHeaderLayout>
		)
	}
}
