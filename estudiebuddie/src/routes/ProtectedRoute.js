// import { useRef } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useCreateStorage } from "../hooks/persistToStorage";
import { toast } from 'react-toastify'

const protectedroute = "ProtectedRoute:"
const publicroute = "PublicRoute:"
function ProtectedRoute({ children, requireMatch = false }) {
	const location = useLocation();
	const params = useParams();
	const { lStorage } = useCreateStorage();

	// Retrieve user info
	const currentUser = lStorage.getItem('user');
	console.log(protectedroute, "currentUser =", currentUser);
	console.log(protectedroute, "params =", params);
	console.log(protectedroute, "requireMatch =", requireMatch);
	console.log(protectedroute, "location =", location.pathname);
	console.log(protectedroute, "children =", children);
	console.log(protectedroute, "currentUser.id =", currentUser?.id);
	console.log(protectedroute, "type of currentUser.id =", typeof currentUser?.id);
	console.log(protectedroute, "params.id =", params.id)
	console.log(protectedroute, "type of params.id =", typeof params?.id)

	// Not logged in — redirect to login
	if (!currentUser) {
		console.log(protectedroute, "User not logged in, redirecting to /login");
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Masking protection — if route contains a userID param
	if (requireMatch && Object.keys(params).length > 0) {
		console.log(protectedroute, "requireMatch is true, checking userID match");
		const loggedUserId = String(currentUser.id);
		const routeUserId = String(params.id);

		if (loggedUserId !== routeUserId) {
			console.log(protectedroute, "User ID mismatch, redirecting");
			const routeKey = location?.pathname?.split?.('/')[1]
			const contribute = location?.pathname?.split?.('/')[3]
			const [_empty, dashboard, _userid, toScramble, scrambleID] = location?.pathname?.split?.('/')
			console.log({dashboard})
			// console.log({scramble})
			if (routeKey === 'scramble-questions'||routeKey === 'profile'||
				routeKey === 'dashboard') {
				if (routeKey === 'profile'&&contribute === 'contribute-questions') {
					console.log('redirecting to contribute page but with logged in user id')
					return <Navigate to={`/profile/${loggedUserId}/contribute-questions`} replace />;
				} else if (routeKey === 'dashboard') {
					if (toScramble === 'scramble-questions') {
						console.log('redirecting to scramble from dashboard page but with logged in user id')
						return <Navigate to={`/dashboard/${loggedUserId}/scramble-questions/${scrambleID}`} replace />;
					}
					console.log('redirecting to dashboard page but with logged in user id')
					return <Navigate to={`/dashboard/${loggedUserId}`} replace />;
				}
				console.log('redirecting to scramble page but with logged in user id')
				return <Navigate to={`/scramble-questions/${loggedUserId}`} replace />;
			}
			console.warn("Unauthorized access attempt: masking detected!");
			return <Navigate to="/unauthorised" replace />;
		}
	}

	// // Role-based access control (RBAC)
	// if (location?.pathname?.toLowerCase()?.includes("post-products")) {
		// console.log(protectedroute, "Checking RBAC for post-products route");
	// 	if (!currentUser?.is_seller) {
	// 		console.warn(`Unauthorized access attempt by non-seller role: ${currentUser.role}`);
	// 		return <Navigate to="/unauthorised" replace />;
	// 	}
	// }
	// if (location?.pathname?.toLowerCase()?.includes("staff-dashboard")||
	// 	location?.pathname?.toLowerCase()?.includes("notifications")) {
		// console.log(protectedroute, "Checking RBAC for notifications/staff-dashboard route");
	// 	// const allowedRoles = ["admin", "editor"];
	// 	// if (!allowedRoles.includes(currentUser.role.toLowerCase())) {
	// 	// 	console.warn(`Unauthorized access attempt by role: ${currentUser.role}`);
	// 	// 	return <Navigate to="/unauthorised" replace />;
	// 	// }
	// 	if (!currentUser?.is_staff) {
	// 		console.warn(`Unauthorized access attempt by non-staff role: ${currentUser.role}`);
	// 		return <Navigate to="/unauthorised" replace />;
	// 	}
	// }

	// Passed all checks — render the component
	console.log(protectedroute, "Access granted, rendering children");
	return <Outlet />;
}

function PublicRoute({ children }) {
	const location = useLocation()
	const pathname = location.pathname
	const { lStorage } = useCreateStorage();
	// const loginRegisterRef = useRef(true)

	// Retrieve user and location info
	const currentUser = lStorage.getItem('user');
	console.log(publicroute, "location =", location);
	console.log(publicroute, "currentUser.id =", currentUser?.id);
	console.log(publicroute, "children =", children);

	// Logged in and location is login/signup — redirect to home
	if (currentUser?.id && (pathname === "/login" || pathname === "/signup")) {
		console.log(publicroute, "User logged in and trying to access login/signup, redirecting to /");
		// if (pathname === "/login") {
		// 	toast.info('You are already logged in.')
		// } else if (pathname === "/signup") {
		// 	toast.info('You have to logout to create a new account.')
		// }
		return <Navigate to="/" replace />;
	}

	// Passed — render the component
	console.log(publicroute, "Access granted, rendering children");
	return children ? children : <Outlet />;
}

export { ProtectedRoute, PublicRoute }