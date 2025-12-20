import Lottie from "lottie-react";
import dancingLion from "./lrunning.json";
import talkingLion from "./lion.json";
import idleLion from "./lrunning.json";

function DancingLion() {
  return (
    <Lottie
      animationData={dancingLion}
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}

function TalkingAnimal({ talking }) {
	return (
	  <div>
		<Lottie
		  animationData={talking ? talkingLion : idleLion}
		  loop
		  style={{ width: 200, height: 200 }}
		/>
		{talking && <audio src="/sounds/lion-roar.mp3" autoPlay />}
	  </div>
	);
  }

  export { DancingLion, TalkingAnimal };