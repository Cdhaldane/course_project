import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Homepage.css';

function Homepage() {
  const [hotels, setHotels] = useState([]);
  const [chainHotels, setChainHotels] = useState([]);
  const [selectedHotelChain, setSelectedHotelChain] = useState(null);

  useEffect(() => {
    async function fetchHotels() {
      const response = await axios.get('http://localhost:5000/api/hotelChains').then((res) => {
        setChainHotels(res.data);
        console.log(res.data)
      })

    }

    fetchHotels();
  }, []);

  const handleSubmit = async (event) => {
    const form = event.target;
    const formData = new FormData(form);

    const response = await axios.get('http://localhost:5000/api/getRooms', {
      body: formData,
    }).then((res) => {
      console.log(res.data)
    })
  };

  const handleHotelChainClick = (hotelChain) => {
    setSelectedHotelChain(hotelChain);

    const response = axios.get('http://localhost:5000/api/getHotel', {
      params: {
        coaddress: hotelChain
      }
    }).then((res) => {
      setHotels(res.data)
      console.log(res.data)
    })

  };


  return (
    <div className="Homepage">
      <header className="Homepage-header">
        <h1>Welcome to Vortex Hotels</h1>
        <p>Search for available rooms and make bookings or direct rentals with ease!</p>
      </header>
      <div className="Homepage-form">
        {chainHotels.length > 0 && (
          <div className='hotelChain'>
            <label htmlFor="hotelChain">Hotel Chain:</label>
            <select id="hotelChain" name="hotelChain" onChange={(e) => handleHotelChainClick(e.target.value)}>
              <option value="">All Hotel Chains</option>
              {chainHotels.map((hotel) => (
                <option value={hotel.coaddress}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <section className="Homepage-section">
        <h2>Search for Available Rooms</h2>
        <form className="Homepage-form" onSubmit={handleSubmit}>


          <label htmlFor="checkinDate">Check-in Date:</label>
          <input type="date" id="checkinDate" name="checkinDate" required />

          <label htmlFor="checkoutDate">Check-out Date:</label>
          <input type="date" id="checkoutDate" name="checkoutDate" required />

          <label htmlFor="capacity">Room Capacity:</label>
          <input type="number" id="capacity" name="capacity" min="1" max="10" />

          <label htmlFor="view">View:</label>
          <input type="text" id="view" name="view" />

          <label htmlFor="price">Price Range:</label>
          <div className="Homepage-priceRange">
            <input type="number" id="minPrice" name="minPrice" min="0" max="5000" placeholder="Min" />
            <span> - </span>
            <input type="number" id="maxPrice" name="maxPrice" min="0" max="5000" placeholder="Max" />
          </div>



          <button type="submit">Search</button>

          
        </form>
      </section>

      {selectedHotelChain && (
        <section className="Homepage-section">
          <h2>Search Results for {selectedHotelChain}</h2>
          {hotels.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <ul>
              {hotels.map((hotel) => (
                <li key={hotel.coaddress}>
                  <h3>{hotel.hotelid}</h3>
                  <p>{hotel.telephone}</p>
                  <p>{hotel.email}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="Homepage-section">
        <h2>Already have a Booking?</h2>
        <p>If you've already made a booking and want to manage it, please go to our<Link to="/booking"> Booking Page</Link>.</p>
      </section>
    </div>

    
  );
}

export default Homepage;