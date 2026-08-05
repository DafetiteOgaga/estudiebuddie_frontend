import { FetchFromServer } from "./FetchFromServer";
import { titleCase } from "./changeCase";

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

function ItemsToggler ({togglerArray, btnItem,
	stateSetter, isMobileDev768,
	toggleStyle=null, pageName=null,
	isConsecutive,}) {
	// const isMobile = deviceInfo?.width <= 768
	return (
	<div className={`${toggleStyle?toggleStyle:''}
						${isMobileDev768?'':'align-self-end pb-05'}
						${pageName==='scramble'?'pr-1':''}`}>
		{togglerArray.map((btn, idb) => {
			return (
				<button key={`${btn}-${idb}`}
				type="button"
				onClick={()=>{
					// console.log('clicked', {btn});
					stateSetter(btn)
				}}
				disabled={isConsecutive&&idb}
				className={`cta-button btn-sm
							${togglerArray.length===1?'':(idb===0?'first':
							(idb===togglerArray.length-1)?'last':'middle')}
							${(btnItem===btn)?'active':''}
							${isMobileDev768?'px-1':''}`}>
					{titleCase(btn)}
				</button>
			)
		})}
	</div>
	)
}

function customFindLast(arr, predicate) {
	// console.log({arr_in_customFindLast_1: arr,
	// 			predicate_in_customFindLast_1: predicate
	// })
	if (!Array.isArray(arr)) return undefined;

	for (let i = arr.length - 1; i >= 0; i--) {
		if (predicate(arr[i], i, arr)) {
			return arr[i];
		}
	}
	return undefined;
}

export {
	shuffleArray,
	generateUniqueId,
	justNumbers,
	removeWhiteSpace,
	spaceToHyphen,
	getAuthorizedCodes,
	ItemsToggler,
	customFindLast,
};
