import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EStudieBuddieLogo } from "./appLogo";
import { useLogout } from "../authentication/logout";
import { useCreateStorage } from "../../hooks/persistToStorage";
import { useAuth } from "../../contexts/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDevice } from "../../contexts/deviceTypeContext";
import { serverOrigin } from "../../hooks/FetchFromServer";
import { normalizeStringLength } from "./profile";
import { titleCase } from "../../hooks/changeCase";

const moveByIndex = (arr, fromIndex, toIndex) => {
	const copy = [...arr];                // do not mutate original
	const [item] = copy.splice(fromIndex, 1);
	copy.splice(toIndex, 0, item);
	return copy;
}

function Header({isSticky, scrollY, isOver2000Width}) {
	const logoutFunc = useLogout()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { loggedIn, setLoggedIn } = useAuth()
	const { lStorage, sStorage } = useCreateStorage()
	const userInfo = lStorage.getItem('user') || {}
	// const deviceInfo = useDeviceInfo()
	const { label, width, isMobileDev900 } = useDevice();
	// const isMobileDev900 = deviceInfo.width<=900
	const isDev = serverOrigin === 'http://127.0.0.1:8000/'
	// console.log({isDev, serverOrigin})
	let {
		about,
		email,
		fileId,
		image_url,
		avatar_code,
		first_name,
		last_name,
		is_staff,
		is_super_admin,
		role,
		contributor,
		gender,
		mobile_no,
		school,
		username,
		id,
		points,
	} = userInfo

	const headerMenu = [];
	// Login / Logout
	if (loggedIn) {
		headerMenu.push({ name: 'Logout', link: logoutFunc });
	} else {
		headerMenu.push({ name: 'Login', link: 'login' });
	}
	if (loggedIn&&(is_super_admin||school?.name)) {
		headerMenu.push({ name: 'Dashboard', link: `dashboard/${userInfo?.id}` });
	}
	// Always available
	headerMenu.push({ name: 'Quiz', link: 'quiz' });
	// Profile (only when logged in)
	if (loggedIn) {
		headerMenu.push({ name: 'Profile', link: `profile/${userInfo?.id}` });
	}
	// Teacher-specific options
	if (loggedIn && role?.toLowerCase() !== 'student') {
		headerMenu.push({ name: 'Scramble', link: `scramble-questions/${userInfo?.id}` });
	}
	// Always available
	headerMenu.push({ name: 'Leaderboard', link: 'leaderboard' });

	// // for development only
	// headerMenu.push({ name: 'D', link: 'development' });

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
	// const hideHeader = location === "complete-registration"
	// console.log({location})
	// console.log({userInfo, headerMenu, isOver2000Width, isSticky, scrollY})
	let mobileHeaderMenu = moveByIndex(headerMenu, 0, 3)
	// console.log({firstMHM: mobileHeaderMenu})
	mobileHeaderMenu = moveByIndex(mobileHeaderMenu, 4, 3).filter(item=>item)
	// console.log({secondMHM: mobileHeaderMenu})
	return (
		<header className={`header ${isSticky?'sticky':''}`}>
			<div className={`${isOver2000Width?'max-w-auto':'container'} ${isSticky?'sticky':''}`}>
				<nav className={`glass ${isSticky?'sticky':''}`}>
					<div className="logo"
					onClick={(e)=>navigate('/')}
					>
						<div className="logo-icon">
							<EStudieBuddieLogo />
						</div>
						<div className="d-flex flex-column">
							<AppName />
							{isDev? <span className='device-width'> {width}</span>: null}
						</div>
					</div>
					<div className="nav-links is-desktop">
						{headerMenu.map((header, hIdx) => {
							// console.log({link: header?.link})
							let linkArr
							if (typeof(header?.link) === "function") {
								linkArr = ["logout"]
							} else {
								linkArr = header?.link?.split?.('/')
							}
							// console.log({linkArr})
							return (
								<Link
									key={hIdx}
									onClick={(e)=>{
										if (typeof(header?.link)==='function') {
											e.preventDefault()
											header?.link()
										}
									}}
									to={typeof(header?.link)==='string'?header?.link:'#'}
									className={linkArr.includes(location) ? 'active' : ''}
								>
									{header?.name}
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
							<Link to={`profile/${userInfo?.id}`}
							className={`avatar-container ${['profile'].includes(location) ? 'active' : ''}`}
							onClick={() => setIsMenuOpen(false)}>
								{image_url ?
									<img
									className="bar-avatar"
									src={image_url}
									alt={first_name} />
									:
									<div className="bar-avatar m-0">{avatar_code?avatar_code:<FontAwesomeIcon icon="user" color="white" />}</div>
								}
								<p className="p-05 white-space-pre">
									{id ? titleCase(normalizeStringLength(username||first_name, isMobileDev900)) : 'Anon'}
								</p>

							</Link>
							:
							<span className="not-logged-in"></span>}
						{mobileHeaderMenu.map((header, hIdx) => {
							// console.log({header})
							if (header?.name.toLowerCase()==='profile') return null
							// console.log({link: header?.link})
							let linkArr
							if (typeof(header?.link) === "function") {
								linkArr = ["logout"]
							} else {
								linkArr = header?.link?.split?.('/')
							}

							const marginMap = {
								4: '10vh',
								5: '15vh',
							};
							// console.log({hIdx})x
							return (
								<Link
									key={hIdx}
									style={{
										marginTop: marginMap[hIdx] ?? undefined,
									}}
									onClick={(e)=>{
										if (typeof(header?.link)==='function') {
											e.preventDefault()
											header?.link()
										}
										setIsMenuOpen(false)
									}}
									to={typeof(header?.link)==='string'?header?.link:'#'}
									className={`font-bold ${linkArr?.includes(location) ? 'active' : ''}`}
								>
									{header?.name}
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
			<span className={`${color2?color2:'font-gold1'} text-nowrap`}>
				<span className="skew-b">B</span>
				<span className=''>uddie</span>
			</span>
		</span>
	)
}
export { Header, AppName };