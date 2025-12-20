import Confetti from 'react-confetti';

function GameResult({ win }) {
  return (
    <>
      {win ? (
        <Confetti />
      ) : (
        <div className="text-3xl text-red-600">😢 Try Again!</div>
      )}
    </>
  );
}

export { GameResult };