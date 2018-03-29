import React from 'react'
import { Row, Col,Card,Modal } from 'antd';
import './index.css'
import IconSelect from './IconSelect'

class IconSelectModal extends React.Component {
  state={
    icon:'',
    visible:false
  }

  componentDidMount(){
  }

  showModal=()=>{
    this.setState({
      visible:true
    })
  }
  onCancel=()=>{
    this.setState({
      visible:false
    })
  }

  handleChange=(icon)=>{
    this.props.selectIcon(icon)
    this.setState({
      visible:false
    })
  }
  render() {
    var dom = null;
    if (this.props.renderButton) {
        dom = (<a onClick={e=>this.showModal()}>
            {this.props.renderButton}
          </a>)
    } else {
        dom =  <a onClick={e=>this.showModal()}><p style={{marginTop:15}}>请选择</p></a> 
    }
    return (
      <div>
        {dom}
        <p>{this.state.icon}</p>
        <Modal
        width='800px'
        bodyStyle={{height:500,overflow:'auto'}}
        title='图标选择'
        footer={null}
        visible={this.state.visible}
        onCancel={this.onCancel}
        >
        <IconSelect selectIcon={(icon)=>this.handleChange(icon)}/>
        </Modal>
      </div>
    );
  }
}

export default IconSelectModal;