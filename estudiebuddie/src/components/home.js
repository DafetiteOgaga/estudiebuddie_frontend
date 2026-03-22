import { Link } from 'react-router-dom';
import { AppName } from './sections/header';
import { useAuth } from '../hooks/authContext';
import { useDeviceInfo } from '../hooks/deviceType';

const homeCards = [
	{
		icon: '📚',
		heading: 'Interactive Quizzes',
		para: 'Take engaging quizzes across different topics to test understanding and strengthen knowledge.',
	},
	{
		icon: '⏱️',
		heading: 'Timed Challenges',
		para: 'Quizzes are time-based to improve focus, speed, and exam readiness under real conditions.',
	},
	{
		icon: '📈',
		heading: 'Progress Tracking',
		para: 'Track scores, improvements, and learning growth over time in one place.',
	},
	{
		icon: '🎯',
		heading: 'Performance Insights',
		para: 'Detailed results help students understand strengths, weaknesses, and areas to improve.',
	},
	{
		icon: '🏆',
		heading: 'Learning Motivation',
		para: 'Achievements and consistent practice to encourage you stay motivated and aim higher.',
	},
	{
		icon: '🔐',
		heading: 'Secure Student Accounts',
		para: 'Your progress, quiz history, and results are safely stored and protected.',
	},
]
function Home() {
	const { loggedIn } = useAuth()
	const deviceInfo = useDeviceInfo()
	// console.log({loggedIn})
	// const { showPage } = useOutletContext();
	return (
		<>
			{/* <div id="home" className="page active">
				<div className="container"> */}
					<>
						<section className="hero glass">
							<div className="hero-image">
								<img src={require("../assets/images/eStudieBuddie.png")} alt="Modern Technology Interaction" />
							</div>
							<div className="hero-content">
								<h3
								// className='font-bold'
								// style={{fontSize: 23}}
								>Learning just got smarter, simpler, and more fun.</h3>
								<p>
									<AppName paragragh={true} color1='white' color2="font-gold" /> is an all-in-one study and practice platform designed for students
									from <strong>Basic 1-5, JSS 1-3, SSS 1-3</strong>, and candidates preparing for <strong>WAEC</strong> and <strong>JAMB</strong>. Whether
									you're revising for a class test, practicing past questions, or getting exam-ready, we've
									got you covered.
								</p>
								<p>
									With interactive quizzes, timed practice sessions, smart feedback, and exam-focused
									questions, <AppName paragragh={true} color1='white' color2="font-gold" /> helps you <strong>learn better, track your progress, and build
									confidence</strong>, one question at a time.
									<span className='font-gold'>{deviceInfo.width}px</span>
								</p>
								<div className='d-flex gap-1 center-btns'>
									<Link to={"/quiz"}
									className="cta-button">Take a Test!</Link>
									{!loggedIn ?
									<Link to={"/signup"}
									className="cta-button">Register for Free!</Link>:null}
								</div>
							</div>
						</section>

						<section className="features">
							{homeCards.map((card, cIdx) => {
								return (
									<div key={cIdx}
									className="feature-card glass">
										<div className="feature-icon">{card.icon}</div>
										<h3>{card.heading}</h3>
										<p>{card.para}</p>
									</div>
								)
							})}
						</section>
					</>
				{/* </div>
			</div> */}
			{/* <!-- Hero section --> */}
			{/* <Hero /> */}
			{/* <!-- Hero section end --> */}


			{/* <!-- categories section --> */}
			{/* <Categories /> */}
			{/* <!-- categories section end --> */}


			{/* <!-- search section --> */}
			{/* <Search /> */}
			{/* <!-- search section end --> */}


			{/* <!-- course section --> */}
			{/* <CourseSection /> */}
			{/* <!-- course section end --> */}


			{/* <!-- signup section --> */}
			{/* <SignUp /> */}
			{/* <!-- signup section end --> */}

			{/* <!-- banner section --> */}
			{/* <Banner /> */}
			{/* <!-- banner section end --> */}

		</>
	);
}
export { Home };
