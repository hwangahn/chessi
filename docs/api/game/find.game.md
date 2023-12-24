# User find game
**URL** : `/api/find-game`

**Method** : `POST`

**Auth required** : YES

## Success responses
**Condition** :  Game found.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok"
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

### Or

**Condition** : Failed to find game.

**Code** : `403 Forbidden`

**Content** :
```json
{
    "status": "error",
    "msg": "Cannot find game. Try again later"
}
```
