import React, { PureComponent } from 'react';
import { Form, Table, Divider} from 'antd';
import Link from 'react-router-dom/Link';
import { queryAppAIP, getGlobalRoles } from '../../services/aip'
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'
import Authorized from '../../common/Authorized';
import { getPagination, pushUrlParams, urlParamToObj } from '../../utils/utils';
import FunctionListDrawer from '../../components/BasicData/Functional/FunctionListDrawer';
import RoleResourceModal from '../../components/BasicData/Functional/RoleResourceModal';
import { SearchForm } from 'c2-antd-plus';



class FuncRoleList extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
      dataSource: [],
      apps: [],
      title:'',           //模态框title
      loading:false,
      functionsDrawerVisible:false,
    }

    this.loadApps = this.loadApps.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }


  componentDidMount(){
    const urlSearch = urlParamToObj(this.props.history.location.search);
    this.setState({searchData:urlSearch});
    this.loadApps();
    this.loadData(urlSearch);
  }
  componentDidUpdate(preProps){
    if(this.props.environment !== preProps.environment){
      this.loadApps();
      this.loadData();
    }
  }

  loadApps(){
    queryAppAIP().then(data => {
      this.setState({ apps: data });
    })
  }

  loadData = (params={}, page=1, rows=10) => {
    this.setState({loading:true});
    getGlobalRoles({...params,page,rows}).then(data => {
      const pagenation = getPagination(data,(current, pageSize)=>{
        this.loadData(this.state.searchParams,current,pageSize);
      });
      this.setState({loading:false, dataSource: data.contents,pagenation});
    })
  }

  onSearch = (e,values)=>{
    this.loadData(values);
    pushUrlParams(this.props.history,values);
  }

  onManagerModal = (manager,record,type,title)=>{
    this.setState({ authorizeVisible: true,record,type,title});
  }

  onClose=()=>{
    this.setState({functionsDrawerVersion:false})
  }

  render() {
    const columns = [{
      title: '角色名称',
      dataIndex: 'roleName',
      render: (text, record) => {
        return <Link style={{whiteSpace:'nowrap'}} to={`/functions/applications/${record.appId}/roles/${record.roleId}` }>{text}</Link>
      }
    }, {
      title: '所属应用',
      dataIndex: 'appName',
      render: (text, record) => {
        return (
          <Authorized authority='functional_appRedirect' noMatch={<span style={{whiteSpace:'nowrap'}}>{text}</span>}>
            <Link style={{whiteSpace:'nowrap'}} to={`/functions/apps/${record.appId}`}>{text}</Link>
          </Authorized>
        )
      }
    },{
      title:'功能数',
      dataIndex:"functionNum",
      align:'right',
      width:80,
      render:(text,record)=>{
        return <a onClick={()=>this.setState({functionsDrawerVisible:true,record:record,functionsDrawerTitle:record.roleName+'关联的功能'})}>{text}</a>  
      }
    }, {
      title: '操作',
      width: '180px',
      key: 'action',
      render: (text, record) => {
        return (
          <span style={{whiteSpace: 'nowrap'}}>
            <Authorized authority='functional_roleUser' noMatch={<a disabled='true' onClick={() => this.onManagerModal(record.userCollections,record,'addUsers','角色授权用户设置')} >授权用户</a>}>
              <a onClick={() => this.onManagerModal(null,record,'addUsers','将功能角色授权给用户')} >授权</a>
            </Authorized>
            <Divider type='vertical' />
            <Authorized authority='functional_setManager' noMatch={<a disabled='true' onClick={() => this.onManagerModal(record.managers,record,'addManagers','功能管理员设置')} >设置管理员</a>}>
              <a onClick={() => this.onManagerModal(record.managers,record,'addManagers','设置功能角色管理员')} >设置管理员</a>
            </Authorized>
          </span>
        )
      }
    }];

    const searchItems = [
      {label:'角色名称',name:'name'},
      {label:'所属应用',name:'appId',type:'select',
      options:this.state.apps.map(app=>{return {label:app.name,value:app.id}})}
    ];
    
    return (
      <div>
        <SearchForm items={searchItems} data={this.state.searchData} onSearch={this.onSearch} onReset={e=>{this.onSearch(null,{})}}/>
        <Table 
          rowKey='id'
          dataSource={this.state.dataSource}
          pagination={this.state.pagenation}
          columns={columns} 
          loading={this.state.loading}
          />
        <FunctionListDrawer visible={this.state.functionsDrawerVisible} record={this.state.record} title={this.state.functionsDrawerTitle} onClose={e=>this.setState({functionsDrawerVisible:false})}/>
        <RoleResourceModal title={this.state.title} type={this.state.type} role={this.state.record} visible={this.state.authorizeVisible} handleAuthorizeModal={e=>this.setState({authorizeVisible:false})}/>
      </div>
    );
  }
}
const RoleList = Form.create()(FuncRoleList);
export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <RoleList {...props} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
)