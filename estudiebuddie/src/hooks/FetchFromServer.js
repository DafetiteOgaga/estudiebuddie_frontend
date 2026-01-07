import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { useCreateStorage } from './persistToStorage';
import { useAuth } from './authContext';

const originUrl = (api=false) => {
	if (api) {
		return 'https://dafetiteapiendpoint.pythonanywhere.com';
	}

	const host = window.location.hostname;
	if (host === 'localhost' || host === '127.0.0.1') {
		console.log('Running in development mode');
		// /dafetite_brevo_api_key/dafetite_brevo_api
		return 'http://127.0.0.1:8000/';
	}
	console.log('Running in production mode');
	return 'https://estudiebuddieremake.pythonanywhere.com/';
};
const serverOrigin = originUrl()

function buildFormData(formData, data, parentKey = '') {
	if (data === undefined || data === null) {
		console.log('returning null...')
		return null;
	}
	if (data instanceof FormData) {
		console.log('already a form data')
		return data
	}
	if (data &&
		typeof data === 'object' &&
		!(data instanceof File) &&
		!(data instanceof Blob)) {
		if (Array.isArray(data)) {
			data.forEach((value, index) => {
				buildFormData(formData, value, `${parentKey}[${index}]`);
			});
		} else {
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					console.log('building for', key)
					buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
				}
			}
		}
	} else {
		// For primitives or File objects
		formData.append(parentKey, data ?? '');
	}
	return formData;
}


console.log('serverOrigin:', serverOrigin);
async function FetchFromServer(endpoint, method = 'GET', body = null, keepForm=false) {
	console.log('FetchFromServer called.')
	console.log('serverOrigin:', serverOrigin);
	const refreshAccessToken = useRefreshAccessToken()
	const { lStorage, sStorage } = useCreateStorage()
	const finalUrl = `${serverOrigin}${endpoint}${endpoint.includes('?')?'':'/'}`;
	console.log('finalUrl:', finalUrl);
	const accessToken = lStorage.getItem('access_token');
	const manualHeader = {
		'Accept': 'application/json',
		// add auth or other headers here...
	};
	try {
		// const formData = buildFormData(new FormData(), body);
		let options = {
			method: method.toUpperCase(),
		};
	
		if (!body) {
			// GET REQUESTS
			options.headers = manualHeader // manually set header
		} else {
			// POST/PATCH/PUT REQUESTS
			const fd = new FormData()
			if (accessToken) {
				console.log('attatching token')
				manualHeader['Authorization'] = `Bearer ${accessToken}`;
			}
			if (keepForm) {
				console.log('JSON type')
				options.headers = {
					...manualHeader,
					'Content-Type': 'application/json',
				} // manually set header
				options.body = JSON.stringify(body); // stringify body to preserve structure
				// send as it is
			} else {
				console.log('form data type')
				// browser sets header automatically
				const formData = buildFormData(fd, body);
				options.body = formData;
				// browser will handles headers (except for tokens)...
				options.headers = {
					...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
					// other headers are handled by browser!
				};
			}
		}

		console.log({options})
	
		let response = await fetch(finalUrl, options);

		// read server response (success or fail)
		let data = null;
		// Safely attempt to parse JSON
		try {
			data = await response.json();
		} catch {
			data = null;
		}

		console.log({init_status: response.status})
		// /////////////////////////////////////
		// /////////////////////////////////////
		if (response.status === 401) {
			console.error('token expired. refreshing...')
			const newToken = await refreshAccessToken();

			console.log({newToken})
			if (!newToken) {
				console.error("Session expired. Please log in again.")
				toast.error("Session expired. Please log in again.");
				return {
					ok: false,
					status: 401,
					error: "Session expired"
				};
			}

			console.log('retrying original request with new  token')
			// Retry original request with new token
			options = {
				method: options.method,
				headers: {
					...(options.headers || {}),
					Authorization: `Bearer ${newToken}`,
				},
				body: options.body,
			};
			response = await fetch(finalUrl, options);
			try {
				data = await response.json();
			} catch {
				data = null;
			}

			console.log('refresh data:', {data})
			console.log({refresh_status: response.status})
			console.log('refresh and retry completed')
			return {
				ok: true,
				status: response.status,
				data
			};
		}
		// /////////////////////////////////////
		// /////////////////////////////////////

		if (!response.ok) {
			const errorText = data?.error ||
								data?.detail ||
								`HTTP error ${response.status}`||
								'No error response from server'
			console.error("API error:", errorText);
			toast.error(errorText)
			return {
				ok: false,
				status: response.status,
				error: errorText
			};
		}

		console.log('Success:', data);
		if (data?.access) {
			lStorage.setItem('access_token', data.access);
		}
		if (data?.refresh) {
			lStorage.setItem('refresh_token', data.refresh);
		}
		if (data?.access||data?.refresh) {
			lStorage.setItem('user', data?.user)
			data = "Success"
		}
		return {
			ok: true,
			status: response.status,
			data,
		};

	} catch (error) {
		console.error("Network / runtime error:", error);
		const networkErr = "Network error. Please check your connection."
		toast.error(networkErr)
		return {
			ok: false,
			status: 0,
			error: networkErr,
		};
	}
}

function useRefreshAccessToken() {
	const { lStorage, sStorage } = useCreateStorage()
	const refreshAccessToken = async () => {
		const refresh = lStorage.getItem('refresh_token');
		console.log('fetched local refresh token:', {refresh})
		if (!refresh) return null;

		console.log('requesting refresh from server')
		const res = await fetch(`${serverOrigin}/api/token/refresh/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh }),
		});

		const data = await res.json();
		if (!res.ok) {
			console.error(data)
			return null
		};

		console.log('got the new access token:', data.access)
		lStorage.setItem('access_token', data.access);
		console.log('replaced old access token with new one in storage')
		console.log('refresh success!')
		return data.access;
	}
	return refreshAccessToken
}

function useImageKitAPIs() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getAPIs = async () => {
		try {
			const apiURL = originUrl(true) + "/get-imagekit-apis/";
			console.log({apiURL})

			const apiResponse = await fetch(apiURL);
			const apiData = await apiResponse.json();
			if (!apiResponse.ok) {
				console.error(apiData)
				throw new Error("Network response was not ok");
			}

			setData(apiData);
		} catch (err) {
			console.error("Error fetching data:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getAPIs();
	}, []);

  	return { data, loading, error };  // return something usable
}

export { FetchFromServer, buildFormData, serverOrigin, useImageKitAPIs };
