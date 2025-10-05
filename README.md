# User Registration API (`/user/register`)

This document describes the `/user/register` route of the RIDER-MaaS-Platform- backend. It covers the accepted request data, validation rules, and the data returned upon successful registration.

---

## Endpoint

```
POST /user/register
```

---

## Request Body

Content-Type: `application/json`

| Field                  | Type     | Required | Description                                         | Validation                          |
|------------------------|----------|----------|-----------------------------------------------------|-------------------------------------|
| email                  | string   | Yes      | User's email address                                | Must be a valid email format        |
| fullname.firstname     | string   | Yes      | User's first name                                   | Min 3 characters                    |
| fullname.lastname      | string   | No       | User's last name                                    | Min 3 characters (optional)         |
| password               | string   | Yes      | User's password                                     | Min 5 characters                    |

**Example Request:**
```json
{
  "email": "user@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "password": "securepassword"
}
```

---

## Validation

- `email`: must be a valid email address.
- `fullname.firstname`: at least 3 characters.
- `fullname.lastname`: at least 3 characters (optional).
- `password`: at least 5 characters.

If validation fails, the server responds with status `400` and a list of errors:
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      ...
    },
    ...
  ]
}
```

---

## Response

### Success (`201 Created`)

```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "userMongoId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "user@example.com",
    "socketId": null
    // other user fields
  }
}
```

- `token`: JWT authentication token for the newly registered user.
- `user`: The created user object.

### Failure (`400 Bad Request`)

If any field fails validation, the response is:
```json
{
  "errors": [
    {
      "msg": "password should be atleast 5 characters",
      "param": "password",
      ...
    }
  ]
}
```

---

## Notes

- Passwords are securely hashed before storage.
- Duplicate email registration is not allowed (`email` must be unique).
- JWT secret must be configured in environment variables for token generation.

---
