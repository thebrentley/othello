import React from "react";

interface BoardCellProps {
  cell: {
    token: string;
    isPreview?: boolean;
    isCellValid?: boolean;
    isAffected?: boolean;
  };
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  className?: string;
}

export const BoardCell: React.FC<BoardCellProps> = ({
  cell,
  onClick,
  onHover,
  onLeave,
}) => {
  const renderToken = () => {
    if (cell.isCellValid) {
      const borderColor = cell.token === "W" ? "border-white" : "border-black";
      return <div className={`w-12 h-12 rounded-full border ${borderColor}`} />;
    }

    switch (cell.token) {
      case "W":
        return (
          <div
            className={`w-12 h-12 rounded-full ${
              cell.isPreview ? "bg-white/60" : ""
            } ${cell.isCellValid ? "border border-white" : ""} ${
              cell.isAffected ? "border border-black bg-gray-300" : "bg-white"
            }`}
          />
        );
      case "B":
        return (
          <div
            className={`w-12 h-12 rounded-full bg-black ${
              cell.isPreview ? "bg-black/60" : ""
            } ${cell.isCellValid ? "border border-black" : ""} ${
              cell.isAffected ? "border border-white" : ""
            }`}
          />
        );
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
