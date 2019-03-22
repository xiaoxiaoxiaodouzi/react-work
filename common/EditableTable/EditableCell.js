import React from 'react'
import { InputNumber, Input, Form, Checkbox, Select } from 'antd'
import EditableTableContext from '../../context/EditableTableContext'
import styled from 'styled-components';

const FormItem = Form.Item;
const Option = Select.Option

const FormItemStyle = styled(FormItem)`
.ant-form-explain {
  position: absolute;
  font-size: 12px;
  margin-top: -4px;
}
`

class EditableCell extends React.Component {
  getInput = (col, record, form) => {
    const editorOptions = col.editorOptions;
    if (col.dataType === 'number') {
      return <InputNumber {...editorOptions.attribute} />;
    } else if (col.dataType === 'checkboxGroup') {
      return <Checkbox.Group options={editorOptions.options} {...editorOptions.attribute} onChange={this.checkBoxChange}></Checkbox.Group>
    } else if (col.dataType === 'select') {
      const attribute = Object.assign({ style: { width: '100%' } }, editorOptions.attribute)
      return <Select  {...attribute}>
        {col.editorOptions && col.editorOptions.options.map((o, i) => {
          return <Option key={i} value={o.value}>{o.label}</Option>
        })}
      </Select>
    } else {
      return <Input {...editorOptions.attribute} />;
    }
  };

  render() {
    let {
      editing,
      col,
      record,
      index,
      ...restProps
    } = this.props;
    if (editing && !col.editorOptions) {
      col = {
        ...col,
        editorOptions: {}
      }
    }
    return (
      <EditableTableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          if (editing) {
            if (col.dataType === "checkboxGroup") {
              if (!Array.isArray(record[col.dataIndex])) {
                record[col.dataIndex] = [record[col.dataIndex]]
              }
            }
          }
          return (
            <td {...restProps}>
              {editing ? (
                <FormItemStyle
                  style={{ margin: 0 }}>
                  {getFieldDecorator(col.dataIndex, {
                    rules: [{
                      required: col.editorOptions.required,
                      message: col.editorOptions.message
                    }],
                    initialValue: record[col.dataIndex]
                  })(this.getInput(col, record, form))}
                </FormItemStyle>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableTableContext.Consumer>
    );
  }
}

export default EditableCell;