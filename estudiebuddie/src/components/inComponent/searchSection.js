

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
export { SearchSection };