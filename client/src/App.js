import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './Homepage';
import './styles/App.css';
import Header from './Header';
import TableList from './Tables';
import Booking from './Booking';
import Employee from './Employee';
import Views from './Views';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/tables" element={<TableList />} />
        <Route exact path="/employee" element={<Employee />} />
        <Route path='/booking/:indate/:outdate/:id/:address' element={<Booking />} />
        <Route exact path="/views" element={<Views />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
