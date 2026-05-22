# How to Run the E-Voting System

This project has **3 parts** that need to run simultaneously.

---

## 1. Blockchain (Hardhat local node + Smart Contracts)

```bash
cd blockchain
npm install
npx hardhat node
```

In a **separate terminal**, deploy the contracts:

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

The local node runs on `http://127.0.0.1:8545`.

---

## 2. Backend (Express + Prisma + PostgreSQL)

Make sure **PostgreSQL** is running and the database URL in `.env` is correct.

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

The backend starts on `http://localhost:5000`.

---

## 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

---

## 4. Seed the database

In a new terminal, run these commands **in order**:

```bash
cd backend
npx prisma db push --force-reset   # Reset database
node seed.js                        # Create admin account
node seed-nin.js                    # Create test NIN records
node seed-election.js               # Create election + deploy to chain
```

---

## Login Credentials

### Admin Portal
| Field    | Value                      |
|----------|----------------------------|
| Email    | `admin@nigeriavote.gov.ng` |
| Password | `Admin@123`                |

### Voter Test NINs (for registration & login)
| NIN         | Name             | State    |
|-------------|------------------|----------|
| 12345678901 | David Ugbah-Nduka | Nasarawa |
| 23456789012 | John Doe         | Lagos    |
| 34567890123 | Jane Smith       | Kano     |
| 45678901234 | Ahmed Musa       | Kano     |
| 56789012345 | Chioma Okafor    | Anambra  |
| 67890123456 | Ibrahim Yusuf    | Kaduna   |
| 78901234567 | Amaka Eze        | Enugu    |
| 89012345678 | Emeka Nwosu      | Rivers   |
| 90123456789 | Fatima Aliyu     | Sokoto   |
| 01234567890 | Biodun Adeleke   | Osun     |

---

## Quick Start (all steps)

```bash
# Terminal 1: Blockchain
cd blockchain
npx hardhat node

# Terminal 2: Deploy contracts
cd blockchain
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Backend
cd backend
npx prisma generate
npm run dev

# Terminal 4: Seed database (first time only)
cd backend
npx prisma db push --force-reset
node seed.js
node seed-nin.js
node seed-election.js

# Terminal 5: Frontend
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Portal Access

### Voter Portal (default)
- `http://localhost:5173` — Register with NIN, login, and vote

### Admin Portal
- Click "Admin Login" on the homepage or go to `http://localhost:5173`
- Login with `admin@nigeriavote.gov.ng` / `Admin@123`
- Pages: Dashboard, Create Election, Candidates, Deploy, Monitor, Results, Reports

### Observer Portal (frontend not yet built)
- API endpoints available at `/api/observer/*`

---

## Summary

| Part       | Command                              | URL                        |
|------------|--------------------------------------|----------------------------|
| Blockchain | `npx hardhat node`                   | `http://127.0.0.1:8545`   |
| Backend    | `npm run dev` (in `backend/`)        | `http://localhost:5000`    |
| Frontend   | `npm run dev` (in `frontend/`)       | `http://localhost:5173`    |
