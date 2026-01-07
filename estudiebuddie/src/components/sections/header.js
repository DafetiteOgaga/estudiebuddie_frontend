import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppLogo } from "./appLogo";
import { useLogout } from "../authentication/logout";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { useAuth } from "../../hooks/authContext";

function Header({isSticky, scrollY}) {
	const logoutFunc = useLogout()
	const { loggedIn, setLoggedIn } = useAuth()
	const { lStorage, sStorage } = useCreateStorage()
	const userData = lStorage.getItem('user')
	const { role, contributor, points } = userData||{}
	console.log({loggedIn, userData, role, contributor})

	const headerMenu = [];
	// Login / Logout
	if (loggedIn) {
		headerMenu.push({ name: 'Logout', link: logoutFunc });
	} else {
		headerMenu.push({ name: 'Login', link: 'login' });
	}
	// Always available
	headerMenu.push({ name: 'Quiz', link: 'quiz' });
	// Profile (only when logged in)
	if (loggedIn) {
		headerMenu.push({ name: 'Profile', link: 'profile' });
	}
	// Teacher-specific options
	if (loggedIn && role?.toLowerCase() === 'teacher') {
		headerMenu.push({ name: 'Scramble', link: 'scramble-questions' });
		// Contributor option for teachers
		// if (contributor) {
		// 	headerMenu.push({ name: 'Contribute', link: 'contribute-questions' });
		// }
	}
	// Always available
	headerMenu.push({ name: 'Leaderboard', link: 'leaderboard' });
	// headerMenu.push({ name: 'About', link: 'about' });
	// headerMenu.push({ name: 'Services', link: 'services' });
	// headerMenu.push({ name: 'Contact', link: 'contact' });

	// // temporary
	// headerMenu.push({ name: 'Logout', link: logoutFunc });
	// headerMenu.push({ name: 'Login', link: 'login' });
	// headerMenu.push({ name: 'Quiz', link: 'quiz' });
	// headerMenu.push({ name: 'Profile', link: 'profile' });
	// headerMenu.push({ name: 'Scramble', link: 'scramble-questions' });
	// headerMenu.push({ name: 'Contribute', link: 'contribute-questions' });
	// headerMenu.push({ name: 'Leaderboard', link: 'leaderboard' });

	const navigate = useNavigate()
	const location = useLocation().pathname.split('/')[1];
	// console.log({isSticky, scrollY});
	return (
		<header className={`header ${isSticky?'sticky':''}`}>
			<div className={`container ${isSticky?'sticky':''}`}>
				<nav className={`glass ${isSticky?'sticky':''}`}>
					<div className="logo"
					onClick={(e)=>navigate('/')}
					>
						<div className="logo-icon">
							<AppLogo />
						</div>
						{/* <span>eStudieBuddie</span> */}
					</div>
					<div className="nav-links">
						{headerMenu.map((header, hIdx) => {
							return (
								<Link
									key={hIdx}
									onClick={(e)=>{
										if (typeof(header.link)==='function') {
											e.preventDefault()
											header.link()
										}
									}}
									to={typeof(header.link)==='string'?header.link:'#'}
									className={header.link === location ? 'active' : ''}
								>
									{header.name}
								</Link>
							)
						})}
						<p className={`align-self-center ${role?.toLowerCase()==='student'?'':'d-none'}`}>🏆 {points}</p>
					</div>
				</nav>
			</div>
		</header>
	)
}
export { Header };