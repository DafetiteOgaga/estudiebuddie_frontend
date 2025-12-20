

function Categories() {
	return (
		<>
			{/* <div className="container"> */}
				<div className="section-title">
					<h2>Our Course Categories</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.</p>
				</div>
				<div className="row">
					{/* <!-- categorie --> */}
					<div className="col-lg-4 col-md-6">
						<div className="categorie-item">
							<div className="ci-thumb set-bg" data-setbg="img/categories/1.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/categories/1.jpg')})`,
							}}></div>
							<div className="ci-text">
								<h5>IT Development</h5>
								<p>Lorem ipsum dolor sit amet, consectetur</p>
								<span>120 Courses</span>
							</div>
						</div>
					</div>
					{/* <!-- categorie --> */}
					<div className="col-lg-4 col-md-6">
						<div className="categorie-item">
							<div className="ci-thumb set-bg" data-setbg="img/categories/2.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/categories/2.jpg')})`,
							}}></div>
							<div className="ci-text">
								<h5>Web Design</h5>
								<p>Lorem ipsum dolor sit amet, consectetur</p>
								<span>70 Courses</span>
							</div>
						</div>
					</div>
					{/* <!-- categorie --> */}
					<div className="col-lg-4 col-md-6">
						<div className="categorie-item">
							<div className="ci-thumb set-bg" data-setbg="img/categories/3.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/categories/3.jpg')})`,
							}}></div>
							<div className="ci-text">
								<h5>Illustration & Drawing</h5>
								<p>Lorem ipsum dolor sit amet, consectetur</p>
								<span>55 Courses</span>
							</div>
						</div>
					</div>
					{/* <!-- categorie --> */}
					<div className="col-lg-4 col-md-6">
						<div className="categorie-item">
							<div className="ci-thumb set-bg" data-setbg="img/categories/4.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/categories/4.jpg')})`,
							}}></div>
							<div className="ci-text">
								<h5>Social Media</h5>
								<p>Lorem ipsum dolor sit amet, consectetur</p>
								<span>40 Courses</span>
							</div>
						</div>
					</div>
					{/* <!-- categorie --> */}
					<div className="col-lg-4 col-md-6">
						<div className="categorie-item">
							<div className="ci-thumb set-bg" data-setbg="img/categories/5.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/categories/5.jpg')})`,
							}}></div>
							<div className="ci-text">
								<h5>Photoshop</h5>
								<p>Lorem ipsum dolor sit amet, consectetur</p>
								<span>220 Courses</span>
							</div>
						</div>
					</div>
					{/* <!-- categorie --> */}
					<div className="col-lg-4 col-md-6">
						<div className="categorie-item">
							<div className="ci-thumb set-bg" data-setbg="img/categories/6.jpg"
							style={{
								backgroundImage: `url(${require('../../assets/img/categories/6.jpg')})`,
							}}></div>
							<div className="ci-text">
								<h5>Cryptocurrencies</h5>
								<p>Lorem ipsum dolor sit amet, consectetur</p>
								<span>25 Courses</span>
							</div>
						</div>
					</div>
				</div>
			{/* </div> */}
		</>
	)
}
export { Categories };