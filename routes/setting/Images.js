import React,{Component} from 'react'
import { Form} from 'antd';
import PageHeaderLayout from './layouts/PageHeaderLayout'
import ImagesTabMine from '../../components/Setting/Images/ImagesTabMine'
import {base} from '../../services/base'
import ImageTaskList from '../../components/Setting/Images/ImageTaskList'
import {BreadcrumbTitle} from '../../common/SimpleComponents'

const tabList = [{
  key: 'mine',
  tab: '我的镜像',
}, {
  key: 'platform',
  tab: '平台镜像',
},{
  key:'taskList',
  tab:'任务列表'
}];

class ImagesForm extends Component{

  state={
    key:'mine'    
  }

  componentDidMount(){
    
  }

  onTabChange=(key)=>{
    this.setState({
      key:key
    })
  }
  render(){
    const {history}=this.props;
    let title = BreadcrumbTitle([{name:"平台管理"},{name:"镜像管理"}]);
    return (
      <PageHeaderLayout
      title={title}
      onTabChange={this.onTabChange}
      tabList={tabList}
      tabActiveKey={this.state.key}
      >
          {this.state.key === 'mine' ? (<ImagesTabMine tenant={base.tenant} history={history} />) : (this.state.key === 'taskList' ? <ImageTaskList /> : <ImagesTabMine tenant='c2cloud' history={history}/>)}
      </PageHeaderLayout>
    )
  }
}
const Images=Form.create()(ImagesForm);
export default Images;