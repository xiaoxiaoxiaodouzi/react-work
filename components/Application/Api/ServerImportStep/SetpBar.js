import React from 'react';
import { Col, Row, Button } from 'antd';

export default class SetpBar extends React.Component {

    render() {
        return (
            <Row type="flex" justify={'end'} style={this.props.style || {}}>
                {this.props.onPreviousStep == null ? null : <Col><Button onClick={() => { this.props.onPreviousStep() }} type="primary">上一步</Button></Col>}
                {this.props.onNextStep == null ? null : <Col><Button onClick={() => { this.props.onNextStep() }} type="primary" style={{marginLeft:25}}>下一步</Button></Col>}
                {this.props.importStep == null ? null : <Col><Button onClick={() => { this.props.importStep() }} loading={this.props.importLoading} type="primary" style={{marginLeft:25}}>导入</Button></Col>}
                {this.props.complete == null ? null : <Col><Button onClick={() => { this.props.complete() }} type="primary" style={{marginLeft:25}}>关闭</Button></Col>}
            </Row>
        )
    }
}