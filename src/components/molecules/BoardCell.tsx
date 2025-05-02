import React from "react";

interface BoardCellProps {
  token: string | number;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  className?: string;
}

export const BoardCell: React.FC<BoardCellProps> = ({
  token,
  onClick,
  onHover,
  onLeave,
}) => {
  const renderToken = () => {
    switch (token) {
      case "W":
        return <div className="w-12 h-12 rounded-full bg-white" />;
      case "B":
        return <div className="w-12 h-12 rounded-full bg-black" />;
      default:
        return <></>;
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex items-center justify-center cursor-pointer flex items-center justify-center bg-gray-700`}
    >
      {renderToken()}
    </div>
  );
};
