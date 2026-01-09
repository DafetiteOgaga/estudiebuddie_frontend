import { useCreateStorage } from "../../hooks/persistToStorage";
import { toast } from "react-toastify"
import { useAuth } from "../../hooks/authContext";

function useLogout() {
	// console.log('trying to logout')
	const { setLoggedIn } = useAuth();
	const { lStorage } = useCreateStorage();

	const logout = () => {
		console.log('logging out now')
		lStorage.logout();
		setLoggedIn(false);
		console.log('logout success')
		toast.success("Logout successful");
	};

	return logout;
}

export { useLogout };