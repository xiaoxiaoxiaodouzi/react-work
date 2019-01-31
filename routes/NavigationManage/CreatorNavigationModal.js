import React from 'react';
import { Modal, Form, Input, Button, Icon,TreeSelect } from 'antd';
import IconSelectModal from '../../common/IconSelectModal';
import { TwitterPicker } from 'react-color'
import TreeHelp from '../../utils/TreeHelp';
import constants from '../../services/constants';
import { getNavigations } from './../../services/aip'


const FormItem = Form.Item;

class CreatorNavigationModal extends React.PureComponent {
  state = {
    data: {},
    displaynameColor: false,
    icon: '',
    menusTree:[]
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      let data = nextProps.data;
      this.setState({data});
      getNavigations({catalogAndResourceType:nextProps.catalogAndResourceType}).then(datas => {
        let allMenuNodes = datas.filter(d => d.type === constants.NAVIGATION_TYPE.catalog);
        allMenuNodes.push({id:'0',pid:'',name:'根目录'});
        this.setState({menusTree:TreeHelp.toChildrenStruct( allMenuNodes)})
      }); 
    }
  }

  onOk = () => {
    let nameValidate = this.formItemValidate(this.state.data.name,'name');
    let codeValidate = this.formItemValidate(this.state.data.code,'code');
    let urlValidate = this.formItemValidate(this.state.data.uri,'url');
    let fontIconValidate = this.formItemValidate(this.state.data.fontIcon,'fontIcon',"请选择一个字体图标.");
    let parentValidate = this.formItemValidate(this.state.data.pid,'pid');
    let data = {...this.state.data};
    data.url = data.uri;
    //this.setState({data:data});
    if (nameValidate&&codeValidate&&fontIconValidate&&urlValidate&&parentValidate) {
      this.props.onOk(data);
    }
  }

  formItemValidate = (vlaue,keyName,errerMessage) => {
    if(vlaue){
      const validateStateData = {[keyName+'Error']:'',[keyName+'ErrorValidateStatus']:'success'};
      this.setState(validateStateData);
      return true;
    }else{
      const validateStateData = {[keyName+'Error']:errerMessage?errerMessage:'必填项！',[keyName+'ErrorValidateStatus']:'error'};
      this.setState(validateStateData);
      return false;
    }
  }

  selectIcon = (icon) => {
    this.setState({
      data: { ...this.state.data, fontIcon: icon },
      icon: icon
    })
  }


  render() {

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
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        destroyOnClose width={600}
        onOk={this.onOk}
        onCancel={this.props.onCancel}
      >
        <Form>
          {/* {
            this.state.data.pname &&
            <FormItem label="父菜单" {...formItemLayout}>
              <span>{this.state.data.pname}</span>
            </FormItem>
          } */}
          <FormItem label="父菜单" {...formItemLayout} validateStatus={this.state.parentErrorValidateStatus}>
             <TreeSelect defaultValue={this.state.data.pid} 
                        treeData={this.state.menusTree}
                        placeholder="请选择父菜单"
                        treeDefaultExpandAll
                        onChange={e => this.setState({ data: { ...this.state.data, pid: e} })}
                        />
          </FormItem>
          <FormItem label="目录名称" {...formItemLayout} help={this.state.nameError} required validateStatus={this.state.nameErrorValidateStatus}>
            <Input value={this.state.data.name} onChange={e => this.setState({ data: { ...this.state.data, name: e.target.value } })} />
          </FormItem>
          <FormItem label="目录编码" {...formItemLayout} required help={this.state.codeError} validateStatus={this.state.codeErrorValidateStatus}>
            <Input value={this.state.data.code} onChange={e => this.setState({ data: { ...this.state.data, code: e.target.value } })} />
          </FormItem>
          <FormItem label="URL" {...formItemLayout} required help={this.state.urlError} validateStatus={this.state.urlErrorValidateStatus}>
            <Input defaultValue={this.state.data.uri} onChange={e => this.setState({ data: { ...this.state.data, uri: e.target.value } })} />
          </FormItem>
          <FormItem label="字体图标" {...formItemLayout} help={this.state.fontIconError} required validateStatus={this.state.fontIconErrorValidateStatus}>
            <IconSelectModal renderButton={<Button type="dashed" icon={this.state.data.fontIcon || 'plus'} />} selectIcon={(icon) => this.selectIcon(icon)} />
          </FormItem>
          <FormItem label="颜色" {...formItemLayout} >
            <div>
              <div
                style={{ cursor: 'pointer', textAlign: 'center', color: this.state.data.fontColor, marginTop: 4, height: '30px', width: '30px', borderRadius: 4, backgroundColor: this.state.data.fontColor, float: 'left', position: 'relative' }}
                onClick={() => { this.setState({ displaynameColor: !this.state.displaynameColor }) }}>
                <Icon type='edit' />
              </div>
              {
                this.state.displaynameColor &&
                <div style={{ position: 'absolute', top: '55px', zIndex: 10 }}>
                  <div style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }} onClick={() => { this.setState({ displaynameColor: false }) }} />
                  <TwitterPicker
                    triangle='top-left'
                    style={{ width: 300 }}
                    color={this.state.nameColor}
                    onChangeComplete={(color, event) => { this.setState({ data: { ...this.state.data, fontColor: color.hex }, displaynameColor: false }) }}
                  />
                </div>
              }
            </div>
          </FormItem>
          <FormItem label="样式编码" {...formItemLayout} >
            <Input value={this.state.data.fontCode} onChange={e => this.setState({ data: { ...this.state.data, fontCode: e.target.value } })} />
          </FormItem>
          <FormItem label="图片" {...formItemLayout} >
            <Input value={this.state.data.icon} onChange={e => this.setState({ data: { ...this.state.data, icon: e.target.value } })} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

// const CreatorNavigationModalForm = Form.create()(CreatorNavigationModal);
export default CreatorNavigationModal;