import React, { useState, useEffect } from "react";
import { getMatrixPosition, getVisualPosition } from "./helpers";
import { TILE_COUNT, GRID_SIZE, BOARD_SIZE } from "./constants"

function Tile(props) {
  const { tile, index, width, height, handleTileClick, imgUrl } = props;
  const { row, col } = getMatrixPosition(index);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const visualPos = getVisualPosition(row, col, width, height);
    setTranslateX(visualPos.x);
    setTranslateY(visualPos.y);
  }, [row, col, width, height]);

  const tileStyle = {
    width: `calc(100% / ${GRID_SIZE})`,
    height: `calc(100% / ${GRID_SIZE})`,
    transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
    backgroundImage: `url(${imgUrl})`,
    backgroundSize: `${BOARD_SIZE}px`,
    backgroundPosition: `${(100 / (GRID_SIZE - 1)) * (tile % GRID_SIZE)}% ${(100 / (GRID_SIZE - 1)) * (Math.floor(tile / GRID_SIZE))}%`,
    // Is last tile?
    opacity: tile === TILE_COUNT - 1 ? 0 : 1,
  };

  return (
    <li
      style={tileStyle}
      className="tile"
      onClick={() => handleTileClick(index)}
    >
      {!imgUrl && `${tile + 1}`}
    </li>
  );
}

export default Tile;
