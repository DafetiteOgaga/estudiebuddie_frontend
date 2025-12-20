

function PageInfo({number}) {
	return (
		<>
			{/* <div className="container"> */}
				<div className="site-breadcrumb">
					<a href="#">Home</a>
					<span>Courses</span>
				</div>
			{/* </div> */}
		</>
	)
}

function SearchSection() {
	return (
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
	)
}

function CourseSection() {
	return (
		<section className="course-section spad pb-0">
			<div className="course-warp">
				<ul className="course-filter controls">
					<li className="control active" data-filter="all">All</li>
					<li className="control" data-filter=".finance">Finance</li>
					<li className="control" data-filter=".design">Design</li>
					<li className="control" data-filter=".web">Web Development</li>
					<li className="control" data-filter=".photo">Photography</li>
				</ul>
				<div className="row course-items-area">
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 finance">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/1.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/1.jpg')})`,
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
										backgroundImage: `url(${require('../../assets/img/authors/1.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 design">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/2.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/2.jpg')})`,
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
										backgroundImage: `url(${require('../../assets/img/authors/2.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 web">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/3.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/3.jpg')})`,
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
										backgroundImage: `url(${require('../../assets/img/authors/3.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 photo">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/4.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/4.jpg')})`,
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
										backgroundImage: `url(${require('../../assets/img/authors/4.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 finance">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/5.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/5.jpg')})`,
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
										backgroundImage: `url(${require('../../assets/img/authors/5.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 design">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/6.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/6.jpg')})`,
							}}>
								<div className="price">Price: $15</div>
							</div>
							<div className="course-info">
								<div className="course-text">
									<h5>Socia Media</h5>
									<p>Lorem ipsum dolor sit amet, consectetur</p>
									<div className="students">120 Students</div>
								</div>
								<div className="course-author">
									<div className="ca-pic set-bg" data-setbg="img/authors/6.jpg"
									style={{
										backgroundImage: `url(${require('../../assets/img/authors/6.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 web">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/7.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/7.jpg')})`,
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
									<div className="ca-pic set-bg" data-setbg="img/authors/7.jpg"
									style={{
										backgroundImage: `url(${require('../../assets/img/authors/7.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- course --> */}
					<div className="mix col-lg-3 col-md-4 col-sm-6 photo">
						<div className="course-item">
							<div className="course-thumb set-bg" data-setbg="img/courses/8.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/courses/8.jpg')})`,
							}}>
								<div className="price">Price: $15</div>
							</div>
							<div className="course-info">
								<div className="course-text">
									<h5>HTML 5</h5>
									<p>Lorem ipsum dolor sit amet, consectetur</p>
									<div className="students">120 Students</div>
								</div>
								<div className="course-author">
									<div className="ca-pic set-bg" data-setbg="img/authors/8.jpg"
									style={{
										backgroundImage: `url(${require('../../assets/img/authors/8.jpg')})`,
									}}></div>
									<p>William Parker, <span>Developer</span></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="featured-courses">
					<div className="featured-course course-item">
						<div className="course-thumb set-bg" data-setbg="img/courses/f-1.jpg"
						style={{
								backgroundImage: `url(${require('../../assets/img/courses/f-1.jpg')})`,
							}}>
							<div className="price">Price: $15</div>
						</div>
						<div className="row">
							<div className="col-lg-6 offset-lg-6 pl-0">
								<div className="course-info">
									<div className="course-text">
										<div className="fet-note">Featured Course</div>
										<h5>HTNL5 & CSS For Begginers</h5>
										<p>Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna</p>
										<div className="students">120 Students</div>
									</div>
									<div className="course-author">
										<div className="ca-pic set-bg" data-setbg="img/authors/1.jpg"
										style={{
											backgroundImage: `url(${require('../../assets/img/authors/1.jpg')})`,
										}}></div>
										<p>William Parker, <span>Developer</span></p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="featured-course course-item">
						<div className="course-thumb set-bg" data-setbg="img/courses/f-2.jpg"
						style={{
								backgroundImage: `url(${require('../../assets/img/courses/f-2.jpg')})`,
							}}>
							<div className="price">Price: $15</div>
						</div>
						<div className="row">
							<div className="col-lg-6 pr-0">
								<div className="course-info">
									<div className="course-text">
										<div className="fet-note">Featured Course</div>
										<h5>HTNL5 & CSS For Begginers</h5>
										<p>Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna</p>
										<div className="students">120 Students</div>
									</div>
									<div className="course-author">
										<div className="ca-pic set-bg" data-setbg="img/authors/2.jpg"
										style={{
											backgroundImage: `url(${require('../../assets/img/authors/2.jpg')})`,
										}}></div>
										<p>William Parker, <span>Developer</span></p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

function PagePage() {
	return (
		<>
			{/* <div className="container"> */}
				<div className="row">
					<div className="col-lg-9">
						{/* <!-- blog post --> */}
						<div className="blog-post">
							<img src="img/blog/1.jpg" alt=""/>
							<h3>How to create the perfect resume</h3>
							<div className="blog-metas">
								<div className="blog-meta author">
									<div className="post-author set-bg" data-setbg="img/authors/1.jpg"
									style={{
										backgroundImage: `url(${require('../../assets/img/authors/1.jpg')})`,
									}}></div>
									<a href="#">James Smith</a>
								</div>
								<div className="blog-meta">
									<a href="#">Development</a>
								</div>
								<div className="blog-meta">
									<a href="#">June 12, 2018</a>
								</div>
								<div className="blog-meta">
									<a href="#">2 Comments</a>
								</div>
							</div>
							<p>Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna. </p>
							<a href="#" className="site-btn readmore">Read More</a>
						</div>
						{/* <!-- blog post --> */}
						<div className="blog-post">
							<img src="img/blog/2.jpg" alt=""/>
							<h3>5 Tips to make money from home</h3>
							<div className="blog-metas">
								<div className="blog-meta author">
									<div className="post-author set-bg" data-setbg="img/authors/2.jpg"
									style={{
										backgroundImage: `url(${require('../../assets/img/authors/2.jpg')})`,
									}}></div>
									<a href="#">James Smith</a>
								</div>
								<div className="blog-meta">
									<a href="#">Development</a>
								</div>
								<div className="blog-meta">
									<a href="#">June 12, 2018</a>
								</div>
								<div className="blog-meta">
									<a href="#">2 Comments</a>
								</div>
							</div>
							<p>Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna. </p>
							<a href="#" className="site-btn readmore">Read More</a>
						</div>
						{/* <!-- blog post --> */}
						<div className="blog-post">
							<img src="img/blog/3.jpg" alt=""/>
							<h3>Why choose an online course?</h3>
							<div className="blog-metas">
								<div className="blog-meta author">
									<div className="post-author set-bg" data-setbg="img/authors/3.jpg"
									style={{
										backgroundImage: `url(${require('../../assets/img/authors/3.jpg')})`,
									}}></div>
									<a href="#">James Smith</a>
								</div>
								<div className="blog-meta">
									<a href="#">Development</a>
								</div>
								<div className="blog-meta">
									<a href="#">June 12, 2018</a>
								</div>
								<div className="blog-meta">
									<a href="#">2 Comments</a>
								</div>
							</div>
							<p>Lorem ipsum dolor sit amet, consectetur. Phasellus sollicitudin et nunc eu efficitur. Sed ligula nulla, molestie quis ligula in, eleifend rhoncus ipsum. Donec ultrices, sem vel efficitur molestie, massa nisl posuere ipsum, ut vulputate mauris ligula a metus. Aenean vel congue diam, sed bibendum ipsum. Nunc vulputate aliquet tristique. Integer et pellentesque urna. </p>
							<a href="#" className="site-btn readmore">Read More</a>
						</div>
						<div className="site-pagination">
							<span className="active">01.</span>
							<a href="#">02.</a>
							<a href="#">03</a>
						</div>
					</div>
					<div className="col-lg-3 col-md-5 col-sm-9 sidebar">
						<div className="sb-widget-item">
							<form className="search-widget">
								<input type="text" placeholder="Search"/>
								<button><i className="fa fa-search"></i></button>
							</form>
						</div>
						<div className="sb-widget-item">
							<h4 className="sb-w-title">Categories</h4>
							<ul>
								<li><a href="#">Developement</a></li>
								<li><a href="#">Social Media</a></li>
								<li><a href="#">Press</a></li>
								<li><a href="#">Events & Lifestyle</a></li>
								<li><a href="#">Uncategorizes</a></li>
							</ul>
						</div>
						<div className="sb-widget-item">
							<h4 className="sb-w-title">Archives</h4>
							<ul>
								<li><a href="#">February 2018</a></li>
								<li><a href="#">March 2018</a></li>
								<li><a href="#">April 2018</a></li>
								<li><a href="#">May 2018</a></li>
								<li><a href="#">June 2018</a></li>
							</ul>
						</div>
						<div className="sb-widget-item">
							<h4 className="sb-w-title">Archives</h4>
							<div className="tags">
								<a href="#">education</a>
								<a href="#">courses</a>
								<a href="#">development</a>
								<a href="#">design</a>
								<a href="#">on line courses</a>
								<a href="#">wp</a>
								<a href="#">html5</a>
								<a href="#">music</a>
							</div>
						</div>
						<div className="sb-widget-item">
							<div className="add">
								<a href="#"><img src="img/add.jpg" alt=""/></a>
							</div>
						</div>
					</div>
				</div>
			{/* </div> */}
		</>
	)
}
export { PageInfo, SearchSection, CourseSection, PagePage };