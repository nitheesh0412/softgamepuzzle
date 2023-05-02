import 'bootstrap/dist/css/bootstrap.css'
import './comp.css'
import logo from '../components/logos/logo.png'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Login({setIsLoggedIn,isLoggedIn}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server with the email and password
      const {data} = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });

	  console.log('Received token:', data.token);
	  const tok = data.token;
	  const emailPrefix = email.split('@')[0];
      // Save the JWT token to the local storage
	  localStorage.setItem('user',JSON.stringify(email));
      localStorage.setItem('new', JSON.stringify(tok));
	  localStorage.setItem('emailPrefix', JSON.stringify(emailPrefix));
      // Update the isLoggedIn state
      setIsLoggedIn(true);

      // Redirect to the home page
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };
  return (
	<div className="hello"><h1 className='text-center mt-3 text'>user login</h1>
	  <div class="container h-100">
		<div class="d-flex justify-content-center h-100">
		  <div class="user_card">
			<div class="d-flex justify-content-center">
			  <div class="brand_logo_container">
				<img src={logo} class="brand_logo" alt="Logo" />
			  </div>
			</div>
			<div class="d-flex justify-content-center form_container">
				<form onSubmit={handleSubmit}>
				  <div class="input-group mb-3">
					<div class="input-group-append">
					  <span class="input-group-text">
						<FontAwesomeIcon icon={faUser} />
					  </span>
					</div>
					<input
					  type="email"
					  name=""
					  class="form-control input_user"
					  placeholder="email"
					  value={email}
					  onChange={(e) => setEmail(e.target.value)}
					/>
				  </div>
				  <div class="input-group mb-2">
					<div class="input-group-append">
					  <span class="input-group-text">
						<FontAwesomeIcon icon={faKey} />
					  </span>
					</div>
					<input
					  type="password"
					  name=""
					  class="form-control input_pass"
					  placeholder="password"
					  value={password}
					  onChange={(e) => setPassword(e.target.value)}
					/>
				  </div>
				  <div class="form-group">
					<div class="custom-control custom-checkbox">
					  <input
						type="checkbox"
						class="custom-control-input"
						id="customControlInline"
					  />
					  <label
						class="custom-control-label"
						for="customControlInline"
					  >
						Remember me
					  </label>
					</div>
				  </div>
				  {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
				  <div class="d-flex justify-content-center mt-3 login_container">
					<button type="submit" name="button" class="btn login_btn">
					  Login
					</button>
				  </div>
				  <div class="mt-4">
					<div class="d-flex justify-content-center links">
						Don't have an account? <a href="/register" class="ml-2">Sign Up</a>
					</div>
				</div>
				</form>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  );
			  }
export default Login;