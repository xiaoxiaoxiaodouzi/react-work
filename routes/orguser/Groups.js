import React from 'react';
import { Groups} from 'c2-orguser';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import { base } from '../../services/base';

class groups extends React.Component{

    render(){
        
        return (
            <div style={{ margin: '-24px -24px 0' }}>
               <PageHeaderBreadcrumb breadcrumbList={[{name:'机构用户'},{name:'用户分组'}]} action={<GlobalEnvironmentChange/>}/>

            <div style={{ margin:24 }}>
                <Groups ampEnvId={base.environment} permissions={base.isAdmin?null:base.allpermissions}/>
            </div>
            
           </div >
        )
    }
}
export default groups;

