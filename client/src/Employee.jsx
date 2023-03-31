import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './styles/Employee.css';

function Employee() {
    const [sinNumber, setSinNumber] = useState('');
    const [bookings, setBookings] = useState([]);
    const [rentings, setRentings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [visible, setVisible] = useState(false);


    const fetchBookings = async () => {
        const bookingData = await axios.get(`http://localhost:5000/api/bookings`);
        setBookings(bookingData.data);
    };

    const fetchRentings = async () => {
        const rentingData = await axios.get(`http://localhost:5000/api/rentings`);
        setRentings(rentingData.data);
    };



    const handleSearch = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(`http://localhost:5000/api/employees`);
            
            for (const employee in response.data) {
                if (parseInt(response.data[employee].sin) === parseInt(sinNumber)) {
                    console.log('Employee found!')
                    fetchBookings();
                    fetchRentings();
                    setVisible(true);
                    setErrorMessage('');
                    return
                } else {
                    setBookings([]);
                    setErrorMessage('Please enter an employee SIN number.');
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleSinNumberChange = (event) => {
        setSinNumber(event.target.value);
    };

    const handleMove = async (bookingId) => {
        let rentingDate = new Date().toISOString().slice(0, 10);
        console.log(bookingId)
        try {
            await axios.put('http://localhost:5000/api/moveBooking', {bookingId, rentingDate}
            ).then((res) => {
                fetchBookings();
                fetchRentings();
            })

        } catch (error) {
            console.error(error);
            // Optionally, show an error message to the user
        }
    }

    return (
        <div className='Employee'>
            <div className='Employee-header'>
                <h1>Employee Portal</h1>
                <form onSubmit={handleSearch}>
                    <label htmlFor="sinNumber">Enter SIN number:</label>
                    <input type="text" id="sinNumber" value={sinNumber} onChange={handleSinNumberChange} />
                    <button type="submit">Search</button>
                </form>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            {visible && (
                <>
            {bookings.length > 0 && (
                <>
                    <h1>Bookings</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer SIN</th>
                                <th>Room ID</th>
                                <th>Booking Date</th>
                                <th>Check-in Date</th>
                                <th>Check-out Date</th>
                                <th>Move to Renting</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.customersin}</td>
                                    <td>{booking.roomid}</td>
                                    <td>{booking.bookingdate.slice(0, 10)}</td>
                                    <td>{booking.chekindate.slice(0, 10)}</td>
                                    <td>{booking.checkoutdate.slice(0, 10)}</td>
                                    <td><button onClick={() => handleMove(booking.id)}>Renting</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {rentings.length > 0 && (
                <>
                    <h1>Rentings</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Renting ID</th>
                                <th>Customer SIN</th>
                                <th>Room ID</th>
                                <th>Renting Date</th>
                                <th>Check-in Date</th>
                                <th>Check-out Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentings.map((renting) => (
                                <tr key={renting.id}>
                                    <td>{renting.id}</td>
                                    <td>{renting.customersin}</td>
                                    <td>{renting.roomid}</td>
                                    <td>{renting.rentingdate.slice(0, 10)}</td>
                                    <td>{renting.chekindate.slice(0, 10)}</td>
                                    <td>{renting.checkoutdate.slice(0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            </>
            )}
        </div>
    );
}

export default Employee;