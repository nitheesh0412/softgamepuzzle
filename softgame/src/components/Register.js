import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './comp.css';
import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import logo from '../components/logos/logo.png';
import { useNavigate } from 'react-router-dom';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', {
        email,
        password,
      });
      console.log(response.data);
      // If successful, navigate to home page or show success message
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Unknown error occurred');
      }
    }
  };

  return (
    <div><h1 className='text-center mt-3 text'>please register here</h1>
    <div className="hello">
      
      <div className="container h-100">
        <div className="d-flex justify-content-center h-100">
          <div className="user_card">
            <div className="d-flex justify-content-center">
              
              
              <div className="brand_logo_container">
                <img src={logo} className="brand_logo" alt="Logo" />
              </div>
            </div>
            <div className="d-flex justify-content-center form_container">
              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                    </span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="form-control input_user"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-group mb-2">
                  <div className="input-group-append">
                    <span className="input-group-text">
                    <FontAwesomeIcon icon={faKey} />
                    </span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="form-control input_pass"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <div className="d-flex justify-content-center mt-3 login_container pt-2">
                  <button
                    type="submit"
                    name="button"
                    className="btn login_btn"
                  >
                    Signup
                  </button>
                </div>
                <div class="mt-4">
                  <div class="d-flex justify-content-center links">
                    Already registered? <a href="/login" class="ml-2">Login here</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Register;
