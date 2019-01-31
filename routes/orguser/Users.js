import React from 'react';
import {Users} from 'c2-orguser';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
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
      
        return (
            <div style={{ margin: '-24px -24px 0' }}>
             <PageHeaderBreadcrumb breadcrumbList={[{name:'机构用户'},{name:'用户列表'}]} action={<GlobalEnvironmentChange/>}/>
            <div  style={{ margin:24 }}>
                <Users ampEnvId={base.environment}
                categoryid={this.state.category}
                value={this.state.value} iforgusers={false}
                permissions={base.isAdmin?null:base.allpermissions}
                />
            </div>
            
           </div >
        )
    }
}
export default users;

