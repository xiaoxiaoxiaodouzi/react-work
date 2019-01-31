import React from 'react'
import {InputNumber,Input,Form,Checkbox} from 'antd'
import EditableTableContext from '../../context/EditableTableContext'

const FormItem = Form.Item;
class EditableCell extends React.Component {
  getInput = (col,record,form) => {
    if (col.dataType === 'number') {
      return <InputNumber />;
    }else if(col.dataType === 'checkboxGroup'){
      const editorOptions = col.editorOptions;
      return <Checkbox.Group options={editorOptions.options}></Checkbox.Group>
    }else{
      return <Input />;
    }
  };

  render() {
    const {
      editing,
      col,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableTableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(col.dataIndex, {
                    rules: [{
                      required: col.editorOptions.required,
                      message: col.editorOptions.message,
                    }],
                    initialValue: record[col.dataIndex],
                  })(this.getInput(col,record,form))}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableTableContext.Consumer>
    );
  }
}

export default EditableCell;