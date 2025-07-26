import React from "react";
import setIcon from "../assets/Button/ set.png";
import set2Icon from "../assets/Button/ set2.png";

interface SettingsIconProps {
  onClick: () => void;
  variant?: "default" | "colored"; // default는 set.png, colored는 set2.png
  position?: { x: number; y: number };
}

const SettingsIcon: React.FC<SettingsIconProps> = ({ 
  onClick, 
  variant = "default",
  position = { x: 12, y: 12 }
}) => {
  const iconSrc = variant === "colored" ? set2Icon : setIcon;

  return (
    <img
      src={iconSrc}
      alt="설정"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "24px",
        height: "24px",
        cursor: "pointer",
        zIndex: 100,
        userSelect: "none"
      }}
      onClick={onClick}
      draggable={false}
    />
  );
};

export default React.memo(SettingsIcon); 