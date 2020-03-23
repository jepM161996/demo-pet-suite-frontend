import { apiRequest } from './api'
import storage from 'store'
import { Redirect } from 'react-router-dom'

const actions = {
  login : async (store, user, history) => {

		const res = await apiRequest('POST', 'login', user)
		console.log(res)
		if(res.status){
			storage.set('isLogin', true)
			storage.set('user', res.user)
			storage.set('token', res.token)
			if(res.user.role === 'manager'){
				store.setState({ user: res.user, token: res.token, isLogin: true, loginLoaded: true } )
				history.push('/')
			}
			else if(res.user.role === 'employee') {
				store.setState({  user: res.user, token: res.token, isLogin: true, loginLoaded: true })
				history.push('/')
			}
			else {
				store.setState({  user: res.user, token: res.token, isLogin: true, loginLoaded: true })
				history.push('/')
			}
			return true
		}
		else {
			console.log(res)
			await store.setState({ notificationError: res.message, notificationsLoaded: false})
			return false
		}
		// console.log(res)
	},

	getLogin: async(store) => {
		await store.setState({user: storage.get('user'), token: storage.get('token'), isLogin: storage.get('isLogin'),
		routeLinks: storage.get('routeLinks'), loginLoaded: true })
	},
	
	logout: async(store, props) => {
		const res = await apiRequest('GET', 'logout')
		if(res.status) {
			storage.clearAll()
			storage.set('isLogin', false)
			store.setState({ user: [], token: '', isLogin: false })
			// props.history.push('/login')

			return true
		}
		else {
			console.log('error', res)
			return false
		}
	},

	register: async (store, user, props ) => {
		const res = await apiRequest('POST', 'register', user)
		if(res.status) {
			// props.history.push('/')
		}
		console.log(res)
		// await store.setState({ validationError: res.err })
	},

	getUsers: async(store) => {
		const res = await apiRequest('GET', 'users')
		if(res.status) {
			if(res.users.length !== 0){
				store.setState({ users: res.users, isLoading: false, usersLoaded: true })
			}
		}
		else {
			console.log('error: ', res)
		}
	},

	createUser: async(store, user) => {
		const res = await apiRequest('POST', 'users', user)
		if(res.status){
			console.log(res);
			await store.actions.getUsers();
			await store.setState({isLoading: false, success: res.message, error: '', warning: ''})
			return true;
		}
		console.log('error: ', res);
		await store.setState({ isLoading: false, error: res.message, success: '', warning: '' })
		return false;
	},

	deleteUser: async(store, id) => {
		const res = await apiRequest('DELETE', 'users', id)
		if(res.status) {
			await store.actions.getUsers()
		}
		console.log(res)
	},

	getPets: async(store) => {
		const res = await apiRequest('GET', 'pets')
		if(res.status) {
			if(res.pets.length !==0) {
				await store.setState({ pets: res.pets, isLoading: false, petsLoaded: true })
			}
		}
		else {
			await store.setState({ isLoading: false, error: res.message })
			console.log('error: ', res)
		}
	},

	getBookings: async(store) => {
		const res = await apiRequest('GET', 'bookings')
		if(res.status) {
			if(res.bookings.length !==0) {
				await store.setState({ bookings: res.bookings, isLoading: false, bookingsLoaded: true })
			}	
		}
		else {
			console.log('error: ', res)
		}
	},

	getUserPets: async(store, id) => {
		console.log(id)
		const res = await apiRequest('GET', `user-pets/${id}`)
		if(res.status){
			await store.setState({ userPets: res.pets, userPetsLoaded: true })
		}
		else {
			console.log(res)
		}
	},

	booking: async(store, data) => {
		const res = await apiRequest('POST', 'bookings', data)
		console.log(res)
	},

	notificationDefault: store => {
		store.setState({ notificationError: '', notificationsLoaded: true })
	},

	toggleSidebar: store => {
		store.setState({isToggle: !store.state.isToggle})
	},

  getUser : async store => {
    const res = await apiRequest('GET', 'users')
    store.setState({ users: res.users, isLoading: false, usersLoaded: true })
  }
}

export default actions