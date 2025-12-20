import { SignUp } from "./dynamicPages/signup";
import { CourseSection } from "./dynamicPages/courseSection";
import { Search } from "./dynamicPages/search";
import { Categories } from "./dynamicPages/categories";
import { Hero } from "./dynamicPages/hero";
import { Banner } from "./dynamicPages/banner";
// import { showPage } from "../hooks/templatemo-glossy-touch";
import { useOutletContext } from "react-router-dom";

function Home() {
	// const { showPage } = useOutletContext();
	return (
		<>
			{/* <div id="home" className="page active">
				<div className="container"> */}
					<>
						<section className="hero glass">
							<div className="hero-image">
								<img src={require("../assets/images/templatemo-futuristic-girl.jpg")} alt="Modern Technology Interaction" />
							</div>
							<div className="hero-content">
								<h1>Welcome to the Future</h1>
								<p>Experience cutting-edge glass morphism design that brings depth and elegance to modern web interfaces. Clean, translucent, and beautifully interactive.</p>
								<a href="##" className="cta-button"
								// onClick={()=>showPage('about')}
								>Learn More</a>
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
