# Healthcare Demo

## Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env with MongoDB Atlas, JWT secret and Stripe test key
npm start
```

## Frontend
```bash
cd frontend
npm install
cp .env.example .env
# edit Cloudinary values if image upload is needed
npm run dev -- --host 0.0.0.0
```

Open http://localhost:5173. The backend health check is http://localhost:5000/api/v1/health.

Do not commit `.env` files.

Environment setup notes
=======================

The archive now includes backend/.env and frontend/.env templates. They contain placeholders
where private credentials are required; replace those placeholders before running the app.

Backend:
- Copy the MongoDB Atlas connection string from Atlas > Connect > Drivers.
- Rotate any database password previously exposed, then use the new password.
- If the password contains reserved URI characters, URL-encode them.
- Keep the full MONGO_URL on one line.
- Set JWT_SECRET_KEY to a long random private value.
- Set CLIENT_SITE_URL to the exact frontend origin.
- STRIPE_SECRET_KEY is needed only for Stripe checkout.

Frontend:
- VITE_API_BASE_URL=http://localhost:5000/api/v1 is for local development only.
- For WAN access, deploy the backend and use its public HTTPS API URL, then rebuild/redeploy
  the frontend. Do not put MongoDB credentials or JWT secrets in frontend/.env.

Do not commit .env files to GitHub. Use the hosting provider's environment settings for deployment.
