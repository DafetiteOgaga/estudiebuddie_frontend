import { PageInfo, SearchSection, PagePage } from '../inComponent/incomponent';

function Blog() {
  return (
	<>

		{/* <!-- Page info --> */}
		<PageInfo number="3" />
		{/* <!-- Page info end --> */}


		{/* <!-- search section --> */}
		<SearchSection />
		{/* <!-- search section end --> */}


		{/* <!-- Page  --> */}
		<PagePage />
		{/* <!-- Page end --> */}
	</>
  );
}
export { Blog };