# FIR & Case Tracking System 🛡️

A full-stack web application designed for tracking FIRs (First Information Reports) and case details. Built with React (Vite) and Django REST Framework.

## Features ✨

- **Role-Based Access**: Specialized views for Citizens, Police Officers, and Admins.
- **FIR Filing**: Citizens can securely log incidents and track their progress through investigations and court dates.
- **Police Dashboard**: Officers can view assigned cases and update their statuses dynamically.
- **Admin Analytics**: Administrators can view real-time statistics and assign cases to specific officers.
- **Notifications**: Automated alerts for status changes and court scheduling.

## Tech Stack 🛠️

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Recharts, Lucide Icons.
- **Backend**: Django, Django REST Framework, SimpleJWT (Authentication).
- **Database**: SQLite (default for development), MySQL (production-ready).
- **Deployment**: Docker Compose included for rapid spin-up.

---

## Local Development Setup 🚀

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# Mac/Linux
source venv/bin/activate

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pymysql python-dotenv Pillow django-storages boto3

python manage.py makemigrations
python manage.py migrate

# Create a superuser (Admin) account
python manage.py createsuperuser

python manage.py runserver
```

### 2. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables
Check the `backend/.env` file. You can configure:
- `USE_MYSQL=True` to switch to the MySQL database.
- Database credentials.
- AWS S3 placeholders for Evidence uploads.

---

## Docker Deployment 🐳

You can spin up the entire stack using Docker:

```bash
docker-compose up --build
```
This will start:
- MySQL Database on port 3306
- Django Application on port 8000
- React Frontend on port 5173

Make sure to map `AWS_ACCESS_KEY_ID` and other S3 properties in the `docker-compose.yml` environment blocks if going strictly into production.

---

## AWS Deployment Considerations ☁️

For production deployment to AWS:

1. **EC2**: Deploy the backend and frontend using Nginx and Gunicorn inside an EC2 instance. Or upload the docker-compose setup directly.
2. **RDS**: Set `USE_MYSQL=True` and configure DB variables to point to an AWS RDS MySQL instance.
3. **S3**: Uncomment the `AWS_` variables in `.env` and configure `django-storages` in `settings.py` for `DEFAULT_FILE_STORAGE` to securely store case evidence.

---

## Using the Application
1. Start both servers.
2. Visit `http://localhost:5173/login`.
3. Register a Citizen account or use the Admin superuser created earlier.
4. File an FIR, and as an Admin, assign it to an officer.
