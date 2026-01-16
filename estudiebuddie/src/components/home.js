import { Link } from 'react-router-dom';
import { AppName } from './sections/header';

function Home() {
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
								<p className='font-bold'
								style={{fontSize: 23}}>Learning just got smarter, simpler, and more fun.</p>
								<p>
									<AppName size='md' color1='white' color2="font-gold" /> is an all-in-one study and practice platform designed for students
									from <strong>Basic 1-5, JSS 1-3, SSS 1-3</strong>, and candidates preparing for <strong>WAEC</strong> and <strong>JAMB</strong>. Whether
									you're revising for a class test, practicing past questions, or getting exam-ready, we've
									got you covered.
								</p>
								<p>
									With interactive quizzes, timed practice sessions, smart feedback, and exam-focused
									questions, <AppName size='md' color1='white' color2="font-gold" /> helps you <strong>learn better, track your progress, and build
									confidence</strong>, one question at a time.
								</p>
								<div className='d-flex gap-1'>
									<Link to={"/quiz"}
									className="cta-button">Take a Test!</Link>
									<Link to={"/signup"}
									className="cta-button">Register for Free!</Link>
								</div>
							</div>
						</section>

						<section className="features">
							<div className="feature-card glass">
								<div className="feature-icon">📚</div>
								<h3>Interactive Quizzes</h3>
								<p>Take engaging quizzes across different topics to test understanding and strengthen knowledge.</p>
							</div>
							
							<div className="feature-card glass">
								<div className="feature-icon">⏱️</div>
								<h3>Timed Challenges</h3>
								<p>Quizzes are time-based to improve focus, speed, and exam readiness under real conditions.</p>
							</div>
							
							<div className="feature-card glass">
								<div className="feature-icon">📈</div>
								<h3>Progress Tracking</h3>
								<p>Track scores, improvements, and learning growth over time in one place.</p>
							</div>

							<div className="feature-card glass">
								<div className="feature-icon">🎯</div>
								<h3>Performance Insights</h3>
								<p>Detailed results help students understand strengths, weaknesses, and areas to improve.</p>
							</div>

							<div className="feature-card glass">
								<div className="feature-icon">🏆</div>
								<h3>Learning Motivation</h3>
								<p>Achievements and consistent practice to encourage you stay motivated and aim higher.</p>
							</div>

							<div className="feature-card glass">
								<div className="feature-icon">🔐</div>
								<h3>Secure Student Accounts</h3>
								<p>Your progress, quiz history, and results are safely stored and protected.</p>
							</div>
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
