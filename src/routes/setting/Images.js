import React,{Component} from 'react'
import { Form} from 'antd';
import PageHeaderLayout from './layouts/PageHeaderLayout'
import ImagesTabMine from '../../components/Setting/Images/ImagesTabMine'
import {base} from '../../services/base'
import ImageTaskList from '../../components/Setting/Images/ImageTaskList'

const breadcrumbList=[{
  title: '高级设置',
  href:'/'
},{
  title:'镜像管理',
  href:'/#/setting/images'
}]

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
    const {history}=this.props
    return (
      <div>
      <PageHeaderLayout
      title='镜像列表'
      breadcrumbList={breadcrumbList}
      onTabChange={this.onTabChange}
      tabList={tabList}
      tabActiveKey={this.state.key}
      >
          {this.state.key === 'mine' ? (<ImagesTabMine tenant={base.tenant} history={history} />) : (this.state.key === 'taskList' ? <ImageTaskList /> : <ImagesTabMine tenant='c2cloud' history={history}/>)}
      </PageHeaderLayout>
      </div>
    )
  }
}
const Images=Form.create()(ImagesForm);
export default Images;