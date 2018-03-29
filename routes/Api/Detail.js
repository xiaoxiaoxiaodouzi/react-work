import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Button, Row, Col, Spin, message } from 'antd';
import { Route } from 'react-router-dom';
import moment from 'moment';

const { Description } = DescriptionList;

class ApiDetail extends React.Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  //*************************************************************************** */
  //**********************************EVENT************************************ */
  //*************************************************************************** */
  onTabChange = (key) => {
    let { history } = this.props;
    let params = this.props.match.params;
    history.push({ pathname: `/apps/${params.id}/${key}` });
    this.setState({ tabActiveKey: key });
  }

  // render() {
  //   return (
     
  //   )
  // }
}

export default ApiDetail;