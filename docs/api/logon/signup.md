# User signup
**URL** : `/api/signup`

**Method** : `POST`

**Auth required** : NO

**Data constraints** :
```json
{
    "data": {
        "username": "string",
        "password": "Must include lowercase, uppercase, number and no other symbol. Min length 8",
        "email": "john@example.com"
    }
}
```

## Success responses
**Condition** :  Data provided is valid and the system send a verification email to the user's provided email.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok",
    "msg": "Head over to your mailbox for verification"
}
```

## Error responses
**Condition** :  Server error

**Code** : `500 Server error`

### Or

**Condition** :  Username provided is duplicate

**Code** : `403 Forbidden`

**Content** :
```json
{
    "status": "error",
    "msg": "Username Exist"
}
```
