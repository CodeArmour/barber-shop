# 💇‍♂️ Sharp Cuts - Barber Shop Reservation System

![Sharp Cuts Banner](/public/classic-barbershop.png)

<div align="center">
  
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

## 📋 Overview

Sharp Cuts is a modern, full-stack web application designed for barber shops to manage appointments and for customers to book services online. The application features a clean, responsive design with barber shop-themed styling and animations, providing an intuitive user experience for both customers and administrators.

## ✨ Features

### 👤 Customer-Facing Features

- **🗓️ Interactive Booking System**: Step-by-step appointment booking with real-time availability
- **✂️ Service Selection**: Browse and select from various haircut and grooming services
- **👨‍💼 Barber Selection**: Choose preferred barbers based on availability
- **📅 Appointment Management**: View, modify, or cancel existing appointments
- **📱 Responsive Design**: Optimized for all devices from mobile phones to desktops
- **✨ Animated UI Elements**: Custom scissors animations and transitions for an engaging experience
- **📧 Booking Confirmation**: Email confirmation with appointment details

### 👨‍💼 Admin Features

- **📊 Dashboard**: Overview of daily, weekly, and monthly appointments
- **📆 Calendar View**: Visual calendar with appointment slots and availability
- **🔄 Appointment Management**: Confirm, reschedule, or cancel appointments
- **👥 Customer Database**: Access customer information and booking history
- **🛠️ Service Management**: Add, edit, or remove services and pricing
- **👨‍💇‍♂️ Barber Management**: Manage barber profiles, schedules, and specialties
- **📈 Analytics**: Track business performance with appointment statistics

## 🛠️ Technology Stack

### ⚛️ Frontend
- **Next.js 15**: React framework with App Router for server components and routing
- **TypeScript**: Type-safe code for better developer experience and fewer bugs
- **Tailwind CSS**: Utility-first CSS framework for custom styling
- **Shadcn UI**: Component library based on Radix UI for consistent UI elements
- **Lucide React**: Modern icon library
- **React Hook Form**: Form validation and submission
- **date-fns**: Date manipulation library
- **Recharts**: Composable charting library for data visualization

### 🖥️ Backend
- **Next.js API Routes**: Server-side API endpoints
- **Server Actions**: For form submissions and data mutations
- **Prisma ORM**: Type-safe database queries and schema management
- **Nodemailer**: Email sending functionality for confirmations

### 🔐 Authentication
- **Client-side Authentication**: For demo purposes (would use NextAuth.js in production)

## 📁 Project Structure

```
sharp-cuts/
├── app/                  # Next.js App Router
│   ├── actions/          # Server Actions for data mutations
│   ├── admin/            # Admin dashboard and management
│   ├── booking/          # Booking flow and confirmation
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── booking/          # Booking-specific components
│   ├── home/             # Homepage components
│   ├── layout/           # Layout components (header, footer)
│   ├── ui/               # Shadcn UI components
│   └── error/            # Error handling components
├── lib/                  # Utility functions and database client
├── sections/             # Page sections composed of components
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎨 UI/UX Design

The application features a carefully crafted design that balances modern web aesthetics with traditional barber shop elements:

- **🎭 Color Palette**: Rich amber and stone colors that evoke classic barber shop aesthetics
- **🔤 Typography**: Clean, readable fonts with clear hierarchy
- **✂️ Animations**: Custom scissors animations for interactive elements
- **🧭 Iconography**: Barber-themed icons and decorative elements
- **📱 Responsive Layout**: Fluid design that adapts to all screen sizes
- **♿ Accessibility**: ARIA attributes and keyboard navigation support
- **⚠️ Error Handling**: Custom error pages with themed styling

## 📄 Key Pages

### 🏠 Homepage
The homepage showcases the barber shop's services and features with a prominent "Book Now" call-to-action button featuring a custom scissors animation.

### 📝 Booking Flow
The booking process is divided into logical steps:
1. Date and time selection
2. Barber selection
3. Service selection
4. Customer information
5. Confirmation

### 📊 Admin Dashboard
The admin dashboard provides a comprehensive overview of the business:
- Today's appointments
- Quick stats (completion rate, cancellation rate, revenue)
- Calendar view with daily, weekly, and monthly views
- Appointment management interface

### ❌ Error Pages
Custom-designed error pages (404, 500) maintain the barber shop theme with animated elements and clear navigation options.

## 📦 Technologies & Dependencies

### Core Technologies
- [Next.js](https://nextjs.org/) (v15.2.4) - React framework
- [React](https://reactjs.org/) (v19) - UI library
- [TypeScript](https://www.typescriptlang.org/) (v5) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) (v3.4.17) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) (v6.6.0) - ORM for database operations

### UI Components & Styling
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Lucide React](https://lucide.dev/) (v0.454.0) - Icon library
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge) - Merge Tailwind CSS classes
- [Class Variance Authority](https://cva.style/docs) - Create style variants

### Form Handling & Validation
- [React Hook Form](https://react-hook-form.com/) - Form state management
- [Zod](https://zod.dev/) (v3.24.1) - Schema validation
- [Input OTP](https://github.com/guilherme-pg/input-otp) - One-time password input

### Date & Time
- [date-fns](https://date-fns.org/) - Date utility library
- [React Day Picker](https://react-day-picker.js.org/) (v8.10.1) - Date picker component

### Charts & Visualization
- [Recharts](https://recharts.org/) (v2.15.0) - Composable chart library

### Notifications & Feedback
- [Sonner](https://sonner.emilkowal.ski/) (v1.7.4) - Toast notifications
- [Nodemailer](https://nodemailer.com/) (v6.10.1) - Email sending

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (or cloud SQL service)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sharp-cuts.git
cd sharp-cuts
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
DATABASE_URL=your_postgres_connection_string
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

The application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## 🔮 Future Enhancements

- **💳 Online Payment Integration**: Accept payments through Stripe or PayPal
- **📱 SMS Notifications**: Send appointment reminders via Twilio
- **🏆 Loyalty Program**: Implement a points system for returning customers
- **👨‍💼 Staff Scheduling**: Advanced scheduling features for barbers
- **📦 Inventory Management**: Track product usage and stock
- **📱 Mobile App**: Native mobile applications for iOS and Android

## 📄 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "postinstall": "prisma generate"
}
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Vercel](https://vercel.com/)