import React from 'react';
import { Modal,Form,Input,Button } from 'antd';
import IconSelectModal from '../../common/IconSelectModal';

const FormItem = Form.Item;

class CreatorNavigationModal extends React.PureComponent{
  state={
    data:{}
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      let data = nextProps.data;
      this.setState({data});
    }
  }

  onOk = ()=>{
    let validata = true;
    if(!this.state.data.name){
      this.setState({nameError:'请填写目录名称。',nameErrorValidateStatus:'error'});
      validata = false;
    }else{
      this.setState({nameError:null,nameErrorValidateStatus:'success'});
    }
    if(!this.state.data.fontIcon){
      this.setState({fontIconError:'请选择一个字体图标。'});
      validata = false;
    }else{
      this.setState({fontIconError:null});
    }
    if(validata){
      this.props.onOk(this.state.data);
    }
    
  }
  render(){

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
      <Modal title={this.props.title} visible={this.props.visible} destroyOnClose width={600} onOk={this.onOk} onCancel={this.props.onCancel}>
        <Form>
          {
            this.state.data.pname&&
            <FormItem label="父菜单" {...formItemLayout}>
              <span>{this.state.data.pname}</span>
            </FormItem>
          }
          <FormItem label="目录名称" {...formItemLayout} help={this.state.nameError} required validateStatus={this.state.nameErrorValidateStatus}>
            <Input value={this.state.data.name} onChange={e=>this.setState({data:{...this.state.data,name:e.target.value}})}/>
          </FormItem>
          <FormItem label="字体图标" {...formItemLayout} help={this.state.fontIconError} required validateStatus='error'>
            <IconSelectModal renderButton={<Button type="dashed" icon={this.state.data.fontIcon||'plus'} />} selectIcon={(icon) => this.setState({data:{...this.state.data,fontIcon:icon}})} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

// const CreatorNavigationModalForm = Form.create()(CreatorNavigationModal);
export default CreatorNavigationModal;