# 🏨 Hotel Karlton Inn — API Reference

Base URL: `http://localhost:5000`  
All protected routes require: `Authorization: Bearer <token>`  
All responses are JSON.

---

## 📌 Table of Contents

1. [Health Check](#health-check)
2. [User Auth — `/api/auth`](#user-auth)
3. [Admin Auth — `/api/admin/auth`](#admin-auth)
4. [Admin Dashboard — `/api/admin/stats`](#admin-dashboard)
5. [Hotels — `/api/hotels` (Public) & `/api/admin/hotels` (Admin CRUD)](#hotels)
6. [Rooms — `/api/rooms` (Public) & `/api/admin/rooms` (Admin CRUD)](#rooms)
7. [Bookings — `/api/bookings` (User) & `/api/admin/bookings` (Admin)](#bookings)
8. [Users — `/api/users` (Profile) & `/api/admin/users` (Admin CRUD)](#users)
9. [Payment — `/api/payment`](#payment)
10. [Error Responses](#error-responses)

---

## Health Check

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/health` | Public |

**Response:**
```json
{ "status": "ok", "message": "Hotel Booking API is running" }
```

---

## 1. User Auth

> Normal users register and log in here. Admins can also use these endpoints but should prefer the admin login endpoint.

### Register

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phone": "9876543210"
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "664abc123def456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "phone": "9876543210"
  }
}
```

---

### Login

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "664abc123def456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "phone": "9876543210"
  }
}
```

---

### Get Current User

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/auth/me` | 🔒 Private (any logged-in user) |

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response `200`:**
```json
{
  "success": true,
  "user": {
    "_id": "664abc123def456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "phone": "9876543210",
    "bookings": ["bookingId1", "bookingId2"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 2. Admin Auth

> **Only users with `role: "admin"` can log in here.** Normal users will receive a `403 Access denied` error.

### Admin Login

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/admin/auth/login` | Public (admin credentials only) |

**Request Body:**
```json
{
  "email": "admin@hotelkarlton.com",
  "password": "admin123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "664xyz789abc012",
    "name": "Hotel Admin",
    "email": "admin@hotelkarlton.com",
    "role": "admin",
    "avatar": "",
    "phone": "9999999999"
  }
}
```

**Error if non-admin tries to log in `403`:**
```json
{
  "success": false,
  "message": "Access denied: Admins only"
}
```

> **How to create an admin user?**  
> Run `npm run seed` in the backend directory. This creates a seeded admin account.  
> Or manually update a user's role in MongoDB:  
> `db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })`

---

## 3. Admin Dashboard

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/stats` | 🔒 Admin |

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response `200`:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 120,
    "totalHotels": 15,
    "totalRooms": 87,
    "totalBookings": 340,
    "revenue": 2450000,
    "recentBookings": [
      {
        "_id": "booking_id",
        "user": { "name": "John Doe", "email": "john@example.com" },
        "hotel": { "name": "Grand Palace Hotel" },
        "room": { "title": "Deluxe Suite" },
        "status": "confirmed",
        "totalPrice": 12000,
        "createdAt": "2024-06-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 4. Hotels

### Public Endpoints (no token needed)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | Get all hotels (with filters) |
| GET | `/api/hotels/featured` | Get featured hotels (max 6) |
| GET | `/api/hotels/:id` | Get single hotel with rooms |

**GET `/api/hotels` — Query Parameters:**
| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `city` | string | `Mumbai` | Filter by city |
| `minPrice` | number | `1000` | Min cheapest price |
| `maxPrice` | number | `5000` | Max cheapest price |
| `rating` | number | `4` | Min rating |
| `featured` | boolean | `true` | Only featured hotels |
| `search` | string | `Grand` | Search by hotel name |
| `sort` | string | `price_asc` | Sort: `price_asc`, `price_desc`, `rating` |

**Example: `GET /api/hotels?city=Mumbai&minPrice=1000&sort=rating`**

**Response `200`:**
```json
{
  "success": true,
  "count": 3,
  "hotels": [
    {
      "_id": "hotel_id",
      "name": "Grand Palace Hotel",
      "description": "A luxurious hotel in the heart of Mumbai",
      "location": {
        "city": "Mumbai",
        "address": "123 Marine Drive",
        "country": "India"
      },
      "images": ["https://example.com/image1.jpg"],
      "rating": 4.5,
      "reviewCount": 230,
      "amenities": ["WiFi", "Pool", "Gym", "Spa"],
      "featured": true,
      "cheapestPrice": 3500,
      "rooms": [{ "_id": "room_id", "price": 3500, "roomType": "Deluxe" }]
    }
  ]
}
```

---

### Admin Hotel CRUD

> All endpoints below require admin token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/hotels` | Get all hotels |
| GET | `/api/admin/hotels/:id` | Get single hotel |
| POST | `/api/admin/hotels` | Create hotel |
| PUT | `/api/admin/hotels/:id` | Update hotel |
| DELETE | `/api/admin/hotels/:id` | Delete hotel + its rooms |

**POST `/api/admin/hotels` — Request Body:**
```json
{
  "name": "Grand Palace Hotel",
  "description": "A luxurious 5-star hotel in the heart of Mumbai with world-class amenities.",
  "location": {
    "city": "Mumbai",
    "address": "123 Marine Drive, Nariman Point",
    "country": "India"
  },
  "images": [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  "rating": 4.5,
  "amenities": ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Parking"],
  "featured": true,
  "cheapestPrice": 3500
}
```

**PUT `/api/admin/hotels/:id` — Request Body (any subset of fields):**
```json
{
  "rating": 4.8,
  "featured": true,
  "cheapestPrice": 4000
}
```

**Response `200` (create/update):**
```json
{
  "success": true,
  "message": "Hotel created",
  "hotel": { ...hotelObject }
}
```

---

## 5. Rooms

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms/hotel/:hotelId` | Get all rooms for a hotel |
| GET | `/api/rooms/:id` | Get single room |
| GET | `/api/rooms/:id/availability?checkIn=&checkOut=` | Check availability |

**GET `/api/rooms/:id/availability` — Query Parameters:**
| Param | Type | Example |
|-------|------|---------|
| `checkIn` | ISO date | `2024-07-01` |
| `checkOut` | ISO date | `2024-07-05` |

**Response `200`:**
```json
{ "success": true, "available": true }
```

---

### Admin Room CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/rooms` | Get all rooms |
| GET | `/api/admin/rooms/:id` | Get single room |
| POST | `/api/admin/rooms/hotel/:hotelId` | Create room for hotel |
| PUT | `/api/admin/rooms/:id` | Update room |
| DELETE | `/api/admin/rooms/:id` | Delete room |

**POST `/api/admin/rooms/hotel/:hotelId` — Request Body:**
```json
{
  "title": "Deluxe Sea-View Suite",
  "description": "Spacious room with panoramic sea view, king-size bed and private balcony.",
  "price": 5500,
  "maxGuests": 2,
  "roomType": "Suite",
  "amenities": ["AC", "WiFi", "Mini Bar", "Bathtub", "Room Service"],
  "images": [
    "https://example.com/room1.jpg",
    "https://example.com/room2.jpg"
  ]
}
```

> `roomType` must be one of: `Standard`, `Deluxe`, `Suite`, `Family`, `Presidential`

**PUT `/api/admin/rooms/:id` — Request Body (any subset):**
```json
{
  "price": 6000,
  "isAvailable": false
}
```

---

## 6. Bookings

### User Booking Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | 🔒 User | Create a booking |
| GET | `/api/bookings/my` | 🔒 User | Get my bookings |
| GET | `/api/bookings/:id` | 🔒 User/Admin | Get single booking |
| PUT | `/api/bookings/:id/cancel` | 🔒 User/Admin | Cancel booking |

**POST `/api/bookings` — Request Body:**
```json
{
  "hotel": "664hotel_id_here",
  "room": "664room_id_here",
  "checkIn": "2024-07-01",
  "checkOut": "2024-07-05",
  "guests": 2,
  "specialRequests": "Late check-in requested, non-smoking room preferred"
}
```

> `totalPrice` is **auto-calculated** by the server: `nights × room.price`

**Success Response `201`:**
```json
{
  "success": true,
  "booking": {
    "_id": "booking_id",
    "user": "user_id",
    "hotel": "hotel_id",
    "room": "room_id",
    "checkIn": "2024-07-01T00:00:00.000Z",
    "checkOut": "2024-07-05T00:00:00.000Z",
    "guests": 2,
    "totalPrice": 22000,
    "status": "pending",
    "paymentStatus": "unpaid",
    "specialRequests": "Late check-in requested"
  }
}
```

---

### Admin Booking Management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/bookings` | 🔒 Admin | Get all bookings |
| GET | `/api/admin/bookings/:id` | 🔒 Admin | Get single booking |
| PUT | `/api/admin/bookings/:id/status` | 🔒 Admin | Update booking/payment status |
| DELETE | `/api/admin/bookings/:id` | 🔒 Admin | Delete booking |

**PUT `/api/admin/bookings/:id/status` — Request Body:**
```json
{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

> `status` options: `pending`, `confirmed`, `cancelled`, `completed`  
> `paymentStatus` options: `unpaid`, `paid`, `refunded`

---

## 7. Users

### User Profile

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/profile` | 🔒 User | Get own profile |
| PUT | `/api/users/profile` | 🔒 User | Update own profile |

**PUT `/api/users/profile` — Request Body (any subset):**
```json
{
  "name": "John Updated",
  "phone": "9123456789",
  "avatar": "https://example.com/profile.jpg",
  "password": "newpassword123"
}
```

---

### Admin User Management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | 🔒 Admin | Get all users |
| GET | `/api/admin/users/:id` | 🔒 Admin | Get single user |
| PUT | `/api/admin/users/:id` | 🔒 Admin | Update user (incl. role) |
| DELETE | `/api/admin/users/:id` | 🔒 Admin | Delete user |

**PUT `/api/admin/users/:id` — Request Body:**
```json
{
  "name": "Promoted User",
  "role": "admin",
  "phone": "9000000000"
}
```

> `role` must be `"user"` or `"admin"`

---

## 8. Payment

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/payment/create-intent` | 🔒 User | Create Stripe payment intent |
| POST | `/api/payment/confirm` | 🔒 User | Confirm payment (mock/webhook) |

**POST `/api/payment/create-intent` — Request Body:**
```json
{ "bookingId": "664booking_id_here" }
```

**Response `200`:**
```json
{ "success": true, "clientSecret": "pi_xxx_secret_xxx" }
```

**POST `/api/payment/confirm` — Request Body:**
```json
{ "bookingId": "664booking_id_here" }
```

**Response `200`:**
```json
{
  "success": true,
  "booking": {
    "_id": "booking_id",
    "paymentStatus": "paid",
    "status": "confirmed"
  }
}
```

---

## 9. Error Responses

All errors follow this standard format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Bad Request — missing or invalid fields |
| `401` | Unauthorized — no token or invalid token |
| `403` | Forbidden — insufficient permissions (e.g. non-admin accessing admin route) |
| `404` | Not Found — resource does not exist |
| `500` | Internal Server Error |

---

## 🔑 Authentication Flow

```
1. Register/Login  →  Receive JWT token
2. Store token in client (localStorage or cookie)
3. Send token in every protected request:
   Header: Authorization: Bearer <your_token>
```

### Route Access Summary

| Route Prefix | Who Can Access |
|---|---|
| `/api/auth/register` | Anyone |
| `/api/auth/login` | Anyone (users + admins) |
| `/api/admin/auth/login` | Admins ONLY |
| `/api/admin/*` (rest) | Admins with valid token |
| `/api/hotels` (GET) | Anyone |
| `/api/hotels` (POST/PUT/DELETE) | Admins only |
| `/api/rooms/*` (GET) | Anyone |
| `/api/rooms/*` (POST/PUT/DELETE) | Admins only |
| `/api/bookings` | Logged-in users (or admins) |
| `/api/users/profile` | Logged-in user (own profile) |
| `/api/payment/*` | Logged-in users |
