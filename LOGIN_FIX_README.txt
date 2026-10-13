Heal Time — login fix notes

Changes in this archive:
- Backend login now returns a consistent success field and a clearer server message if JWT_SECRET_KEY is missing or still the example placeholder.
- Frontend login now validates the API response and displays a helpful network/API configuration message for fetch failures.

Important setup required after extracting:
1. Copy backend/.env.example to backend/.env if you do not already have your private .env. Do not overwrite an existing working .env.
2. Set MONGO_URL to your MongoDB Atlas connection string.
3. Generate a private JWT secret with: openssl rand -hex 32
   Put it in backend/.env as JWT_SECRET_KEY=<generated-value>. Never share it.
4. For same-Wi-Fi use, set frontend/.env VITE_API_BASE_URL=http://<PARROT_WIFI_IP>:5000/api/v1
   and backend/.env CLIENT_SITE_URL=http://<PARROT_WIFI_IP>:5173
   Replace <PARROT_WIFI_IP> with the computer's current Wi-Fi IP. Both devices must be on the same Wi-Fi.
5. Restart the backend and Vite after environment changes.
6. Ensure backend/index.js binds to 0.0.0.0 (this archive already does).

This archive does not contain private credentials. Existing user passwords are not reset or migrated.
