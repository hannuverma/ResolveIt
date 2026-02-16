# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-16

### Added
- Initial release of ResolveIt
- Student complaint submission with image upload
- AI-powered automatic department assignment
- Real-time complaint status tracking
- Department performance leaderboard
- Admin dashboard for managing students and departments
- Point-based reward system for departments
- Feedback and rating system
- Admin alert notifications with estimated resolution times
- Complaint similarity detection and grouping
- Auto-generated department usernames
- College-based data isolation
- JWT authentication
- Role-based access control (Student, Department, Admin)
- Cloudinary integration for image storage
- PostgreSQL database support
- React frontend with Tailwind CSS
- Django REST API backend
- Node.js AI layer with LangChain

### Features
- **Student Portal**
  - Submit complaints with images
  - View complaint history
  - Track complaint status
  - Rate resolved complaints
  - View department leaderboards
  - Receive admin notifications

- **Department Portal**
  - View assigned complaints
  - Update complaint status
  - View performance metrics
  - Track reward points

- **Admin Portal**
  - Add/remove students
  - Create/delete departments
  - Create system alerts
  - View department leaderboards
  - Manage college data

- **AI Features**
  - Automatic department detection
  - Complaint title generation
  - Priority assignment
  - Similarity detection
  - Duplicate complaint prevention

### Security
- JWT-based authentication
- Password hashing
- Role-based permissions
- College data isolation
- CORS configuration
- Secure file uploads

## [Unreleased]

### Planned
- Email notifications
- SMS alerts integration
- Advanced analytics dashboard
- Complaint export (PDF/Excel)
- Multi-language support
- Mobile app (React Native)
- Real-time chat with departments
- Complaint escalation workflow
