import React, { useState, useEffect } from 'react';
import './Inspect.css';
import { useNavigate } from 'react-router-dom';

function Inspect() {
  const [showHiddenText, setShowHiddenText] = useState(false);
  const [answer, setAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [numWrongAnswers, setNumWrongAnswers] = useState(0);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setShowHiddenText(true);
  };

  const handleMouseLeave = () => {
    setShowHiddenText(false);
  };

  const handleInspect = async (event) => {
    const username = localStorage.getItem('user');
    const useremail = JSON.parse(username);
    console.log(useremail);
    if (event.key === 'Enter') {
      console.log(timeSpent);
      console.log(numWrongAnswers);
      try {
        if (answer.toLowerCase() === '100') {
          const response = await fetch(`http://localhost:3001/inspect/${useremail}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "timeSpent" : timeSpent,
            "wrongAnswers" : numWrongAnswers
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }
          navigate('/slide');
        } 
        else {
          alert('Your answer is not correct. Think again.');
          setNumWrongAnswers(numWrongAnswers + 1);
        }
        setAnswer('');
        
      } catch (error) {
        console.error(error);
        alert('Failed to update user');
      }


    }
  };
  const handleInputChange = (event) => {
    setAnswer(event.target.value);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prevTimeSpent) => prevTimeSpent + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeSpent]);

  useEffect(() => {
    setNumWrongAnswers(0);
    setTimeSpent(0);
  }, []);

  return (
    <div>
      <h1>The Mystery Page</h1>
      <p className="description">
        {/* <p>this is the answer - "Inspect"</p> */}
        I am a mystery, that hides in plain sight,<br />
        But to reveal me, you must see with new light.<br />
        My code is complex, and hard to discern,<br />
        But with persistence and wit, you'll find what you yearn.<br /><br />
        I am a secret, that's meant to be found,<br />
        Hidden deep within the code's profound.<br />
        But beware, for the road is long,<br />
        And the journey to reveal me, will test the strong.<br /><br />
        So take up the challenge, and unravel my disguise,<br />
        And the secret that's hidden, will be your ultimate prize.
      </p>

      <div className="image-grid">
        <div className="image-wrapper">
          <img
            src="https://picsum.photos/300/300?random=2"
            alt="Image 1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <div className="overlay"></div>
          <div className="text-overlay">
            <p className="hidden-text">
              I am a path that seems to lead you astray, But keep on walking,
              don't lose your way. I promise a treasure at the end of the trail,
              But beware, for my promises may be to no avail.
            </p>
            <span>I am hidden in plain sight, inside the code's might.</span>
          </div>
        </div>
        <div className="image-wrapper">
          <img src="https://picsum.photos/300/300?random=1" alt="Image 2" />
          <div className="overlay"></div>
          <div className="text-overlay">
            <p className="hidden-text">
              You follow me with hope in your heart, But soon you'll find we're
              worlds apart. For at the end of my winding way, A dead end awaits,
              where you must stay.
            </p>
            <p>
              I am the path less traveled, a journey with no end, follow me if you
              dare, for I lead to a dead end.
            </p>
          </div>
        </div>
        <div className="image-wrapper">
          <img src="https://picsum.photos/300/300?random=3" alt="Image 3" />
          <div className="overlay"></div>
          <div className="text-overlay">
            <p className="hidden-text">
              My secret lies not in what I give, But in what I take away, for as
              long as you live. So turn back now, before it's too late, And find
              the truth before it's sealed by fate.
            </p>
          </div>
        </div>
      </div>

      <p className="description">
        I am a number, not hard to find,
        Just look to the console, and you'll unwind.
        Fifty is where I make my stand,
        And the code you seek, is close at hand.
      </p>
      <div className='center mb-1'>
        <input
          type='text'
          placeholder='Enter your answer here'
          value={answer}
          onChange={handleInputChange}
          onKeyDown={handleInspect}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: 'yellow',
            color: 'black',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
          }}
        />

      </div>
      <div className='center '>
        <p>press enter after you answered</p>
      </div>

    </div>
  );
}
export default Inspect;