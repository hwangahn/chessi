# Get all games
**URL** : `/api/admin/all-game`

**Method** : `GET`

**Auth required** : YES

## Success responses
**Condition** :  Game list retrieved.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok",
    "msg": "Done",
    "game": [
        {
          "gameid": 17013687199650,
          "reason": "Timed out",
          "timestamp": "2023-11-30 18:26:03",
          "finalFen": "rn1qkbnr/pppB1ppp/8/3p4/3P4/8/PPP2PPP/RNBQK1NR b KQkq - 0 5",
          "white": "something",
          "black": "something",
          "whiteRatingChange": 7,
          "blackRatingChange": -7
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
