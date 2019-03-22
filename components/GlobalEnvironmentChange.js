import React from 'react'
import { Button, message } from 'antd';
import { base } from '../services/base';

import { GlobalHeaderContext } from '../context/GlobalHeaderContext'


class GlobalEnvironmentChange extends React.Component {
    state = {
        environments: []
    }
    constructor() {
        super();
        this.state.environments = base.environments;
        if (base.currentEnvironment && base.currentEnvironment.id) {
            this.state.currentEnvironmentId = base.currentEnvironment.id;
        }
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.tenant!==this.props.tenant){
            this.setState({
                environments:base.environments,
                currentEnvironmentId:base.currentEnvironment?base.currentEnvironment.id:null
            })
        }
    }
    onChange = (env) => {
        this.setState({ currentEnvironmentId: env.id });
        message.success('切换到环境：' + env.name);
        this.props.environmentChange(env);
    }
    render() {
        return (
            <div>
                
                {this.state.environments.length===0?
                <span style={{color:'red'}}>当前租户没有所属环境！</span>
                :<span>环境：
                    {
                        this.state.environments.map((env) => {
                            return <Button key={env.id} onClick={e => { this.onChange(env) }} type={env.id === this.state.currentEnvironmentId ? 'primary' : ''} style={{ marginRight: 16 }}>{env.name}</Button>
                        })
                    }

                </span>}
            </div>
        )
    }
}

export default props => (
    <GlobalHeaderContext.Consumer>
      {context=><GlobalEnvironmentChange {...props} environmentChange={context.changeEnvironment} tenant={context.tenant}/>}
    </GlobalHeaderContext.Consumer>
);