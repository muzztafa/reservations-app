import logo from './logo.svg';
import './App.css';
import ReservationsList from './components/pages/home';
import Login_Register  from './components/pages/login-register';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
} from "react-router-dom"; 
// import { ExtractJwt } from 'passport-jwt';
// import Routes from './Routes'

function App() {

  return (
    <div className="App">
      {/* This is the alias of BrowserRouter i.e. Router */} 
      <Router> 
        <Routes> 
          {/* This route is for home component  
          with exact path "/", in component props  
          we passes the imported component*/} 
          <Route exact path="/" element={<Login_Register/>} /> 
            
          {/* This route is for about component  
          with exact path "/about", in component  
          props we passes the imported component*/} 
          {/* <Route path="/about" component={About} />  */}
            
          {/* This route is for contactus component 
          with exact path "/contactus", in  
          component props we passes the imported component*/} 
          <Route path="/home" element={<ReservationsList/>} /> 
            
          {/* If any route mismatches the upper  
          route endpoints then, redirect triggers  
          and redirects app to home component with to="/" */} 
          {/* <Redirect to="/login" />  */}
        </Routes> 
      </Router> 
    </div>
  );
}

export default App;
