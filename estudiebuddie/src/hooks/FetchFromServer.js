import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { useCreateStorage } from './persistToStorage';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const originUrl = (api=false, dev=false) => {
	if (api) {
		return 'https://dafetiteapiendpoint.pythonanywhere.com';
	}

	const host = window.location.hostname;
	if (host === 'localhost' || host === '127.0.0.1') {
		console.log('Running in development mode');
		if (dev) {
			return dev
		}
		// /dafetite_brevo_api_key/dafetite_brevo_api
		return 'http://127.0.0.1:8000/';
	}
	console.log('Running in production mode');
	return 'https://estudiebuddie-backend.fly.dev/'; // fly.io
	// return 'https://estudiebuddieremake.pythonanywhere.com/'; // pythonanywhere
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
async function FetchFromServer(endpoint, method = 'GET', body = null, keepForm=false, logoutUser=null) {
	// const navigate = useNavigate()
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
	
		if (accessToken) {
			console.log('attatching token')
			manualHeader['Authorization'] = `Bearer ${accessToken}`;
		}
		if (!body) {
			// GET REQUESTS
			options.headers = manualHeader // manually set header
		} else {
			// POST/PATCH/PUT REQUESTS
			const fd = new FormData()
			// if (accessToken) {
			// 	console.log('attatching token')
			// 	manualHeader['Authorization'] = `Bearer ${accessToken}`;
			// }
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
			console.log({response})
			const contentType = response.headers.get("content-type");
			const isFile = contentType && contentType.includes("application/zip");
			console.log({isFile})
			if (response.ok && isFile) {
				// trigger file download
				const filename = await downloadFile(response)

				return {
					ok: true,
					status: response.status,
					data: { downloaded: true, filename }
				};
			}
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
				console.log('clearing auth data')
				// lStorage.removeItem('access_token')
				// lStorage.removeItem('refresh_token')
				// lStorage.removeItem('user')
				if (typeof(logoutUser) === "function") {
					logoutUser()
				} else {
					toast.error("Oopsy! can't logout")
				}
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
			console.log('❎ completed after refresh ❎')
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
		if (data?.update_user_must_change_password) {
			console.log('granting user access')
			const currentUser = lStorage.getItem("user")
			if (currentUser) {
				currentUser.must_change_password = data.must_change_password
				currentUser.username = data.username
				lStorage.setItem("user", currentUser)
			}
			// lStorage.setItem('access_token', data.access);
		}
		if (data?.access) {
			console.log('setting access to storage')
			lStorage.setItem('access_token', data.access);
		}
		if (data?.refresh) {
			console.log('setting refresh to storage')
			lStorage.setItem('refresh_token', data.refresh);
		}
		if (data?.access||data?.refresh) {
			console.log('setting user to storage')
			lStorage.setItem('user', data?.user)
			data = {
				must_change_password: data?.user?.must_change_password,
				id: data?.user?.id,
			}
		}
		console.log('✅ completed with normal process ✅')
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
		const res = await fetch(`${serverOrigin}api/token/refresh/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh }),
		});

		const data = await res.json();
		if (!res.ok) {
			console.error(data)
			if (data?.code==="token_not_valid"||
				data?.detail?.toUpperCase()==="Token is expired".toUpperCase()) {
				lStorage.logout()
				window.location.href = "/"
			}
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

async function downloadFile (response) {
	console.log("📦 file response detected");

	const blob = await response.blob();

	const contentDisposition = response.headers.get("Content-Disposition");
	let filename = "download.zip";


	if (contentDisposition) {
		const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^;"']+)/);
		if (match?.[1]) {
			filename = decodeURIComponent(match[1].replace(/"/g, ""));
		}
	}
	// trigger download
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.URL.revokeObjectURL(url);
	return filename
}

export { FetchFromServer, buildFormData, serverOrigin, useImageKitAPIs };
