

function CourseSection() {
	return (
		<>
			{/* <div className="container"> */}
				<div className="section-title mb-0">
					<h2>Featured Courses</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.</p>
				</div>
			{/* </div> */}
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
			</div>
		</>
	)
}
export { CourseSection };