import React, { PureComponent } from 'react';
import { Modal,Form,Select,Radio,Row,Col } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { queryContainerConfig,queryImageVersions } from '../../../services/deploy';
import showConfirmModal from './ShowConfirmModal';
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
    visibleBasicModal:false,
    artifact:this.props.artifact,
    tenant:this.props.tenant,
    version:this.props.version,
    node:this.props.node,
    dockerConfig:this.props.dockerConfig,
    isVersionChange:false,
    isDockerConfigChange:false,
    versionList:[], //
    quotaList:[],      //容器配额
    quotaValue:0,
  };
  getImageVersions = ( tenant,artifact) => {
    queryImageVersions(tenant,artifact, { page: 1, rows: 10 }).then(data => {
      if(data && Array.isArray(data.contents)){
        this.setState({versionList:data.contents});
      }
    });
  }
  showConfirmEdit = ()=>{
    const { appCode,operationkey } = this.props;
    const { isDockerConfigChange,isVersionChange,version,dockerConfig } = this.state;
    showConfirmModal(()=>{
      this.props.onChangeBasicInfo(version,dockerConfig,isVersionChange,isDockerConfigChange);
      this.setState({visibleBasicModal:false});
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
          let quota = element.cpu+'-'+element.memory+'Gi';
          if(quota === this.state.dockerConfig){
            quotaValue = index;
          }
        });
        this.setState({quotaList:data,quotaValue});
      }
    });
  }
  componentDidMount(){
    this.getImageVersions(this.state.tenant,this.state.artifact);
    this.getContainerConfig();
  }
  componentWillReceiveProps (nextProps){
    if(nextProps.artifact !== this.state.artifact){
      const {artifact,tenant,version,node,dockerConfig} = nextProps;
      this.setState({artifact,tenant,version,node,dockerConfig});
      this.getImageVersions(tenant,artifact);
      this.getContainerConfig();
    }
  }
  handleBasicModalOk = () =>{
    this.showConfirmEdit();
  }
  radioChange = (e) => {
    let quota = this.state.quotaList[e.target.value];
    let dockerConfig = quota.cpu+'-'+quota.memory+'Gi';
    this.setState({
      dockerConfig,
      isDockerConfigChange:true,
      quotaValue:e.target.value
    });
  }
  onClickEdit = ()=>{
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
            {artifact}
          </Description>
          <Description term="版本">
            {version}
          </Description>
          <Description term="节点">
            { node /* 10.100.12.125，10.100.12.125 */}
          </Description>
          <Description term="容器配置">
            { dockerConfig.indexOf('-')>0 && `${dockerConfig.split('-')[0]} 核CPU ${parseInt(dockerConfig.split('-')[1])}GB 内存` /* 2X（16G 内存 / 8核CPU） */}
          </Description>
        </DescriptionList>
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