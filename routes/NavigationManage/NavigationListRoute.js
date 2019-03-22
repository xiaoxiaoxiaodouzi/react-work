import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import NavigationList from './NavigationList'


export default class componentName extends Component {
	static propTypes = {
		prop: PropTypes
	}

	render() {
		return (
			<Card bordered={false}>
				<NavigationList />
			</Card>
		)
	}
}
