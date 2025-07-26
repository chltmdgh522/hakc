import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import q3SuccessBg from "../assets/Q3-성공-배경.png";
import q3SuccessCrown from "../assets/Q3-성공_왕관.png";

interface Q3SuccessPageProps {
  onComplete?: () => void;
  onNext?: () => void;
}

const Q3SuccessPage: React.FC<Q3SuccessPageProps> = ({ onComplete, onNext }) => {
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
    if (onNext) {
      onNext();
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center cursor-pointer"
      style={{ backgroundImage: `url(${q3SuccessBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      onClick={handleClick}
    >
      <motion.img
        src={q3SuccessCrown}
        alt="Q3 성공 왕관"
        style={{
          width: '290px',
          height: 'auto',
          marginTop: '20%',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        initial={{ rotate: 0, filter: "brightness(1)" }}
        animate={controls}
      />
    </div>
  );
};

export default Q3SuccessPage; 