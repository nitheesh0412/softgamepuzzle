import React, { useState } from "react";
import Tile from "./Tile";
import { TILE_COUNT, GRID_SIZE, BOARD_SIZE } from "./constants"
import { canSwap, shuffle, swap, isSolved } from "./helpers"
import { useNavigate } from "react-router-dom";

function Board({ imgUrl, move, setmove,setRunning,setTime, time}) {

  const handleGameWon = async () => {
    const username = localStorage.getItem("user");
    const useremail = JSON.parse(username);
    try {
      console.log(move)
      console.log(time)
      const response = await fetch(`http://localhost:3001/slidepuzzle/${useremail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noofmoves: move,
          timeslide: time,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      navigate("/slide");
      setTime(0);
      setmove(0);
    } catch (error) {
      console.error(error);
    }
  };
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
  const [isStarted, setIsStarted] = useState(false);
  // console.log('is started:', isStarted)

  const shuffleTiles = () => {

    const shuffledTiles = shuffle(tiles)
    setTiles(shuffledTiles);
  }

  const swapTiles = (tileIndex) => {
    if (canSwap(tileIndex, tiles.indexOf(tiles.length - 1))) {
      const swappedTiles = swap(tiles, tileIndex, tiles.indexOf(tiles.length - 1))
      setTiles(swappedTiles)
      setmove(move+1)
    }
  }

  const handleTileClick = (index) => {
    swapTiles(index)
    // setmove(move+1)
  }

  const handleShuffleClick = () => {
    // handleGameWon();
    shuffleTiles()
    setRunning(false)
    setTime(0)
    setRunning(true)
    setmove(0)

  }

  const handleStartClick = () => {
    
    shuffleTiles()
    setTime(0)
    setIsStarted(true)
    setRunning(true)
    
  }

  const pieceWidth = Math.round(BOARD_SIZE / GRID_SIZE);
  const pieceHeight = Math.round(BOARD_SIZE / GRID_SIZE);
  const style = {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  };
  const hasWon = isSolved(tiles)
  if (isStarted && hasWon){
    handleGameWon();
    
  }
  return (
    <>
    {!isStarted ?
        (<button className="centers" onClick={() => handleStartClick()}>Start</button>) :
        (<button className = "centers" onClick={() => handleShuffleClick()}>Restart</button>)}
      <ul style={style} className="board">
        {tiles.map((tile, index) => (
          <Tile
            key={tile}
            index={index}
            imgUrl={imgUrl}
            tile={tile}
            width={pieceWidth}
            height={pieceHeight}
            handleTileClick={handleTileClick}
          />
        ))}
      </ul>
      {hasWon && isStarted && <div>Puzzle solved 🧠 🎉</div>}
      
    </>
  );
}

export default Board;
