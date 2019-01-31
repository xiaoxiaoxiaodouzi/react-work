import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Modal } from 'antd';
import DynamicFormEditor from './DynamicFormEditor';


/**
 *动态表单编辑弹窗
 *
 * @class FormEditorModal
 * @extends {Component}
 * 
 * data属性：
 * label,name,value,attribute,required,requiredMessage,regExp,regExpMessage,fieldDecoratorOptions
 * 
 * type: select,number,hidden,input(default)
 */
class FormEditorModal extends Component {
  constructor(props){
    super(props);
    
    this.onOk = this.onOk.bind(this);
  }

  onOk = (errors, values) =>{
    this.dynamicForm.validateFields((errors, values) => {
      if(!errors){
        this.props.onOk(values);
      }
    })
  }

  render() {
    return (
      <Modal
        title={this.props.title} maskClosable={false} width={this.props.width} confirmLoading={this.props.confirmLoading}
        visible={this.props.visible} bodyStyle={{maxHeight:360,overflow:'auto'}} destroyOnClose={true}
        onOk={this.onOk}
        onCancel={this.props.onCancel}>
        <DynamicFormEditor items={this.props.items} data={this.props.data} getForm={form=>this.dynamicForm=form} footer={null}/>
      </Modal>
    )
  }
}

FormEditorModal.propTypes  = {
  items:PropTypes.oneOfType([PropTypes.array,PropTypes.object]),
  data:PropTypes.object,
  title:PropTypes.string,//Modal框标题
  width: PropTypes.number, //Modal宽度
  visible: PropTypes.bool, //显示
  onOk:PropTypes.func, //确认按钮回调
  onCancle: PropTypes.func, //取消按钮回调
}

FormEditorModal.defaultProps = {
  title:'编辑',
  visible:false,
  confirmLoading:false
}



export default FormEditorModal;
