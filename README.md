# 🏠 BookingPro - Airbnb Clone Platform

> A full-stack property booking platform where hosts can list properties and guests can discover and book accommodations.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool & dev server
- **TailwindCSS 4.1.17** - Utility-first CSS framework
- **DaisyUI 5.5.7** - Tailwind CSS component library
- **React Router 7.10.0** - Client-side routing
- **Zustand 5.0.9** - State management
- **Axios 1.13.2** - HTTP client
- **React Hot Toast 2.6.0** - Toast notifications
- **Lucide React 0.555.0** - Icon library
- **date-fns 4.1.0** - Date manipulation

### **Backend**
- **NestJS 11.0.1** - Node.js framework
- **TypeScript 5.7.3** - Programming language
- **Prisma 5.22.0** - Modern ORM
- **PostgreSQL 15** - Relational database
- **Passport JWT 4.0.1** - JWT authentication strategy
- **bcryptjs 3.0.3** - Password hashing
- **class-validator 0.14.3** - DTO validation
- **class-transformer 0.5.1** - Object transformation
- **Swagger 11.2.3** - API documentation

### **DevOps**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📸 Screenshots

### Home Page - Property Listings
<img width="1919" height="946" alt="image" src="https://github.com/user-attachments/assets/abe64267-244c-4fd7-b0ee-93ddaa4209db" />

*Browse available properties with filtering options*

---

### Property Detail Page
<img width="1908" height="986" alt="image" src="https://github.com/user-attachments/assets/406212c8-a49b-4db4-80b5-546b5976736c" />

*Detailed property information with booking form*

---

### User Authentication
<img width="1915" height="939" alt="image" src="https://github.com/user-attachments/assets/e6a88615-382d-42a7-ac51-c9dd01c72071" />

*Secure login with JWT authentication*

<img width="1896" height="940" alt="image" src="https://github.com/user-attachments/assets/3191be05-ada8-44e6-828a-c8bb99e5718e" />

*User registration with role selection (GUEST/HOST)*

---

### Host Dashboard
<img width="1919" height="998" alt="image" src="https://github.com/user-attachments/assets/9e4684e3-8a9c-49e0-8138-8d4c4a9fbe21" />
*Host overview with quick access to property management*

---

### My Properties (HOST)
<img width="1919" height="987" alt="image" src="https://github.com/user-attachments/assets/6b9eaab4-d42a-47e1-aeb8-f2c7bfbd7773" />


*Manage all your listed properties*

---

### Create Property
<img width="1918" height="959" alt="image" src="https://github.com/user-attachments/assets/4cbc10e2-f4c9-48ea-abd5-61e27009e02b" />
<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/2406d0fd-bfc6-470d-b1e4-6fce86ddf961" />

*Add new property with detailed information*

---

### Edit Property
<img width="1912" height="999" alt="image" src="https://github.com/user-attachments/assets/78c50d99-6082-4bf8-adfd-5f4ac0f2849e" />

*Update existing property details*

---

### Host Bookings
<img width="1908" height="958" alt="image" src="https://github.com/user-attachments/assets/fac584e4-653a-4563-a1cd-65d3fd8d531a" />

*View and manage bookings for your properties*

---

### Guest Bookings
<img width="1916" height="993" alt="image" src="https://github.com/user-attachments/assets/6185e0c1-6f76-41ac-9248-dfe6c94ce177" />

*View your booking history and status*

---

## ✨ Features

- 🔐 **Authentication** - JWT-based auth with role-based access control (GUEST, HOST, ADMIN)
- 🏡 **Property Management** - Hosts can create, edit, and delete properties
- 🔍 **Property Discovery** - Browse and filter properties by city and type
- 📅 **Booking System** - Complete booking flow with status management
- 💰 **Revenue Tracking** - Hosts can track earnings from confirmed bookings
- ⭐ **Reviews & Ratings** - Review system with average rating display
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean interface built with DaisyUI components

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/booking-pro.git
cd booking-pro
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Setup environment variables**

Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_pro"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION="24h"
PORT=3001
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

4. **Start PostgreSQL database**
```bash
cd backend
docker-compose up -d
```

5. **Run database migrations**
```bash
cd backend
npx prisma migrate dev
```

6. **Start the application**
```bash
# From root directory
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **API Docs:** http://localhost:3001/api/docs

---

## 📸 Screenshots

### Home Page - Property Listings
![Home Page](screenshots/home-page.png)
*Browse available properties with filtering options*

---

### Property Detail Page
![Property Detail](screenshots/property-detail.png)
*Detailed property information with booking form*

---

### User Authentication
![Login](screenshots/login.png)
*Secure login with JWT authentication*

![Register](screenshots/register.png)
*User registration with role selection (GUEST/HOST)*

---

### Host Dashboard
![Host Dashboard](screenshots/host-dashboard.png)
*Host overview with quick access to property management*

---

### My Properties (HOST)
<img width="1917" height="984" alt="image" src="https://github.com/user-attachments/assets/78f21b58-7acd-4d11-b2b3-1fa78750accc" />


*Manage all your listed properties*

---

### Create Property
![Create Property](screenshots/create-property.png)
*Add new property with detailed information*

---

### Edit Property
![Edit Property](screenshots/edit-property.png)
*Update existing property details*

---

### Host Bookings
![Host Bookings](screenshots/host-bookings.png)
*View and manage bookings for your properties*

---

### Guest Bookings
![Guest Bookings](screenshots/guest-bookings.png)
*View your booking history and status*

---

### Booking Statistics
![Booking Stats](screenshots/booking-stats.png)
*Track bookings by status with revenue analytics*

---

## 📁 Project Structure

```
BookingPro/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── properties/    # Property management
│   │   │   └── bookings/      # Booking system
│   │   ├── common/            # Shared decorators, guards, filters
│   │   ├── prisma/            # Database service
│   │   └── main.ts            # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   └── docker-compose.yml     # PostgreSQL container
│
├── frontend/
│   ├── src/
│   │   ├── api/               # API client & services
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Helper functions
│   │   └── App.tsx            # Main application component
│   └── public/                # Static assets
│
└── README.md
```

---

## 🗄️ Database Schema

### Users
- Authentication & profile information
- Roles: GUEST, HOST, ADMIN

### Properties
- Property details (title, description, type)
- Location information
- Pricing and capacity
- Amenities and images

### Bookings
- Check-in/check-out dates
- Guest count and total price
- Status: PENDING, CONFIRMED, CANCELLED, COMPLETED

### Reviews
- Rating (1-5 stars)
- Comment and timestamps

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (public)
- `GET /api/properties/:id` - Get property details
- `GET /api/properties/my` - Get my properties (HOST)
- `POST /api/properties` - Create property (HOST)
- `PATCH /api/properties/:id` - Update property (HOST)
- `DELETE /api/properties/:id` - Delete property (HOST)

### Bookings
- `POST /api/bookings` - Create booking (GUEST)
- `GET /api/bookings/my` - Get my bookings (GUEST)
- `GET /api/bookings/host` - Get bookings for my properties (HOST)
- `PATCH /api/bookings/:id/confirm` - Confirm booking (HOST)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (GUEST/HOST)

Full API documentation available at: `http://localhost:3001/api/docs`

---

## 🎯 User Roles

### GUEST
- Browse and search properties
- Create bookings
- View booking history
- Cancel bookings
- Leave reviews

### HOST
- All GUEST permissions
- Create and manage properties
- View bookings for owned properties
- Confirm/reject booking requests
- Track revenue and statistics

### ADMIN
- All HOST permissions
- Manage all users
- Moderate content
- Access to admin panel

---

## 🚧 Future Enhancements

- [ ] **Reviews System** - Complete implementation of property reviews
- [ ] **Advanced Filters** - Price range, amenities, date availability
- [ ] **Image Upload** - Direct image upload instead of URLs
- [ ] **Payment Integration** - Stripe payment processing
- [ ] **Real-time Chat** - Host-Guest messaging system
- [ ] **Email Notifications** - Booking confirmations and updates
- [ ] **Calendar View** - Availability calendar for properties
- [ ] **Admin Panel** - Complete admin dashboard
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Google Maps Integration** - Property location visualization

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration from Airbnb
- UI components from DaisyUI
- Icons from Lucide React
- Documentation templates from various open-source projects

---

<p align="center">Made with ❤️ using React, NestJS, and PostgreSQL</p>
