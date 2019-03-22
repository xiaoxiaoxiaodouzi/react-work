import React, { Fragment } from 'react';
import { Drawer, Button, Table, Input, Checkbox, Alert, Select } from 'antd';
import { getResources } from '../../services/aip'
import _ from 'lodash';

const defaultTableAlert = '勾选功能导入到菜单。';
const Option = Select.Option;
const getTableAlert = (ids) => {
  const baseAlert = <Fragment>已选中 <a style={{ fontWeight: 600 }}>{ids.length}</a> 个功能。</Fragment>;
  return ids.length > 0 ? baseAlert : defaultTableAlert;
}
export default class FunctionalSelectedDrawer extends React.PureComponent {
  state = {
    datas: [],
    selectedRowKeys: [],//初始选中数据
    loading: false,
    hiddenChecked: true,
    allFunChecked: false,
    tableAlert: defaultTableAlert,
    searchValue: '',       //搜索框的值
    apps: [],
    app: '',     //查询应用ID 
    funcName: '',
  }
  selectedRows = [];
  allDatas = [];
  hiddenFilterDatas = [];
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.functionType = nextProps.functionType;
      this.loadData();
      const selectedRowKeys = nextProps.selectedDatas.map(f => f.id);
      this.setState({ selectedRowKeys, tableAlert: getTableAlert(selectedRowKeys) });
    }
    if (nextProps.visible && nextProps.selectedDatas !== this.props.selectedDatas) {
      const selectedRowKeys = nextProps.selectedDatas.map(f => f.id);
      this.setState({ selectedRowKeys, tableAlert: getTableAlert(selectedRowKeys) });
    }
  }
  loadData = () => {
    this.setState({ loading: true, app: undefined, funcName: undefined, });
    getResources({ type: 'function', functionType: this.functionType }).then(data => {
      let apps = [];
      this.allDatas = data;
      this.hiddenFilterDatas = data.filter(d => {
        let nohidden = true;
        this.props.hiddenDatas.forEach(hd => {
          if (hd.id === d.id) nohidden = false;
        })
        return nohidden;
      })
      data.forEach(i => {
        if (apps.filter(t => t.value === i.appId).length === 0) {
          apps.push({ label: i.appName, value: i.appId })
        }
      })
      this.setState({ datas: this.state.hiddenChecked ? this.hiddenFilterDatas : this.allDatas, loading: false, apps });
    });
  }
  hiddenDataChange = (e) => {
    const checked = e.target.checked;
    this.setState({ hiddenChecked: checked, datas: checked ? this.hiddenFilterDatas : this.allDatas });
  }

  /* handleSearch = (selectedKeys, confirm, type) => () => {
    confirm();
    if (type === 'funtional') this.setState({ funtionalSearch: selectedKeys[0] });
    else this.setState({ appSearch: selectedKeys[0] });
  } */
  submit = () => {
    this.props.onOk(this.state.selectedRowKeys, this.selectedRows);
  }

  _handleSearch = (
    _.debounce(function (params) {
      let funcName = params.funcName || null;
      let app = params.app || null;
      // eslint-disable-next-line
      let datas = this.state.hiddenChecked ? this.hiddenFilterDatas : this.allDatas;
      let ary = datas.filter(i => {
        if ((funcName === null || i.name.includes(funcName)) && (app === null || i.appId === app)) {
          return true
        }else return false;
      });
      this.setState({ datas: ary })
    }, 500)
  )
  onChange = (e) => {
    this.setState({ funcName: e.target.value });
    let app = this.state.app;
    let params = Object.assign({ funcName: e.target.value }, { app: app });
    this._handleSearch(params);
  }

  selectChange = (e) => {
    this.setState({ app: e })
    let funcName = this.state.funcName;
    let params = Object.assign({ app: e }, { funcName: funcName });
    this._handleSearch(params);
  }
  render() {
    const columns = [{
      title: '功能名称',
      dataIndex: 'name',
      // render: (text) => {
      //   const { searchValue } = this.state;
      //   return searchValue ? (
      //     <span>
      //       {text.split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i')).map((fragment, i) => (
      //         fragment.toLowerCase() === searchValue.toLowerCase()
      //           ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
      //       ))}
      //     </span>
      //   ) : text;
      // }
    }, {
      title: '所属应用',
      dataIndex: 'appName',
      // render: (text) => {
      //   const { searchValue } = this.state;
      //   return searchValue ? (
      //     <span>
      //       {text.split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i')).map((fragment, i) => (
      //         fragment.toLowerCase() === searchValue.toLowerCase()
      //           ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
      //       ))}
      //     </span>
      //   ) : text;
      // }
    }];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
        this.setState({ tableAlert: getTableAlert(selectedRowKeys), selectedRowKeys });
      }
    };
    let alertMessage = <Fragment>{this.state.tableAlert}<Checkbox style={{ float: 'right' }} checked={this.state.hiddenChecked} onChange={this.hiddenDataChange}>隐藏已经设置为菜单的功能</Checkbox></Fragment>;
    return (
      <Drawer
        title={this.props.title}
        width={480}
        placement="right"
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        mask={true}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Alert message={alertMessage} type="info" showIcon style={{ marginBottom: 10 }} />
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          {/*  <Search
            placeholder='功能名称/应用名称'
            value={this.state.searchValue}
            onChange={e => { this.setState({ searchValue: e.target.value }) }}
            onPressEnter={this._handleSearch}
          /> */}
          <Input placeholder='请输入功能名称' onChange={this.onChange} style={{ width: '64%' }} value={this.state.funcName}></Input>

          <Select
            showSearch
            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
            onChange={this.selectChange}
            style={{ width: '35%', float: 'right' }}
            placeholder='选择应用'
            allowClear
            value={this.state.app}
          >
            {this.state.apps.map(o => {
              return <Option key={o.value} value={o.value}>{o.label}</Option>
            })}
          </Select>
        </div>
        <Table rowKey='id' columns={columns} size='middle' loading={this.state.loading} rowSelection={rowSelection} dataSource={this.state.datas} pagination={false}></Table>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button style={{ marginRight: 8, }} onClick={this.props.onClose}>取消</Button>
          <Button onClick={this.submit} type="primary">添加到导航</Button>
        </div>
      </Drawer>
    )
  }
}