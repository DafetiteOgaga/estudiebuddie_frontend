import { Link, useLocation } from "react-router-dom";
import { AppLogo } from "./appLogo";

const headerMenu = [
	{
		name: 'Home',
		link: ''
	},
	{
		name: 'About',
		link: 'about'
	},
	{
		name: 'Services',
		link: 'services'
	},
	{
		name: 'Contact',
		link: 'contact'
	},
	{
		name: 'Scramble Questions',
		link: 'scramble-questions'
	}
]
function Header({isSticky, scrollY}) {
	const location = useLocation().pathname.split('/')[1];
	// console.log({isSticky, scrollY});
	return (
		<header className={`header ${isSticky?'sticky':''}`}>
			<div className={`container ${isSticky?'sticky':''}`}>
				<nav className={`glass ${isSticky?'sticky':''}`}>
					<div className="logo"
					// onClick={()=>showPage('home')}
					>
						<div className="logo-icon">
							<AppLogo />
						</div>
						<span>eStudieBuddie</span>
					</div>
					<div className="nav-links">
						{headerMenu.map((header, hIdx) => {
							return (
								<Link
									key={hIdx}
									to={header.link}
									className={header.link === location ? 'active' : ''}
								>
									{header.name}
								</Link>
							)
						})}
					</div>
				</nav>
			</div>
		</header>
	)
}
export { Header };