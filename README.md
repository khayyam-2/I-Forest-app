Forest Watch Dashboard
======================

Real-time dashboard that shows incoming help alerts with latitude/longitude, image, and an attention popup.

Run locally
-----------
1) Install Node.js LTS.
2) In this folder run:

```
npm install
npm run start
```

Open `http://localhost:3000`.

Send a test alert
-----------------

Use curl or Postman to POST JSON to the API:

```
curl -X POST http://localhost:3000/alert \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 33.6844,
    "lng": 73.0479,
    "message": "Fire reported near green belt",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Forest_fire_-_MN_Shot.jpg/640px-Forest_fire_-_MN_Shot.jpg"
  }'
```

Integrate with your mobile app
------------------------------
POST to `/alert` with fields:
- `lat` (number)
- `lng` (number)
- `message` (optional string)
- `imageUrl` (optional string URL)

Example body:

```
{ "lat": 24.8607, "lng": 67.0011, "message": "SOS from ranger team", "imageUrl": "https://..." }
```


