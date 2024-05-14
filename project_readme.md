## Setting Local Environment Variables

To set up your local environment variables:

1. Create a file named `.env` in your project's root directory.

2. Inside `.env`, define your variables like this:

    ```makefile
    DATABASE_URL="postgres://user:password@localhost:5432/database"
    JWT_ACC_SECRET="your_secret_key"
    JWT_RESH_SECRET="your_refresh_secret"
    EMAIL_SERVICE="Gmail"
    EMAIL_HOST="smtp.gmail.com"
    EMAIL_USER="your_email@gmail.com"
    EMAIL_PASS="your_email_password"
    ```

3. Make sure to add `.env` to your `.gitignore` file to avoid uploading it to version control.


## Routes Overview

### User Registration

- **Method**: POST
- **Path**: `/registration`
- **Purpose**: Register a new user.
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
      "id": "123",
      "email": "user@example.com"
    }
    ```

### OTP Verification

- **Method**: POST
- **Path**: `/verify`
- **Purpose**: Verify OTP for user authentication.
- **Request Body**:

    ```json
    {
      "email": "user@example.com",
      "otp": "123456"
    }
    ```

- **Response**:

    ```
    "OTP verification successful"


## User Controller Routes Overview

### Get User by ID

- **Method**: GET
- **Path**: `/user/:userId`
- **Guard**: JwtAuthGuard
- **Purpose**: Retrieve a user by their ID.
- **Parameters**:
  - `userId`: number (Path parameter)
- **Authorization**: Bearer Token required
- **Response**: Returns the user object.

### Find All Users

- **Method**: GET
- **Path**: `/user`
- **Guard**: JwtAuthGuard
- **Purpose**: Retrieve a list of all users.
- **Query Parameters**:
  - `page`: number (optional)
  - `pageSize`: number (optional)
- **Authorization**: Bearer Token required
- **Response**: Returns a paginated list of users.

### Update User

- **Method**: PUT
- **Path**: `/user/:id`
- **Guard**: JwtAuthGuard
- **Purpose**: Update user details by their ID.
- **Parameters**:
  - `id`: number (Path parameter)
- **Request Body**:
  - `updateUserDto`:
    - `email` (optional):
      - Must be a valid email format.
    - `name` (optional):
      - Must be a string.
    - `age` (optional):
      - Must be a number.
    - `phoneNumber` (optional):
      - Must be a valid phone number.
- **Authorization**: Bearer Token required
- **Response**: Returns the updated user object.


## Auth Controller Routes Overview

### Login

- **Method**: POST
- **Path**: `/auth/login`
- **Purpose**: Authenticate user and obtain access and refresh tokens.
- **Request Body**:
  - `loginDto`:
    - `email`: string (required)
    - `password`: string (required, min length: 6, max length: 16)
- **Response**:
  - `accessToken`: string
  - `refreshToken`: string

### Refresh Token

- **Method**: POST
- **Path**: `/auth/refresh-token`
- **Purpose**: Refresh the access token using a refresh token.
- **Request Body**:
  - `refreshTokenDto`:
    - `refreshToken`: string (required)
- **Response**:
  - `accessToken`: string
