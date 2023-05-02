import './Home.css'
import man from '../components/logos/man.jpg'
import React, { useState, useEffect } from 'react';
import { BsFillArrowDownCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
function Home() {
  const games = [
    {
      name: 'Mystery Page',
      gameurl : '/inspect',
      description: 'this game consists of hints that lead to other hints, careful! there may be deadends, enter the answer after you solved hints in the text box.',
    },
    {
      name: 'The 16',
      gameurl : '/slide',
      description: 'A sliding puzzle is a game where a player must slide tiles around a board in order to arrange them in a specific pattern.',
    }
  ];
  const [currentGame, setCurrentGame] = useState("");

  const handleMouseEnter = (gameName) => {
    setCurrentGame(gameName);
  };

  const handleMouseLeave = () => {
    setCurrentGame("");
  };

  const handleGameClick = (game) => {
    navigate(game.gameurl)
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Check if the user is logged in by looking for the token in the local storage
    const token = localStorage.getItem('new');
    const tok = localStorage.getItem('new_admin');
    console.log(token)
    setIsLoggedIn(!!token);
    setIsLoggedIn(!!tok)
  }, [isLoggedIn]);
  const navigate = useNavigate();
  const inspectgame = () => {
    if (isLoggedIn == true) {
      navigate('/inspect')
    }
    else {
      navigate('/register')
    }
  };
  return (
    <div className='container'>
      <div>
        <h1>Welcome to the Treasure Hunt Game!</h1>

      </div>
      <div className='ms-3 me-3'>
        <p class="texts">hello guys, this is an incredible puzzle game, there are 2 levels in this game</p>
      </div>
      <div className='gridimg'>
          <img src= {man} alt='image' className='image k'/>
          <div className='listofgame'>
          <div className="game-list">
      {games.map((game) => (
        <div
          key={game.name}
          className="game"
          onMouseEnter={() => handleMouseEnter(game.description)}
          onMouseLeave={() => handleMouseLeave()}
          onClick={() => handleGameClick(game)}
        >
          <p className="game-name pt-3">{game.name}</p>
          {currentGame === game.description && (
            <div className="game-description-container">
              <div className="game-description ">{game.description}</div>
            </div>
          )}
        </div>
      ))}
    </div>
          </div>
        
      </div>
      <div>
        <p class="center">click here to start the game   <BsFillArrowDownCircleFill className='ms-2 mt-1' /></p>
        <div class="center">
          <button onClick={inspectgame} type="submit" name="button" className="btn btn-danger btn-lg">
            start
          </button>
        </div>
      </div>

    </div>
  )
}

export default Home;