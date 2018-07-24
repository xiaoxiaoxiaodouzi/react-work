import React, { PureComponent } from 'react';
import {Modal} from 'antd';
import Transaction from '../../components/Application/Overview/Transaction'
import PropTypes from 'prop-types';
export default class ResourcesModal extends PureComponent{

  render(){
    return (
      <div>
      <Modal
        style={{top:20 ,overflow:'auto'}}
        title='事务列表'
        width={1200} /* bodyStyle={{height:660,overflow:'auto'}} */
        visible={this.props.visible}
        footer={null}
        onCancel={e=>this.props.onCancle()}
        >
          {
            this.props.type ? 
              <Transaction 
                appCode={this.props.appCode} 
                from={this.props.from}
                to={this.props.to}
                type={this.props.type } 
                datas={this.props.datas} />
              :''
          }
      </Modal>
      </div>
    )
  }
}

ResourcesModal.propTypes = {
  type: PropTypes.string.isRequired,//目标应用的类型 包括 dot散点图 rect柱状图 pie饼状图
  datas: PropTypes.object.isRequired,//传过来的数据
}