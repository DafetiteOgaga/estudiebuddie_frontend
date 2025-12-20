

function Shapes() {
	return (
		<div className='bg-shapes'>
			{Array.from({length: 6}).map((_, idx) => {
				return (
					<div key={idx} className='shape'/>
				)
			})}
		</div>
	)
}
export { Shapes };