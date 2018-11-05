import React from 'react'
import { Button } from 'antd';
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
                environments:base.environments
            })
            if (base.currentEnvironment && base.currentEnvironment.id) {
                this.setState({currentEnvironmentId:base.currentEnvironment.id});
            }
        }
   
    }
    onChange = (env) => {
        this.setState({ currentEnvironmentId: env.id });
        this.props.environmentChange(env);
    }
    render() {
        return (
            <div>
                环境：
                {this.state.environments.map((env) => {
                    return <Button key={env.id} onClick={e => { this.onChange(env) }} type={env.id === this.state.currentEnvironmentId ? 'primary' : ''} style={{ marginRight: 16 }}>{env.name}</Button>
                })}
            </div>
        )
    }
}

export default props => (
    <GlobalHeaderContext.Consumer>
      {context=><GlobalEnvironmentChange {...props} environmentChange={context.changeEnvironment} tenant={context.tenant}/>}
    </GlobalHeaderContext.Consumer>
);