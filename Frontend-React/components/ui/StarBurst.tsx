import * as React from "react";

type StarBurstProps = {
  color: string;
};

export const StarBurst: React.FC<StarBurstProps> = ({ color }) => {
  return (
    <div className="relative">
      <div className="relative">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className={`${color} drop-shadow-lg`}
          style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))" }}
        >
          <path
            d="M40 5 L45 15 L55 10 L50 20 L65 20 L55 30 L70 35 L55 40 L65 50 L50 45 L55 60 L45 50 L40 65 L35 50 L25 60 L30 45 L15 50 L25 40 L10 35 L25 30 L15 20 L30 20 L25 10 L35 15 Z"
            fill="currentColor"
          />
        </svg>
        <div className="absolute bottom-4 inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-[12px] transform -rotate-12 text-center leading-tight">
            NEW!
          </span>
        </div>
      </div>
    </div>
  );
};
