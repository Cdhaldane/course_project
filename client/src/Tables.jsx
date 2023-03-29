import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CollapsibleTable({ title, columns, data }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='table-collapsable'>
      <h2 onClick={() => setIsOpen(!isOpen)}>{title} {isOpen ? '▲' : '▼'}</h2>
      {isOpen && (
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column, i) => (
                  <td key={i}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function TableData() {
  const [hotelChains, setHotelChains] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rentings, setRentings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const hotelsChainsRes = await axios.get('http://localhost:5000/api/hotelChains');
        setHotelChains(hotelsChainsRes.data);

        const hotelsRes = await axios.get('http://localhost:5000/api/hotels');
        setHotels(hotelsRes.data);

        const employeesRes = await axios.get('http://localhost:5000/api/employees');
        setEmployees(employeesRes.data);

        const customersRes = await axios.get('http://localhost:5000/api/customers');
        setCustomers(customersRes.data);

        const roomsRes = await axios.get('http://localhost:5000/api/rooms');
        setRooms(roomsRes.data);

        const bookingsRes = await axios.get('http://localhost:5000/api/bookings');
        setBookings(bookingsRes.data);

        const rentingsRes = await axios.get('http://localhost:5000/api/rentings');
        setRentings(rentingsRes.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className='TableList'>
      <CollapsibleTable
        title="Hotel Chains"
        columns={['name', 'coaddress', 'telephone', 'email', 'nhotels', 'rank']}
        data={hotelChains}
      />
      <CollapsibleTable
        title="Hotels"
        columns={['hotelid', 'address', 'telephone', 'email', 'nrooms', 'coaddress']}
        data={hotels}
      />
      <CollapsibleTable
        title="Employees"
        columns={['sin', 'fullname', 'address', 'hotelid', 'position']}
        data={employees}
      />
      <CollapsibleTable
        title="Customers"
        columns={['sin', 'fullname', 'address', 'registdate']}
        data={customers.map(customer => ({ ...customer, registdate: customer.registdate.slice(0, 10) }))}
      />
      <CollapsibleTable
        title="Rooms"
        columns={['hotelid', 'roomnum', 'view', 'price', 'capacity', 'extendable', 'amenities', 'damages']}
        data={rooms}
      />
      <CollapsibleTable
        title="Bookings"
        columns={['id', 'customersin', 'roomid', 'chekindate', 'checkoutdate']}
        data={bookings.map(booking => ({ ...booking, chekindate: booking.chekindate.slice(0, 10), checkoutdate: booking.checkoutdate.slice(0, 10) }))}
      />
      <CollapsibleTable
        title="Rentings"
        columns={['id', 'customersin', 'roomid', 'chekindate', 'checkoutdate']}
        data={rentings.map(renting => ({ ...renting, chekindate: renting.chekindate.slice(0, 10), checkoutdate: renting.checkoutdate.slice(0, 10) }))}
      />
    </div>
  );
}

export default TableData;
