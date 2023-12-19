# Get user's current active game
**URL** : `/api/user-active-game`

**Method** : `GET`

**Auth required** : YES

## Success responses
**Condition** :  Found user's active game.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok",
    "inGame": true,
    "gameid": 17013687199650
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
