import { FetchFromServer } from "./FetchFromServer";

function shuffleArray(array) {
	return array
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
}

const removeWhiteSpace = (str = '') => {
	return str.replace(/\s+/g, '');
};

const justNumbers = (str) => {
	if (!str) return '';
	return str.trim().replace(/\D+/g, '');
};

const spaceToHyphen = (str) => {
	if (!str) return '';
	return str.replace(/\s+/g, '-');
};

const generateUniqueId = () => crypto.randomUUID();

const getAuthorizedCodes = async (school_code='school_code') => {
	// const queryString = new URLSearchParams({ code_type: 'school_code' }).toString();
	const endpoint = `user/school-code/${school_code}`
	const schCode = await FetchFromServer(endpoint)
	console.log({schCode})
	if (!schCode || !schCode.ok) {
		return null
	}
	return schCode?.data?.esb_code
}

export {
	shuffleArray,
	generateUniqueId,
	justNumbers,
	removeWhiteSpace,
	spaceToHyphen,
	getAuthorizedCodes
};
