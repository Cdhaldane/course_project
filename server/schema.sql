CREATE TABLE IF NOT EXISTS HotelChain (
  Nhotels INT,
  Name VARCHAR(255),
  COAddress VARCHAR(255),
  Telephone VARCHAR(20),
  Email VARCHAR(255),
  PRIMARY KEY(COAddress),
  Rank INT CHECK (Rank BETWEEN 1 AND 5)
);

CREATE TABLE IF NOT EXISTS Hotel (
  HotelID VARCHAR(255),
  Address VARCHAR(255),
  Telephone VARCHAR(20),
  Email VARCHAR(255),
  Nrooms INT,
  COaddress VARCHAR(255),
  PRIMARY KEY (HotelID),
  FOREIGN KEY (COaddress) REFERENCES HotelChain (COAddress)
);

CREATE TABLE IF NOT EXISTS Employee (
  SIN VARCHAR(9),
  FullName VARCHAR(255),
  Address VARCHAR(255),
  HotelID INT,
  Position VARCHAR(255),
  PRIMARY KEY (SIN),
  FOREIGN KEY (HotelID) REFERENCES Hotel (HotelID)
);

CREATE TABLE IF NOT EXISTS Customer (
  SIN VARCHAR(9),
  FullName VARCHAR(255),
  Address VARCHAR(255),
  RegistDate DATE,
  PRIMARY KEY (SIN)
);

CREATE TABLE IF NOT EXISTS Room (
  HotelID INT NOT NULL,
  RoomNum INT NOT NULL,
  Capacity INT,
  Price DECIMAL(10, 2),
  View VARCHAR(255),
  Extendable BOOLEAN,
  Amenities VARCHAR(255),
  Damages VARCHAR(255),
  PRIMARY KEY (HotelID, RoomNum),
  FOREIGN KEY (HotelID) REFERENCES Hotel (HotelID)
);

CREATE TABLE IF NOT EXISTS Booking (
  ID SERIAL PRIMARY KEY,
  CustomerSIN VARCHAR(9),
  RoomNum INT,
  BookingDate DATE,
  ChekInDate DATE,
  CheckOutDate DATE,
  FOREIGN KEY (CustomerSIN) REFERENCES Customer (SIN),
  FOREIGN KEY (RoomNum) REFERENCES Room (RoomNum)
);

CREATE TABLE IF NOT EXISTS Renting (
  ID SERIAL PRIMARY KEY,
  CustomerSIN VARCHAR(9),
  RoomNum INT,
  RentingDate DATE,
  ChekInDate DATE,
  CheckOutDate DATE,
  FOREIGN KEY (CustomerSIN) REFERENCES Customer (SIN),
  FOREIGN KEY (RoomNum) REFERENCES Room (RoomNum)
);
