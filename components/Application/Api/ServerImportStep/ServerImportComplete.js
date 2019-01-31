import React from 'react';
import { Row, Col} from 'antd';
import SetpBar from './SetpBar';

export default class ServerImportComplete extends React.Component {

    state={
        display:false
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.display !== this.props.display){
            this.setState({display:nextProps.display})
        }
    }
    
    //**************************************************************************** */
    //*************************************UI************************************* */
    //**************************************************************************** */

    render() {
        if (!this.state.display) {
            return null;
        }
        return (
            <Col>
                <Col span={18} offset={3} style={{ paddingTop: 30 }}>
                    <Row type={'flex'} align="middle" style={{ marginBottom: 20 }}>
                        <Col span={4}>已更新服务数:</Col>
                        <Col span={15}>{this.props.data?this.props.data.updateNum:0}</Col>
                    </Row>
                    <Row type={'flex'} align="middle" style={{ marginBottom: 20 }}>
                        <Col span={4}>已导入服务数:</Col>
                        <Col span={15}>{this.props.data?this.props.data.importNum:0}</Col>
                    </Row>
                    
                </Col>
                <Col span={24}>
                    <SetpBar complete={this.props.onNextSetp} style={{ marginTop: 20 }} />
                </Col>
            </Col>

        )
    }
}