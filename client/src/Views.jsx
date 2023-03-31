import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/RoomViews.css';


function RoomViews() {
  const [availableRoomsPerArea, setAvailableRoomsPerArea] = useState([]);
  const [capacityPerHotel, setCapacityPerHotel] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelChain, setHotelChain] = useState([]);
  const [rooms, setRooms] = useState([]);



  useEffect(() => {
    async function fetchRoomViews() {
      try {
        const hotels = await axios.get('http://localhost:5000/api/hotels');
        setHotels(hotels.data);
        const hotelChain = await axios.get('http://localhost:5000/api/hotelChains');
        console.log(hotelChain.data);
        setHotelChain(hotelChain.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRoomViews();
  }, []);

  const handleHotels = async (hotelChain) => {
    const roomsHotels = await axios.get('http://localhost:5000/api/rooms');
    const hotelRooms = roomsHotels.data.filter((hotel) => hotel.hotelid === parseInt(hotelChain));
    setRooms(hotelRooms);
  }

  const handleHotelChain = async (hotelChain) => {
    const roomsHotels = await axios.get('http://localhost:5000/api/hotels');
    const hotelRooms = roomsHotels.data.filter((hotel) => hotel.coaddress=== hotelChain);
    console.log(hotelRooms);
    setAvailableRoomsPerArea(hotelRooms);
  }

  return (
    <div className="RoomViews">
      <header className="RoomViews-header">
        <h1>Room Views</h1>
        <p>View the number of available rooms per area and the capacity of all rooms in a specific hotel.</p>
      </header>

      <section className="RoomViews-section">
        <h2>Available Rooms per Area</h2>
        <select id="hotels" name="hotels" onChange={(e) => handleHotelChain(e.target.value)}>
              <option value="">All Hotels</option>
              {hotelChain.map((hotel, index) => (
                <option value={hotel.coaddress} key={index}>
                  {hotel.coaddress}
                </option>
              ))}
            </select>
          <table>
            <thead>
              <tr>
                {['Address',  'Available Rooms'].map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {availableRoomsPerArea.map((row, index) => (
                <tr key={index}>
                  <td>{row.address}</td>
                  <td>{row.nrooms}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </section>

      <section className="RoomViews-section">
        <h2>Capacity of all Rooms in a Specific Hotel</h2>
        <select id="hotels" name="hotels" onChange={(e) => handleHotels(e.target.value)}>
              <option value="">All Hotels</option>
              {hotels.map((hotel, index) => (
                <option value={hotel.hotelid} key={index}>
                  {hotel.address}
                </option>
              ))}
            </select>
            <table>
            <thead>
              <tr>
                {['Room Number', 'Total Capacity'].map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((row, index) => (
                <tr key={index}>
                  <td>{row.roomnum}</td>
                  <td>{row.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>  
      </section>
    </div>
  );
}

export default RoomViews;