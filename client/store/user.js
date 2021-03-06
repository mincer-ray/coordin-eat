import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ME = 'GET_ME'
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const SET_ONE_FAV = 'SET_ONE_FAV'
const UPDATE_FAVS = 'UPDATE_FAVS'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getMe = myself => ({type: GET_ME, myself})
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
export const setOneFav = favArray => ({type: SET_ONE_FAV, favoriteFood: favArray})
const updatFavsAction = () => ({type: UPDATE_FAVS})

/**
 * THUNK CREATORS
 */
export const me = () =>
	dispatch =>
		axios.get('/auth/me')
			.then(res => {
				dispatch(getMe(res.data || defaultUser))
				if (res.data.name === 'not logged in'){
					history.push('/login')
				}
			})
			.catch(err => console.log(err))

export const auth = (email, password, name, method) =>
	dispatch =>
		axios.post(`/auth/${method}`, { email, password, name })
			.then(res => {
				dispatch(getUser(res.data))
				history.push('/home')
			})
			.catch(error =>
				dispatch(getUser({error})))

export const logout = () =>
	dispatch =>
		axios.post('/auth/logout')
			.then(res => {
				dispatch(removeUser())
				history.push('/login')
			})
			.catch(err => console.log(err))

export const postFriend = (friendId) =>
	dispatch =>
		axios.post(`api/friends/${friendId}`) 
			.then(() => dispatch(me()))
			.catch(err => console.log(err))

export const updateFavs = (user, userId) =>
	dispatch =>
		axios.put(`api/users/${userId}`, user) 
			.then(() => {
				dispatch(updatFavsAction())
				history.push('/profile')
			})
			.catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
	switch (action.type) {
	case GET_ME:
		return action.myself
	case GET_USER:
		return action.user
	case REMOVE_USER:
		return defaultUser
	case SET_ONE_FAV:
		return Object.assign({}, state, {favoriteFood: action.favoriteFood})
	case UPDATE_FAVS:
		//No change to state, just saving changes to DB
		return state
	default:
		return state
	}
}
