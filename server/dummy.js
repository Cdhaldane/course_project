async function generateDummyData() {

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'booking_system'
    });

    // Generate hotel chain data
    const hotelChains = [];
    for (let i = 0; i < 10; i++) {
        const name = faker.company.companyName();
        const coAddress = faker.address.streetAddress();
        const telephone = faker.phone.phoneNumber();
        const email = faker.internet.email();
        const rank = faker.random.number({ min: 1, max: 5 });
        hotelChains.push([name, coAddress, telephone, email, rank]);
    }

    // Insert hotel chains into database
    await connection.query('INSERT INTO HotelChain (Name, COAddress, Telephone, Email, Rank) VALUES ?', [hotelChains]);

    // Generate hotel data
    const hotels = [];
    for (let i = 0; i < 50; i++) {
        const address = faker.address.streetAddress();
        const telephone = faker.phone.phoneNumber();
        const email = faker.internet.email();
        const nRooms = faker.random.number({ min: 50, max: 500 });
        const coAddress = faker.address.streetAddress();
        hotels.push([address, telephone, email, nRooms, coAddress]);
    }

    // Get list of hotel chain IDs
    const hotelChainIds = (await connection.query('SELECT ID FROM HotelChain')[0].map((row) => row.ID));

    // Insert hotels into database
    for (const hotel of hotels) {
        const hotelChainId = faker.random.arrayElement(hotelChainIds);
        await connection.query('INSERT INTO Hotel (Address, Telephone, Email, Nrooms, COaddress, HotelChainID) VALUES (?, ?, ?, ?, ?, ?)', [...hotel, hotelChainId]);
    }

    // Generate employee data
    const employees = [];
    const hotelsWithEmployees = hotels.slice(0, 20); // Assign employees to first 20 hotels
    for (const hotel of hotelsWithEmployees) {
        const nEmployees = faker.random.number({ min: 5, max: 20 });
        for (let i = 0; i < nEmployees; i++) {
            const sin = faker.random.number({ min: 100000000, max: 999999999 });
            const fullName = faker.name.findName();
            const address = faker.address.streetAddress();
            const hotelId = hotelsWithEmployees.indexOf(hotel) + 1;
            const position = faker.random.arrayElement(['Front Desk', 'Housekeeping', 'Maintenance', 'Food Service']);
            employees.push([sin, fullName, address, hotelId, position]);
        }
    }

    // Insert employees into database
    await connection.query('INSERT INTO Employee (SIN, FullName, Address, HotelID, Position) VALUES ?', [employees]);

    // Generate customer data
    const customers = [];
    for (let i = 0; i < 100; i++) {
        const sin = faker.random.number({ min: 100000000, max: 999999999 });
        const fullName = faker.name.findName();
        const address = faker.address.streetAddress();
        const registDate = faker.date.between('2020-01-01', '2022-12-31');
        customers.push([sin, fullName, address, registDate]);
    }

    // Insert customers into database
    await connection.query('INSERT INTO Customer (SIN, FullName, Address, RegistDate) VALUES ?', [customers]);

    // Iterate over each hotel and generate room data
    for (const hotel of hotels) {
        const nRooms = hotel[3];
        for (let i = 1; i <= nRooms; i++) {
            const roomNum = hotel[0] - i;
            const capacity = faker.random.number({ min: 1, max: 6 });
            const price = faker.random.number({ min: 50, max: 500 });
            const view = faker.random.arrayElement(['City', 'Sea', 'Mountain']);
            const extendable = faker.random.boolean();
            const amenities = faker.random.arrayElements(['TV', 'Air Conditioning', 'Free Wi-Fi', 'Minibar', 'Balcony']);
            const damages = faker.random.arrayElements(['Scratched Furniture', 'Stained Carpet', 'Broken Mirror'], { count: faker.random.number({ min: 0, max: 2 }) });
            rooms.push([roomNum, hotel[4], capacity, price, view, extendable, amenities.join(','), damages.join(',')]);
        }
    }

    // Insert rooms into database
    await connection.query('INSERT INTO Room (RoomNum, HotelID, Capacity, Price, View, Extendable, Amenities, Damages) VALUES ?', [rooms]);

    // Generate booking data
    const bookings = [];
    for (let i = 0; i < 200; i++) {
        const id = i + 1;
        const customerSin = faker.random.arrayElement(customers)[0];
        const roomNum = faker.random.arrayElement(rooms)[0];
        const bookingDate = faker.date.between('2020-01-01', '2022-12-31');
        const checkInDate = faker.date.between(bookingDate, new Date('2023-12-31'));
        const checkOutDate = faker.date.between(checkInDate, new Date('2024-12-31'));
        bookings.push([id, customerSin, roomNum, bookingDate, checkInDate, checkOutDate]);
    }

    // Insert bookings into database
    await connection.query('INSERT INTO Booking (ID, CustomerSIN, RoomNum, BookingDate, ChekInDate, CheckOutDate) VALUES ?', [bookings]);

    // Generate renting data
    const rentings = [];
    for (let i = 0; i < 50; i++) {
        const id = i + 1;
        const customerSin = faker.random.arrayElement(customers)[0];
        const roomNum = faker.random.arrayElement(rooms)[0];
        const rentingDate = faker.date.between('2020-01-01', '2022-12-31');
        const checkInDate = faker.date.between(rentingDate, new Date('2023-12-31'));
        const checkOutDate = faker.date.between(checkInDate, new Date('2024-12-31'));
        rentings.push([id, customerSin, roomNum, rentingDate, checkInDate, checkOutDate]);
    }

    // Insert rentings into database
    await connection.query('INSERT INTO Renting (ID, CustomerSIN, RoomNum, RentingDate, ChekInDate, CheckOutDate) VALUES ?', [rentings]);

    // Close database connection
    await connection.end();
}