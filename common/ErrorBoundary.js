import React from 'react';
import Exception from 'ant-design-pro/lib/Exception';

/**
 *异常组件处理类，处理可能出错的组件。
 *
 * @class ErrorBoundary
 * @extends {React.Component}
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <Exception type="500" title="Oops..." desc="页面渲染出错了，赶紧向管理员报告！" backText='返回首页'/>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;