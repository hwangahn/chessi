# Remove admin account
**URL** : `/api/admin/{adminid}`

**Method** : `DELETE`

**Auth required** : YES

## Success responses
**Condition** :  Admin account removed.

**Code** : `200 Success`

**Content** :
```json
{
    "status": "ok",
    "msg": "Done",
}
```

## Error responses
**Condition** :  Admin account does not exist.

**Code** : `404 Not found`

**Content** :
```json
{
    "status": "error",
    "msg": "Cannot find admin"
}
```

### Or

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
