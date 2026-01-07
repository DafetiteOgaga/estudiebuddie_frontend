

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
	return str.replace(/\D+/g, '');
};

const generateUniqueId = () => crypto.randomUUID();

export {
	shuffleArray,
	generateUniqueId,
	justNumbers,
	removeWhiteSpace
};
