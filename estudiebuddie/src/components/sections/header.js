import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppLogo } from "./appLogo";
import { useLogout } from "../authentication/logout";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { useAuth } from "../../hooks/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getGender } from "./profile";

const moveByIndex = (arr, fromIndex, toIndex) => {
	const copy = [...arr];                // do not mutate original
	const [item] = copy.splice(fromIndex, 1);
	copy.splice(toIndex, 0, item);
	return copy;
}

function Header({isSticky, scrollY}) {
	const logoutFunc = useLogout()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { loggedIn, setLoggedIn } = useAuth()
	const { lStorage, sStorage } = useCreateStorage()
	// const userData = lStorage.getItem('user')
	// const { role, contributor, points } = userData||{}
	// console.log({loggedIn, userData, role, contributor})
	// console.log({scrollY, isSticky})
	const userData = lStorage.getItem('user') || {}
	let {
		about,
		email,
		fileId,
		image_url,
		avatar_code,
		first_name,
		last_name,
		is_staff,
		is_superuser,
		role,
		contributor,
		gender,
		mobile_no,
		username,
		id,
		points,
	} = userData
	const [avatar] = useState(() => getGender());

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
		headerMenu.push({ name: 'Profile', link: `profile/${userData?.id}` });
	}
	// Teacher-specific options
	if (loggedIn && role?.toLowerCase() === 'teacher') {
		headerMenu.push({ name: 'Scramble', link: `scramble-questions/${userData?.id}` });
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

	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add('menu-open');
		} else {
			document.body.classList.remove('menu-open');
		}
	
		return () => document.body.classList.remove('menu-open');
	}, [isMenuOpen]);
	const navigate = useNavigate()
	const location = useLocation().pathname.split('/')[1];
	// console.log({location, username})
	// console.log({
	// 	location,
	// 	split: ['profile'],
	// 	includes: ['profile'].includes(location)
	// })
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
						<AppName />
					</div>
					<div className="nav-links is-desktop">
						{headerMenu.map((header, hIdx) => {
							// console.log({link: header?.link})
							let linkArr
							if (typeof(header.link) === "function") {
								linkArr = ["logout"]
							} else {
								linkArr = header?.link?.split?.('/')
							}
							// console.log({linkArr})
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
									className={linkArr.includes(location) ? 'active' : ''}
								>
									{header.name}
								</Link>
							)
						})}
						<p className={`align-self-center ${role?.toLowerCase()==='student'?'':'d-none'}`}>🏆 {points}</p>
					</div>
					<span className="menu-icon is-mobile"
					onClick={(e)=>setIsMenuOpen(prev=>!prev)}>
						<FontAwesomeIcon
							icon={isMenuOpen?"times":"bars"}
							className=""
						/>
					</span>
				</nav>
				<div className="is-mobile">
					{isMenuOpen && <div
						className={`open menu-overlay`}
						onClick={() => setIsMenuOpen(false)}
					/>}
					<div className={`nav-links ${isMenuOpen?'open':''}`}>
						{loggedIn ?
							<Link to={`profile/${userData?.id}`}
							className={`avatar-container ${['profile'].includes(location) ? 'active' : ''}`}
							onClick={() => setIsMenuOpen(false)}>
								{image_url ?
									<img
									className="bar-avatar"
									src={image_url}
									alt={first_name} />
									:
									<div className="bar-avatar m-0">{avatar_code?avatar_code:avatar}</div>
								}
								<p className="p-05 white-space-pre">
									{id ? username||first_name : 'Anon'}
								</p>

							</Link>
							:
							<span className="not-logged-in"></span>}
						{moveByIndex(headerMenu, 0, 3).map((header, hIdx) => {
							if (header.name.toLowerCase()==='profile') return null
							// console.log({link: header?.link})
							let linkArr
							if (typeof(header.link) === "function") {
								linkArr = ["logout"]
							} else {
								linkArr = header?.link?.split?.('/')
							}

							const marginMap = {
								3: '15vh',
								4: '15vh',
							};
							// console.log({hIdx})
							return (
								<Link
									key={hIdx}
									style={{
										marginTop: marginMap[hIdx] ?? undefined,
									}}
									onClick={(e)=>{
										if (typeof(header.link)==='function') {
											e.preventDefault()
											header.link()
										}
										setIsMenuOpen(false)
									}}
									to={typeof(header.link)==='string'?header.link:'#'}
									className={`font-bold ${linkArr.includes(location) ? 'active' : ''}`}
								>
									{header.name}
								</Link>
							)
						})}
						<p className={`align-self-center ${role?.toLowerCase()==='student'?'':'d-none'}`}>🏆 {points}</p>
					</div>
				</div>
			</div>
		</header>
	)
}

function AppName({paragragh=false, color1=null, color2=null}) {
	return (
		<span
		className={paragragh?'':'logo-text'}>
			<span className="font-gold skew-e">e</span>
			<span className={`font-${color1?color1:'light-white'}`}>Studie</span>
			<span className={color2?color2:'font-gold1'}><span className="skew-b">B</span>uddie</span>
		</span>
	)
}
export { Header, AppName };