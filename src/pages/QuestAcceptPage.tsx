import React from "react";
import { motion } from "framer-motion";
import questPaper from "../assets/3_퀘스트수락용지.png";
import acceptBtn from "../assets/3_버튼_수락.png";
import bg3 from "../assets/3_배경.png";

interface QuestAcceptPageProps {
  onAccept?: () => void;
}

const QuestAcceptPage: React.FC<QuestAcceptPageProps> = ({ onAccept }) => {
  return (
    <div
      className="relative w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bg3})` }}
    >
      <motion.img
        src={questPaper}
        alt="퀘스트 수락 용지"
        style={{
          position: 'absolute',
          top: '207px',
          left: '10px',
          width: '355px',
          height: 'auto'
        }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <button
        style={{
          position: 'absolute',
          top: '628px',
          left: '38px',
          width: '300px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          outline: 'none'
        }}
        onClick={onAccept}
      >
        <img src={acceptBtn} alt="수락 버튼" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </button>
    </div>
  );
};

export default QuestAcceptPage; 