import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class WrapComponent  extends Component {
	static propTypes = {
		prop: PropTypes.object,
		AuthComponent:PropTypes.objec,
	}

	render() {
		return (
			<div>
				{this.props.AuthComponent()}
			</div>
		)
	}
}
