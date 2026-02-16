# ResolveIt - Centralized Complaint Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![Django](https://img.shields.io/badge/django-6.0-green.svg)
![React](https://img.shields.io/badge/react-19.2-blue.svg)

ResolveIt is an AI-powered centralized complaint management system designed for educational institutions. It streamlines the process of submitting, tracking, and resolving student complaints while providing department leaderboards and administrative controls.

## ✨ Features

### For Students
- 📝 Submit complaints with images and descriptions
- 🤖 AI-powered automatic department assignment
- 📊 Track complaint status in real-time
- ⭐ Rate and provide feedback on resolved complaints
- 🔔 Receive admin notifications and alerts
- 📈 View department leaderboards

### For Departments
- 📋 View assigned complaints filtered by college
- ✅ Update complaint status (Pending → In Progress → Resolved)
- 🏆 Earn reward points for timely resolutions
- ⚡ Speed bonuses for quick responses
- 📉 Penalty system for delayed resolutions

### For Administrators
- 👥 Manage students and departments
- 🏢 Department creation with auto-generated usernames
- ⚠️ Create system-wide alerts with resolution times
- 📊 View department performance leaderboards
- 🎯 College-based data isolation

### AI Layer
- 🧠 Automatic complaint categorization and department assignment
- 🏷️ Generate complaint titles and priority levels
- 🔍 Detect duplicate/similar complaints
- 📌 Group related complaints with similarity hashing

## 🏗️ Architecture

```
ResolveIt/
├── Backend/           # Django REST API
├── frontend/          # React + Vite UI
└── Ai-layer/          # Node.js AI Service
```

### Tech Stack

**Backend**
- Django 6.0 + Django REST Framework
- PostgreSQL (Supabase)
- JWT Authentication
- Cloudinary for image storage

**Frontend**
- React 19.2 with React Router
- Vite for build tooling
- Tailwind CSS 4
- Axios for API calls

**AI Layer**
- Node.js + Express
- LangChain with Groq/OpenAI
- LangGraph for AI workflows

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or Supabase account)
- Cloudinary account
- Groq/OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend/backend
```

2. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in `Backend/backend/`:
```env
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=6543

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Layer
AI_LAYER_API=http://localhost:3000/process

# JWT Settings (optional)
SIMPLE_JWT_ACCESS_LIFETIME_MIN=30
SIMPLE_JWT_REFRESH_LIFETIME_DAYS=1
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

### AI Layer Setup

1. Navigate to the AI layer directory:
```bash
cd Ai-layer
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `Ai-layer/`:
```env
GROQ_API_KEY=your-groq-api-key
# OR
OPENAI_API_KEY=your-openai-api-key
```

4. Start the AI service:
```bash
node server.js
```

## 📡 API Endpoints

### Authentication
- `POST /api/token/` - Login (get JWT tokens)
- `POST /api/token/refresh/` - Refresh access token

### User Management
- `GET /api/profile/` - Get user profile
- `POST /api/admin/addstudents/` - Add student
- `DELETE /api/admin/removestudents/{identifier}/` - Remove student

### Complaints
- `GET /api/complaints/` - List complaints (filtered by role)
- `POST /api/complaints/` - Submit complaint
- `PATCH /api/complaints/{id}/` - Update complaint status
- `POST /api/complaints/{id}/feedback/` - Submit feedback

### Departments
- `GET /api/admin/getdepartments/` - List departments
- `POST /api/admin/adddepartments/` - Create department
- `DELETE /api/admin/removedepartments/{identifier}/` - Remove department
- `GET /api/departments/{id}/points/` - Get department points

### Alerts
- `POST /api/admin/createalert/` - Create admin alert
- `GET /api/admin/createalert/` - List alerts

## 🎯 Key Features Explained

### Auto-Generated Department Usernames
When creating departments, usernames are automatically generated as:
```
{department_name}@{college_name}.com
```
Example: "Computer Science" at "IIT" → `computerscience@iit.com`

### Complaint Similarity Detection
The AI layer generates similarity hashes to:
- Detect duplicate complaints
- Group related issues
- Increase priority for frequently reported problems
- Auto-resolve grouped complaints when one is resolved

### Point System
- **Resolve Bonus**: +50 points for resolving complaints
- **Speed Bonus**: +20 points for resolving within 24 hours
- **Rating Multiplier**: Points × (rating/5)
- **Penalty**: -10 points/day for unresolved complaints

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (Student, Department, Admin)
- College-based data isolation
- Password hashing with Django's built-in security
- CORS configuration for API security

## 📝 Database Models

### Core Models
- **User**: Extended AbstractUser with roles and college association
- **College**: Institution management
- **Department**: Department info with linked user accounts
- **Complaint**: Central complaint tracking
- **Feedback**: Student ratings and reviews
- **DepartmentPointTransaction**: Point system ledger
- **AlertMessage**: Admin notifications

## 🧪 Development

### Running Tests
```bash
cd Backend/backend
python manage.py test
```

### Code Formatting
```bash
cd frontend
npm run lint
```

## 🚢 Deployment

### Backend (Django)
1. Set `DEBUG=False` in settings
2. Configure proper `ALLOWED_HOSTS`
3. Use production database (PostgreSQL)
4. Set up static file serving (WhiteNoise included)
5. Use `gunicorn` as WSGI server

### Frontend (React)
```bash
cd frontend
npm run build
```
Serve the `dist/` folder with Nginx or similar.

### AI Layer
Deploy to any Node.js hosting (Heroku, Railway, etc.)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name/Team

## 🙏 Acknowledgments

- Django REST Framework for the robust API framework
- LangChain for AI orchestration
- Tailwind CSS for beautiful UI components
- Cloudinary for media management