import React, { Component, Fragment} from 'react';
import { Table, Button, Divider, Checkbox, message, Input, Select,Popconfirm} from 'antd';
import { getRouters, addRouters, updateRouters, deleteRouters} from '../../../services/domainList'
import moment from 'moment';
import PropTypes from 'prop-types';

const Option = Select.Option
export default class SettingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
      code: '',
      isEditing: false,       //当前是否正在修改
      CTXCheckValue: false,       //上下文checkbox  
      hosts: '',   //域名
      name:'',      //域名name
      datas: [],
      ctx:'',
      upstream: 'http://',
      HttpCheckValue:'http://',       //是否是HTTP
    }
  }
  
  componentWillReceiveProps(nextProps){
    if(this.state.code !== nextProps.appCode || this.state.id!==nextProps.appId){
      let code = nextProps.appCode;
      this.setState({code:nextProps.appCode,id:nextProps.appId})

      if(code){
        getRouters(code).then(data => {
          if(data){
            this.setState({ datas: data })
          }else{
            this.setState({datas:[]})
          }
        })
      }
    }
    if(!nextProps.checked){
      if (this.state.upstream !== 'http://'){
        this.setState({
          upstream: 'http://',
        })
      }
    }else{
      if (this.state.upstream !=='https://'){
        this.setState({
          upstream: 'https://'
        })
      }
    }
   
    if(this.state.ctx!==nextProps.ctx){
      if(this.state.ctx){
        this.setState({ctx:nextProps.ctx})
      }
    }
  }

  //加载数据
  loadDatas=()=>{
    let code=this.state.code;
    getRouters(code).then(data => {

      if (data) {
        this.setState({ 
          datas: data,
          CTXCheckValue:'',
          hosts:'',
          isEditing:false,
         })
      }else{
        this.setState({
          datas:[],
          isEditing: false,
          CTXCheckValue: '',
          hosts: '',
        })
      }
    })
  }

  newMember=()=>{
    if(!this.state.isEditing){
      this.state.datas.push({
        new:true,
        hosts: '',      
        stripUri: true,
        editable: true,
      })
      this.setState({
        CTXCheckValue:true,
        isEditing: true,
        datas:this.state.datas
      })
    }else{
      message.error('有未保存的数据，请先保存数据再进行添加')
    }
  }

  handleCancle=(record)=>{
   delete record.editable;
   this.loadDatas();
  }

  handleSave=(record)=>{
    if(!this.state.hosts){
      message.info('请先填写域名再保存');
      return ;
    }
    let name=this.state.name;
    let code=this.state.code;
    let appId=this.state.id;
    let array = [];
    let b = [];
    if (this.state.ctx) {
      b.push(this.state.ctx)
    } else {
      b.push('/')
    }
    array.push(this.state.hosts);
    let ups = this.state.upstream ;
    let bodyParams = {
      hosts: array,
      name: appId,
      stripUri: this.state.CTXCheckValue,
      uris: b,
      upstreamUrl: ups + code,
      https_only: this.state.HttpCheckValue ==='http://'?false:true,
    }
    if(record.new){
      delete record.new;
      //调用新增接口
      addRouters(bodyParams).then(data=>{
        if(data){
          delete record.editable;
          delete record.new;
          message.success('新增成功')
          this.loadDatas();
        }
      }).catch(err=>{
        message.error('新增域名出错');
        this.setState({isEditing:false})
      })
            }else{
      //修改接口
      updateRouters(name,bodyParams).then(data=>{
        delete record.editable;
        delete record.new;
        message.success('修改域名成功');
        this.loadDatas();
      }).catch(err=>{
        message.error('修改域名出错');
        this.setState({isEditing:false})
      })
    }
  }



  handleCTXchange = (e) => {
    this.setState({
      CTXCheckValue: e.target.checked
    })
  }


  handleInputChange=(e)=>{
    this.setState({
      hosts:e.target.value
    })
  }

  //HTTP下拉选择框
  handleSelectChange=(e)=>{
    this.setState({
      HttpCheckValue:e,
    })
  }

  handleClick=(record)=>{
    if(!this.state.isEditing){
      this.setState({isEditing:true})
      this.setState({
        name:record.name,
        hosts:record.hosts[0],
        CTXCheckValue: record.stripUri,
      })
      record.editable=true;
    }else{
      message.error('有未保存的数据，请先保存数据在进行编辑！')
    }
  }

  handleDelete=(record)=>{
    let name=record.name;
    deleteRouters(name).then(data=>{
      message.success('删除成功')
      this.loadDatas();
    })
    
  }
  render() {

    const selectBefore = (
      <Select value={this.state.HttpCheckValue} style={{ width: 90 }} onChange={e=>this.handleSelectChange(e)}>
        <Option value="Http://">http://</Option>
        <Option value="Https://">https://</Option>
      </Select>
    );

    // const options = [
    //   { label: '是', value: '1' },
    //   { label: '否', value: '2' },
    // ];
    const columns=[
      {
        title:'域名',
        dataIndex:'name',
        width:'40%',
        render:(text,record)=>{
          if(record.editable){
            return <Input addonBefore={selectBefore} value={this.state.hosts} onChange={e=>this.handleInputChange(e)} style={{width:'60%'}}/>
          }else{
            if (record.httpsOnly ){
              return 'https://'+record.hosts[0]
            }else{
              return 'http://'+record.hosts[0]
            }
          }
        }
      },
      {
        title: '裁剪上下文',
        dataIndex: 'stripUri',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Checkbox checked={this.state.CTXCheckValue} onChange={this.handleCTXchange}>
                是
              </Checkbox>
          )
                    
          } else {
            return text ? '是' : '否'
          }
        }
        }, 
        {
          title:'创建时间',
          dataIndex:'createdAt',
          width:'30%',
          render:(text,record)=>{
            return moment(text).format('YYYY-MM-DD')
          }
        },
      {
        title: '操作',
        width: '20%',
        render:(text,record)=>{
          if(record.editable){
            return (
              <Fragment>
                <a onClick={e => this.handleSave(record)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e=>this.handleCancle(record)}>取消</a>
              </Fragment>
            )
          }else{
            return(
              <Fragment>
                <a onClick={e=>this.handleClick(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm onConfirm={e=>this.handleDelete(record)} title='确认删除？'>
                  <a >删除</a>
                </Popconfirm>
                
              </Fragment>
            )
            
          }
        }
      }
    ]
    return(
      <div>
        <Table
          size={this.props.size}
          style={{width:this.props.width}}
          rowKey={record => record.id}
          columns={columns}
          dataSource={this.state.datas}
          pagination={false}
        />
        <Button
          style={{ width:this.props.width, marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          添加域名配置
      </Button>
      </div>
    )
  }
}

SettingTable.propTypes = {
  size:PropTypes.string ,    //表格尺寸大小，有small跟default
  appCode: PropTypes.string.isRequired,      //应用Code
  appId: PropTypes.string.isRequired,        //应用ID
  checked:PropTypes.string,       //判断是否勾选中了https按钮
  ctx:PropTypes.string,          //应用上下文
  width:PropTypes.string          //表格宽度
}

SettingTable.defaultProps={
  size:'default',
  width:'100%'
}
