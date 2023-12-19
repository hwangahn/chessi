# Create admin account
**URL** : `/admin`

**Method** : `PUT`

**Auth required** : YES

**Data constraints** : 
```json
{
    "username": "string",
    "password": "string"
}
```

## Success responses
**Condition** :  Data provided is valid and Admin account is created.

**Code** : `200 Success`

**Content** :
```json
{
    "status": "ok",
    "msg": "Admin account created"
}
```

## Error responses
**Condition** :  Data provided is duplicate and Admin account is not created.

**Code** : `403 Forbidden`

**Content** :
```json
{
    "status": "error",
    "msg": "Username and/or email already used"
}
```

### Or

**Condition** :  User not logged in and Admin account is not created.

**Code** : `401 1 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "You are not logged in"
}
```

### Or

**Condition** :  Login session expired and Admin account is not created.

**Code** : `401 2 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "Session expired. Please log in again"
}
```

### Or

**Condition** :  Permission denied and Admin accoutn is not created.

**Code** : `401 3 Unauthorized`

**Content** :
```json
{
    "status": "error",
    "msg": "Not admin"
}
```
