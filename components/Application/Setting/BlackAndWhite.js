import React,{PureComponent} from 'react';
import {Card} from 'antd';
import Blacks from './Blacks';
import Whites from './Whites';

class BlackAndWhite extends PureComponent{
   state={
       key:'black'
   }
    render(){
        const tabList = [{
            key: 'black',
            tab: '黑名单',
          }, {
            key: 'white',
            tab: '白名单',
          }];
          const contentList = {
            black: <Blacks appId={this.props.appId}/>,
            white: <Whites appId={this.props.appId}/>
          };
        return (
            <Card
            style={{margin:24,border:0}}
            tabList={tabList}
            activeTabKey={this.state.key}
            onTabChange={(key)=>{this.setState({key:key})}}
            >
                {contentList[this.state.key]}
            </Card>
        )
        
    }
}
export default BlackAndWhite;