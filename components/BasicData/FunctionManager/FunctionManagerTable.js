import React from 'react'
import { Select, Button, Input, Col, Card, Row, Table,Form } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class FunctionManagerTable extends React.PureComponent {

  state ={
      search:{},
      apps:[]
  }
  componentDidMount(){
    
  }
  componentWillUpdate(nextProps){
      
  }
  render() {
    // const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    return (
      <Card bordered={false} style={{ margin: '24px 24px 0' }} >
        <Form layout="inline">
            <Row gutter={24}>
                <Col md={6} sm={24}>
                    <FormItem label="功能名称">
                        <Input style={{ width: '100%' }}
                            onChange={this.nameChange} 
                            value={this.state.search.name} />
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="应用名称">
                        <Select placeholder="请选择" style={{ width: '100%' }}
                            value={this.state.search.app}
                            onChange={this.selectChange} >
                            {
                                this.state.apps.map((value, index) => {
                                    return (
                                        <Option key={index} value={value.id}>{value.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <Button type="primary" htmlType="submit" onClick={this.props.handlesearch}>查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.props.restfields}>重置</Button>
                </Col>
            </Row>
            </Form>
        <Table></Table>
      </Card>
    );
  }
}

const FunctionManagerTableFrom = Form.create()(FunctionManagerTable);
export default FunctionManagerTableFrom;