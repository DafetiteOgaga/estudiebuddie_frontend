import { motion } from "framer-motion";

function CoinsRain() {
  const coins = Array.from({ length: 10 });

  return (
    <div className="relative w-full h-screen bg-sky-100 overflow-hidden">
      {coins.map((_, i) => (
        <motion.img
          key={i}
          src="/assets/coin.png"
          alt="coin"
          className="absolute w-12 h-12"
          initial={{ y: -100, x: Math.random() * window.innerWidth }}
          animate={{ y: window.innerHeight + 50, rotate: 720 }}
          transition={{ duration: 2 + Math.random() * 1.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
}
export { CoinsRain };