# 🛡️ Safar Suraksha – Tourist Safety Monitoring App  

Safar Suraksha is a **real-time tourist safety monitoring system** that ensures safe travel experiences through **location tracking, SOS alerts, AI-powered risk analysis, and responder coordination**.  

---

## 1. Why Safar Suraksha?  
- Safe travel for tourists  
- AI + Blockchain + Real-time alerts  
- Quick SOS help & police integration 

---

## 2. Features  

- 🔐 **Blockchain ID**: Secure identity & contacts  
- 📍 **Live Location**: Continuous tracking, GPS fallback  
- 🚨 **SOS Module**: One-tap SOS + voice → text  
- ⚠️ **AI Modules**:  
  - Anomaly detection  
  - Geofencing alerts  
  - Safety score calculation  
- 👮 **Police Dashboard**: Real-time alerts & monitoring  
- 💾 **NoSQL DB**: Stores events & trips

---

## 3. Flow  

1. User registers → Blockchain ID  
2. App shares live location → Backend  
3. AI modules process → detect risks  
4. SOS / anomalies → Police Dashboard  
5. DB logs all events

---

## 4. Tech Stack  

- **Frontend**: React Native, Dashboard (Next.js)  
- **Backend**: NestJS / Node.js  
- **Database**: MongoDB / DynamoDB  
- **AI**: Speech-to-Text, Anomaly, Geofencing, Safety Score  
- **Security**: Blockchain ID, TLS, JWT

---

## 5. Project Structure  

```
safar-suraksha/
├── backend/                  # Backend services
│   ├── src/                  # Controllers, routes, services
│   ├── server.js             # Backend entry point
│   ├── package.json          # Backend dependencies
│   ├── pnpm-lock.yaml        # Lock file
│
├── frontend/                 # Frontend (React Native / Expo)
│   ├── app/                  # Screens & navigation
│   ├── assets/               # Images, icons, fonts
│   ├── constants/            # App constants (colors, configs)
│   ├── contexts/             # React contexts (auth, location, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── providers/            # Context providers
│   ├── scripts/              # Utility scripts
│   ├── tsconfig.json         # TypeScript config
│   ├── package.json          # Frontend dependencies
│   ├── package-lock.json     # Lock file
│
├── ml/                       # AI/ML modules
│   └── (speech-to-text, anomaly detection, safety score, etc.)
│
```

---

## 6. Data Flows  

- **SOS** → App → Backend → AI → DB + Police  
- **Location** → App → Backend → AI (Geo/Anomaly) → Police  
- **Safety Score** → AI → Dashboard

---

## 7. Privacy  

- Blockchain ID  
- Consent-based tracking  
- Encrypted data  
- Emergency-only storage

---

## 8. License  
MIT License 
