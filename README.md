# RIDER MaaS Platform – Backend API Documentation

_Last updated: 2025-10-24_

This document covers all REST endpoints and socket events in the backend, based on code from the `routes`, `controllers`, `services`, and `socket.js` files.

---

## Table of Contents

- [General Information](#general-information)
- [REST API Endpoints](#rest-api-endpoints)
    - [User APIs](#user-apis)
    - [Captain APIs](#captain-apis)
    - [Ride APIs](#ride-apis)
    - [Maps APIs](#maps-apis)
- [Socket Events](#socket-events)
- [Service Layer Notes](#service-layer-notes)
- [References](#references)

---

## General Information

- **Base URL**: `/` (for ping), `/user`, `/captain`, `/ride`, `/maps`
- **Format**: JSON for requests/responses.
- **Auth**: JWT in cookies or Authorization header for protected endpoints.
- **Validation**: Uses `express-validator`.

---

## REST API Endpoints

### User APIs

**Route:** `/user`  
**Controller:** `user.controller.js`

#### POST `/user/register`
Register a new user.
```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**  
- `201 Created`: `{ "token": "JWT", "user": { ... } }`
- `400 Bad Request`: On validation error or duplicate email.

#### POST `/user/login`
Login as a user.
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**  
- `200 OK`: `{ "token": "JWT", "user": { ... } }`
- `401 Unauthorized`: On invalid credentials.

#### GET `/user/profile`
Get profile of the logged-in user.  
**Auth:** Yes (JWT)
- `200 OK`: `{ ...userFields }`

#### POST `/user/logout`
Log out the current user, blacklists the token.  
**Auth:** Yes (JWT)
- `200 OK`: `{ "message": "Logged out successfully" }`

---

### Captain APIs

**Route:** `/captain`  
**Controller:** `captain.controller.js`

#### POST `/captain/register`
Register a new captain (driver).
```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "captain@example.com",
  "password": "password123",
  "vehicle": {
    "color": "red",
    "plate": "DL01AB1234",
    "capacity": 4,
    "Vehicletype": "car"
  }
}
```
**Response:**  
- `201 Created`: `{ "token": "JWT", "captain": { ... } }`
- `400 Bad Request`: On validation error or duplicate email.

#### POST `/captain/login`
Login as captain.
```json
{
  "email": "captain@example.com",
  "password": "password123"
}
```
**Response:**  
- `200 OK`: `{ "token": "JWT", "captain": { ... } }`
- `401 Unauthorized`: On invalid credentials.

#### GET `/captain/profile`
Get profile of the logged-in captain.  
**Auth:** Yes (JWT)
- `200 OK`: `{ ...captainFields }`

#### POST `/captain/logout`
Log out the current captain, blacklists the token.  
**Auth:** Yes (JWT)
- `200 OK`: `{ "message": "Logged out successfully" }`

---

### Ride APIs

**Route:** `/ride`  
**Controller:** `ride.controller.js`

#### POST `/ride/create`
Create a new ride request (user).
```json
{
  "pickup": "Some Address",
  "destination": "Another Address",
  "vehicleType": "car"
}
```
**Auth:** User  
**Response:**  
- `201 Created`: `{ ...rideDetails }` (also pushes ride to captains in radius via socket)

#### GET `/ride/get-fare`
Get fare estimate for a ride (user).  
**Query:** `pickup`, `destination`  
**Auth:** User  
**Response:**  
- `200 OK`: `{ "auto": 42, "car": 55, "moto": 28 }`

#### POST `/ride/confirm`
Confirm a ride by captain.
```json
{ "rideId": "<mongoId>" }
```
**Auth:** Captain  
**Response:**  
- `200 OK`: `{ ...ride }` (also emits `ride-confirmed` via socket)

#### GET `/ride/start-ride`
Start a ride (captain).  
**Query:** `rideId`, `otp`  
**Auth:** Captain  
**Response:**  
- `200 OK`: `{ ...ride }` (also emits `ride-started` via socket)

#### POST `/ride/end-ride`
End a ride (captain).
```json
{ "rideId": "<mongoId>" }
```
**Auth:** Captain  
**Response:**  
- `200 OK`: `{ ...ride }` (not detailed in current search)

---

### Maps APIs

**Route:** `/maps`  
**Controller:** `map.controller.js`

#### GET `/maps/get-coordinates`
Get coordinates for an address.
**Query:** `address`  
**Auth:** User  
**Response:**  
- `200 OK`: `{ "ltd": 28.61, "lng": 77.23 }`  
- `404 Not Found`: If not found.

#### GET `/maps/get-distance-time`
Get distance and time between two locations.
**Query:** `origin`, `destination`  
**Auth:** User  
**Response:**  
- `200 OK`: `{ "distance": {...}, "duration": {...} }`

#### GET `/maps/get-suggestions`
Get autocomplete suggestions for a place input.
**Query:** `input`  
**Auth:** User  
**Response:**  
- `200 OK`: `[ "Place 1", "Place 2", ... ]`

---

## Socket Events

**File:** [`backend/socket.js`](https://github.com/aman081/RIDER-MaaS-Platform-/blob/20af1e6ec1c5dc3a78721c8ff4073c9b633b15be/backend/socket.js)

### Events (Client → Server)

- `join`  
  **Payload:** `{ userId, userType }`  
  Registers user/captain's socket ID in DB.

- `update-location-captain`  
  **Payload:**  
  ```json
  {
    "userId": "<captainId>",
    "location": { "type": "Point", "coordinates": [lng, lat] }
  }
  ```
  Updates captain's geolocation in DB.

### Events (Server → Client)

- `new-ride`  
  **Payload:** Full ride object  
  Sent to all captains in radius when a new ride is created.

- `ride-confirmed`  
  **Payload:** Full ride object  
  Sent to user when a captain confirms the ride.

- `ride-started`  
  **Payload:** Full ride object  
  Sent to user when the ride starts.

---

## Service Layer Notes

- **maps.service.js:** Handles Google Maps API (geocode, distance matrix, autocomplete).
- **ride.service.js:** Business logic for fare calculation, OTP, and ride state.
- **user.services.js/captain.services.js:** Creation and validation of users/captains.

---

## References

- [user.routes.js](https://github.com/aman081/RIDER-MaaS-Platform-/blob/20af1e6ec1c5dc3a78721c8ff4073c9b633b15be/backend/routes/user.routes.js)
- [captain.routes.js](https://github.com/aman081/RIDER-MaaS-Platform-/blob/20af1e6ec1c5dc3a78721c8ff4073c9b633b15be/backend/routes/captain.routes.js)
- [ride.routes.js](https://github.com/aman081/RIDER-MaaS-Platform-/blob/20af1e6ec1c5dc3a78721c8ff4073c9b633b15be/backend/routes/ride.routes.js)
- [maps.routes.js](https://github.com/aman081/RIDER-MaaS-Platform-/blob/20af1e6ec1c5dc3a78721c8ff4073c9b633b15be/backend/routes/maps.routes.js)
- [socket.js](https://github.com/aman081/RIDER-MaaS-Platform-/blob/20af1e6ec1c5dc3a78721c8ff4073c9b633b15be/backend/socket.js)

---

## Notes

- This documentation may be incomplete due to search limits. For the latest and complete source, browse the [project code on GitHub](https://github.com/aman081/RIDER-MaaS-Platform-/search).
- If you need OpenAPI/Swagger or Postman collection formats, specify your request.
    }
    ```
