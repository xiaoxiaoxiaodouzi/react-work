import React, { PureComponent } from 'react';
import { Modal, Select, Tooltip, Table, Icon } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { queryContainerConfig, queryImageVersions } from '../../../services/deploy';
import showConfirmModal from './ShowConfirmModal';
import ShareLicense from './ShareLicense';
import HealthCheck from './HealthCheck';
import moment from 'moment';
import { base } from '../../../services/base';
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';
const Option = Select.Option;
const { Description } = DescriptionList;
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
  };
  version = this.props.version;
  quotaValue = 0;
  componentWillReceiveProps(nextProps) {
    if (nextProps.artifact !== this.props.artifact || this.props.operationkey !== nextProps.operationkey) {
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
        data.forEach((element, index) => {
          let quota = element.cpu + '-' + element.memory + element.memoryUnit;
          if (quota === this.state.dockerConfig) {
            quotaValue = index;
            this.quotaValue = quotaValue;
          }
        });
        this.setState({ quotaList: data, quotaValue });
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

  onSelectChange = (value) => {
    if (value !== this.state.quotaValue) {
      this.setState({
        quotaValue: value
      }, () => {
        this.showConfirmEdit('quota')
      })
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
        let quota = quotaList[quotaValue];
        let dockerConfig = quota.cpu + '-' + quota.memory + quota.memoryUnit;
        this.props.onChangeBasicInfo(null, dockerConfig, false, true);
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
      render: (value, record) => moment(value).format('YYYY-MM-DD hh:mm')
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
    const Authorized = RenderAuthorized(base.allpermissions);

    if(this.props.configs){
      this.props.configs.forEach(element=>{
        if(element.name === 'config-license'){
          this.setState({
            sharedLicense:true
          });
          
        }
      });
    }

    if(this.props.probe){
      this.setState({healthChecked:true});
    }else{
      this.setState({healthChecked:false});
    }

    return (
      <div>
        <DescriptionList size="large" title={'基本配置'}>
          <Description term="所属镜像">
            <Tooltip title={this.props.image} overlayStyle={{ wordWrap: 'break-word' }}>{artifact}</Tooltip>
          </Description>
          <Description term="版本">
          <Authorized authority='app_release' noMatch={<span>{version}</span>}>
            <span>{version}</span>
            <a style={{ marginLeft: 8 }} onClick={() => {
              this.version = this.state.version;
              this.setState({ page: 1, rows: 10 }, () => this.getImageVersions(this.props.tenant, this.props.artifact));
              this.setState({ visibleVersion: true });
            }} ><Icon type='edit' /></a>
            </Authorized>
          </Description>
          <Description term="主机">
            {node ? node : '--'}
          </Description>
          
          <Description term="容器配置">
          <Authorized authority='app_container' noMatch={'未指定'}>
            {this.state.editDockerConfig ?
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
            }
             </Authorized>
          </Description>
         
          <Description term="健康检查">
          <Authorized authority='app_healthExamination' noMatch={<HealthCheck
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
          
          <Authorized authority='app_sharedLicense' noMatch={<ShareLicense
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
          <Table size='middle' loading={this.state.loadingTable} dataSource={versionList} columns={columns} pagination={pagination} />
        </Modal>
      </div>
    );
  }
}
export default BasicSettings;