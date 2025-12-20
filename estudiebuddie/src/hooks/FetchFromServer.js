
const serverOrigin = process.env.REACT_APP_API_BASE_URL;
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
async function FetchFromServer(endpoint, method = 'GET', body = null) {
	console.log('FetchFromServer called')
	console.log('serverOrigin:', serverOrigin);
	const finalUrl = `${serverOrigin}${endpoint}/`;
	console.log('finalUrl:', finalUrl);
	try {
		// const formData = buildFormData(new FormData(), body);
		let options = {
			method: method.toUpperCase(),
		};
	
		if (!body) {
			options.headers = {
				'Accept': 'application/json',
				// add auth or other headers here...
			};
		} else {
			const formData = buildFormData(new FormData(), body);
			options.body = formData;
			// browser will handles headers..
		}
	
		const response = await fetch(finalUrl, options);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log('Success:', data);
		return data;

	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

export { FetchFromServer, buildFormData, serverOrigin };
