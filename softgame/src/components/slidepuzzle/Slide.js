import React, { useState, useEffect } from "react";
import Board from "./Board";
import { updateURLParameter } from "./helpers"
import './slide.css'

function Slide() {
  const [imgUrl, setImgUrl] = useState("")
  const [move, setmove] = useState(0)
  // const [gamestarted,setgamestarted] =useState(0)
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("img")) {
      setImgUrl(urlParams.get("img"))
    }
    let timerID;

    if (running) {
      timerID = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timerID);
  }, [running])

  const handleImageChange = (e) => {
    setImgUrl(e.target.value)
    window.history.replaceState("", "", updateURLParameter(window.location.href, "img", e.target.value))
  }


  return (
    <div className="Slide">
      <h1> sliding puzzle</h1>
      <p className="textss ms-5 me-5 mt-3">

{">"}{">"} To play the game, the player must slide tiles into the empty space in order to move them around the board. <br/>
{">"}{">"} The player can only move a tile if there is an empty space adjacent to it.<br/>
{">"}{">"} The player should use strategy and planning to move the tiles into their correct positions, while also keeping in mind that they may need to move tiles out of the way to create a clear path to the empty space.
      </p>
      <div class="row">
        <div className="col-3">
        <h4 className="">moves = {move}</h4>
      <h4 className="">Timer : {time}</h4>
        </div>
        <div className="col-9">
        <Board imgUrl={imgUrl} move = {move} setmove = {setmove} setRunning = {setRunning} setTime = {setTime} time = {time} />
        </div>
      </div>
      
      
      <input className="large-input" placeholder="paste a image link to play your own version of sliding puzzle" value={imgUrl} onChange={handleImageChange} />
    </div>
  );
}

export default Slide;
