import React, { PureComponent,Fragment } from 'react';
import {Table,Popconfirm,Divider,Checkbox, message, Button } from 'antd';
import EditableFormRow from '../../common/EditableTable/EditableRow'
import EditableCell from '../../common/EditableTable/EditableCell'
import EditableTableContext from '../../context/EditableTableContext';
import {addRouteTempate,deleteRouteTempate,updateRouteTempate} from '../../services/amp'

const protocolOptions = [
  { label: 'http', value: 'http'},
  { label: 'https', value: 'https'},
];
export default class EnvRouteTemplateTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { data:props.data, editingKey: '' };
    this.columns = [
      {
        title: '路由类型名称',
        dataIndex: 'name',
        width:'30%',
        dataType:'input',
        editorOptions:{required:true,message:`请输入路由模板名称!`},
        editable: true,
      },
      {
        title: '协议支持',
        dataIndex: 'protocol',
        width: 150,
        dataType:'checkboxGroup',
        editorOptions:{required:true,options:protocolOptions,message:`必须选中一个协议!`},
        editable: true,
        render:(text,record)=>{
          let options = protocolOptions.map(o=>{
            let option = {};
            return Object.assign(option,o,{disabled:true});
          });
          let value = [];
          if(record.http)value.push('http');
          if(record.https)value.push('https');
          return <Checkbox.Group options={options} value={value}></Checkbox.Group>
        }
      },
      {
        title: '域名模板',
        dataIndex: 'host',
        dataType:'input',
        editorOptions:{required:true,message:`请输入域名模板!`},
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width:100,
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
      },
    ];
  }

  isEditing = record => record.id === this.state.editingKey;

  cancel = (record) => {
    if(record.newRow){
      this.state.data.pop();
      this.setState({data:this.state.data,editingKey: ''});
    }else{
      this.setState({ editingKey: '' });
    }
  };

  saveRecord = (form, record)=>{
    form.validateFields((error, row) => {
      if (error) {
        return;
      }else{
        row.http = row.protocol.includes('http');
        row.https = row.protocol.includes('https');
        Object.assign(record,row);
        let savePromise;
        if(record.newRow){//新增保存
          delete record.id;
          savePromise = addRouteTempate(record);
        }else savePromise = updateRouteTempate(record.id,record);
        savePromise.then(data=>{
          Object.assign(record,data);
          message.success('操作成功！');
          this.setState({data:this.state.data,editingKey:''});
        })
      }
    });
  }

  edit = (key)=>{
    this.setState({ editingKey: key });
  }

  addRouteTemplateRow = e=>{
    const newId = Math.random();
    this.state.data.push({id:newId,http:true,environmentId:this.props.environmentId,newRow:true});
    this.setState({ editingKey: newId,data :this.state.data });
  }
  routeTemplateDeleteRow = id=>{
    deleteRouteTempate(id).then(()=>{
      message.success('操作成功！');
      const data = this.state.data.filter(d=>d.id !== id);
      this.setState({data});
    })
  }

  render() {
    // const tableTitle = (data)=>(<span>路由模板 <Button icon='plus' size='small' type="dashed" title='新增模版' onClick={this.addRouteTemplateRow}></Button></span>);

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          if(col.dataIndex === 'protocol'){
            record.protocol = [];
            if(record.http)record.protocol.push('http');
            if(record.https)record.protocol.push('https');
          }
          return {
            record,
            col,
            editing: this.isEditing(record),
          }
        },
      };
    });

    return (
      <Fragment>
      <Table
        components={components}
        dataSource={this.state.data}
        columns={columns}
        size='middle'
        rowKey='id'
        pagination={false}
      />
      <Button type="dashed" icon="plus" style={{width:'100%',margin:'12px 0 24px'}} onClick={this.addRouteTemplateRow}>添加新的路由类型</Button>
      </Fragment>
      
    );
  }
}
