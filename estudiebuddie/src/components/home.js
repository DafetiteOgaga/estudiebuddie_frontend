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
								<div className="feature-icon">✨</div>
								<h3>Modern Design</h3>
								<p>Beautiful glass morphism effects with backdrop blur and translucent elements that create depth and visual hierarchy.</p>
							</div>
							
							<div className="feature-card glass">
								<div className="feature-icon">⚡</div>
								<h3>Fast Performance</h3>
								<p>Optimized animations and effects that maintain smooth 60fps performance across all modern browsers and devices.</p>
							</div>
							
							<div className="feature-card glass">
								<div className="feature-icon">📱</div>
								<h3>Responsive</h3>
								<p>Fully responsive design that adapts beautifully to any screen size, from mobile phones to desktop displays.</p>
							</div>

							<div className="feature-card glass">
								<div className="feature-icon">🎨</div>
								<h3>Interactive UI</h3>
								<p>Engaging hover effects, smooth transitions, and micro-animations that create delightful user experiences.</p>
							</div>

							<div className="feature-card glass">
								<div className="feature-icon">🔒</div>
								<h3>Secure & Safe</h3>
								<p>Built with modern security standards and best practices to ensure your data and user privacy are protected.</p>
							</div>

							<div className="feature-card glass">
								<div className="feature-icon">🚀</div>
								<h3>Easy Integration</h3>
								<p>Simple to implement and customize for any project with clean, well-documented code and flexible components.</p>
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
