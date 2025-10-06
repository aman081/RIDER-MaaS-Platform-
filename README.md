# API Documentation

## Routes

### 1. **Login**
- **Endpoint**: `/api/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a token.
- **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
- **Response**:
    ```json
    {
        "token": "your-auth-token",
        "message": "Login successful"
    }
    ```

### 2. **Logout**
- **Endpoint**: `/api/logout`
- **Method**: `POST`
- **Description**: Logs out the authenticated user.
- **Headers**:
    - `Authorization: Bearer <token>`
- **Response**:
    ```json
    {
        "message": "Logout successful"
    }
    ```

### 3. **Register**
- **Endpoint**: `/api/register`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Request Body**:
    ```json
    {
        "name": "John Doe",
        "email": "user@example.com",
        "password": "password123"
    }
    ```
- **Response**:
    ```json
    {
        "message": "Registration successful",
        "userId": "12345"
    }
    ```

### 4. **Profile**
- **Endpoint**: `/api/profile`
- **Method**: `GET`
- **Description**: Retrieves the profile of the authenticated user.
- **Headers**:
    - `Authorization: Bearer <token>`
- **Response**:
    ```json
    {
        "userId": "12345",
        "name": "John Doe",
        "email": "user@example.com"
    }
    ```