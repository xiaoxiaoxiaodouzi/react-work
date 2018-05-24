import React, { PureComponent } from 'react';
import showConfirmModal from './ShowConfirmModal';
import { Switch } from 'antd';

export default class Component extends PureComponent {
  state = {
    shareLicenseChecked:false,
  };
  componentDidMount() {
    //console.log('sharelicense',this.props.configs);
    let flag = false;
    if(this.props.configs){
      this.props.configs.forEach(element=>{
        if(element.name === 'config-license'){
          flag = true;
        }
      });
      if(flag){
        this.setState({shareLicenseChecked:true});
      }else{
        this.setState({shareLicenseChecked:false});
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    //console.log('sharelicense11',nextProps);
    let flag = false;
    if(nextProps.configs){
      nextProps.configs.forEach(element=>{
        if(element.name === 'config-license'){
          flag = true;
        }
      });
      if(flag){
        this.setState({shareLicenseChecked:true});
      }else{
        this.setState({shareLicenseChecked:false});
      }
    }
  }
  showConfirm = ()=>{
    const { appCode,operationkey,configs } = this.props;
    const { shareLicenseChecked } = this.state;
    showConfirmModal(()=>{
      if(shareLicenseChecked){
        this.props.onChangeShareLicense(configs,'close');
        this.setState({shareLicenseChecked:false});
      }else{
        this.props.onChangeShareLicense(configs,'open');
        this.setState({shareLicenseChecked:true});
      }
    },()=>{
    },{
      appCode:appCode,
      containerName:operationkey,
    }); 
  }
  handleShareLicenseClick = ()=>{
      this.showConfirm();
  }
  render() {
    const { shareLicenseChecked } = this.state;
    return (
        <Switch 
          checkedChildren="开" unCheckedChildren="关" checked={shareLicenseChecked} 
          onClick={this.handleShareLicenseClick} />
    );
  }
}
