# Logout
**URL** : `/api/logout`

**Method** : `POST`

**Auth required** : YES

## Success responses
**Condition** :  Successfully logged out.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok",
    "msg": "Logged out"
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
