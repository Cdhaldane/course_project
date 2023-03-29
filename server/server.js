const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const { faker } = require('@faker-js/faker');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'booking_system',
    password: 'password',
    port: 5432,
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

async function generateDummyData() {
    await db.connect();

    await db.query("DELETE FROM renting");
    await db.query("DELETE FROM booking");
    await db.query("DELETE FROM customer");
    await db.query("DELETE FROM room");
    await db.query("DELETE FROM employee");
    await db.query("DELETE FROM hotel");
    await db.query("DELETE FROM hotelChain");


    // Generate hotel chain data
    const hotelChains = [];
    for (let i = 0; i < 3; i++) {
        const name = faker.company.name();
        const coAddress = faker.address.streetAddress();
        const telephone = faker.phone.number('###-###-###')
        const email = faker.internet.email();
        const rank = faker.random.numeric(1, { bannedDigits: ['0', '6', '7', '8', '9'] });
        const nHotels = faker.random.numeric(1, { bannedDigits: ['0', '5', '6', '7', '8', '9'] });
        hotelChains.push([nHotels, name, coAddress, telephone, email, rank]);
    }

    // Insert hotel chains into database
    for (const hotelChain of hotelChains) {
        await db.query('INSERT INTO HotelChain (nHotels, Name, COAddress, Telephone, Email, Rank) VALUES ($1, $2, $3, $4, $5, $6)', hotelChain);
    }

    // Generate hotel data
    const hotels = [];
    let j = 0;
    for (const hotel of hotelChains) {
        for (let i = 0; i < hotel[0]; i++) {
            const hoID = j.toString()
            const roID = i.toString()
            const hotelID = hoID + roID;
            const address = faker.address.streetAddress();
            const telephone = faker.phone.number('###-###-###')
            const email = faker.internet.email();
            const nRooms = faker.random.numeric(1);
            const coAddress = hotel[2]
            hotels.push([address, telephone, email, nRooms, hotelID, coAddress]);
        }
        j++;
    }

    // Insert hotels into database
    for (const hotel of hotels) {
        await db.query('INSERT INTO Hotel (Address, Telephone, Email, Nrooms, HotelID, COaddress) VALUES ($1, $2, $3, $4, $5, $6)', hotel);
    }

    // Generate employee data
    const employees = [];
    for (const hotel of hotels) {
        const nEmployees = faker.random.numeric(1);
        for (let i = 0; i < nEmployees; i++) {
            const sin = faker.random.numeric(9);
            const fullName = faker.name.fullName();
            const address = faker.address.streetAddress();
            const hotelID = hotel[4];
            const positions = ['Front Desk', 'Housekeeping', 'Maintenance', 'Food Service']
            const randomIndex = Math.floor(Math.random() * positions.length);
            const position = positions[randomIndex];
            employees.push([sin, fullName, address, hotelID, position]);
        }
    }

    // Insert employees into database
    for (const employee of employees) {
        await db.query('INSERT INTO Employee (SIN, FullName, Address, HotelID, Position) VALUES ($1, $2, $3, $4, $5)', employee);
    }

    // Generate customer data
    const customers = [];
    for (let i = 0; i < 10; i++) {
        const sin = faker.random.numeric(9);
        const fullName = faker.name.fullName();
        const address = faker.address.streetAddress();
        const registDate = faker.date.between('2020-01-01', '2022-12-31');
        customers.push([sin, fullName, address, registDate]);
    }

    // Insert customers into database
    for (const customer of customers) {
        await db.query('INSERT INTO Customer (SIN, FullName, Address, RegistDate) VALUES ($1, $2, $3, $4)', customer);
    }

    // Iterate over each hotel and generate room data
    const rooms = [];
    for (const hotel of hotels) {
        const nRooms = hotel[3];
        for (let i = 1; i <= nRooms; i++) {
            const hoID = hotel[4].toString()
            const roID = i.toString()
            const roomID = hoID + roID;
            const roomNum = i + 1;
            const capacity = faker.random.numeric(1);
            const price = faker.random.numeric(2);
            const views = ['City', 'Sea', 'Mountain'];
            const randomIndex = Math.floor(Math.random() * views.length);
            const view = views[randomIndex];
            const extendable = faker.datatype.boolean();
            const amenitiesN = ['TV', 'Air Conditioning', 'Free Wi-Fi', 'Minibar', 'Balcony'];
            const random = Math.floor(Math.random() * amenitiesN.length);
            const amenities = amenitiesN[random];
            const damagesN = ['Scratched Furniture', 'Stained Carpet', 'Broken Mirror']
            const rando = Math.floor(Math.random() * damagesN.length);
            const damages = damagesN[rando];

            rooms.push([roomID, roomNum, hotel[4], capacity, price, view, extendable, amenities, damages]);
        }
    }

    for (const room of rooms) {
        await db.query('INSERT INTO Room (RoomID, RoomNum, HotelID, Capacity, Price, View, Extendable, Amenities, Damages) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', room);
    }


    // Generate booking data
    const bookings = [];
    for (let i = 0; i < 5; i++) {
        const id = i + 1;
        const randomIndex = Math.floor(Math.random() * customers.length);
        const customerSin = customers[randomIndex][0];
        const random = Math.floor(Math.random() * rooms.length);
        const roomID = rooms[random][0];
        const bookingDate = faker.date.between('2020-01-01', '2022-12-31');
        const checkInDate = faker.date.between(bookingDate, new Date('2023-12-31'));
        const checkOutDate = faker.date.between(checkInDate, new Date('2024-12-31'));
        bookings.push([id, customerSin, roomID, bookingDate, checkInDate, checkOutDate]);
    }

    // Insert bookings into database
    for (const booking of bookings) {
        await db.query('INSERT INTO Booking (ID, CustomerSIN, roomID, BookingDate, ChekInDate, CheckOutDate) VALUES ($1, $2, $3, $4, $5, $6)', booking);
    }

    // Generate renting data
    const rentings = [];
    for (let i = 0; i < 5; i++) {
        const id = i + 1;
        const randomIndex = Math.floor(Math.random() * customers.length);
        const customerSin = customers[randomIndex][0];
        const random = Math.floor(Math.random() * rooms.length);
        const roomID = rooms[random][0];
        const rentingDate = faker.date.between('2020-01-01', '2022-12-31');
        const checkInDate = faker.date.between(rentingDate, new Date('2023-12-31'));
        const checkOutDate = faker.date.between(checkInDate, new Date('2024-12-31'));
        rentings.push([id, customerSin, roomID, rentingDate, checkInDate, checkOutDate]);
    }

    // Insert rentings into database
    for (const renting of rentings) {
        await db.query('INSERT INTO Renting (ID, CustomerSIN, roomID, RentingDate, ChekInDate, CheckOutDate) VALUES ($1, $2, $3, $4, $5, $6)', renting);
    }


}

// Call the function to generate dummy data
generateDummyData()
    .then(() => console.log('Dummy data generated successfully!'))
    .catch((err) => console.error(err));

// API routes
app.get('/api/hotelChains', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM hotelChain');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/hotels', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM hotel');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM employee');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/customers', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM customer');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM room');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM booking');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/rentings', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM renting');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/getHotel', async (req, res) => {
    const coaddress = req.query.coaddress;

    console.log(req.query)

    const query = `
        SELECT * FROM hotel
        WHERE hotel.coaddress = $1::text;
    `;

    const VALUES = [coaddress];

    try {
        const result = await db.query(query, VALUES);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});





// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));