import React from 'react';
import {Form} from 'antd';
import EditableTableContext from '../../context/EditableTableContext'

const EditableRow = ({ form, index, ...props }) => (
  <EditableTableContext.Provider value={form}>
    <tr {...props} />
  </EditableTableContext.Provider>
);

export default Form.create()(EditableRow);