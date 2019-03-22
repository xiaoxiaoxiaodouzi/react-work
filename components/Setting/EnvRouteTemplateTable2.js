import React, { PureComponent, Fragment } from 'react';
import { Table, Popconfirm, Divider, Checkbox, message, Button } from 'antd';
import EditableFormRow from '../../common/EditableTable/EditableRow'
import EditableCell from '../../common/EditableTable/EditableCell'
import EditableTableContext from '../../context/EditableTableContext';
import { addRouteTempate, deleteRouteTempate, updateRouteTempate } from '../../services/amp'
import EditableTable from '../../common/EditableTable/EditableTable';

const protocolOptions = [
  { label: 'http', value: 'http' },
  { label: 'https', value: 'https' },
];
export default class EnvRouteTemplateTable2 extends PureComponent {
  constructor(props) {
    super(props);
    const protocolOptions = [
      { label: 'http', value: 'http' },
      { label: 'https', value: 'https' },
    ];

    this.datas = [
      { id: 1, name: '1', protocol: "http", host: '123' },
      { id: 2, name: '2', protocol: "http", host: '123' },
      { id: 3, name: '3', protocol: "http", host: '123' },
      { id: 4, name: '4', protocol: "http", host: '123' },
    ]

    this.state = { data: this.datas, editingKey: '' };
    this.columns = [
      {
        title: '路由类型名称',
        dataIndex: 'name',
        width: '30%',
        dataType: 'input',
        editorOptions: { required: true, message: `请输入路由模板名称!` },
        editable: true,
      },
      {
        title: '协议支持',
        dataIndex: 'protocol',
        width: 150,
        dataType: 'checkboxGroup',
        editorOptions: { required: true, options: protocolOptions, message: `必须选中一个协议!` },
        editable: true,
        render: (text, record) => {
          let options = protocolOptions.map(o => {
            let option = {};
            return Object.assign(option, o, { disabled: true });
          });
          let value = [];
          if (record.http) value.push('http');
          if (record.https) value.push('https');
          return <Checkbox.Group options={options} value={value}></Checkbox.Group>
        }
      },
      {
        title: '域名模板',
        dataIndex: 'host',
        dataType: 'input',
        editorOptions: { required: true, message: `请输入域名模板!`, },
        editable: true,
      }
      /* , {
        title: '操作',
        dataIndex: 'actions',
        width: 100,
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableTableContext.Consumer>
                    {form => (
                      <a onClick={() => this.saveRecord(form, record)}>保存</a>
                    )}
                  </EditableTableContext.Consumer>
                  <Divider type="vertical" />
                  <a onClick={() => this.cancel(record)}>取消</a>
                </span>
              ) : (
                  <span>
                    <a onClick={() => this.edit(record.id)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                      title="确认删除?"
                      onConfirm={() => this.routeTemplateDeleteRow(record.id)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                )}
            </div>
          );
        },
      } */
    ];
  }

  /* componentDidUpdate(props, state) {
    if (props.data !== this.props.data) {
      this.setState({ data: this.props.data })
    }
  } */

  isEditing = record => record.id === this.state.editingKey;

  cancel = (record) => {
    if (record.newRow) {
      this.state.data.pop();
      this.setState({ data: this.state.data, editingKey: '' });
    } else {
      this.setState({ editingKey: '' });
    }
  };

  saveRecord = (form, record) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      } else {
        row.http = row.protocol.includes('http');
        row.https = row.protocol.includes('https');
        Object.assign(record, row);
        let savePromise;
        if (record.newRow) {//新增保存
          delete record.id;
          savePromise = addRouteTempate(record);
        } else savePromise = updateRouteTempate(record.id, record);
        savePromise.then(data => {
          Object.assign(record, data);
          message.success('操作成功！');
          this.setState({ data: this.state.data, editingKey: '' });
        })
      }
    });
  }

  edit = (key) => {
    this.setState({ editingKey: key });
  }

  addRouteTemplateRow = e => {
    const newId = Math.random();
    this.state.data.push({ id: newId, http: true, environmentId: this.props.environmentId, newRow: true });
    this.setState({ editingKey: newId, data: this.state.data });
  }
  routeTemplateDeleteRow = id => {
    deleteRouteTempate(id).then(() => {
      message.success('操作成功！');
      const data = this.state.data.filter(d => d.id !== id);
      this.setState({ data });
    })
  }

  recordSave = (type, values) => {
    if (type === 'save') {
      let ary = [];
      this.state.data.forEach(i => {
        if (i.id === values.id) {
          i = values;
          i.name = '123123123'
        }
        ary.push(i)
      })
      this.setState({ data: ary })
    }
  }



  render() {
    // const tableTitle = (data)=>(<span>路由模板 <Button icon='plus' size='small' type="dashed" title='新增模版' onClick={this.addRouteTemplateRow}></Button></span>);

    return (
      <Fragment>
        <EditableTable data={this.datas} columns={this.columns} editCol editingKey={this.state.editingKey} recordSave={this.recordSave} addNewRow />
      </Fragment>

    );
  }
}
