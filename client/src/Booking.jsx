import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/Booking.css';

function Booking() {
    const { id } = useParams();
    const { indate } = useParams();
    const { outdate } = useParams();
    const { address } = useParams();

    useEffect(() => {
        console.log(id, indate, outdate)
    }, []);

    const handleSubmit = (event) => {
        console.log(2)
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        if (formData.get('sin').length !== 9) {
            alert('SIN must be 9 digits')
            return
        }

        const customer = {
            customerSIN: formData.get('sin'),
            name: formData.get('name'),
            address: formData.get('address'),
            registdate: new Date().toISOString().slice(0, 10),
        }
        const booking = {
            customerSIN: formData.get('sin'),
            roomID: id,
            bookingDate: new Date().toISOString().slice(0, 10),
            checkInDate: indate,
            checkOutDate: outdate,
        }

        axios.post('http://localhost:5000/api/addCustomer', customer)
            .then(response => {
                axios.post('http://localhost:5000/api/makeBooking', booking)
                    .then(response => {
                        alert('Booking successful!')
                    })
            })
            .catch(error => {
                console.error(error);
            });      
    };



return (
    <div className="Booking">
        <h1 className="Booking-header">Book Room {id.slice(1)[1]} at {address}</h1>
        <form className="Booking-form" onSubmit={handleSubmit}>
            <label htmlFor="sin">SIN:</label>
            <input type="number" id="sin" name="sin" required minLength={9} maxLength={9} />

            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required  />

            <label htmlFor="address">Address:</label>
            <input type="text" id="address" name="address" required  />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="checkinDate">Check-in Date:</label>
            <input type="date" id="checkinDate" name="checkinDate" value={indate} required readOnly />

            <label htmlFor="checkoutDate">Check-out Date:</label>
            <input type="date" id="checkoutDate" name="checkoutDate" value={outdate} required readOnly />

            <label htmlFor="creditCard">Credit Card Number:</label>
            <input type="text" id="creditCard" name="creditCard" required />

            <label htmlFor="expiryDate">Expiry Date:</label>
            <input type="month" id="expiryDate" name="expiryDate" required />

            <button type="submit">Book Room {id.slice(1)[1]}</button>
        </form>
    </div>
);
}

export default Booking;
