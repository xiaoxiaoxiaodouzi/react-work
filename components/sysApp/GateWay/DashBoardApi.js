import React,{PureComponent} from 'react';
import {Card,Radio,DatePicker} from 'antd';
import { base } from '../../../services/base'
import constants from "../../../services/constants";

const {RangePicker} = DatePicker;

export default class DashBoardApi extends PureComponent{

    state={
        timeStr:'1'
    }

    //时间按钮组改变事件
    timeChange = (e)=>{
        this.setState({timeStr:e.target.value});
    }

    //时间范围选择改变事件
    onChange = (value)=>{
        if(value.length===0){//清空时间范围时重置按钮组
            this.setState({timeStr:'1'}); 
        }else{
            this.setState({timeStr:''}); 
        }
    }

    render(){
        const title = <div style={{float:'right'}}>
            <Radio.Group value={this.state.timeStr} buttonStyle="solid" onChange={this.timeChange}>
              <Radio.Button value="1">1小时</Radio.Button>
              <Radio.Button value="2">2小时</Radio.Button>
              <Radio.Button value="3">3小时</Radio.Button>
              <Radio.Button value="24">一天</Radio.Button>
              <Radio.Button value="48">两天</Radio.Button>
            </Radio.Group>
            <RangePicker onChange={this.onChange} style={{marginLeft:10}}/>
          </div>;

        return (
            <div style={{margin:24}}>
                <Card title={title} style={{border:0,}}>
                    <iframe title='Grafana' style={{border:0,height:833,width:'100%'}} src={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.apiOverview+`&var-env=cep`}/>
                </Card>
            </div>
        )
    }
} 