import React,{Component} from 'react'
import { Modal} from 'antd';
import ImagesForm from './ImagesForm';

class ImagesUpload extends Component {
  state={
    visible:false,
    tenant:'',
    artifact:'',
  }

  showModal=(e)=>{
    this.setState({
      visible:true
    })
  }
  onCancel=()=>{
    this.setState({
      visible:false
    })
  }
  onOk = ()=>{
    this.setState({
      visible: false
    })
    this.props.onOk()
  }
  render() {
    var dom = null;
    if (this.props.renderButton) {
        dom = 
        (<a onClick={this.showModal}>
            {this.props.renderButton}
        </a>)
    }
    const formItemLayout = {
      labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
      },
      wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 13 },
      },
     };
    return (
      <div>
        {dom}
        <p>{this.state.icon}</p>
        <Modal
          width='700px'
          bodyStyle={{height:500,overflow:'auto'}}
          title='上传程序包&编译镜像'
          footer={null}
          visible={this.state.visible}
          onCancel={this.onCancel}
          maskClosable={false}
        >
          <ImagesForm onOk={this.onOk} tenant={this.props.tenant} artifact={this.props.artifact} formItemLayout={formItemLayout}/>
        </Modal>
      </div>
    );
  }
}
export default ImagesUpload;