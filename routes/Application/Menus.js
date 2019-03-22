import React, { Component } from 'react';
import { Card} from 'antd'
import Role from '../../components/Application/Running/Role'
import Functions from '../../components/BasicData/Functional/Functions'
import {getResourceTree} from '../../services/aip'
import { ErrorComponentCatch } from '../../common/SimpleComponents';


class Menus extends Component {
  constructor(props){
    super(props);
    this.state = {
      roleList:[],
      flag:false,     //建立子组件的相互联系
      treeNode:[],
      refreshFlag:false,//刷新功能列表标志
      appname:this.props.appname
    }
    
  }
  
  componentDidMount(){
    this.setState({appname:this.props.appname})
    this.loadData();
  }

  loadData=()=>{
    getResourceTree(this.props.match.params.id,{pid: 0,cascade: true}).then(data => {
      this.setState({ treeNode: data })
    }).catch(err => {
      this.setState({ treeNode: [] })
    })
  }

  render() {
    
    return (
      <div>
        <Card title='功能角色' style={{ margin: 24 }} bordered={false}>
          <Role flag={this.state.flag} appId={this.props.match.params.id} roleList={(roleList)=>{this.setState({roleList:roleList,refreshFlag:!this.state.refreshFlag})}} treeNode={this.state.treeNode} appname={this.state.appname}/>
        </Card>

          {/* 查询应用下的资源 */}
        <Card title='功能' style={{ margin: 24 }} bordered={false}>
          <Functions resourceChange={()=>{this.loadData();this.setState({flag:!this.state.flag})}} refreshFlag={this.state.refreshFlag} showCheckBox={true} showSearchInput={true} showAddButton={true} appId={this.props.match.params.id} roleList={this.state.roleList} appname={this.state.appname}/>
        </Card>
      </div>
    )
  }
}

export default ErrorComponentCatch(Menus);