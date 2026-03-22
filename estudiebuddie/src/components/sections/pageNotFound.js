import { useState } from "react";
import { toast } from 'react-toastify'
import { Spinner } from '../../hooks/spinner/spinner'
// import { GameResult } from '../animationComps/confettiAnime'
// import { CoinsRain } from '../animationComps/framerAnime'
import { DancingLion, DancingLion2, TalkingAnimal } from '../animationComps/lottieAnime'
import { FetchFromServer } from "../../hooks/FetchFromServer";
import { useDeviceInfo } from "../../hooks/deviceType";
import { titleCase } from "../../hooks/changeCase";

function PageNotFound() {
	const deviceInfo = useDeviceInfo()
	console.log({deviceInfo})
	const [showAnime, setShowAnime] = useState(false)

	const submitHandler = async (e) => {
		e.preventDefault(); // prevent default page refres
		const endpoint = 'shufflequestions/get-links'
		const res = await FetchFromServer(endpoint)
		console.log('Form submitted with data:');
		// const alert1 = `\nResponse: \n ${JSON.stringify(res, null, 2)}`
		alert("Success\nClick 'Download File' to download the shuffled questions");
		if (res.ok) {
			console.log({res})
		}
	};
	return (
		<>
			<div className="d-flex flex-column justify-content-center align-items-center">
				<h2>Oopsy!</h2>
				<h1>Page not found</h1>
			</div>

			{/* <button
			type="submit"
			onClick={(e)=>{
				toast.success('Success')
				toast.error('Error')
				toast.info('Info')
			}}
			className="cta-button profile-btn">
				Test Toasts
			</button> */}

			<div>
				<Spinner type={'dot'} />
			</div>
			<div>
				<Spinner type={'bar'} />
			</div>

			{/* <button
			type="submit"
			onClick={(e)=>{
				setShowAnime(prev=>!prev)
			}}
			className="cta-button profile-btn">
				{showAnime?'Hide anime':'show anime'}
			</button>
			{showAnime?
			<div>
				<div className='d-flex'>
					<DancingLion />
				</div>
				<div className='d-flex'>
					<DancingLion2 />
				</div>
				<div>
					<TalkingAnimal />
				</div>
			</div>:null} */}

			{/* <button
			type="submit"
			onClick={submitHandler}
			className="cta-button profile-btn">
				test GET request
			</button> */}
			<h2>Device: {titleCase(deviceInfo.label)}</h2>
			<h3>Media width: {deviceInfo.width}px</h3>
		</>
	)
}
export { PageNotFound };
