import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const headerList = [
	{ name: 'Home', path: '/' },
	{ name: 'Courses', path: 'courses' },
	{ name: 'Take a Test', path: 'take-test' },
	{ name: 'Scramble Questions', path: 'scramble-questions' },
	// { name: 'News', path: 'news' },
	{ name: 'Contact', path: 'contact' },
	{ name: 'Element', path: 'element' },
	{ name: 'Single Course', path: 'single-course' },
]
function Header() {
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);
	const location = useLocation().pathname.split('/')[1];
	console.log({
		// location
	})
	return (
		<header
		// className="header-section"
		>
			{/* <div className="container"> */}
				<div className="row align-items-center">
					<div className="col-lg-3 col-md-3">
						<div className="site-logo">
							<h2 className='text-white text-bold'>
								<span className='estudie'>eStudie</span>
								<span className='buddie'>Buddie</span>
							</h2>
							{/* <img src={require('../../assets/img/logo.png')} alt=""/> */}
						</div>
						<div className="nav-switch"
						onClick={() => setShowMenu(!showMenu)}>
							<i className={`fa ${showMenu?'fa-close':'fa-bars'}`}></i>
						</div>
					</div>
					<div className="col-lg-9 col-md-9">
						<Link to="login" className="site-btn header-btn"
						>Login</Link>
						<nav className={`main-menu ${showMenu?'show-menu':''}`}>
							<ul>
								{headerList.map((header, hIdx) => {
									const isActive = (location === '' && header.path === '/') || (location === header.path);
									console.log({
										isActive,
										location,
										headerPath: header.path
									})
									return (
										<li key={hIdx}><Link to={header.path} className={`${isActive?'active':''}`}>{header.name}</Link></li>
									)
								})}
								{/* <li><Link to="/">Home</Link></li>
								<li><Link to="courses">Courses</Link></li>
								<li><Link to="news">News</Link></li>
								<li><Link to="contact">Contact</Link></li> */}
							</ul>
						</nav>
					</div>
				</div>
			{/* </div> */}
		</header>
	)
}
export { Header };
