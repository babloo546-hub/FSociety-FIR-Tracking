# FSociety FIR Tracking 🛡️

A professional, high-security **Full-Stack FIR & Case Tracking System** designed for modern law enforcement. Featuring a tactical dark theme, role-based access control, and automated investigation tracking.

---

## 🚀 Instant Cloud Deployment (Render)

You can now deploy the entire stack (Backend + Frontend + Database) to the cloud with **zero technical setup** using the Render Blueprint.

1.  **Fork** this repository to your GitHub account.
2.  Create a free account at [Render.com](https://render.com).
3.  Click **"New +"** and select **"Blueprint"**.
4.  Connect your GitHub repository and click **"Apply"**.

Render will automatically detect the `render.yaml` file and spin up your secure Tactical environment on a live URL!

---

## 🛠️ Local Development (Manual Setup)

If you prefer to run the system on your own machine:

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (Optional, for `docker-compose`)

### 2. Quick Launch (Docker)
```bash
cd FIR_TRACKING
docker-compose up --build
```

### 3. Manual Launch
**Backend:**
```bash
cd FIR_TRACKING/backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd FIR_TRACKING/frontend
npm install
npm run dev
```

---

## 🏗️ Technical Architecture
- **Environment**: Containerized via Docker.
- **Backend**: Django REST Framework + SimpleJWT.
- **Frontend**: React (Vite) + Tailwind CSS (Tactical Dark Theme).
- **Orchestration**: Render.yaml Blueprint for CI/CD.

Developed for **Advanced Law Enforcement Tracking** and **Citizen Transparency**. ⚖️

