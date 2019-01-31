import React, { Fragment } from 'react';
import { Row,Col,Input,Button,Alert,Table,Card,Tag,Modal,message } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { queryAppAIP } from '../../../services/aip';
import DataFormate from '../../../utils/DataFormate';
import { getApiGrationinfo, removeAppServer, addAppsToServer } from '../../../services/aip';
import { base } from '../../../services/base';
import Authorized from '../../../common/Authorized';

export default class PermissionCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visibleModal:false,
      modalData:[],
      modalRow:10,
      modalPage:1,
      modalTotal:0,
      selectedRowKeysModal: [],
      dataSource: [],
      selectedRowKeys: [],
      searchText: null,
      appName:'',
      filterMethod: null,
      pagination: { current: 1, total: 1, showTotal: this.showTotal, pageSize: 1, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, },
    }

    this._removeApi = this._removeApi.bind(this);
    this.rowSelection = this.rowSelection.bind(this);
    this._onChange = this._onChange.bind(this);
    this._clear = this._clear.bind(this);
    this._search = this._search.bind(this);
    this._addServerApis = this._addServerApis.bind(this);
    this._removeServerApis = this._removeServerApis.bind(this);
  }
  showTotal = () => {
		if (this.state.pagination) {
			const { total, current,pageSize } = this.state.pagination;
			return `共 ${total} 条记录  第 ${current}/${Math.ceil(total/pageSize)} 页 `;
		} else {
			return '';
		}
	}
  componentDidMount() {
    this._pullData( 1, 10);
  }

  //**************************************************************************** */
  //************************************EVENT*********************************** */
  //**************************************************************************** */
  _pullData( page, rows, condition) {

    this.page = page;
    this.rows = rows;

    if (condition != null) {
      condition = {};
      if (this.state.searchText != null) {
        condition.name = this.state.searchText;
      }
      // if (this.state.filterMethod != null) {
      //   condition.method = this.state.filterMethod;
      // }
    }

    getApiGrationinfo(this.props.appId, this.props.apiId, page, rows, condition)
      .then((response) => {
        let pagination = { current: response.pageIndex, showTotal: this.showTotal, total: response.total, pageSize: response.pageSize, pageSizeOptions: ['10', '20', '30', '50'], showSizeChanger: true, showQuickJumper: true, };
        this.setState({
          dataSource: response.contents,
          pagination: pagination
        })
      })
  }

  _getColumn() {

    let cols =  [{
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text, record) => {
        var tags = record.tags || [];
        return (
          <Row type={'flex'}>
            <Col><Ellipsis style={{ margingLeft: 5 }} lines={1} tooltip={true}>{text}</Ellipsis></Col>
            <Col style={{ marginLeft: 10 }}>
              {tags.map((element,index) => {
                return <Tag key={index}>{element.name}</Tag>
              })}
            </Col>
          </Row>
        )
      }
    },
    {
      title: '应用描述',
      dataIndex: 'desc',
      key: 'desc',
      render:(text)=>{
        return <Ellipsis lines={1} tooltip>{text}</Ellipsis>
      }
    }];

    if(base.allpermissions.includes('service_cancelAuthorization')){
      cols.push({
        title: '操作',
        dataIndex: 'options',
        key: 'options',
        width: '100px',
        render: (text, record) => {
          return (
            <div>
              <a onClick={()=>{this._removeServerApis(record.id)}} style={{ marginLeft: 10 }}>取消授权</a>
            </div>
          )
        }
      })
    }
    
    return cols;
  }
  getAllApps = (page,row,name)=>{
    let params = {
      page:page,
      rows:row
    }
    if(name){
      params.name = name;
    }
    queryAppAIP(params,{'AMP-ENV-ID':base.environment}).then(data=>{
      let modalData = data.contents.slice();
      modalData.forEach(element=>{
        element.key = element.id;
      }); 
      this.setState({
        modalData,
        modalPage:data.pageIndex,
        modalRow:data.pageSize,
        modalTotal:data.total,
      });
    });
  }

  _onCancel=()=>{
    this.setState({  visibleModal:false,appName:'' })

  }
  _onChange(pagination, filters, sorter) {
    this._pullData( pagination.current, pagination.pageSize);
  }

  _removeApi(apiId) {
  }

  _search() {
    this._pullData( this.page, this.rows, {})
  }

  _clear() {
    this._pullData( this.page, this.rows)
    this.setState({
      filterMethod: null,
      searchText: null
    })
  }

  //新增授权
  _addServerApis(apiIds = []) {

  }

  //移除授权
  _removeServerApis(appid) {
    removeAppServer(this.props.apiId,appid)
    .then((response)=>{
      message.success('服务取消授权成功')
      this._pullData( this.page, this.rows, {})
    })

  }

  //**************************************************************************** */
  //*************************************UI************************************* */
  //**************************************************************************** */
  rowSelection() {

    let obj = {
      selectedRowKeys: this.state.selectedRowKeys,
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        if (selected) {
          let isExist = false;
          for (let n = 0; n < this.state.selectedRowKeys.length; n++) {
            if (record.id === this.state.selectedRowKeys[n]) {
              isExist = true;
            }
          }
          if (isExist) {
            return;
          }
          let selectedRowKeys = this.state.selectedRowKeys.slice();
          selectedRowKeys.push(record.id)
          this.setState({
            selectedRowKeys: selectedRowKeys
          })
        } else {
          let rowsKeys = [];
          for (let n = 0; n < this.state.selectedRowKeys.length; n++) {
            if (record.id !== this.state.selectedRowKeys[n]) {
              rowsKeys.push(this.state.selectedRowKeys[n]);
            }
          }
          this.setState({
            selectedRowKeys: rowsKeys
          })
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        let rowKeys = [];
        if (selected) {
          rowKeys = this.state.selectedRowKeys.slice();
          for (let n = 0; n < selectedRows.length; n++) {
            let newSelected = selectedRows[n];
            for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
              if (this.state.selectedRowKeys[i] === selectedRows[n].id) {
                newSelected = null
                break;
              }
            }
            if (newSelected) {
              rowKeys.push(newSelected.id);
            }
          }
        } else {
          for (let n = 0; n < this.state.selectedRowKeys.length; n++) {
            let newSelected = null;
            for (let i = 0; i < changeRows.length; i++) {
              if (this.state.selectedRowKeys[n] === changeRows[i].id) {
                newSelected = this.state.selectedRowKeys[n];
              }
            }
            if (!newSelected) {
              rowKeys.push(this.state.selectedRowKeys[n])
            }
          }
        }

        this.setState({
          selectedRowKeys: rowKeys
        })
      }
    }
    return obj;
  }
  onSelectChange = (selectedRowKeysModal) => {
    this.setState({ selectedRowKeysModal });
  }
  handleModalOk = ()=>{
    const { selectedRowKeysModal,addRowKeys } = this.state;
    let keys = selectedRowKeysModal.filter((item)=>{
      let flag = true;
      addRowKeys.forEach(element=>{
        if(element === item){
          flag = false;
        }
      });
      return flag;
    })
    if(keys.length){
      addAppsToServer(this.props.apiId,keys.join(',')).then(data=>{
        message.success('服务授权给应用成功');
        this._pullData(1,10);
      });
    }
    //this.setState({visibleModal:false});
    this._onCancel();
  }
  render() {
    const columnsModal = [{
      title: '应用名称',
      dataIndex: 'name'  
    }, {
      title: '集群',
      dataIndex: 'clusterName',
      render:(value,record) => value ? value:'--'
    }, {
      title: '运行时间',
      dataIndex: 'createtime',
      render: (value, record) => {
        return DataFormate.periodFormate(value);
      }
    }];  
    const paginationModal = {
      total: this.state.modalTotal,
      current:this.state.modalPage,
      pageSize: this.state.modalRow,
      onChange:(current, pageSize) => {
          this.getAllApps(current, pageSize,this.state.appName);
      },
    };  
    const rowSelectionModal = {
      selectedRowKeys:this.state.selectedRowKeysModal,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: this.state.addRowKeys.filter(item => item === record.key).length > 0, // Column configuration not to be checked
      }), 
    };
    return (
      <div style={{ margin: 24 }}>
        <Card bordered={false} title={'授权'}>
          <Row>
            <Col span={10}>
              <Row type={'flex'} align='middle'>
                <Col span={4}>应用名称:</Col><Col span={18}>
                  <Input onChange={(e) => { this.setState({ searchText: e.target.value }) }} 
                    onPressEnter={() => this._search()}
                    value={this.state.searchText} placeholder="请输入" />
                  </Col>
              </Row>
            </Col>
            <Col>
              <Row type={'flex'} justify="end">
                <Col><Button type="primary" htmlType="submit" onClick={() => this._search()}>查询</Button></Col>
                <Col><Button style={{ marginLeft: 10 }} onClick={() => this._clear()}>重置</Button></Col>
              </Row>
            </Col>
          </Row>
          
          <Row type={'flex'} style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Authorized authority='service_authorization' noMatch={null}>
            <Button icon="plus" type="primary" onClick={()=>{
              let selectedRowKeysModal = [];
              this.state.dataSource.forEach(element=>{
                selectedRowKeysModal.push(element.id);
              });
              this.setState({visibleModal:true,selectedRowKeysModal,addRowKeys:selectedRowKeysModal});
              this.getAllApps(1,10);
            }}>授权</Button>
             </Authorized>
          </Row>
         
          <Alert
            style={{ marginBottom: 10 }}
            message={(
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                            <a onClick={() => { this.setState({ selectedRowKeys: [] }) }} style={{ marginLeft: 24 }}>清空</a>
              </Fragment>
            )}
            type="info"
            showIcon
          />
          <Table
            rowKey="name"
            rowSelection={this.rowSelection()}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            columns={this._getColumn()}
            onChange={this._onChange} />
          <Modal 
            title="应用授权"
            style={{top:20}}
            visible={this.state.visibleModal}
            onOk={this.handleModalOk}
            destroyOnClose={true} 
            onCancel={this._onCancel}>
            <Row style={{marginBottom:24}} type={'flex'} align='middle'>
              <Col style={{width:70}} span={4}>应用名称:</Col>
              <Col span={12}>
                <Input 
                  onChange={(e) => { this.setState({ appName: e.target.value }) }} 
                  value={this.state.appName} 
                  onPressEnter={() => this.getAllApps(1,10,this.state.appName)}
                  placeholder="请输入" />
              </Col>
              <Col span={8}>
              <span style={{float:'right'}}>
                <Button type="primary" htmlType="submit" onClick={() => this.getAllApps(1,10,this.state.appName)}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={() => { this.setState({appName:''});this.getAllApps(1,10) }}>重置</Button>
              </span>
              </Col>
            </Row>
            <Table 
              rowKey='id'
              dataSource={this.state.modalData} 
              columns={columnsModal} 
              size='small'
              pagination={paginationModal} 
              rowSelection={rowSelectionModal} />
          </Modal>
        </Card>
      </div>
    )
  }
}