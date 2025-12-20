import { PageInfo, SearchSection } from "../inComponent/incomponent";

function Contact() {
	return (
		<>
			{/* <!-- Page info --> */}
			<PageInfo number="4" />
			{/* <!-- Page info end --> */}


			{/* <!-- search section --> */}
			<SearchSection />
			{/* <!-- search section end --> */}



			{/* <!-- Page --> */}
			<>
				{/* <div className="container"> */}
					<div className="row">
						<div className="col-lg-8">
							<div className="contact-form-warp">
								<div className="section-title text-white text-left">
									<h2>Get in Touch</h2>
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. </p>
								</div>
								<form className="contact-form">
									<input type="text" placeholder="Your Name"/>
									<input type="text" placeholder="Your E-mail"/>
									<input type="text" placeholder="Subject"/>
									<textarea placeholder="Message"></textarea>
									<button className="site-btn">Sent Message</button>
								</form>
							</div>
						</div>
						<div className="col-lg-4">
							<div className="contact-info-area">
								<div className="section-title text-left p-0">
									<h2>Contact Info</h2>
									<p>Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendi sse cursus faucibus finibus.</p>
								</div>
								<div className="phone-number">
									<span>Direct Line</span>
									<h2>+53 345 7953 32453</h2>
								</div>
								<ul className="contact-list">
									<li>1481 Creekside Lane <br/>Avila Beach, CA 931</li>
									<li>+53 345 7953 32453</li>
									<li>yourmail@gmail.com</li>
								</ul>
								<div className="social-links">
									<a href="#"><i className="fa-brands fa-pinterest"></i></a>
									<a href="#"><i className="fa-brands fa-facebook"></i></a>
									<a href="#"><i className="fa-brands fa-twitter"></i></a>
									<a href="#"><i className="fa-brands fa-dribbble"></i></a>
									<a href="#"><i className="fa-brands fa-behance"></i></a>
									<a href="#"><i className="fa-brands fa-linkedin"></i></a>
								</div>
							</div>
						</div>
					</div>
					<div id="map-canvas"></div>
				{/* </div> */}
			</>
			{/* <!-- Page end --> */}

		</>
	);
}

export { Contact };