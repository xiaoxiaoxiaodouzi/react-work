import React from 'react';
import {Users} from 'c2-orguser';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Breadcrumb,Divider} from 'antd';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import { base } from '../../services/base';
import './Orgs.css'

class users extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
          category: this.props.location.state !== undefined ? this.props.location.state.category : '',
          value: this.props.location.state !== undefined ? this.props.location.state : null,
        }
      }
    render(){
        let breadcrumbList =<Breadcrumb style={{marginTop:6}}>

        <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/>基础数据 </Breadcrumb.Item>
        <Breadcrumb.Item> 用户列表</Breadcrumb.Item>
      </Breadcrumb>;
        return (
            <div style={{ margin: '-24px -24px 0' }}>
            <PageHeader title={breadcrumbList}  action={<GlobalEnvironmentChange/>}/>
            <div  style={{ margin:24 }}>
                <Users ampEnvId={base.currentEnvironment.id}
                categoryid={this.state.category}
                value={this.state.value} iforgusers={false}
                permissions={base.allpermissions}
                />
            </div>
            
           </div >
        )
    }
}
export default users;

