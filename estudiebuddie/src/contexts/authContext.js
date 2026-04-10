import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useCreateStorage } from "../hooks/persistToStorage";

// 1. Create the context
export const AuthContext = createContext();

// 2. Create a provider component
export function AuthProvider({ children }) {
	const { lStorage, sStorage } = useCreateStorage()
	// const [reloadBgThemeKey, setReloadBgThemeKey] = useState(0); // trigger

	// const refreshBgTheme = () => {
	// 	console.log('refresh active')
	// 	setReloadBgThemeKey(prev => prev + 1);
	// };
	const [user, setUser] = useState(() => {
		return lStorage.getItem("user");
	});
	// const theme = user?.theme_mode
	// console.log({theme})
	const [loggedIn, setLoggedIn] = useState(false);
	console.log('AuthContext rendered');
	useEffect(() => {
		const theme = user?.theme_mode
		console.log({theme})
		console.log('changing theme')
		const shouldUseDark = theme==="dark"
		if (shouldUseDark) {
			console.log('change to dark...')
			document.documentElement.classList.add("dark-theme");
		} else {
			console.log('change to blue...')
			document.documentElement.classList.remove("dark-theme");
		}
		// document.documentElement.classList.toggle(
		// 	"dark-theme",
		// 	theme === "dark"
		// );
	}, [user])

	useEffect(() => {
		const isLoggedIn = !!user?.id
		setLoggedIn(isLoggedIn)
	}, [])
	console.log({loggedIn})

	return (
		<AuthContext.Provider value={{
			loggedIn, setLoggedIn, setUser
			}}>
			{children}
		</AuthContext.Provider>
	);
}

// 4. Create a custom hook for easy access to context
const useAuth = () => useContext(AuthContext);
export { useAuth };

