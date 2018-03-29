import React from 'react'
import { Row, Col, Card } from 'antd';
import './AppState.less'

export default class AppState extends React.Component {
    render() {
        const Info = ({ title, value, bordered }) => (
            <div className='headerInfo'>
              <span>{title}</span>
              <p>{value}</p>
              {bordered && <em />}
            </div>
          );
        return (
            <div className='standardList'>
            <Card bordered={false} style={{ margin: 24 }}>
                <Row>
                    <Col sm={8} xs={24}>
                        <Info title="正常应用" value={this.props.normal} bordered />
                    </Col>
                    <Col sm={8} xs={24}>
                        <Info title="告警应用" value={this.props.warm} bordered />
                    </Col>
                    <Col sm={8} xs={24}>
                        <Info title="异常应用" value={this.props.abnormal} bordered />
                    </Col>
                </Row>
            </Card>
            </div>
        )
    }
}