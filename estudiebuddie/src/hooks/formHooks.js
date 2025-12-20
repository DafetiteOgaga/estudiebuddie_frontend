

function shuffleArray(array) {
	return array
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
}

function generateUniqueId() {
	// Get date & time down to seconds
	const now = new Date();
	const timestamp = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
	// Generate 6–8 random alphanumeric characters
	const randomPart = Math.random().toString(36).substring(2, 10);
	return `${timestamp}${randomPart}`;
}

export { shuffleArray, generateUniqueId };
