import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Shapes } from './sections/shapes';
import { Header } from './sections/header';
import { Footer } from './sections/footer';
import { useDevice } from '../contexts/deviceTypeContext';

function Index() {
	const { width, isMobileDev768 } = useDevice();
	const isOver2000Width = width>1600
	// const isMobileDev768 = deviceInfo.width<=768
	// console.log({isOver2000Width,})
	const page = useLocation().pathname.split('/')[1]
	const centerWrapper = page==='login' || page==='signup' || page==='leaderboard' || page==='complete-registration'
	const showHeaderAndFooter = page !== "complete-registration"
	// console.log({centerWrapper})
	const [isSticky, setIsSticky] = useState(false);
    const [scrollY, setScrollY] = useState(window.scrollY);
	useEffect(() => {
        const handleScroll = () => {
            const updatedScrollY = window.scrollY;
            setScrollY(updatedScrollY); // update scrollY state
            // // remove head when scrolling down
            if (updatedScrollY > 30) {
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
	const headerArgs = {
		isSticky,
		scrollY,
		isOver2000Width,
	}
	// console.log({page})
	return (
		<>
			{/* shapes */}
			<Shapes />

			{/* header */}
			{showHeaderAndFooter &&
			<Header {...headerArgs}/>}

			<div className={`page ${!showHeaderAndFooter?'mt-10':''}`}
			style={(page==="dashboard"&&isMobileDev768)?{padding: '0 4px'}:{}}>
				<div className={`${isOver2000Width?'max-w-auto':'container'}`}>
					<div className={`content-wrapper ${isSticky?'dy-scroll-top':''} ${centerWrapper?'center-login':''}`}>
						{/* children pages */}
						<Outlet context={{}} />
					</div>
				</div>
			</div>

			{/* footer */}
			{showHeaderAndFooter &&
			<Footer />}
			{/* {centerWrapper?null:<Footer />} */}
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
