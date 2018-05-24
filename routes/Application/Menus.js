import React,{Component} from 'react';
import {Card,Modal} from 'antd'
import {getManagerOrgs} from '../../services/running'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import OrgModal from '../../components/Application/Running/OrgModal'
import Role from '../../components/Application/Running/Role'
import MenusTableList from '../../components/Application/Running/MenusTableList'
import FormTableList from '../../components/Application/Running/FormTableList'
import ServiceTableList from '../../components/Application/Running/ServiceTableList'


const { Description } = DescriptionList;
export default class Menus extends Component{
  state={
    orgNames:"",		//应用可管理的机构名字
    editable:false,
    visible:false,
  }

  componentDidMount(){
    const appid=this.props.match.params.id
    //获取应用可管理的机构
    getManagerOrgs(appid).then(data=>{
      this.setState({
        orgNames:data.names,
        editable:data.editable
      })
   })
  }

  showModal = () => {
    this.setState({
        visible: true
    });
  }

  //应用机构用户数据模态框取消
 
  handleCancel = (e) => {
    const appid=this.props.match.params.id
    getManagerOrgs(appid).then(data=>{
      this.setState({
        orgNames:data.names,
        editable:data.editable,
        visible:false
      })
    })
  }

  render(){
    const action=<a style={{float:"right",display:this.state.editable?'block':'none'}} onClick={this.showModal}>修改</a>
    return(
      <div>
        <Card title='应用的机构用户数据权限' style={{ margin: 24 }} bordered={false} extra={action}>
          <DescriptionList col='1' style={{ marginBottom: 24 }} >
            <Description>
              {this.state.orgNames ?  this.state.orgNames :'无数据' }
            </Description>
          </DescriptionList>
        </Card>

        <Card title='角色管理' style={{ margin: 24 }} bordered={false}>
          <Role appid={this.props.match.params.id}/>
        </Card>

        <Card title='菜单&页面&服务' style={{ margin: 24 }} bordered={false}>
          <Card type='inner' title='菜单' style={{marginBottom:16}}>
            <MenusTableList appid={this.props.match.params.id}/>
          </Card>
          
          <Card type='inner' title='页面' style={{marginBottom:16}}><FormTableList appid={this.props.match.params.id}/></Card>
          <Card type='inner' title='服务'><ServiceTableList appid={this.props.match.params.id}/></Card>
        </Card>

        <Modal 
          title="机构与读写权限设置"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}   //将底部按钮取消掉
          > 
          <OrgModal appid={this.props.match.params.id}/>
				</Modal>
      </div>
    )
  }
}