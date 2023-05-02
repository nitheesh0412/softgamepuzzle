import './App.css';
import React, { useState, useEffect } from "react";
import Home from './components/Home';
import Dashboard from './components/Dashboard.js';
import Login from './components/Login';
import Register from './components/Register';
import Inspect from './components/Inspect';
import Slide from './components/slidepuzzle/Slide';
import Admindashboard from './components/Admindashboard'
import Adminlogin from './components/Adminlogin';
import 'bootstrap/dist/css/bootstrap.css';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isadminLoggedIn, setIsadminLoggedIn] = useState(false);
  const user = localStorage.getItem('emailPrefix');
  const username = JSON.parse(user);
  const admin = JSON.parse(localStorage.getItem('admin'));
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the user is logged in by looking for the token in the local storage
    const token = localStorage.getItem('new');
    console.log(token)
    const admin_token = localStorage.getItem('new_admin');
    console.log(admin_token)
    setIsLoggedIn(!!token);
    setIsadminLoggedIn(!!admin_token);
  }, [isLoggedIn,isadminLoggedIn]);

  const handleLogout = () => {
    // Remove the token from the local storage
    localStorage.removeItem('new');
    localStorage.removeItem('emailPrefix');
    // Update the isLoggedIn state
    setIsLoggedIn(false);
    navigate('/login');
  };

  const adminlogout = () =>{
    localStorage.removeItem('admin');
    localStorage.removeItem('new_admin');
    setIsadminLoggedIn(false);
    navigate('/adminlogin');
  }

  return (
    <div className='page-container'>
      <div className='content-wrap'>
        {/* links to routes */}
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Softgame</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link " to="" >Home</NavLink>
                </li>
                  { isLoggedIn  ? 
                    <li className="nav-item">
                  <NavLink className="nav-link " to= {`/${username}/dashboard`}>Dashboard</NavLink>
                </li>:
                <li className="nav-item">
                </li>
                    
                  }
                  {isadminLoggedIn ?
                  <li className="nav-item">
                  <NavLink className="nav-link " to={`/${admin}/admindashboard`} >Dashboard</NavLink>
                </li>:
                <li className="nav-item">
                </li>
                  }
                
                {isLoggedIn || isadminLoggedIn ?
                  <li className="nav-item">


                    <Dropdown className="custom-dropdown">
                      <Dropdown.Toggle className='rounded-circle'>
                        <FontAwesomeIcon icon={faUser} className='ms-2' />
                      </Dropdown.Toggle>
                      {isLoggedIn ? 
                        <Dropdown.Menu>
                        <Dropdown.Item href={`/${username}/dashboard`}>{username}</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>logout</Dropdown.Item>

                      </Dropdown.Menu>
                      :
                      <Dropdown.Menu>
                        <Dropdown.Item href={`/${admin}/admindashboard`}>{admin}</Dropdown.Item>
                        <Dropdown.Item onClick={adminlogout}>logout</Dropdown.Item>

                      </Dropdown.Menu>
                      }
                      
                    </Dropdown>
                  </li> :

                  <li className="nav-item">
                    <Dropdown className="custom-dropdown">
                      <Dropdown.Toggle className='rounded-circle'>
                        <FontAwesomeIcon icon={faUser} className='ms-2' />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="/login">user</Dropdown.Item>
                        <Dropdown.Item href='/adminlogin'>admin</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                  </li>

                }


              </ul>

            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={`/${username}/dashboard`} element={<Dashboard />} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inspect" element={<Inspect />} />
          <Route path='/adminlogin' element={<Adminlogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path={`/${admin}/admindashboard`} element={<Admindashboard />} />
          <Route path = '/slide' element={<Slide/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
