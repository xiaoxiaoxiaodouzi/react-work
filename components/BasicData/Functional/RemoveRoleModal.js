import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal,Alert } from "antd";
import FunctionTable from './FunctionTable'
import { getResources } from '../../../services/functional'

export default class RemoveRoleModal extends Component {
  static propTypes = {
    prop: PropTypes,
    visible:PropTypes.bool,
    handleModal:PropTypes.func
  }
  state={
    datas:[],
  }
  componentDidMount(){
    this.loadDatas('jNM8ica66SuuaWibsExTibnjg')
  }
  
	loadDatas = (appId) => {
		//有可能是从角色进来的资源列表 也有可能是应用下面进来的资源列表，所以这里要区分下查询
		if (this.props.roleId) {
			//调用角色查询资源的接口
		} else {
			let queryParams = {
				pid: 0,
				appId:appId,
				page: 1,
				rows: 10,
				cascade: true,
			};
			getResources(queryParams).then(res => {
        console.log('res',res)
				if (res) {
					this.setState({ datas: res.contents })
				}
			})
		}
	}

  render() {
    const message = <span>取消<a>[运维组]</a>的下列功能权限</span>
    return (
      <Modal
        title="功能角色移除" width={1000} style={{top:20}} bodyStyle={{maxHeight:600,overflowY:'auto'}}
        visible={this.props.visible}
        onOk={ () => this.props.handleModal(true) }
        onCancel={() => this.props.handleModal(false)} >
        <Alert style={{marginBottom:16}} message={message} type="info" />
        <FunctionTable datas={this.state.datas}/>
      </Modal>
    )
  }
}
