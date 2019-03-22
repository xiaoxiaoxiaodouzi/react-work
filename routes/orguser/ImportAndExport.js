import React from 'react';
import {ImportAndExport as Imports} from 'c2-orguser';
import { base } from '../../services/base';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';

class ImportAndExport extends React.Component{
  
    render(){
      
        return (
            <div style={{ margin: '-24px -24px 0' }}>
                <PageHeaderBreadcrumb breadcrumbList={[{name:'机构用户'},{name:'导入导出'}]} action={<GlobalEnvironmentChange/>}/>
                <div >
                    <Imports ampEnvId={base.environment} history={this.props.history} permissions={base.isAdmin?null:base.allpermissions}/>
                </div>
            </div >

        )
    }
}
export default ImportAndExport;

