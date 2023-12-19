# Get user account
**URL** : `/api/user/{userid}`

**Method** : `GET`

**Auth required** : YES

## Success responses
**Condition** :  User account info retrieved.

**Code** : `200 Success`

**Content** :
```json
{
    "status": "ok",
    "msg": "Done",
    "username": "something",
    "rating": 1500,
    "ratingChange": [
        {
            "timestamp": "2023-11-30 18:26:03",
            "rating": 1493
        },
        {
            "...": "same format"
        }
    ],
    "gameHistory": [
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

**Condition** :  User account does not exist.

**Code** : `404 Not found`

**Content** :
```json
{
    "status": "error",
    "msg": "Cannot find user"
}
```
