import { Banner } from './banner';

function Hero() {
	return (
		<>
			<div className="hero-text text-white">
				<h2>Get The Best Free Online Courses</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla <br/> dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.</p>
			</div>
			<div className="row">
				<div className="col-lg-10 offset-lg-1 justify-content-center d-flex gap-1">
					<button className="site-btn">Take a Test</button>
					{/* <button className="site-btn">Scramble Questions</button>
					<button className="site-btn">Contribute Questions</button> */}

					{/* <form className="intro-newslatter">
						<input type="text" placeholder="Name"/>
						<input type="text" className="last-s" placeholder="E-mail"/>
						<button className="site-btn">Sign Up Now</button>
					</form> */}
				</div>
			</div>
			{/* <!-- banner section --> */}
			<Banner />
			{/* <!-- banner section end --> */}
		</>
	)
}
export { Hero };