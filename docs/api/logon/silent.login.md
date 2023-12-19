# Login using session token
**URL** : `/api/silent-login`

**Method** : `POST`

**Auth required** : YES

**Data constraints** : 
```json
{
    "socketid": "string"
}
```

## Success responses
**Condition** :  Successfully logged in.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok",
    "msg": "Logged in",
    "accessToken": "JWT token",
    "profile": {
        "userid": 1,
        "username": "something",
        "isAdmin": false,
        "rating": 1500
    }
}
```

## Error responses
**Condition** :  Server error

**Code** : `500 Server error`

### Or

**Condition** :  User has not logged in.

**Code** : `401 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "You are not logged in"
}
```

### Or

**Condition** :  Login session expired.

**Code** : `401 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "Session expired. Please log in again"
}
```

### Or

**Condition** :  Failed to verify session.

**Code** : `401 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "Cannot verify session"
}
```
