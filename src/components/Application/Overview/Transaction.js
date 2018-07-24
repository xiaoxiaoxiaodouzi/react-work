import React, { Fragment } from 'react';
import { Row,Col,Divider,Form,Select,Input,Button,Switch,DatePicker,Tabs } from 'antd';
import TransactionTableSimple from './TransactionTableSimple';
import TransactionTableAdvance from './TransactionTableAdvance';
import CallStack from './CallStack';
import CallLink from './CallLink';
import moment from 'moment';
import { 
  getTransactionInfo,
  selectDotGetTrans
} from '../../../services/dashApi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

class Components extends React.PureComponent {
  state = {
    checkedValue:false,
    data:[],
    loading:false,
    selectedRows:[],
    rangePickerValue:[],
    loadingSwitch:false,
  };
  componentDidMount(){
    this.beforeLoadData();
  }
  //当时间范围变化时重新获取数据
  componentWillReceiveProps(nextProps){
    let flag = this.props.appCode !== nextProps.appCode 
    || this.props.from !== nextProps.from 
    || this.props.to !== nextProps.to 
    || this.props.type !== nextProps.type 
    || this.props.datas !== nextProps.datas;
    console.log('fff2',flag,nextProps,this.props);
    if(this.props.appCode !== nextProps.appCode 
      || this.props.from !== nextProps.from 
      || this.props.to !== nextProps.to 
      || this.props.type !== nextProps.type 
      || this.props.datas !== nextProps.datas ){
        console.log('fff3',nextProps);
      if(nextProps.type === 'dot'){
        this.dotGetTransData({},nextProps.datas);
      }else if(nextProps.type === 'pie'){
        let params = {
          from:nextProps.from,
          to:nextProps.to
        }
        if(nextProps.datas === 'exception'){
          params.exception=1
        }else{
          params.elapsed=nextProps.datas
        }
        this.loadData(nextProps.appCode,params);
      }else if(nextProps.type === 'rect'){
        let params = {
          path:nextProps.datas,
        }
        this.loadData(nextProps.appCode,params);
      }else{
        /* let params = {
          from:nextProps.from,
          to:nextProps.to
        } */
        this.loadData(nextProps.appCode);
      }
    }
  }  
  handleRangePickerChange = (rangePickerValue) => {
    console.log('rangepicker',rangePickerValue);
    this.setState({
      rangePickerValue,
    });
  };
  //获取事务列表数据前参数整理
  beforeLoadData = (params)=>{
    if(!params){
      params = {};
    }
    if(this.props.type === 'dot'){
      this.dotGetTransData(params,this.props.datas);
    }else if(this.props.type === 'pie'){
      params.from=this.props.from;
      params.to=this.props.to;
      if(this.props.datas === 'exception'){
        params.exception=1;
      }else{
        params.elapsed=this.props.datas;
      }
      this.loadData(this.props.appCode,params);
    }else if(this.props.type === 'rect'){
      params.path=this.props.datas;
      this.loadData(this.props.appCode,params);
    }else{
      /* params.from=this.props.from;
      params.to=this.props.to; */
      this.loadData(this.props.appCode,params);
    }
  }
  //获取事务列表数据
  loadData=(appCode,queryParams)=>{
    if(this.state.checkedValue){
      queryParams.mode = 'aggre';
    }
    this.setState({loading:true,loadingSwitch:true});
    getTransactionInfo(appCode,queryParams).then(data=>{
      this.setState({loading:false,loadingSwitch:false});
      if(data && data.length){
        data.forEach(element=>{
          element.key = element.traceId
        })
        let selectedRows = [];
        if(!this.state.checkedValue){
          selectedRows=[data[0].traceId];
        }
        this.setState({ 
          data,
          selectedRows, 
        });
      }else{
        this.setState({ data:[],selectedRows:[] });
      }
    }).catch(err=>{
      this.setState({loading:false,loadingSwitch:false,data:[]});
    });
  }
  //散点图获取事务列表数据
  dotGetTransData=(queryParams,bodyParams)=>{
    if(this.state.checkedValue){
      queryParams.mode = 'aggre';
    }
    selectDotGetTrans(queryParams,bodyParams).then(data=>{
      this.setState({loading:false});
      if(data && data.length){
        data.forEach(element=>{
          element.key = element.traceId
        });
        let selectedRows = [];
        if(!this.state.checkedValue){
          selectedRows=[data[0].traceId];
        }
        this.setState({ 
          data,
          selectedRows, 
        });
      }else{
        this.setState({
          data:[],
          selectedRows:[],
        });
      }
    }).catch(err=>{
      this.setState({loading:false,data:[]});
    });
  }
  //单选行获取traceID，从而获取事务链和事务栈数据
  onSelectRows = (rowKeys)=>{
    this.setState({selectedRows:rowKeys});
  }
  //过滤表单查询事务列表数据
  handleFormSubmit = ()=>{
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    if(this.state.rangePickerValue.length){
      values.from = moment(this.state.rangePickerValue[0]).format('x');
      values.to = moment(this.state.rangePickerValue[1]).format('x');
    }
    this.beforeLoadData(values);
  }
  //重置表单条件
  handleFormReset = ()=>{
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({ rangePickerValue:[] });
    this.beforeLoadData();
  }
  //聚合模式和普通模式切换
  onCheckValue = (checked)=>{
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    this.setState({checkedValue:checked,selectedRows:[]},()=>{
      this.beforeLoadData(values);
    });
  }
  //不同情况下渲染不同过滤表单
  renderForm = () =>{
    const { getFieldDecorator } = this.props.form;
    if(this.props.type === 'pie'){
      return (
        <Form layout="inline">
          <Row  style={{ marginBottom: 24 ,marginLeft:12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="路径">
                {getFieldDecorator('path')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="异常">
                {getFieldDecorator('exception')(
                  <Select style={{ width: '100%' }} >
                    <Option value="0">正常</Option>
                    <Option value="1">异常</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="模式">
              <Switch 
                loading={this.state.loadingSwitch} 
                checked={this.state.checkedValue}
                checkedChildren="聚合模式" 
                unCheckedChildren="普通模式" 
                onChange={checked => this.onCheckValue(checked)} />
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: 24, marginLeft: 12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              {!this.state.checkedValue?
                <FormItem label="客户端IP">
                  {getFieldDecorator('endpoint')(
                    <Input placeholder="不限" />
                  )}
                </FormItem>:'' }
            </Col>
            <Col md={8} sm={24}>
            </Col>
            <Col md={8} sm={24}>
              <span>
                <Button type="primary" onClick={this.handleFormSubmit}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </Col>
          </Row>
        </Form>
      )
    }else if(this.props.type === 'rect'){
        return (
          <Form layout="inline">
            <Row  style={{ marginBottom: 24 ,marginLeft:12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="耗时">
                  {getFieldDecorator('elapsed')(
                    <Select style={{ width: '100%' }} >
                      <Option value={1}>1s</Option>
                      <Option value={3}>3s</Option>
                      <Option value={5}>5s</Option>
                      <Option value={6}>slow</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="异常">
                  {getFieldDecorator('exception')(
                    <Select style={{ width: '100%' }} >
                      <Option value="0">正常</Option>
                      <Option value="1">异常</Option>
                    </Select>
                  )}
                </FormItem>
                
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="模式">
                <Switch 
                  loading={this.state.loadingSwitch}  
                  checked={this.state.checkedValue}
                  checkedChildren="聚合模式" 
                  unCheckedChildren="普通模式" 
                  onChange={checked => this.onCheckValue(checked)} />
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginBottom: 24, marginLeft: 12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                {!this.state.checkedValue?
                  <FormItem label="客户端IP">
                    {getFieldDecorator('endpoint')(
                      <Input placeholder="不限" />
                    )}
                  </FormItem>:'' }
              </Col>
              <Col md={8} sm={24}>
              </Col>
              <Col md={8} sm={24}>
                <span>
                  <Button type="primary" onClick={this.handleFormSubmit}>查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </span>
              </Col>
            </Row>
          </Form>
        )
    }else if(this.props.type === 'dot'){
        return (
          <Form layout="inline">
            <Row  style={{ marginBottom: 24 ,marginLeft:12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="路径">
                  {getFieldDecorator('path')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="异常">
                  {getFieldDecorator('exception')(
                    <Select style={{ width: '100%' }} >
                      <Option value="0">正常</Option>
                      <Option value="1">异常</Option>
                    </Select>
                  )}
                </FormItem>
                
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="模式">
                <Switch 
                  loading={this.state.loadingSwitch} 
                  checked={this.state.checkedValue}
                  checkedChildren="聚合模式" 
                  unCheckedChildren="普通模式" 
                  onChange={checked => this.onCheckValue(checked)} />
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginBottom: 24, marginLeft: 12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                {!this.state.checkedValue?
                  <FormItem label="客户端IP">
                    {getFieldDecorator('endpoint')(
                      <Input placeholder="不限" />
                    )}
                  </FormItem>:'' }
              </Col>
              <Col md={8} sm={24}>
                {!this.state.checkedValue?
                  <FormItem label="耗时">
                    {getFieldDecorator('elapsed')(
                      <Select style={{ width: '100%' }} >
                        <Option value={1}>1s</Option>
                        <Option value={3}>3s</Option>
                        <Option value={5}>5s</Option>
                        <Option value={6}>slow</Option>
                      </Select>
                    )}
                  </FormItem>:'' }
              </Col>
              <Col md={8} sm={24}>
              <span>
                <Button type="primary" onClick={this.handleFormSubmit}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
              </Col>
            </Row>
          </Form>
        )
    }else{
      if(!this.state.checkedValue){
        return (
          <Form layout="inline">
            <Row  style={{ marginBottom: 24 ,marginLeft:12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="路径">
                  {getFieldDecorator('path')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="异常">
                  {getFieldDecorator('exception')(
                    <Select style={{ width: '100%' }} >
                      <Option value="0">正常</Option>
                      <Option value="1">异常</Option>
                    </Select>
                  )}
                </FormItem>
                
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="模式">
                <Switch 
                  loading={this.state.loadingSwitch} 
                  checked={this.state.checkedValue}
                  checkedChildren="聚合模式" 
                  unCheckedChildren="普通模式" 
                  onChange={checked => this.onCheckValue(checked)} />
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginBottom: 24, marginLeft: 12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="时间">
                  <RangePicker
                    value={this.state.rangePickerValue}
                    onChange={this.handleRangePickerChange}
                    style={{ width:'100%'}}
                  />
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="客户端IP">
                  {getFieldDecorator('endpoint')(
                    <Input placeholder="不限" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="耗时">
                  {getFieldDecorator('elapsed')(
                    <Select style={{ width: '100%' }} >
                      <Option value={1}>1s</Option>
                      <Option value={3}>3s</Option>
                      <Option value={5}>5s</Option>
                      <Option value={6}>slow</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginBottom: 24, marginLeft: 12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
              </Col>
              <Col md={8} sm={24}>
              </Col>
              <Col md={8} sm={24}>
                <span>
                  <Button type="primary" onClick={this.handleFormSubmit}>查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </span>
              </Col>
            </Row>
          </Form>
        )
      }else{
        return (
          <Form layout="inline">
            <Row  style={{ marginBottom: 24 ,marginLeft:12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="路径">
                  {getFieldDecorator('path')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="异常">
                  {getFieldDecorator('exception')(
                    <Select style={{ width: '100%' }} >
                      <Option value="0">正常</Option>
                      <Option value="1">异常</Option>
                    </Select>
                  )}
                </FormItem>
                
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="模式">
                <Switch 
                  loading={this.state.loadingSwitch} 
                  checked={this.state.checkedValue}
                  checkedChildren="聚合模式" 
                  unCheckedChildren="普通模式" 
                  onChange={checked => this.onCheckValue(checked)} />
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginBottom: 24, marginLeft: 12}} gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="开始时间">
                  <RangePicker
                    value={this.state.rangePickerValue}
                    onChange={this.handleRangePickerChange}
                    style={{ width:'100%'}}
                  />
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
              </Col>
              <Col md={8} sm={24}>
              <span>
                <Button type="primary" onClick={this.handleFormSubmit}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
              </Col>
            </Row>
          </Form>
        )
      }
    } 
  }
  render(){
    return (
      <Fragment>
        <div className='tableList' style={{padding:'0px 24px 0px 24px'}}>
          { this.renderForm() }
          { !this.state.checkedValue?
            <Fragment>
              <TransactionTableSimple 
                selectedRows={this.state.selectedRows}
                loading={this.state.loading}
                data={this.state.data}
                onSelectRows={this.onSelectRows} />
              <Divider style={{ marginBottom: 24,marginTop:24 }} />
              <Tabs type="card" style={{marginBottom:32}}>
                <TabPane tab="调用栈" key="1"><CallStack traceId={this.state.selectedRows} /></TabPane>
                <TabPane tab="调用链" key="2"><CallLink traceId={this.state.selectedRows} /></TabPane>
              </Tabs>
            </Fragment>  
          :
            <TransactionTableAdvance 
              loading={this.state.loading}
              data={this.state.data}
               />
          }
        </div>
      </Fragment>
    )
  }
}
const Transaction=Form.create()(Components)
export default Transaction;
