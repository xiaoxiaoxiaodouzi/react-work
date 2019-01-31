import React,{Component} from 'react'
import {Modal} from 'antd'
import {getLogs} from '../../../services/cce'
export default class LogModal extends Component{
  state={
    visible:false,
    id:'',
    destroyOnClose:false,
    log:'',
    interval:[],
    status:''
  }

  showModal=()=>{
    this.setState({
      visible:true,
    })
    this.loadData();
  }

  loadData=()=>{
    let id=this.props.id;

    this.setState({
      id:id,
    })
    let queryParams={
      lines:100
    }
    let interval=setInterval(()=>getLogs(id,queryParams).then(data=>{
      if(data.finished){
        this.setState({
          logs:data.log
        })
      }else{
        this.setState({
          logs:data.log
        })
      }
    }),1000) 
    this.state.interval.push(interval)
  }
  handleCancle=()=>{
    this.state.interval.forEach(item=>{
      clearInterval(item)
    })
    this.setState({
      visible:false,
    })
  }

  render(){
    var dom = null;
    if (this.props.renderButton) {
        dom = 
        (<a onClick={this.showModal}>
            {this.props.renderButton}
        </a>)
    }else{
      dom=(<a onClick={this.showModal}>日志</a>)
    }
    return (
      <div>
        {dom}
        <Modal
          bodyStyle={{height:'500px',backgroundColor:'black',color:'white',paddingLeft:25,overflow:'auto',paddingTop:15,fontFamily:'Microsoft YaHei,SimSun , Arial, Helvetica, sans-serif'}}
          width='800px'
          title={`${this.props.name}镜像编译日志`}
          visible={this.state.visible}
          onCancel={this.handleCancle}
          footer={null}
          >
            {this.state.logs}
          </Modal>
      </div>
     
    )
  }
}

