import React from 'react'
import fundebug from 'fundebug-javascript';
import App from '../App';
/**
 * 应用监控 https://www.fundebug.com 进控制台查看应用错误监控
 */

// import fundebug  from 'fundebug-javascript';
// fundebug.apikey = "dec8303eb46592dfecf73f24c081b7b67d76bd2e09b158587113bbf7747aa83d";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    // 将component中的报错发送到Fundebug
    fundebug.notifyError(error, {
      metaData: {
        info: info
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
      // Note: 也可以在出错的component处展示出错信息，返回自定义的结果。
    }
    return this.props.children;
  }
}

const boundaryApp = function(){
  return <ErrorBoundary><App/></ErrorBoundary>;
}
export default boundaryApp;

