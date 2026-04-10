import { createContext, useContext, useEffect, useState } from "react";
import { useCreateStorage } from "../hooks/persistToStorage";

const LogoContext = createContext();

export function LogoProvider({ children }) {
	const [logo, setLogo] = useState(null);
	const [reloadKey, setReloadKey] = useState(0); // trigger

	const refreshLogo = () => {
		setReloadKey(prev => prev + 1);
	};

	useEffect(() => {
		let isMounted = true;

		const loadLogo = async () => {
			const data = await GetOrFetchLogo();

			if (isMounted) {
				setLogo(data);
			}
		};

		loadLogo();

		return () => {
		  isMounted = false; // cleanup
		};
	}, [reloadKey]);

	return (
		<LogoContext.Provider value={{ logo, refreshLogo }}>
		{children}
		</LogoContext.Provider>
	);
}
export function useLogo() {
	return useContext(LogoContext);
}

// Fetch logo ONLY if not already in localStorage
async function GetOrFetchLogo() {
	const { lStorage } = useCreateStorage()
	const loggedInUser = lStorage.getItem("user")
	// 0. check if user is logged in and has a school
	if (!loggedInUser||!loggedInUser?.school) {
		return null
	}
	const STORAGE_KEY = "school_logo";

	// 1. Check if already stored
	const cached = lStorage.getItem(STORAGE_KEY);
	if (cached) {
		console.log("Loaded logo from localStorage");
		// return cached
		const blob = base64ToBlob(cached);
		const file = blobToFile(blob, "school-logo.png");

		return file;
	}

	// console.warn({url: loggedInUser?.school?.school_logo_url,
	// 	urlTrue: !loggedInUser?.school?.school_logo_url
	// })
	if (!loggedInUser?.school?.school_logo_url) {
		console.warn('school logo yet to be uploaded by school')
		return null
	}
	console.log("🌐 Fetching logo from ImageKit...");

	// 2. Fetch image
	const res = await fetch(
		`${loggedInUser.school.school_logo_url}?tr=f-png`
	);

	const blob = await res.blob();

	const Base64Version = await blobToBase64(blob)

	// 3. Save to localStorage
	lStorage.setItem(STORAGE_KEY, Base64Version);
	const file = blobToFile(blob, "school-logo.png");

	return file;
}


// Helper: Blob → Base64
async function blobToBase64(blob) {
	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});

}

function base64ToBlob(base64) {
	const [header, data] = base64.split(",");
	const mime = header.match(/:(.*?);/)[1];

	const byteCharacters = atob(data);
	const byteNumbers = new Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const byteArray = new Uint8Array(byteNumbers);

	return new Blob([byteArray], { type: mime });
}
function blobToFile(blob, filename = "logo.png") {
	return new File([blob], filename, { type: blob.type });
}