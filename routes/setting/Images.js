import React,{Component} from 'react'
import { Form,Breadcrumb,Divider} from 'antd';
import PageHeaderLayout from './layouts/PageHeaderLayout'
import ImagesTabMine from '../../components/Setting/Images/ImagesTabMine'
import {base} from '../../services/base'
import ImageTaskList from '../../components/Setting/Images/ImageTaskList'

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
    let title = <Breadcrumb style={{marginTop:6}}>
    <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> 高级设置</Breadcrumb.Item>
    <Breadcrumb.Item>镜像管理</Breadcrumb.Item>
    </Breadcrumb>;
    return (
      <div>
      <PageHeaderLayout
      title={title}
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