import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout} from '../store'
import Navbar from './Navbar'



const Main = (props) => {
	const {children, handleClick, isLoggedIn} = props

	console.log("main renders")

	return (
		<div>
			<div className='backgroundAccentColor'>
				<Navbar isLoggedIn={isLoggedIn} handleClick={handleClick}/>
			</div>
			<hr className='noMargin hrColor'/>

			<div className='backgroundAccentColorLight fontAccentColor contentDiv'>
				{children}
			</div>



		</div>
	)
}

/**
 * CONTAINER
 */
const mapState = (state) => {
	return {
		isLoggedIn: !!state.user.id
	}
}

const mapDispatch = (dispatch) => {
	return {
		handleClick () {
			dispatch(logout())
		}
	}
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
	children: PropTypes.object,
	handleClick: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired
}
