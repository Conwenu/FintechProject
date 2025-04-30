import axios from 'axios'
import { Platform } from 'react-native'


export const ADDRESS = 'localhost:8000'

const api = axios.create({
	baseURL: 'http://' + ADDRESS,
	headers: {
		'Content-Type': 'application/json'
	}
})

export default api


// api endpoint for initial setting page
export const saveCurrencySettings = (data) => {
	return api.post('/api/settings/currency');
};

export const saveBudgetSettings = (data) => {
	return api.post('/api/settings/budget');
};