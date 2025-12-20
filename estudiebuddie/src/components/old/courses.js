import { PageInfo, SearchSection, CourseSection } from "../inComponent/incomponent";

function Courses() {
	return (
		<>
			{/* <!-- Page info --> */}
			<PageInfo number="1" />
			{/* <!-- Page info end --> */}


			{/* <!-- search section --> */}
			<SearchSection />
			{/* <!-- search section end --> */}


			{/* <!-- course section --> */}
			<CourseSection />
			{/* <!-- course section end --> */}
		</>
	);
}
export { Courses };