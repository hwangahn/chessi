# Login
**URL** : `/admin/login`

**Method** : `POST`

**Auth required** : NO



## Success responses
**Condition** :  Successfully logged in.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok",
    "msg": "Logged in",
    "accessToken": "JWT token",
    "sessionToken": "JWT token",
    "profile": {
        "userid": 1,
        "username": "something",
        "isAdmin": false,
        "rating": 1500
    }
}
```

## Error responses
**Condition** :  Credentials provided are invalid.

**Code** : `401 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "Wrong credentials"
}
```

### Or

**Condition** :  User has not verified their email when signing up.

**Code** : `403 Forbidden`

**Content** :
```json
{
    "status": "error",
    "msg": "Verify your email before continue"
}
```

### Or

**Condition** :  User tried to log in on more than one device.

**Code** : `409 Conflict`

**Content** :
```json
{
    "status": "error",
    "msg": "This account is logged in on another computer. Log out of the existing session then proceed to log in again"
}
```

### Or

**Condition** : Server error.

**Code** : `500 Server error`
