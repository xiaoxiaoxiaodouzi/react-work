import React, { PureComponent } from 'react';
import { Modal,Form,Select,Radio,Row,Col,Tooltip } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { queryContainerConfig,queryImageVersions } from '../../../services/deploy';
import showConfirmModal from './ShowConfirmModal';
import ShareLicense from './ShareLicense';
import HealthCheck from './HealthCheck';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { Description } = DescriptionList;
const FormItem = Form.Item;
/* 部署页面基本信息,props(artifact,version,node,dockerConfig)
 * artifact string 镜像名称
 * version string 版本信息
 * node string 节点
 * dockerConfig string 容器配置
 */
class BasicSettings extends PureComponent {
  state = {
    tenant:this.props.tenant,
    visibleBasicModal:false,
    artifact:this.props.artifact,
    version:this.props.version,
    node:this.props.node,
    dockerConfig:this.props.dockerConfig,
    isVersionChange:false,
    isDockerConfigChange:false,
    versionList:[], //
    quotaList:[],      //容器配额
    quotaValue:0,
  };
  quotaValue = 0;
  getImageVersions = ( tenant,artifact) => {
    queryImageVersions(tenant,artifact, { page: 1, rows: 999 }).then(data => {
      if(data && Array.isArray(data.contents)){
        this.setState({versionList:data.contents});
      }
    });
  }
  showConfirmEdit = ()=>{
    const { appCode,operationkey } = this.props;
    const { isDockerConfigChange,isVersionChange,version,quotaValue } = this.state;
    let quota = this.state.quotaList[quotaValue];
    console.log('quota',quota);
    let dockerConfig = quota.cpu+'-'+quota.memory+quota.memoryUnit;
    showConfirmModal(()=>{
      this.props.onChangeBasicInfo(version,dockerConfig,isVersionChange,isDockerConfigChange);
      this.setState({visibleBasicModal:false,dockerConfig});
    },()=>{
      this.setState({visibleBasicModal:false});
    },{
      appCode:appCode,
      containerName:operationkey,
    }); 
  }
  getContainerConfig = () =>{
    queryContainerConfig().then(data =>{
      //console.log("datacontainerconfig",data);
      let quotaValue = 0;
      if(Array.isArray(data)){
        data.forEach((element,index) => {
          let quota = element.cpu+'-'+element.memory+element.memoryUnit;
          if(quota === this.state.dockerConfig){
            quotaValue = index;
          }
        });
        this.setState({quotaList:data,quotaValue});
      }
    });
  }
  componentDidMount(){
    this.getImageVersions(this.props.tenant,this.props.artifact);
    this.getContainerConfig();
  }
  componentWillReceiveProps (nextProps){
    if(nextProps.artifact !== this.props.artifact){
      const { tenant,artifact,version,node,dockerConfig } = nextProps;
      this.setState({tenant,artifact,version,node,dockerConfig});
      this.getImageVersions(tenant,artifact);
      this.getContainerConfig();
    }
  }
  handleBasicModalOk = () =>{
    this.showConfirmEdit();
  }
  radioChange = (e) => {
    /* let quota = this.state.quotaList[e.target.value];
    let dockerConfig = quota.cpu+'-'+quota.memory+'Gi'; */
    this.setState({
      //dockerConfig,
      isDockerConfigChange:true,
      quotaValue:e.target.value
    });
  }
  onClickEdit = ()=>{
    this.quotaValue = this.state.quotaValue;
    this.setState({visibleBasicModal:true});
  }
  render() {
    const { visibleBasicModal,node,dockerConfig,version,versionList,artifact,quotaList,quotaValue } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    const title = <span>基本配置<a style={{float:"right",fontSize:14}} 
    onClick={this.onClickEdit}>编辑</a></span>
    return (
      <div>
        <DescriptionList size="large" title={title}>
          <Description term="所属镜像">
            <Tooltip title={this.props.image} overlayStyle={{wordWrap:'break-word'}}>{artifact}</Tooltip>
          </Description>
          <Description term="版本">
            {version}
          </Description>
          <Description term="主机">
            { node /* 10.100.12.125，10.100.12.125 */}
          </Description>
          <Description term="容器配置">
            { dockerConfig.indexOf('-')>0 ?`${dockerConfig.split('-')[0]} 核CPU ${dockerConfig.split('-')[1]} 内存`:'未限制'}
          </Description>
          <Description term="健康检查">
            <HealthCheck 
              probe={this.props.probe}
              container={this.props.operationkey}
              onChangeProbe={this.props.onChangeProbe}
            />
          </Description>
          <Description term="共享许可">
            <ShareLicense 
              appCode={this.props.appCode}
              operationkey={this.props.operationkey}
              configs={this.props.configs}
              onChangeShareLicense={this.props.onChangeShareLicense}
            />
          </Description>
        </DescriptionList>
        {/* <DescriptionList style={{marginTop:16}} size="large" col={1}>
          <Description term="镜像地址">
            {this.props.image}
          </Description>
        </DescriptionList> */}
        <Modal 
          title="基本配置修改"
          visible={visibleBasicModal}
          onOk={this.handleBasicModalOk} 
          onCancel={()=>{
            this.setState({
              visibleBasicModal:false,
              artifact:this.props.artifact,
              version:this.props.version,
              node:this.props.node,
              dockerConfig:this.props.dockerConfig,
              quotaValue:this.quotaValue
            });
          }}>
          <Form>
            <FormItem {...formItemLayout} label="版本">
              <Select value={version} placeholder="选择版本" onChange={value => this.setState({version:value,isVersionChange:true})}>
                {
                  versionList.map(element=>
                    <Option key={element.tag} value={element.tag}>{moment(element.time).format('YYYY-MM-DD hh:mm')+`@${element.tag}`}</Option>
                  )
                }
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="容器配置">
              <RadioGroup value={quotaValue} onChange={this.radioChange} size="large">
                <Row>
                {
                  quotaList.map((element,index) => {
                      return <Col key={index} span={12}><Radio value={index}>{`${element.cpu} 核CPU ${element.memory+element.memoryUnit} 内存`}</Radio></Col>
                  })
                }
                </Row>
              </RadioGroup>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
const Antdes = Form.create()(BasicSettings);
export default Antdes;