# Get all users
**URL** : `/api/admin/all-user`

**Method** : `GET`

**Auth required** : YES

## Success responses
**Condition** :  User list retrieved.

**Code** : `200 Success`

**Content** :
```json
{
    "status": "ok",
    "msg": "Done",
    "user": [
        {
          "userid": 1,
          "username": "something",
          "rating": 1500
        },
        {
          "...": "same format"
        }
    ]
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

**Condition** :  Permission denied.

**Code** : `401 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "Not admin"
}
```
