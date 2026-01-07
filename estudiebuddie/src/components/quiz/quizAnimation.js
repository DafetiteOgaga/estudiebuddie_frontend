import Lottie from "lottie-react";
import nervousLion from "../animations/nervous.json";
import timeUpExplosion from "../animations/explosion.json";
import happyLion from "../animations/happy.json";
import sadMonkey from "../animations/sad.json";
import coinBurst from "../animations/coins.json";

function QuizFeedback({ feedback, onDone }) {
	if (!feedback) return null;

	const animations = {
		warning: nervousLion,
		timeup: timeUpExplosion,
		correct: happyLion,
		wrong: sadMonkey,
		coin: coinBurst,
	};

	return (
		<div className="feedback-overlay">
			<Lottie
				animationData={animations[feedback]}
				loop={false}
				onComplete={onDone}
				style={{ width: 250, height: 250 }}
			/>
		</div>
	);
}
export { QuizFeedback }