# backend

To install dependencies:

```bash
pnpm install
```

To run:

```bash
pnpm run dev
```

## API Endpoints
```plaintext
POST /auth/otp            { phone } -> 200 (otp sent)
POST /auth/verify         { phone, otp } -> { jwt, consent_token }
POST /tourist/register    { name, kyc_mock_data, itinerary, contacts }
GET  /tourist/:id         -> profile + id status
POST /geo/ping            { touristId, lat, lon, ts, acc, speed }
POST /alerts/panic        { touristId, lat, lon, note }
GET  /dashboard/alerts    -> list
POST /incidents/:id/ack
POST /incidents/:id/dispatch { unitId }
GET  /id/:id/verify
POST /admin/geofence      { name, polygon, riskLevel }
```