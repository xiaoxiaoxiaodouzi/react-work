import React from 'react';
import { Orgs} from 'c2-orguser';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import { base } from '../../services/base';

class orgs extends React.Component{

    render(){
        console.log(base.allpermissions);
        return (
            <div style={{ margin: '-24px -24px 0' }}>
            <PageHeaderBreadcrumb breadcrumbList={[{name:'机构用户'},{name:'机构列表'}]} action={<GlobalEnvironmentChange/>}/>
            <div style={{ margin:24 }}>
                <Orgs ampEnvId={base.environment} permissions={base.isAdmin?null:base.allpermissions}/>
            </div>
            
           </div >
        )
    }
}
export default orgs;

