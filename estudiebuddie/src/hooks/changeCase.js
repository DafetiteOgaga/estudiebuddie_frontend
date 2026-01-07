

function titleCase(str) {
	if (typeof str!=='string'||str==='') return

	const slash = str.includes('/')
	// Insert space before all caps (handles camel and pascal cases)
	str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	return str
		.toLowerCase()
		.split(/[\s_/]+/) // split by space OR underscore
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(slash?'/':' ');
}

// for currency values
function digitSeparator(num) {
	if (!num) return num
	// if (typeof num!=='number') return
	// return num.toLocaleString()
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// for phone numbers
function formatPhoneNumber(num) {
	if (!num) return num;

	const raw = String(num).trim();

	// Preserve +
	const hasPlus = raw.startsWith('+');

	const digits = raw.replace(/\D/g, '');

	// International numbers (+...)
	if (hasPlus) {
		return (
			'+' +
			digits.replace(/(\d{3})(?=\d)/g, '$1 ')
		).trim();
	}

	// Local numbers starting with 0 and length 11
	if (digits.startsWith('0') && digits.length === 11) {
		return digits.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
	}

	// Fallback (group every 3)
	return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
}

// const ignoreArr = [
// 	'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor',
// 	'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'
// ]
function sentenceCase(str) {
	if (typeof str !== 'string' || str.trim() === '') return '';

	// Replace underscores and hyphens with spaces, then lowercase everything
	str = str.replace(/[_-]/g, ' ').toLowerCase().trim();

	// Capitalize the first letter at the start or after a period, exclamation, or question mark
	return str.replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
}

export { digitSeparator, titleCase, formatPhoneNumber, sentenceCase };
