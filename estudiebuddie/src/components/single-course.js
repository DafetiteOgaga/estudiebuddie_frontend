

function SingleCourse () {
	return (
		<>
	{/* <!-- Page Preloder --> */}
	{/* <div id="preloder">
		<div className="loader"></div>
	</div> */}

	{/* <!-- Header section --> */}
	{/* <header className="header-section">
		<div className="container">
			<div className="row">
				<div className="col-lg-3 col-md-3">
					<div className="site-logo">
						<img src={require('../assets/img/logo.png')} alt=""/>
					</div>
					<div className="nav-switch">
						<i className="fa fa-bars"></i>
					</div>
				</div>
				<div className="col-lg-9 col-md-9">
					<a href="" className="site-btn header-btn">Login</a>
					<nav className="main-menu">
						<ul>
							<li><a href="index.html">Home</a></li>
							<li><a href="#">About us</a></li>
							<li><a href="courses.html">Courses</a></li>
							<li><a href="blog.html">News</a></li>
							<li><a href="contact.html">Contact</a></li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</header> */}
	{/* <!-- Header section end --> */}


	{/* <!-- Page info --> */}
	<>
		{/* <div className="container"> */}
			<div className="site-breadcrumb">
				<a href="#">Home</a>
				<span>Courses</span>
			</div>
		{/* </div> */}
	</>
	{/* <!-- Page info end --> */}


	{/* <!-- search section --> */}
	<>
		{/* <div className="container"> */}
			<div className="search-warp">
				<div className="section-title text-white">
					<h2><span>Search your course</span></h2>
				</div>
				<div className="row">
					<div className="col-lg-10 offset-lg-1">
						{/* <!-- search form --> */}
						<form className="course-search-form">
							<input type="text" placeholder="Course"/>
							<input type="text" className="last-m" placeholder="Category"/>
							<button className="site-btn btn-dark">Search Couse</button>
						</form>
					</div>
				</div>
			</div>
		{/* </div> */}
	</>
	{/* <!-- search section end --> */}


	{/* <!-- single course section --> */}
	<>
		{/* <div className="container"> */}
			<div className="course-meta-area">
				<div className="row">
					<div className="col-lg-10 offset-lg-1">
						<div className="course-note">Featured Course</div>
						<h3>HTNL5 & CSS For Begginers</h3>
						<div className="course-metas">
							<div className="course-meta">
								<div className="course-author">
									<div className="ca-pic set-bg" data-setbg="img/authors/2.jpg"
									style={{
										backgroundImage: `url(${require('../assets/img/authors/2.jpg')})`,
									}}></div>
									<h6>Teacher</h6>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
							<div className="course-meta">
								<div className="cm-info">
									<h6>Category</h6>
									<p>Development</p>
								</div>
							</div>
							<div className="course-meta">
								<div className="cm-info">
									<h6>Students</h6>
									<p>120 Registered Students</p>
								</div>
							</div>
							<div className="course-meta">
								<div className="cm-info">
									<h6>Reviews</h6>
									<p>2 Reviews <span className="rating">
										<i className="fa fa-star"></i>
										<i className="fa fa-star"></i>
										<i className="fa fa-star"></i>
										<i className="fa fa-star"></i>
										<i className="fa fa-star is-fade"></i>
									</span></p>
								</div>
							</div>
						</div>
						<a href="#" className="site-btn price-btn">Price: $15</a>
						<a href="#" className="site-btn buy-btn">Buy This Course</a>
					</div>
				</div>
			</div>
			<img src="img/courses/single.jpg" alt="" className="course-preview"/>
			<div className="row">
				<div className="col-lg-10 offset-lg-1 course-list">
					<div className="cl-item">
						<h4>Course Description</h4>
						<p>Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna. Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. </p>
					</div>
					<div className="cl-item">
						<h4>Certification</h4>
						<p>Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna. Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum.</p>
					</div>
					<div className="cl-item">
						<h4>The Instructor</h4>
						<p>Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna. Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. </p>
					</div>
				</div>
			</div>
		{/* </div> */}
	</>
	{/* <!-- single course section end --> */}


	{/* <!-- Page --> */}
	<section className="realated-courses spad">
		<div className="course-warp">
			<h2 className="rc-title">Realated Courses</h2>
			<div className="rc-slider owl-carousel">
				{/* <!-- course --> */}
				<div className="course-item">
					<div className="course-thumb set-bg" data-setbg="img/courses/1.jpg"
					style={{
						backgroundImage: `url(${require('../assets/img/courses/1.jpg')})`,
					}}>
						<div className="price">Price: $15</div>
					</div>
					<div className="course-info">
						<div className="course-text">
							<h5>Art & Crafts</h5>
							<p>Lorem ipsum dolor sit amet, consectetur</p>
							<div className="students">120 Students</div>
						</div>
						<div className="course-author">
							<div className="ca-pic set-bg" data-setbg="img/authors/1.jpg"
							style={{
								backgroundImage: `url(${require('../assets/img/authors/1.jpg')})`,
							}}></div>
							<p>William Parker, <span>Developer</span></p>
						</div>
					</div>
				</div>
				{/* <!-- course --> */}
				<div className="course-item">
					<div className="course-thumb set-bg" data-setbg="img/courses/2.jpg"
					style={{
						backgroundImage: `url(${require('../assets/img/courses/2.jpg')})`,
					}}>
						<div className="price">Price: $15</div>
					</div>
					<div className="course-info">
						<div className="course-text">
							<h5>IT Development</h5>
							<p>Lorem ipsum dolor sit amet, consectetur</p>
							<div className="students">120 Students</div>
						</div>
						<div className="course-author">
							<div className="ca-pic set-bg" data-setbg="img/authors/2.jpg"
							style={{
								backgroundImage: `url(${require('../assets/img/authors/2.jpg')})`,
							}}></div>
							<p>William Parker, <span>Developer</span></p>
						</div>
					</div>
				</div>
				{/* <!-- course --> */}
				<div className="course-item">
					<div className="course-thumb set-bg" data-setbg="img/courses/3.jpg"
					style={{
						backgroundImage: `url(${require('../assets/img/courses/3.jpg')})`,
					}}>
						<div className="price">Price: $15</div>
					</div>
					<div className="course-info">
						<div className="course-text">
							<h5>Graphic Design</h5>
							<p>Lorem ipsum dolor sit amet, consectetur</p>
							<div className="students">120 Students</div>
						</div>
						<div className="course-author">
							<div className="ca-pic set-bg" data-setbg="img/authors/3.jpg"
							style={{
								backgroundImage: `url(${require('../assets/img/authors/3.jpg')})`,
							}}></div>
							<p>William Parker, <span>Developer</span></p>
						</div>
					</div>
				</div>
				{/* <!-- course --> */}
				<div className="course-item">
					<div className="course-thumb set-bg" data-setbg="img/courses/4.jpg"
					style={{
						backgroundImage: `url(${require('../assets/img/courses/4.jpg')})`,
					}}>
						<div className="price">Price: $15</div>
					</div>
					<div className="course-info">
						<div className="course-text">
							<h5>IT Development</h5>
							<p>Lorem ipsum dolor sit amet, consectetur</p>
							<div className="students">120 Students</div>
						</div>
						<div className="course-author">
							<div className="ca-pic set-bg" data-setbg="img/authors/4.jpg"
							style={{
								backgroundImage: `url(${require('../assets/img/authors/4.jpg')})`,
							}}></div>
							<p>William Parker, <span>Developer</span></p>
						</div>
					</div>
				</div>
				{/* <!-- course --> */}
				<div className="course-item">
					<div className="course-thumb set-bg" data-setbg="img/courses/5.jpg"
					style={{
						backgroundImage: `url(${require('../assets/img/courses/5.jpg')})`,
					}}>
						<div className="price">Price: $15</div>
					</div>
					<div className="course-info">
						<div className="course-text">
							<h5>IT Development</h5>
							<p>Lorem ipsum dolor sit amet, consectetur</p>
							<div className="students">120 Students</div>
						</div>
						<div className="course-author">
							<div className="ca-pic set-bg" data-setbg="img/authors/5.jpg"
							style={{
								backgroundImage: `url(${require('../assets/img/authors/5.jpg')})`,
							}}></div>
							<p>William Parker, <span>Developer</span></p>
						</div>
					</div>
				</div>
				{/* <!-- course --> */}
			</div>
		</div>
	</section>
	{/* <!-- Page end --> */}


	{/* <!-- banner section --> */}
	{/* <section className="banner-section spad">
		<div className="container">
			<div className="section-title mb-0 pb-2">
				<h2>Join Our Community Now!</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.</p>
			</div>
			<div className="text-center pt-5">
				<a href="#" className="site-btn">Register Now</a>
			</div>
		</div>
	</section> */}
	{/* <!-- banner section end --> */}


	{/* <!-- footer section --> */}
	{/* <footer className="footer-section spad pb-0">
		<div className="footer-top">
			<div className="footer-warp">
				<div className="row">
					<div className="widget-item">
						<h4>Contact Info</h4>
						<ul className="contact-list">
							<li>1481 Creekside Lane <br/>Avila Beach, CA 931</li>
							<li>+53 345 7953 32453</li>
							<li>yourmail@gmail.com</li>
						</ul>
					</div>
					<div className="widget-item">
						<h4>Engeneering</h4>
						<ul>
							<li><a href="">Applied Studies</a></li>
							<li><a href="">Computer Engeneering</a></li>
							<li><a href="">Software Engeneering</a></li>
							<li><a href="">Informational Engeneering</a></li>
							<li><a href="">System Engeneering</a></li>
						</ul>
					</div>
					<div className="widget-item">
						<h4>Graphic Design</h4>
						<ul>
							<li><a href="">Applied Studies</a></li>
							<li><a href="">Computer Engeneering</a></li>
							<li><a href="">Software Engeneering</a></li>
							<li><a href="">Informational Engeneering</a></li>
							<li><a href="">System Engeneering</a></li>
						</ul>
					</div>
					<div className="widget-item">
						<h4>Development</h4>
						<ul>
							<li><a href="">Applied Studies</a></li>
							<li><a href="">Computer Engeneering</a></li>
							<li><a href="">Software Engeneering</a></li>
							<li><a href="">Informational Engeneering</a></li>
							<li><a href="">System Engeneering</a></li>
						</ul>
					</div>
					<div className="widget-item">
						<h4>Newsletter</h4>
						<form className="footer-newslatter">
							<input type="email" placeholder="E-mail"/>
							<button className="site-btn">Subscribe</button>
							<p>*We don’t spam</p>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div className="footer-bottom">
			<div className="footer-warp">
				<ul className="footer-menu">
					<li><a href="#">Terms & Conditions</a></li>
					<li><a href="#">Register</a></li>
					<li><a href="#">Privacy</a></li>
				</ul>
				<div className="copyright"><a target="_blank" href="https://www.templateshub.net">Templates Hub</a></div>
			</div>
		</div>
	</footer> */}
	{/* <!-- footer section end --> */}

</>
)}
export { SingleCourse }