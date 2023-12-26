# Get game info
**URL** : `/api/game-info/{gameid}`

**Method** : `GET`

**Auth required** : NO

## Success responses
**Condition** :  Game info retrieved.

**Code** : `200 Success`

**Content example** :
```json
{
    "status": "ok",
    "gameInfo": {
        "gameid": 17028124918640,
        "black": {
            "username": "something",
            "rating": 1465
        },
        "white": {
            "username": "somgthing",
            "rating": 1535
        },
        "position": "rnbqkbnr/ppp2ppp/8/3p4/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0 4",
        "history": [
            {
                "color": "w",
                "piece": "p",
                "from": "e2",
                "to": "e4",
                "san": "e4",
                "flags": "b",
                "lan": "e2e4",
                "before": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                "after": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
            },
            {
                "...": "same format"
            }
        ],
        "turn": "w",
        "timeLeft": 897
    }
}
```

## Error responses
**Condition** :  Server error

**Code** : `500 Server error`

### Or

**Condition** :  Game does not exist.

**Code** : `404 Not found`

**Content** :
```json
{
    "status": "error",
    "msg": "Cannot find game"
}
```
