import { useDevice } from "../../contexts/deviceTypeContext";

function EStudieBuddieLogo () {
	return (
		<>
			<svg xmlns="http://www.w3.org/2000/svg"
				// viewBox="0 0 500 500"
				// viewBox="80 80 340 340" // tight
				// viewBox="100 120 300 260"
				// viewBox="120 150 260 220" // tighter
				viewBox="135 165 230 190" // logo mark
				width="500"
				height="500">

				{/* <!-- Background --> */}
				{/* <rect width="500" height="500" rx="96" fill="#0D1F1A"/> */}

				{/* <!-- Outer arc (lightest green, thinnest) --> */}
				{/* <path d="M140 250 A110 110 0 1 1 360 250" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeDasharray="180 1000" opacity="0.55"/> */}

				{/* <!-- Middle arc --> */}
				{/* <path d="M162 250 A88 88 0 1 1 338 250" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeDasharray="130 1000" opacity="0.75"/> */}

				{/* <!-- Inner arc (darkest, thickest) --> */}
				<path d="M186 250 A64 64 0 1 1 314 250" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" strokeDasharray="70 1000" opacity="0.55"/>

				{/* <!-- Central diamond --> */}
				{/* <polygon points="250,176 296,250 250,324 204,250" fill="#ffffff" opacity="0.05"/>
				<polygon points="250,198 278,250 250,302 222,250" fill="#facc15" opacity="0.55"/>
				<polygon points="250,220 264,250 250,280 236,250" fill="#ffffff" opacity="0.55"/> */}
				{/* Central E */}
				<text
					x="250"
					y="250"
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="120"
					fontWeight="700"
					fontFamily="Arial, sans-serif"
					fill="#facc15"
					opacity="0.55"
					transform="rotate(-15 250 250)"
				>
					e
				</text>

				{/* <!-- Mirrored outer arc (lower-right, sweep reversed) --> */}
				{/* <path d="M360 250 A110 110 0 1 1 140 250" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeDasharray="180 1000" opacity="0.55"/> */}

				{/* <!-- Mirrored middle arc --> */}
				{/* <path d="M338 250 A88 88 0 1 1 162 250" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeDasharray="130 1000" opacity="0.75"/> */}

				{/* <!-- Mirrored inner arc --> */}
				<path d="M314 250 A64 64 0 1 1 186 250" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" strokeDasharray="70 1000" opacity="0.55"/>

				{/* <!-- Original arc left-end dots --> */}
				{/* <circle cx="140" cy="250" r="10" fill="#facc15" opacity="1"/> */}
				{/* <circle cx="162" cy="250" r="10" fill="#ffffff" opacity="1"/> */}
				<circle cx="186" cy="250" r="10" fill="#facc15" opacity="1"/>

				{/* <!-- Mirrored arc right-end dots --> */}
				{/* <circle cx="360" cy="250" r="10" fill="#facc15" opacity="1"/> */}
				{/* <circle cx="338" cy="250" r="10" fill="#ffffff" opacity="1"/> */}
				<circle cx="314" cy="250" r="10" fill="#facc15" opacity="1"/>

				{/* <!-- Subtle spark accents --> */}
				<circle cx="288" cy="170" r="6" fill="#ffffff" opacity="0.55"/>
				<circle cx="348" cy="220" r="6" fill="#ffffff" opacity="0.55"/>
				<circle cx="304" cy="215" r="4" fill="#facc15" opacity="1"/>
				<circle cx="324" cy="185" r="4" fill="#facc15" opacity="1"/>
				<circle cx="208" cy="310" r="5" fill="#facc15" opacity="1"/>
				<circle cx="158" cy="280" r="5" fill="#facc15" opacity="1"/>
				<circle cx="196"  cy="285" r="3" fill="#ffffff" opacity="0.7"/>
				<circle cx="196"  cy="335" r="3" fill="#ffffff" opacity="1"/>
				<circle cx="167" cy="320" r="4" fill="white" opacity="0.5"/>
			</svg>
		</>
	)
}

function AppName() {
	const { label, width } = useDevice()
	const _900 = width <= 900
	// const _800 = width <= 800
	return (
		<svg
		width={`${
			
			_900?"175":
			"225"}`}
			height={`${
				
				_900?"28":
				"45"}`}
			viewBox="-15 0 370 60"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* tilted E */}
			<text
				x="-13"
				y="44"
				fontSize="48"
				fontWeight="700"
				fontFamily="Poppins, sans-serif"
				fill="#facc15"
				transform="rotate(-15 20 35)"
			>
				e
			</text>

			{/* Studie */}
			<text
				x="12"
				y="50"
				fontSize="48"
				fontWeight="600"
				fontFamily="Poppins, sans-serif"
				fill="#fff"
				opacity="0.55"
			>
				Studie
			</text>

			{/* tilted B */}
			<text
				x="160"
				y="47"
				fontSize="48"
				fontWeight="700"
				fontFamily="Poppins, sans-serif"
				fill="#facc15"
				transform="rotate(-10 185 35)"
				opacity="0.55"
			>
				B
			</text>

			{/* uddie */}
			<text
				x="194"
				y="50"
				fontSize="48"
				fontWeight="600"
				fontFamily="Poppins, sans-serif"
				fill="#facc15"
				opacity="0.55"
			>
				uddie
			</text>
		</svg>
	);
}
export { EStudieBuddieLogo, AppName }