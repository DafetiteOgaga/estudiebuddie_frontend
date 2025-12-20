import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Shapes } from './sections/shapes';
import { Header } from './sections/header';
import { Footer } from './sections/footer';

function Index() {
	const [isSticky, setIsSticky] = useState(false);
    const [scrollY, setScrollY] = useState(window.scrollY);
	useEffect(() => {
        const handleScroll = () => {
            const updatedScrollY = window.scrollY;
            setScrollY(updatedScrollY); // update scrollY state
            // // remove head when scrolling down
            if (updatedScrollY > 10) {
                setIsSticky(true);
            } else {
                // show head when scrolling up (to top)
                setIsSticky(false);
            }
        };
        // event listener
        window.addEventListener("scroll", handleScroll);
        // cleanup
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [])
	// console.log({
	// 	isSticky,
	// 	scrollY
	// })
	return (
		<>
			{/* shapes */}
			<Shapes />

			{/* header */}
			<Header isSticky={isSticky} scrollY={scrollY}/>

			<div className="page">
				<div className="container">
					<div className={`content-wrapper ${isSticky?'dy-scroll-top':''}`}>
						{/* children pages */}
						<Outlet context={{}} />
					</div>
				</div>
			</div>

			{/* footer */}
			<Footer />
		</>
		// // <section className="set-bg" data-setbg="img/bg.jpg"
		// // 	style={{
		// // 		backgroundImage: `url(${require('../assets/img/bg.png')})`,
		// // 	}}>
		// // 		<div className="container">
		// 	{/* <!-- Page Preloder --> */}
		// // 	{/* <Spinner /> */}

		// 	{/* <!-- Header section --> */}
		// // 	<div className='pt-3'>
		// // 		<Header />
		// // 	</div>
		// 	{/* <!-- Header section end --> */}

		// // 	{/* children component via routes */}
		// // 	{/* <section className="hero-section set-bg" data-setbg="img/bg.jpg"
		// // 	style={{
		// // 		backgroundImage: `url(${require('../assets/img/bg.png')})`,
		// // 	}}> */}
		// // 		{/* <div className="container"> */}
		// // 			<Outlet context={{}} />
		// // 		{/* </div> */}
		// // 	{/* </section> */}

			


			
		// // 	</div>
		// 	{/* <!-- footer section --> */}
		// // 	<Footer />
		// 	{/* <!-- footer section end --> */}
		// // </section>
	);
}
export { Index };
