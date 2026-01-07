import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useCreateStorage } from "./persistToStorage";

// 1. Create the context
export const AuthContext = createContext();

// 2. Create a provider component
export function AuthProvider({ children }) {
	const { lStorage, sStorage } = useCreateStorage()
	const [loggedIn, setLoggedIn] = useState(false);
	console.log('AuthContext rendered');
	useEffect(() => {
		const isLoggedIn = !!lStorage.getItem('user')?.id
		setLoggedIn(isLoggedIn)
	}, [])
	console.log({loggedIn})

	return (
		<AuthContext.Provider value={{
			loggedIn, setLoggedIn
			}}>
			{children}
		</AuthContext.Provider>
	);
}

// 4. Create a custom hook for easy access to context
const useAuth = () => useContext(AuthContext);
export { useAuth };

