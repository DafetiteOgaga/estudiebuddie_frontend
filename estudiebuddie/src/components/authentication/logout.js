import { useCreateStorage } from "../../hooks/persistToStorage";
import { toast } from "react-toastify"
import { useAuth } from "../../hooks/authContext";
import { useNavigate, useLocation } from 'react-router-dom';

const authPages = [
	'profile',
	'scramble-questions',
	'dashboard',
]
function useLogout() {
	const navigate = useNavigate()
	const location = useLocation()?.pathname?.split('/')[1]
	// console.log({location})
	// console.log('trying to logout')
	const { setLoggedIn } = useAuth();
	const { lStorage } = useCreateStorage();

	const logout = () => {
		console.log('logging out now')
		lStorage.removeAllItems();
		setLoggedIn(false);
		console.log('logout success')
		toast.success("Logout successful");
		if (authPages.includes(location)) {
			console.log('navigating home from auth page')
			navigate('/')
		}
	};

	return logout;
}

export { useLogout };