import { Fragment } from "react";
import Lottie from "lottie-react";
import dancingLion from "./lrunning.json";
import talkingLion from "./lion.json";
import idleLion from "./lrunning.json";
import anime01 from "../../assets/animation/a.json"
import anime02 from "../../assets/animation/b.json"
import anime03 from "../../assets/animation/c.json"
import anime04 from "../../assets/animation/d.json"
import anime05 from "../../assets/animation/e.json"
import anime06 from "../../assets/animation/1.json"
import anime07 from "../../assets/animation/2.json"
import anime08 from "../../assets/animation/3.json"
import anime09 from "../../assets/animation/4.json"
import anime10 from "../../assets/animation/5.json"
import anime11 from "../../assets/animation/6.json"
import anime12 from "../../assets/animation/7.json"
import anime13 from "../../assets/animation/8.json"
import anime14 from "../../assets/animation/9.json"

const animes = [
	anime01,
	anime02,
	anime03,
	anime04,
	anime05,
	anime06,
	anime07,
]
const animes2 = [
	anime08,
	anime09,
	anime10,
	anime11,
	anime10,
	anime12,
	anime13,
	anime14,
]
function DancingLion() {
	return (
		<>
			{animes.map((anime, aIdx) => {
				return (
					<Fragment key={aIdx}>
						<Lottie
							animationData={anime}
							loop
							style={{ width: 200, height: 200 }}
						/>
					</Fragment>
				)
			})}
		</>
	);
}

function DancingLion2() {
	return (
		<>
			{animes2.map((anime, aIdx) => {
				return (
					<Fragment key={aIdx}>
						<Lottie
							animationData={anime}
							loop
							style={{ width: 200, height: 200 }}
						/>
					</Fragment>
				)
			})}
		</>
	);
}

function TalkingAnimal({ talking }) {
	return (
	  <>
		<Lottie
		  animationData={talking ? talkingLion : idleLion}
		  loop
		  style={{ width: 200, height: 200 }}
		/>
		{talking && <audio src="/sounds/lion-roar.mp3" autoPlay />}
	  </>
	);
  }

  export { DancingLion, DancingLion2, TalkingAnimal };