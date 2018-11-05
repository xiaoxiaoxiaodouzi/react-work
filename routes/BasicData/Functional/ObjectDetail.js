import React from 'react'
import { Row, Col, Button, message, Modal } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Route } from 'react-router-dom';
import moment from 'moment';
import constants from '../../../services/constants';
import Permission from '../../../components/BasicData/Functional/Permission';
import Log from '../../../components/BasicData/Functional/Log';
import Statistic from '../../../components/BasicData/Functional/Statistic';
import { ObjectDetailContext } from '../../../context/ObjectDetailContext'
import { getResourceById, deleteFunctional, updateResource ,getResourceTree} from '../../../services/functional'
import { getAppInfo } from '../../../services/appdetail'
import FunctionModal from '../../../components/BasicData/Functional/FunctionModal'
import InputInline from '../../../common/Input'
import TreeHelp from '../../../utils/TreeHelp'


const { Description } = DescriptionList;
const tabList = [
  { key: 'permission', tab: '详情' },
  { key: 'log', tab: '日志' },
  { key: 'statistic', tab: '统计' }
];
const confirm = Modal.confirm;
class FunctionalDetail extends React.Component {
  state = {
    tabActiveKey: 'permission',
    tags: [],
    allTags: [],
    appId: this.props.match.params.appid,
    id: this.props.match.params.id,
    resourceId: '',
    appName: '',
    isDelete: '',
    isPublic: '',
    desc: '',
    data: {},
    datas:[],   //应用下的所有资源 树结构
    roleList: [],            //角色集合数据
    userCollections: [],     //用户集合数据
    visible: false,          //编辑模态框开关
    oriData:[],       //所有资源 LIST结构
    roleListChange: (roleList) => {
      this.setState({ roleList })
    }
  }

  componentDidMount() {
    getResourceById(this.props.match.params.appid, this.props.match.params.id).then(data => {
      if (data.length > 0) {
        this.setState({ resourceName: data[0].name, appName: data[0].appName, data: data[0] })
      }
    })
    getResourceTree(this.props.match.params.appid).then(datas=>{
      if (datas.length > 0) {
        datas.forEach(i => {
          i.pid = i.parentId
        });
        let treeData=TreeHelp.toChildrenStruct(datas)
        this.setState({datas:treeData,oriData:datas})
      }
    })
    getAppInfo(this.props.match.params.appid).then(data => {
      this.setState({ appName: data.name });
    })
    tabList.forEach(element => {
      if (window.location.href.indexOf('/' + element.key) > 0) {
        this.setState({ tabActiveKey: element.key });
      }
    })
  }

  onTabChange = (key) => {
    let { history } = this.props;
    history.push({ pathname: `/applications/${this.props.match.params.appid}/functional/${this.props.match.params.id}/${key}` });
    //history.push({ pathname: `/functional/${this.functionalId}/${key}` });
    this.setState({ tabActiveKey: key });
  }

  showDeleteConfirm = () => {
    let that = this;
    confirm({
      title: '删除功能?',
      content: '删除功能【' + this.state.data.name + '】会将功能【' + this.state.data.name + '】关联的所有资源删除',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        deleteFunctional(that.props.match.params.appid, that.props.match.params.id).then(data => {
          message.success('功能删除成功');
          that.props.history.goBack();
        })
      },
      onCancel() {
      },
    });
  }

  onOk = (values) => {
    let resource = this.state.data;
    //调用修改接口
    updateResource(resource.appId, resource.id, values).then(data => {
      this.setState({ visible: false, ...data })
      message.success('修改功能成功')
    }).catch(err => {
      this.setState({ visible: false })
    })
  }

  renderExtra() {
    return (
      <Row>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>收藏的用户</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>--</div>
        </Col>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>访问次数</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>--</div>
        </Col>
      </Row>
    )
  }
  renderconstDescription() {
    return (
      <div>
        <DescriptionList size="small" col="2">
          <Description term="所属应用">{this.state.appName ? this.state.appName : '无'}</Description>
          {/* <Description term="是否删除">{this.state.isDelete ? this.state.isDelete : '无'}</Description> */}
          <Description term="是否默认收藏">{this.state.isPublic ? this.state.isPublic : '无'}</Description>
          <Description term="最近修改时间">{moment(new Date()).format('YYYY-MM-DD HH:mm')}</Description>
        </DescriptionList>
        <DescriptionList size="small" col="1">
          <Description term="描述">{this.state.desc || '/'}</Description>
        </DescriptionList>
      </div>
    )
  }

  render() {
    const title = (
      <InputInline title={'功能名称 '} value={this.state.data.name} onChange={(value) => this.onOk(value, 'name')} dataType={'Input'} mode={'inline'} />
    )

    const action = (
      <div>
        <Button type='primary' onClick={() => { this.setState({ visible: true }) }}>编辑</Button>
        <Button type='danger' onClick={this.showDeleteConfirm}>删除</Button>
      </div>
    );

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={title}
          action={action}
          logo={<img alt="" src={constants.PIC.service} />}
          content={this.renderconstDescription()}
          extraContent={this.renderExtra()}
          tabList={tabList}
          tabActiveKey={this.state.tabActiveKey}
          onTabChange={this.onTabChange}
        />
        <ObjectDetailContext.Provider value={this.state}>
          <Route path="/applications/:appid/functional/:id" component={Permission} exact />
          <Route path="/applications/:appid/functional/:id/permission" component={Permission} />
          <Route path="/applications/:appid/functional/:id/log" component={Log} />
          <Route path="/applications/:appid/functional/:id/statistic" component={Statistic} />
        </ObjectDetailContext.Provider>

        <FunctionModal type={'update'} oriData={this.state.oriData} datas={this.state.datas} data={this.state.data} visible={this.state.visible} onOk={this.onOk} onCancel={() => { this.setState({ visible: false }) }} />
      </div>
    )
  }
}

export default FunctionalDetail;