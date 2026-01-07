import { useState } from "react";
import { toast } from 'react-toastify'
import { Spinner } from '../../hooks/spinner/spinner'
// import { GameResult } from '../animationComps/confettiAnime'
// import { CoinsRain } from '../animationComps/framerAnime'
import { DancingLion, TalkingAnimal } from '../animationComps/lottieAnime'

function PageNotFound() {
	const [showAnime, setShowAnime] = useState(false)
	return (
		<>
			<div className="d-flex flex-column justify-content-center align-items-center">
				<h2>Oopsy!</h2>
				<h1>Page not found</h1>
			</div>

			<button
			type="submit"
			onClick={(e)=>{
				toast.success('Success')
				toast.error('Error')
				toast.info('Info')
			}}
			className="cta-button profile-btn">
				Test Toasts
			</button>

			<div>
				<Spinner type={'dot'} />
			</div>
			<div>
				<Spinner type={'bar'} />
			</div>

			<button
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
				<div>
					<TalkingAnimal />
				</div>
			</div>:null}
		</>
	)
}
export { PageNotFound };
