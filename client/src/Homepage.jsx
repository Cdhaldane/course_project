import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Homepage.css';

function Homepage() {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [chainHotels, setChainHotels] = useState([]);
  const [selectedHotelChain, setSelectedHotelChain] = useState(null);
  const [dates, setDates] = useState([]); // [checkinDate, checkoutDate
  const history = useNavigate();


  useEffect(() => {
    async function fetchHotels() {
      const response = await axios.get('http://localhost:5000/api/hotelChains').then((res) => {
        setChainHotels(res.data);
      })
    }
    fetchHotels();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    setDates([formData.get('checkinDate'), formData.get('checkoutDate')])
    const response = hotels.map(hotel =>
      axios.get('http://localhost:5000/api/getFormRooms', {
        params: {
          hotelid: hotel.hotelid,
          capacity: formData.get('capacity'),
          view: formData.get('view'),
          minPrice: formData.get('minPrice'),
          maxPrice: formData.get('maxPrice'),
          checkinDate: formData.get('checkindate'),
          checkoutDate: formData.get('checkoutdate'),
        }
      }
      ))
    Promise.all(response).then(roomResponses => {
      const allRooms = roomResponses.reduce((accumulator, currentResponse) => {
        return accumulator.concat(currentResponse.data);
      }, []);
      console.log(allRooms)
      setRooms(allRooms);
    });
  };


  const handleHotelChainClick = async (hotelChain) => {
    const response = await axios.get('http://localhost:5000/api/getHotel', {
      params: {
        coaddress: hotelChain
      }
    });
    const hotels = response.data;
    const hotelAddress = hotels[0].address;
    setSelectedHotelChain({ hotelChain, hotelAddress });
    setHotels(hotels);
    const roomRequests = hotels.map(hotel =>
      axios.get('http://localhost:5000/api/getRoom', {
        params: {
          hotelid: hotel.hotelid
        }
      })
    );
    Promise.all(roomRequests).then(roomResponses => {
      const allRooms = roomResponses.reduce((accumulator, currentResponse) => {
        return accumulator.concat(currentResponse.data);
      }, []);
      setRooms(allRooms);
    });
  };

  const roomsByHotel = rooms.reduce((accumulator, currentRoom) => {
    const hotelId = currentRoom.hotelid;
    if (!accumulator[hotelId]) {
      accumulator[hotelId] = [];
    }
    accumulator[hotelId].push(currentRoom);
    return accumulator;
  }, {});

  const bookRoom = (room, history, dates, hotelId) => {
    let address = hotels.find(hotel => hotel.hotelid === parseInt(hotelId))?.address
    if(dates.length === 0) {
      alert('Please select a check-in and check-out date')
      return
    }
    history(`/booking/${dates[0]}/${dates[1]}/${room.roomid}/${address}`);
  }

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
              <option value="">Select a Hotel Chain</option>
              {chainHotels.map((hotel, index) => (
                <option value={hotel.coaddress} key={index}>
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
          <h2>Search Results for {selectedHotelChain.hotelChain}</h2>
          {(!Array.isArray(rooms) || rooms.length === 0) ? (
            <p>No results found.</p>
          ) : (
            <div >
              {Object.keys(roomsByHotel).map((hotelId) => (
                <div key={hotelId} className="Homepage-hotelCard">
                  <h3 className="Homepage-hotelTitle">Hotel ID: {hotelId} - Address: {hotels.find(hotel => hotel.hotelid === parseInt(hotelId))?.address}</h3>
                  <div className="Homepage-rooms">
                    {roomsByHotel[hotelId].map((room) => (
                      <div key={room.roomnum} className="Homepage-roomCard">
                        <h4 className="Homepage-roomTitle">Room Number: {room.roomnum}</h4>
                        <img src={process.env.PUBLIC_URL + '/hotelroom.svg'}/>
                        <p><strong>View:</strong> {room.view}</p>
                        <p><strong>Price:</strong> ${room.price}</p>
                        <p><strong>Capacity:</strong> {room.capacity}</p>
                        <p><strong>Extendable:</strong> {room.extendable}</p>
                        <p><strong>Amenities:</strong> {room.amenities}</p>
                        <p><strong>Damages:</strong> {room.damages}</p>
                        <button onClick={() => bookRoom(room, history, dates, hotelId)}>Book Room</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}
        </section>
      )}

      <section className="Homepage-section">
        <h2>Already have a Booking?</h2>
        <p>If you've already made a booking and want to manage it, please go to our<Link to="/employee"> Booking Page</Link>.</p>
      </section>
    </div>
  );
}

export default Homepage;