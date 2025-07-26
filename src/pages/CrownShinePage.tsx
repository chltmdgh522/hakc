import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import darkBg from "../assets/암흑배경.png";
import crownShine from "../assets/빛나는왕관.png";

interface CrownShinePageProps {
  onComplete?: () => void;
  onGoToQuest1?: () => void;
}

const CrownShinePage: React.FC<CrownShinePageProps> = ({ onComplete, onGoToQuest1 }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: 360,
      filter: [
        "brightness(1)",
        "brightness(1.5)",
        "brightness(1)",
        "brightness(1.7)",
        "brightness(1)"
      ],
      transition: { duration: 2, ease: "easeInOut" },
    }).then(() => {
      if (onComplete) onComplete();
    });
  }, [controls, onComplete]);

  const handleClick = () => {
    if (onGoToQuest1) {
      onGoToQuest1();
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
      style={{ backgroundImage: `url(${darkBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      onClick={handleClick}
    >
      <motion.img
        src={crownShine}
        alt="빛나는 왕관"
        className="w-[250px] h-auto max-w-[90%] select-none pointer-events-none"
        initial={{ rotate: 0, filter: "brightness(1)" }}
        animate={controls}
      />
    </div>
  );
};

export default CrownShinePage; 