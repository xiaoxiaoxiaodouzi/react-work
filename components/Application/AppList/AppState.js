import React from 'react'
import { Row, Col, Card, Spin } from 'antd';
import './AppState.less';
import constants from '../../../services/constants';

export default class AppState extends React.Component {
    onStatusChange = (status) => {
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
                    {this.props.loading ? <div style={{textAlign:'center',height:58}}><Spin /></div>   : 
                    <Row>
                        <Col sm={8} xs={24}>
                            <div style={{ cursor: 'pointer' }} onClick={() => this.onStatusChange('succeeded')} ><Info title={<font color={constants.WARN_COLOR.normal}>运行中</font>} value={<font color="#50cb9d">{this.props.normal}</font>} bordered /></div>
                        </Col>
                        <Col sm={8} xs={24}>
                            <div style={{ cursor: 'pointer' }} onClick={() => this.onStatusChange('exception')} ><Info title={<font color={constants.WARN_COLOR.warn}>异常</font>}  value={<font color="#f6b002">{this.props.warm}</font>} bordered /></div>
                        </Col>
                        <Col sm={8} xs={24}>
                            <div style={{ cursor: 'pointer' }} onClick={() => this.onStatusChange('failed')} ><Info title={<font color={constants.WARN_COLOR.error}>失败</font>}  value={<font color="#ff4431">{this.props.abnormal}</font>} /></div>
                        </Col>
                    </Row>}
                </Card>
            </div>
        )
    }
}