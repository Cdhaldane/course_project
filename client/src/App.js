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
// import BookingPage from './BookingPage';
// import NotFoundPage from './NotFoundPage';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/tables" element={<TableList />} />
        {/* <Route exact path="/booking" component={BookingPage} />
        <Route component={NotFoundPage} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
