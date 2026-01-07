import { Fragment } from "react";
import Lottie from "lottie-react";
import dancingLion from "./lrunning.json";
import talkingLion from "./lion.json";
import idleLion from "./lrunning.json";
import anime1 from "../../assets/animation/anime1.json"
import anime2 from "../../assets/animation/anime2.json"
import anime3 from "../../assets/animation/anime3.json"
import anime4 from "../../assets/animation/anime4.json"
import anime5 from "../../assets/animation/anime5.json"
import anime6 from "../../assets/animation/anime6.json"
import anime7 from "../../assets/animation/anime7.json"
import anime8 from "../../assets/animation/anime8.json"
import anime9 from "../../assets/animation/anime9.json"
import anime10 from "../../assets/animation/anime10.json"
import anime11 from "../../assets/animation/anime11.json"

const animes = [
	anime1,
	anime2,
	anime3,
	anime4,
	anime5,
	anime6,
	anime7,
	anime8,
	anime9,
	anime10,
	anime11,
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

  export { DancingLion, TalkingAnimal };