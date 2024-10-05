import {BrowserRouter,Routes, Route} from 'react-router-dom';
import './App.css'
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Myaccount from './Pages/Myaccount'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/:userId/account" element={<Myaccount />} />

       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
