import './spinner.css'

function Spinner ({type}) {
	return (
		<>
			{type === 'dot' ?
				(<div className='spinner-container'>

					{/* Loader 2: Glassy Pulse Loader */}
					<div className='spinner-pulse-container'>
						{Array.from({length: 4}).map((_, dotIdx) => {
							return (
								<div key={dotIdx}
								className="spinner-pulse-dot"></div>
							)
						})}
						{/* <div className="spinner-pulse-dot"></div>
						<div className="spinner-pulse-dot"></div>
						<div className="spinner-pulse-dot"></div> */}
					</div>
				</div>)
				:
				(<div className='spinner-container'>

					{/* Loader 3: Transparent Glass Bar Loader */}
					<div className="spinner-bar"></div>
				</div>)}
		</>
	)
}
function SpinnerBarForPage () {
	return (
		<div className='page-container'>
			{/* <div className='bar-container glass glass-lighter'> */}
			<div className='bar-container'>
				<Spinner type={'bar'} />
			</div>
		</div>
	)
}
export { Spinner, SpinnerBarForPage }