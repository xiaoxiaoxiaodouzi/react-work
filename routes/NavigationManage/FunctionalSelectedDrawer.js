import React, { Fragment } from 'react';
import { Drawer, Button, Table, Input, Checkbox, Alert } from 'antd';
import { getResources } from '../../services/aip'

const Search = Input.Search;
const defaultTableAlert = '勾选功能导入到菜单。';

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
    searchValue:'',       //搜索框的值
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
    this.setState({ loading: true });
    getResources({ type: 'function' ,functionType:this.functionType}).then(data => {
      this.allDatas = data;
      this.hiddenFilterDatas = data.filter(d => {
        let nohidden = true;
        this.props.hiddenDatas.forEach(hd => {
          if (hd.id === d.id) nohidden = false;
        })
        return nohidden;
      })
      this.setState({ datas: this.state.hiddenChecked ? this.hiddenFilterDatas : this.allDatas, loading: false });
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

  _handleSearch=()=>{
    let value=this.state.searchValue;
    // eslint-disable-next-line
    let ary=this.allDatas.filter(i=>{
      if((i.name && i.name.includes(value) )|| (i.appName && i.appName.includes(value))){
        return true
      }
    });

    this.setState({datas:ary})
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
          <Search
            placeholder='功能名称/应用名称'
            value={this.state.searchValue}
            onChange={e=>{this.setState({searchValue:e.target.value})}}
            onPressEnter={this._handleSearch}
          />
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