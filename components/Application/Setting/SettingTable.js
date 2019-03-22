import React, { Component, Fragment } from 'react';
import { Table, Button, Divider, Checkbox, message, Input, Select, Popconfirm } from 'antd';
import {addRouters,updateRouters,deleteRouters,getRouters} from '../../../services/amp'
import PropTypes from 'prop-types';
import Authorized from '../../../common/Authorized';
import {getRouteTemplate } from '../../../services/amp' 
import { base } from '../../../services/base';
const Option = Select.Option
const InputGroup = Input.Group;
export default class SettingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      code: '',
      isEditing: false,       //当前是否正在修改
      CTXCheckValue: false,       //上下文checkbox  
      hosts: '',   //域名
      name: '',      //域名name
      datas: [],
      ctx: '',
      upstream: 'http://',
      HttpCheckValue: 'http://',       //是否是HTTP
      context: '',     //域名上下文
      demo: '',      //域名模板
      inputValue: {},    //动态Input框的值
      HttpOption: [],
      templateList:[],    //模板列表
    }
  }

  componentDidMount(){
    getRouteTemplate().then(data=>{
      this.setState({templateList:data})
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.checked) {
      if (this.state.upstream !== 'http://') {
        this.setState({
          upstream: 'http://',
        })
      }
    } else {
      if (this.state.upstream !== 'https://') {
        this.setState({
          upstream: 'https://'
        })
      }
    }
    if (this.state.ctx !== nextProps.appDatas.ctx) {
      if (this.state.ctx) {
        this.setState({ ctx: nextProps.appDatas.ctx })
      }
    }
    if (nextProps.appDatas.code && this.props.appDatas.code !== nextProps.appDatas.code) {
      this.setState({ code: nextProps.appDatas.code, id: nextProps.appDatas.id })
      getRouters(nextProps.appDatas.code).then(data => {
        if (data) {
          this.setState({ datas: data })
        } else {
          this.setState({ datas: [] })
        }
      })
      this.setState({ code: nextProps.appDatas.code })
    }
  }

  //加载数据
  loadDatas = () => {
    let code = this.props.appDatas.code;
    getRouters(code).then(data => {
      if (data) {
        this.setState({
          datas: data,
          CTXCheckValue: '',
          hosts: '',
          context: '',
          isEditing: false,
          inputValue: {},
        })
      } else {
        this.setState({
          datas: [],
          isEditing: false,
          CTXCheckValue: '',
          context: '',
          hosts: '',
          inputValue: {},
        })
      }
    })
  }

  newMember = () => {
    if (!this.state.isEditing) {
      this.state.datas.push({
        new: true,
        hosts: '',
        contex: '',
        stripUri: true,
        editable: true,
        CTXCheckValue: false,
      })
      this.setState({
        isEditing: true,
        datas: this.state.datas,
        demo: 'custom'
      })
    } else {
      message.error('有未保存的数据，请先保存数据再进行添加')
    }
  }

  handleCancle = (record) => {
    delete record.editable;
    this.loadDatas();
  }

  handleSave = (record) => {
    if(this.state.context){
      if(!this.state.context.startsWith('/')){
        message.info('上下文要以/开头')
        return; 
      }
    }
    let code = this.state.code;
    let array = [];
    let b = [];
    //找到当前行记录的模板；
    let demo;
    let inputValue = this.state.inputValue;
    //判断是不是自定义
    if(this.state.demo!=='custom' && this.state.demo !=='any'){
      demo = this.state.demo.split('*');
      for (let i in inputValue) {
        if (!inputValue[i]) {
          message.info('请先填写域名再保存');
          return;
        }
      }
      let str='';
      demo.forEach((i,index)=>{
        str+=i+(inputValue[index]?inputValue[index]:'');
      })
      array.push(str);
    }else if(this.state.demo ==='custom'){
      if(this.state.hosts ){
        array.push(this.state.hosts)
      }else{
        message.info('请先填写域名再保存');
        return;
      }  
    }
    if (this.state.context) {
      b.push(this.state.context)
    } else {
      b.push('/')
    }
    //这个是根据集群列表的https勾选所判断的。
    let ups = this.state.upstream;
    /* if(this.state.context.startsWith('/')) cont=this.state.context;
    else cont='/'+this.state.context; */
    let bodyParams = {
      appCode:this.props.appDatas.code,
      name: record.name?record.name:this.state.id,
      stripPath: this.state.CTXCheckValue && this.state.CTXCheckValue!==''?this.state.CTXCheckValue:false,
      uris: b,
      upstreamUrl: ups + code,
      paths:b,
      https_only: this.state.HttpCheckValue === 'http://' ? false : true,
    }
    if(array && array.length > 0){
      bodyParams.hosts = array;
    }
    if(this.state.demo === 'any'){
      delete bodyParams.hosts
    }
    if (record.new) {
      //调用新增接口
      addRouters(bodyParams).then(data => {
        if (data) {
          delete record.new;
          delete record.editable;
          delete record.new;
          message.success('新增成功')
          let datas=this.state.datas;
          if(datas.length>0){
            let ary=[];
            if(record.hosts && record.hosts.length > 0){
              ary.push(record.hosts[0])
            }
            datas.forEach(i=>{
              if(i.hosts && i.hosts.length > 0){
                ary.push(i.hosts[0])
              }  
            })
          }
          this.loadDatas();
        }
      }).catch(e => {
        base.ampMessage('新增域名出错' );
        this.setState({ isEditing: false })
      })
    } else {
      //修改接口
      record.uris = b;
      record.paths = b;
      if(this.state.demo === 'any'){
        record.hosts = [];
      }else{
        record.hosts = array;
      }

      record.stripPath = this.state.CTXCheckValue;
      updateRouters(record.id, record).then(data => {
        delete record.editable;
        delete record.new;
        message.success('修改域名成功');
        let datas=this.state.datas;
        if(datas.length>0){
          let ary=[];
          datas.forEach(i=>{
            if(i.hosts && i.hosts.length > 0){
              ary.push(i.hosts[0])
            }
            
          })
          // let queryParams = {
          //   type: '2'
          // }
          //(this.state.id,queryParams,{hosts:ary.join(',')}).then(res=>{
          //})
        }
        this.loadDatas();
      }).catch(e => {
        base.ampMessage('修改域名出错' );
        this.setState({ isEditing: false })
      })
    }
  }



  handleCTXchange = (e) => {
    this.setState({
      CTXCheckValue: e.target.checked
    })
  }


  handleInputChange = (e) => {
    this.setState({
      hosts: e.target.value
    })
  }

  handleContextChange = (e) => {
    this.setState({ context: e.target.value })
  }

  //HTTP下拉选择框
  handleSelectChange = (e) => {
    this.setState({
      HttpCheckValue: e,
    })
  }

  handleClick = (record) => {
    if (!this.state.isEditing) {
      let name = record.hosts && record.hosts.length > 0 ? record.hosts[0] :'--';
      //反向匹配模板
      let demo = this.getDemo(record);
      let inputValue = this.state.inputValue;
      if(record.hosts && record.hosts.length > 0){
        if (!demo) {
          demo = 'custom';
          this.setState({HttpOption:['http://','https://']})
        } else {
          let ary = [];
          if (demo.https) ary.push('https://');
          if (demo.http) ary.push('http://');
          this.setState({ HttpOption: ary })
          //将原来*对应到的现在的然后塞到state里面去，方便生成input框有对应的值
          let demoAry=demo.host.split('*');
          demoAry.forEach((element, index) => {
            //生成正則匹配表達式
            if(index<demoAry.length-1){
              let regPre=element;
              let regSuf=demoAry[index+1];
              let reg=new RegExp(regPre+'(\\S*)'+regSuf);
              inputValue[index]=name.match(reg)[1]
            }
          });
          demo=demo.host;
        }
      }else{
        demo = 'any';
      }
     
      this.setState({
        demo: demo,
        isEditing: true,
        name: record.name,
        hosts: record.hosts && record.hosts.length>0?record.hosts[0]:null,
        context:record.paths && record.paths.length > 0?record.paths[0]:'',
        CTXCheckValue: record.stripUri,
        inputValue: inputValue,
        HttpCheckValue: record.httpsOnly ? 'https://' : 'http://'
      })
      record.editable = true;
    } else {
      message.error('有未保存的数据，请先保存数据在进行编辑！')
    }
  }

  //根据域名找到对应的模板
  getDemo = (record) => {
    let name = record.hosts && record.hosts.length > 0?record.hosts[0].split('.'):'--';
    //获取域名列表
    let list = this.state.templateList;
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let flag = true;
        if ((record.httpsOnly && list[i].https) || (!record.httpsOnly && list[i].http)) {
          list[i].host.split('.').forEach((item, index) => {
            //不为*，并且相等
            if (item !== '*') {
              if (item !== name[index]) {
                flag = false;
              }
            }
          })
          //如果都匹配上了才将数据返回
          if (flag) {
            //抛出异常跳出循环，
            return list[i];
            // eslint-disable-next-line
            break;
          }
        }
      }
    }
  }

  handleDelete = (record) => {
    deleteRouters(record.id).then(data => {
      message.success('删除成功')
      //let datas=this.state.datas;
      //let ary=datas.filter(item=>item.name===record.name);
      //updateApp(this.state.id,{type:'2'},{host:ary.join(',')})
      this.loadDatas();
    })
  }

  handleChange = (e, index) => {
    let inputValue = this.state.inputValue;
    inputValue[index] = e.target.value;
    this.setState({ inputValue })
  }

  render() {
    const selectBefore = (
      <Select value={this.state.HttpCheckValue} style={{ width: 90 }} onChange={e => this.handleSelectChange(e)}>
        {this.state.HttpOption.map(i => {
          return <Option value={i} key={i}>{i}</Option>
        })}
      </Select>
    );

    // const options = [
    //   { label: '是', value: '1' },
    //   { label: '否', value: '2' },
    // ];
    const columns = [
      {
        title: '访问地址模版',
        render: (text, record) => {
          if (record.editable) {
            return <Select value={this.state.demo} style={{ width: '100%' }} onSelect={e => { this.setState({ demo: e, inputValue: {} }) }} defaultValue='.amp.dev.*'>
              <Option value='custom' key='custom'>自定义</Option>
              <Option value='any' key='any'>不限制</Option>
              {this.state.templateList.map(i=>{
                return <Option value={i.host} key={i.host}>{i.name}</Option> 
              })}
            </Select>
          } else {
            let demo=this.getDemo(record);
            return record.hosts && record.hosts.length > 0 ?demo? (demo.name?demo.name:'自定义'):'自定义':'不限制'
          }
        }
      },
      {
        title: '域名',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.editable) {
            if ((this.state.demo !== 'custom' && this.state.demo !== 'any') && this.state.demo) {
              let str = this.state.demo.split('*');
              if (str.length > 0) {
                return <InputGroup compact >
                  {selectBefore}
                  {// eslint-disable-next-line
                    str.map((i, index) => {
                    if (index === 0) {
                      if (i === '') return <Input autoFocus value={this.state.inputValue[index]}  onChange={e => this.handleChange(e, index)} style={{ borderRight:0,borderRadius:0,width: 100, textAlign: 'center' }} />;
                      else return (
                      <div>
                        <Input style={{ width: i.length * 7 + 23, borderRight:0,borderRadius:0, pointerEvents: 'none', backgroundColor: '#fff', }} placeholder={i} disabled value='' />
                        <Input autoFocus value={this.state.inputValue[index]} onChange={e => this.handleChange(e, index)} style={{borderRadius:0,borderRight:0,borderLeft:0, width: 100, textAlign: 'center' }} />
                      </div> 
                    )
                    } else if(index!==str.length-1){
                      // eslint-disable-next-line
                      if (i === '') return <Input value={this.state.inputValue[index]} onChange={e => this.handleChange(e, index)} style={{borderRight:0,borderLeft:0,borderRadius:0,width: 100, textAlign: 'center', borderLeft: 0 }} />;
                      else return (
                      <div>
                        <Input style={{ width: i.length * 7 + 23, borderLeft: 0, borderRight:0,borderRadius:0,pointerEvents: 'none', backgroundColor: '#fff' }} placeholder={i} value='' disabled />
                        <Input value={this.state.inputValue[index]} onChange={e => this.handleChange(e, index)} style={Object.assign({},{ width: 100, textAlign: 'center', borderLeft: 0 ,borderRadius:0,},str[index+1]===''?'':{borderRight:0})} />
                      </div>
                      )
                    }else if(index===str.length-1){
                      if(i ==='') return '';
                      else return <Input style={{ width: i.length * 7 + 23, borderLeft: 0,borderRadius:0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder={i} value='' disabled />
                    }
                  })}
                </InputGroup>
              }
            } else if (this.state.demo === 'custom') {
              return <Input value={this.state.hosts} onChange={e => this.handleInputChange(e)} style={{ width: '60%' }} />
            }
            // return <Input addonBefore={selectBefore} value={this.state.hosts} onChange={e => this.handleInputChange(e)} style={{ width: '60%' }} />
          } else {
            if (record.httpsOnly) {
              return record.hosts && record.hosts.length > 0 ?'https://' + record.hosts[0] :'--'
            } else {
              return record.hosts && record.hosts.length > 0?'http://' + record.hosts[0]:'--'
            }
          }
        }
      },
      {
        title: '域名上下文',
        dataIndex: 'context',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return <Input value={this.state.context} onChange={e => this.handleContextChange(e)} />
          } else {
            return record.paths && record.paths.length>0?record.paths[0]:'/';
          }
        }
      },
      {
        title: '裁剪上下文',
        dataIndex: 'stripPath',
        width:150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Checkbox defaultChecked={record.stripPath && record.stripPath!== ''?record.stripPath:false} onChange={this.handleCTXchange}>
                是
              </Checkbox>
            )
          } else {
            return text ? '是' : '否'
          }
        }
      }/* ,
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: '10%',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD')
        }
      } */,
      {
        title: '操作',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Fragment>
                <a onClick={e => this.handleSave(record)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.handleCancle(record)}>取消</a>
              </Fragment>
            )
          } else {
            return (
              <Fragment>
                <Authorized authority={this.props.appDatas.appType === "middleware" ? 'middleware_editDomain' : 'app_editDomain'} noMatch={<a disabled="true" onClick={e => this.handleClick(record)}>编辑</a>}>
                  <a onClick={e => this.handleClick(record)}>编辑</a>
                </Authorized>
                <Divider type="vertical" />
                <Authorized authority={this.props.appDatas.appType === "middleware" ? 'middleware_deleteDomain' : 'app_deleteDomain'} noMatch={<Popconfirm onConfirm={e => this.handleDelete(record)} title='确认删除？'><a disabled="true">删除</a></Popconfirm>}>
                  <Popconfirm onConfirm={e => this.handleDelete(record)} title='确认删除？'>
                    <a >删除</a>
                  </Popconfirm>
                </Authorized>
              </Fragment>
            )

          }
        }
      }
    ]
    return (
      <div>
        <Table
          size={this.props.size}
          style={{ width: this.props.width }}
          rowKey={record=>record.name}
          columns={columns}
          dataSource={this.state.datas}
          pagination={false}
        />
        <Authorized authority={this.props.appDatas.appType === "middleware" ? 'middleware_addDomain' : 'app_addDomain'} noMatch={<Button disabled="true" style={{ width: this.props.width, marginTop: 16, marginBottom: 8 }} type="dashed" onClick={this.newMember} icon="plus" > 添加域名配置</Button>}>
          <Button
            style={{ width: this.props.width, marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            添加域名配置
        </Button>
        </Authorized>
      </div>
    )
  }
}

SettingTable.propTypes = {
  size: PropTypes.string,    //表格尺寸大小，有small跟default
  checked: PropTypes.bool,       //判断是否勾选中了https按钮
  width: PropTypes.string,          //表格宽度
}

SettingTable.defaultProps = {
  size: 'default',
  width: '100%'
}
