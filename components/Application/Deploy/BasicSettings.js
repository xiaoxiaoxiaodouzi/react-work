import React, { PureComponent } from 'react';
import { Modal, Tooltip, Table, Icon, Radio, InputNumber,Select,message } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { queryImageVersions, queryContainerConfig } from '../../../services/cce'
import showConfirmModal from './ShowConfirmModal';
import ShareLicense from './ShareLicense';
import HealthCheck from './HealthCheck';
import moment from 'moment';
import Authorized from '../../../common/Authorized';
const { Description } = DescriptionList;
const RadioGroup = Radio.Group;
/* 部署页面基本信息,props(artifact,version,node,dockerConfig)
 * artifact string 镜像名称
 * version string 版本信息
 * node string 节点
 * dockerConfig string 容器配置
 */
class BasicSettings extends PureComponent {
  state = {
    tenant: this.props.tenant,
    artifact: this.props.artifact,
    version: this.props.version,
    node: this.props.node,
    dockerConfig: this.props.dockerConfig,
    versionList: [], //
    quotaList: [],      //容器配额
    quotaValue: 0,
    page: 1,
    rows: 10,
    total: 0,
    sharedLicense:false,
    healthChecked:false,
    customize:false,
    memory:'1',
    request:'0.1',
    limit:'0.1',
  };
  version = this.props.version;
  quotaValue = 0;

  componentDidMount(){
    this.getContainerConfig();
  }
 
  componentWillReceiveProps(nextProps) {
    if (nextProps.artifact !== this.props.artifact || this.props.operationkey !== nextProps.operationkey) {
      if(nextProps.configs){
        nextProps.configs.forEach(element=>{
          if(element.name === 'config-license'){
            this.setState({
              sharedLicense:true
            });
            
          }
        });
      }
      if(nextProps.probe){
        this.setState({healthChecked:true});
      }else{
        this.setState({healthChecked:false});
      }

      const { tenant, artifact, version, node, dockerConfig } = nextProps;
      this.setState({ tenant, artifact, version, node, dockerConfig });
      this.getImageVersions(tenant, artifact);
      this.getContainerConfig();
    }
  }
  //获取容器配置选项
  getContainerConfig = () => {
    queryContainerConfig().then(data => {
      let quotaValue = 0;
      if (Array.isArray(data)) {
        let flag = false;//记录当前配置是否在选项中
        let customize = false;
        data.forEach((element, index) => {
          let quota = element.cpu + '-' + element.memory + element.memoryUnit;
          if (quota === this.state.dockerConfig) {
            quotaValue = index;
            this.quotaValue = quotaValue;
            flag = true;
          }
        });
        if(this.state.dockerConfig && !flag){
          quotaValue = '-1';
          customize = true;
          let dockerConfig = this.props.limit + "-" + this.props.memory;
          this.setState({
            limit:this.props.limit,
            request:this.props.request,
            dockerConfig:dockerConfig,
            memory:this.props.memory.substring(0,this.props.memory.length - 2)
          })
        }
        this.setState({ quotaList: data, quotaValue,customize });
      }
    });
  }
  //获取镜像版本列表
  getImageVersions = (tenant, artifact) => {
    this.setState({ loadingTable: true });
    queryImageVersions(tenant, artifact, { page: this.state.page, rows: this.state.rows }).then(data => {
      this.setState({ loadingTable: false });
      if (data && Array.isArray(data.contents)) {
        this.setState({ versionList: data.contents, page: data.pageIndex, rows: data.pageSize, total: data.total });
      }
    }).catch(err => this.setState({ loadingTable: false }));
  }

  onSelectChange = (e) => {
    if (e.target.value !== this.state.quotaValue) {
      
      if(e.target.value === '-1'){
        this.setState({
          customize:true,
          quotaValue: e.target.value
        })
      }else{
        this.setState({
          quotaValue: e.target.value,
          customize:false
        })
      }
    }
  }

  onSelectOk = () =>{
    if(this.state.request > this.state.limit){
      message.error("request值不能大于limit");
    }else{
      this.showConfirmEdit('quota');
    }
    
  }

  //显示修改信息后是否重启应用确认modal，调用公用确认组件showConfirmModal,flag = 'version'为修改版本确认，'quota'为容器配置修改确认
  showConfirmEdit = (flag) => {
    const { appCode, operationkey } = this.props;
    const { version, quotaValue, quotaList } = this.state;
    /**
     * @param function 确认操作，调用父组件的修改方法
     * @param function 取消操作，关闭modal
     * @param object   传入应用code和容器名称参数
     */
    showConfirmModal(() => {
      if (flag === 'version') {
        this.props.onChangeBasicInfo(version, null, true, false);
        this.setState({ visibleVersion: false });
      } else {
        let quota = {};
        if(quotaValue !== '-1'){
          quota = quotaList[quotaValue];
        }else{
          // let limit = {cpu: {amount: this.state.limit}, memory: {amount: this.state.memory+"Gi"}};
          // let requests = {cpu: {amount: this.state.request}, memory: {amount: this.state.memory+"Gi"}};
          // quota.limits = limit;
          // quota.requests = requests;
          quota.cpu = this.state.limit;
          quota.memory = this.state.memory;
          quota.memoryUnit = "Gi";
        }
        
        let dockerConfig = quota.cpu + '-' + quota.memory + quota.memoryUnit;
        this.props.onChangeBasicInfo(null, dockerConfig, false, true,this.state.request);
        this.setState({ dockerConfig, editDockerConfig: false });
      }
    }, () => {
      if (flag === 'version') {
        this.setState({ visibleVersion: false, version: this.version });
      } else {
        this.setState({ editDockerConfig: false, quotaValue: this.quotaValue });
      }
    }, {
        appCode: appCode,
        containerName: operationkey,
      });
  }

  showTotal = () => `共 ${this.state.total} 条记录  第 ${this.state.page}/${Math.ceil(this.state.total / this.state.rows)} 页 `;

  render() {
    const { node, dockerConfig, version, versionList, artifact, quotaList, quotaValue } = this.state;
    const columns = [{
      title: '版本号',
      dataIndex: 'tag',
    }, {
      title: '最后更新时间',
      dataIndex: 'time',
      render: (value, record) => moment(value).format('YYYY-MM-DD HH:mm')
    }, {
      title: '操作',
      render: (value, record) => {
        if (record.tag === version) {
          return '当前版本'
        } else {
          return (<a onClick={() => {
            this.setState({ version: record.tag }, () => {
              this.showConfirmEdit('version');
            })
          }} >部署此版本</a>)
        }
      }
    }];
    const pagination = {
      total: this.state.total,
      current: this.state.page,
      pageSize: this.state.rows,
      showTotal: this.showTotal,
      onChange: (current, pageSize) => {
        this.setState({ page: current, rows: pageSize }, () => this.getImageVersions(this.props.tenant, this.props.artifact));
      },
    };

    return (
      <div>
        <DescriptionList size="large" title={'基本配置'}>
          <Description term="所属镜像">
            <Tooltip title={this.props.image} overlayStyle={{ wordWrap: 'break-word' }}>{artifact}</Tooltip>
          </Description>
          <Description term="版本">
            <Authorized authority={this.props.type==='web'?'app_release':'middlewares_release'} noMatch={<span>{version}</span>}>
            <span className='hover-editor'><span>{version}</span>
              <a style={{ marginLeft: 8 }} onClick={() => {
                this.version = this.state.version;
                this.setState({ page: 1, rows: 10 }, () => this.getImageVersions(this.props.tenant, this.props.artifact));
                this.setState({ visibleVersion: true });
              }} ><Icon type='edit' /></a></span>
              </Authorized>
          </Description>
          <Description term="主机">
            {node ? node : '--'}
          </Description>
          
          <Description term="容器配置">
          <Authorized authority={this.props.type==='middleware'?'middlewares_container':'app_container'} noMatch={'未指定'}>
            {/* {this.state.editDockerConfig ?
              <div style={{ display: 'flex' }}>
                <Select style={{ flex: '1 1 auto' }} value={quotaValue} placeholder="选择版本"
                  onChange={this.onSelectChange}>
                  {
                    quotaList.map((element, index) =>
                      <Option key={index} value={index}>{`${element.cpu} 核CPU ${element.memory + element.memoryUnit} 内存`}</Option>
                    )
                  }
                </Select>
                <a style={{ marginLeft: 8, marginTop: 4 }} onClick={() => this.setState({ quotaValue: this.quotaValue, editDockerConfig: false })}>取消</a>
              </div>
              :
              <span>
                {dockerConfig.indexOf('-') > 0 ? `${dockerConfig.split('-')[0]} 核CPU ${dockerConfig.split('-')[1]} 内存` : '未限制'}
                <a style={{ marginLeft: 8 }} onClick={() => {
                  this.getContainerConfig();
                  this.setState({ editDockerConfig: true })
                }} ><Icon type='edit' /></a>
              </span>
            } */}
             <span className='hover-editor'>
                {dockerConfig.indexOf('-') > 0 ? `${dockerConfig.split('-')[0]} 核CPU ${dockerConfig.split('-')[1]} 内存` : '未限制'}
                <a style={{ marginLeft: 8 }} onClick={() => {
                  this.getContainerConfig();
                  this.setState({ editDockerConfig: true })
                }} ><Icon type='edit' /></a>
              </span>
             </Authorized>
          </Description>
         
          <Description term="健康检查">
          <Authorized authority={this.props.type==='middleware'?'middlewares_healthExamination':'app_healthExamination'} noMatch={<HealthCheck
              disabled='true'
              probe={this.props.probe}
              container={this.props.operationkey}
              onChangeProbe={this.props.onChangeProbe}
            />}>
            <HealthCheck
              probe={this.props.probe}
              container={this.props.operationkey}
              onChangeProbe={this.props.onChangeProbe}
            />
            </Authorized>
          </Description>
          <Description term="共享许可">
          
          <Authorized authority={this.props.type==='middleware'?'middlewares_sharedLicense':'app_sharedLicense'} noMatch={<ShareLicense
              disabled='true'
              appCode={this.props.appCode}
              operationkey={this.props.operationkey}
              configs={this.props.configs}
              onChangeShareLicense={this.props.onChangeShareLicense}
            />}>
            <ShareLicense
              appCode={this.props.appCode}
              operationkey={this.props.operationkey}
              configs={this.props.configs}
              onChangeShareLicense={this.props.onChangeShareLicense}
            />
          </Authorized>
          </Description>
        </DescriptionList>
        <Modal style={{ top: 20 }}
          title="选择镜像版本" onCancel={() => this.setState({ visibleVersion: false })}
          visible={this.state.visibleVersion} footer={null} >
          <Table size='middle' loading={this.state.loadingTable} dataSource={versionList} columns={columns} pagination={pagination} rowKey='tag'/>
        </Modal>
        <Modal visible={this.state.editDockerConfig}
        onCancel={()=>{this.setState({editDockerConfig:false})}}
        onOk={this.onSelectOk}
        title='容器配置'>
          <RadioGroup onChange={this.onSelectChange} value={quotaValue}>
            {
              quotaList.map((element, index) =>{
                return <Radio style={{
                height: '30px',
                width:'40%'}} key={index} value={index}>{`${element.cpu} 核CPU ${element.memory + element.memoryUnit} 内存`}</Radio>
              })
            }
            <Radio key="-1" style={{
                height: '30px',
                width:'40%'}} value="-1">自定义</Radio>            
          </RadioGroup>
          <div style={{marginTop:8}}>
            {this.state.customize?
            <div>
              <DescriptionList col={1}>
                <Description term="CPU限制"><div><Select disabled={true} style={{width:100,marginRight:5}} value='request'><Select.Option value='request'>request</Select.Option></Select>
                                                <InputNumber defaultValue={this.state.request} precision={1} onChange={
                                                  (value)=>{
                                                    if(value>this.state.limit){
                                                      message.info("request值不能大于limit！")
                                                    }else{
                                                      this.setState({request:value});
                                                    }
                                                }} 
                                                style={{width:'50%'}} min={0.1} max={this.state.limit} step={0.1}/> 核</div>
                                            <div style={{marginTop:5}}><Select disabled={true} style={{width:100,marginRight:5}} value='limit'><Select.Option value='limit'>limit</Select.Option></Select>
                                            <InputNumber defaultValue={this.state.limit} precision={1} 
                                            onChange={(value)=>{
                                              if(value<this.state.request){
                                                message.info("request值不能大于limit！")
                                              }else{
                                                this.setState({limit:value});
                                              }
                                            }} 
                                            style={{width:'50%'}} min={this.state.request} step={0.1}/> 核</div>
                                            <div style={{marginTop:5,color:'rgb(190,190,190)'}}>request只用于资源分配调度，不限制实际使用</div>
                                            <div style={{color:'rgb(190,190,190)'}}>limit与资源调度无关，表示资源的最大使用上限</div>
                </Description>                     
              </DescriptionList> 
              <DescriptionList style={{marginTop:10}} col={1}>
                <Description term="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;内存"><InputNumber defaultValue={this.state.memory} onChange={(value)=>this.setState({memory:value})} style={{width:'76%'}} min={1} max={32}/> Gi
                                          <div style={{marginTop:5,color:'rgb(190,190,190)'}}>内存限制默认rquest=limit</div>
                </Description>
              </DescriptionList>
           </div>
            :"" 
            }
          </div>
        </Modal>
      </div>
    );
  }
}
export default BasicSettings;