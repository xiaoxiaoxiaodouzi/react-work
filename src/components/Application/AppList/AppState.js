import React from 'react'
import { Row, Col, Card } from 'antd';
import './AppState.less'

export default class AppState extends React.Component {
    onStatusChange = (status)=>{
        this.props.onStatusChange(status);
    }
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
                        <div style={{cursor:'pointer'}} onClick={()=>this.onStatusChange('succeeded')} ><Info title="运行中" value={this.props.normal} bordered /></div>
                    </Col>
                    <Col sm={8} xs={24}>
                        <div style={{cursor:'pointer'}} onClick={()=>this.onStatusChange('exception')} ><Info title="异常" value={this.props.warm} bordered /></div>
                    </Col>
                    <Col sm={8} xs={24}>
                        <div style={{cursor:'pointer'}} onClick={()=>this.onStatusChange('failed')} ><Info title="失败" value={this.props.abnormal} /></div>
                    </Col>
                </Row>
            </Card>
            </div>
        )
    }
}