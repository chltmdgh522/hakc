import React from "react";
import { motion, useAnimation } from "framer-motion";

interface FadeOutCircleProps {
  image: string;
  duration?: number;
  onComplete?: () => void;
}

const FadeOutCircle: React.FC<FadeOutCircleProps> = ({ image, duration = 1200, onComplete }) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      clipPath: "circle(0% at 50% 50%)",
      transition: { duration: duration / 1000, ease: "easeInOut" },
    }).then(() => {
      if (onComplete) onComplete();
    });
  }, [controls, duration, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center z-0">
      <motion.div
        initial={{ clipPath: "circle(100% at 50% 50%)" }}
        animate={controls}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
    </div>
  );
};

export default FadeOutCircle; 