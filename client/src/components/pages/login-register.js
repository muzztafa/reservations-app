import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

function Login_Register() {

  const [justifyActive, setJustifyActive] = useState('tab1');;
  //login state variables
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setloginPassword] = useState('');
  
  //register state variables
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  const navigate = useNavigate ();


  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const login = () => {
    if (loginEmail == "" || loginPassword == ""){
        toast.error('Please provide email and password!', {
            position: toast.POSITION.TOP_RIGHT
        });
        return;
    }
    let formData = new FormData();
    formData["email"] = loginEmail;
    formData["password"] = loginPassword;
    axios.post('http://localhost:5000/users/login',{...formData})
      .then(response => {
        toast.success('User logged in successfully!', {
            position: toast.POSITION.TOP_RIGHT
        });

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("loggedInUser", JSON.stringify(response.data.user))
        navigate('/home')

        // console.log(JSON.parse(localStorage.getItem("loggedInUser")))
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Error: '+error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT
        });
      });
  }

  const register = () => {
    if (registerEmail == "" || registerName == "" || registerPassword == ""){
        toast.error('Please provide all details.', {
            position: toast.POSITION.TOP_RIGHT
        });
        return;
    }
    let formData = new FormData();
    formData["email"] = registerEmail;
    formData["password"] = registerPassword;
    formData["name"] = registerName;

    axios.post('http://localhost:5000/users/register',{...formData})
      .then(response => {
        toast.success('User registered. Please login!', {
            position: toast.POSITION.TOP_RIGHT
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Error: '+error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT
        });
      });
  }

  useEffect(() => {
  }, [loginEmail,loginPassword, registerEmail, registerPassword, registerName]);

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>

        <MDBTabsPane show={justifyActive === 'tab1'}>

          {/* <div className="text-center mb-3">
            <p>Sign in with:</p>

            <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='facebook-f' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='twitter' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='google' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='github' size="sm"/>
              </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div> */}

          <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/>
          <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={loginPassword} onChange={(e) => setloginPassword(e.target.value)}/>

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <MDBBtn style={{ backgroundColor: 'green', color: 'white' }} className="mb-4 w-100" onClick={login}>Login</MDBBtn>
          {/* <p className="text-center">Not a member? <a href="#!">Register</a></p> */}

        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>

          {/* <div className="text-center mb-3">
            <p>Sign un with:</p>

            <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='facebook-f' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='twitter' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='google' size="sm"/>
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='github' size="sm"/>
              </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div> */}

          <MDBInput wrapperClass='mb-4' label='Name' id='form1' type='text' value={registerName} onChange={(e) => setRegisterName(e.target.value)}/>
          {/* <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text'/> */}
          <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email' value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)}/>
          <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)}/>

          {/* <div className='d-flex justify-content-center mb-4'>
            <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' />
          </div> */}

          <MDBBtn className="mb-4 w-100" style={{ backgroundColor: 'green', color: 'white' }}  onClick={register}>Register</MDBBtn>

        </MDBTabsPane>

      </MDBTabsContent>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Login_Register;