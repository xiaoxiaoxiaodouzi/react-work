import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from "antd";
import UserUnionTree from './UserUnionTree'
// created by tanshunwang at 2018-09-05
//用户集合授权modal组件，接受selectedKeys对象数组，使用标签显示默认选中用户集合，点击确定时关闭modal并传回选中值
export default class AuthorizeRoleModal extends Component {
  static propTypes = {
    visible:PropTypes.bool,  //modal是否可见
    title: PropTypes.string,  //modal标题
    handleModal:PropTypes.func,  //模态框回调，flag=false为cancel，flag=true为ok，此时传回data为选择的id数组
    selectedKeys:PropTypes.array   //默认选中的值,是一个用户集合对象列表，对象包含name、id、type属性
  }

  state={
    selectedKeys:[],
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selectedKeys !==this.props.selectedKeys){
      this.setState({selectedKeys:nextProps.selectedKeys})
    }
  }


  render() {
    let modalStyle = {
      top:20
    }
    if(this.props.isOffset){
      modalStyle = {
        top:36,
        marginLeft:340
      }
    }
    return (
      <Modal 
        title={this.props.title?this.props.title:'选择用户集合'} width={1000} style={modalStyle} destroyOnClose mask={!this.props.isOffset}
        visible={this.props.visible} bodyStyle={{overflowY:'auto',maxHeight:600}}
        onOk={ () => this.props.handleModal(true,this.state.selectedKeys) }
        onCancel={() => this.props.handleModal(false)} >
          <UserUnionTree 
            disableSelectedKeys={this.props.selectedKeys}
            selectedKeys={this.props.selectedKeys}
            onSelectedKeys={(onSelectedKeys)=>{this.setState({selectedKeys:onSelectedKeys})}}
            />
      </Modal>
    )
  }
}
