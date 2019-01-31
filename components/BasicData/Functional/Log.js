import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import LogTable from '../../Application/Log/LogTable'
import { Card } from 'antd';
export default class Log extends Component {
  static propTypes = {
    prop: PropTypes
  }

  state={
    data:this.props.data,
    readyable:false
  }
  componentDidMount(){
    if(this.props.data && this.props.data.code){
      this.setState({
        // visitLogParam:{oty:'function',ty:'visit',type:'web',ob:this.props.data.code},
        updateLogParam:{oty:'function',ob:this.props.data.code,ap:this.props.data.appId},
        readyable:true
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data && nextProps.data !== this.props.data){
      this.setState({
        // visitLogParam:{oty:'function',ty:'visit',type:'web',ob:nextProps.data.code},
        updateLogParam:{oty:'function',ob:nextProps.data.code,ap:nextProps.data.appId},
        readyable:true
      })
    }
  }

  render() {

    return (
      <Fragment>
        {/* <Card bordered={false} title='访问日志' style={{ margin: '24px 24px 0' }}>
          <LogTable readyable={this.state.readyable} id='1' params={this.state.visitLogParam} backupRender={true}/>
        </Card> */}
        <Card bordered={false} title='变更日志' style={{ margin: '24px 24px 0',type:'web' }}>
          <LogTable id='1' readyable={this.state.readyable} params={this.state.updateLogParam} backupRender={true}/>
        </Card>
      </Fragment>
    )
  }
}
