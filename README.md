# BookShare - Peer-to-Peer Book Exchange Portal

A modern full-stack web application that connects book owners and book seekers to facilitate book exchanges and rentals within communities. This platform aims to promote sustainable reading habits, reduce waste, and build community connections through shared literature.

## Overview

BookShare revolutionizes the way readers interact with books by creating a community-driven platform that enables:

- **Book Owners**: List books they want to give away, rent out, or exchange with others
- **Book Seekers**: Discover, browse, and connect with owners to gain access to a diverse collection of books

The application features an intuitive user interface with seamless authentication, comprehensive book management, advanced search capabilities, and responsive design across all devices.

Built with Next.js 15 using the App Router architecture, MongoDB for data persistence, and Clerk for secure authentication and user management.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB database (local or Atlas)
- Clerk account (for authentication)

### Environment Variables
Create a `.env` file in the root directory with the following:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/bookshare"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Redis (optional, for caching)
REDIS_URL="redis://localhost:6379"
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bookshare.git
cd bookshare
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up the database
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Navigate to `http://localhost:3000` in your browser

## Features Implemented

### User Authentication & Profiles
- ✅ Full authentication using Clerk
- ✅ Role selection (Book Owner or Book Seeker)
- ✅ Profile creation with name, email, mobile number, location, and bio
- ✅ Role-based access control

### Book Listings
- ✅ Book Owners can create, edit, and delete their book listings
- ✅ Comprehensive book details including title, author, genre, description, location, and contact info
- ✅ Book status management (available, rented, exchanged)
- ✅ Book condition specification
- ✅ Cover image upload support

### Browsing & Search
- ✅ Public book browsing for all users
- ✅ Advanced search and filter functionality by title, author, genre, location, etc.
- ✅ Detailed book view with owner information
- ✅ Related books recommendation

### Dashboard
- ✅ Personalized dashboards for both owner and seeker roles
- ✅ Book management interface for owners
- ✅ Statistics and analytics for book owners

### UI/UX
- ✅ Responsive design with Tailwind CSS
- ✅ Interactive UI with animations using Framer Motion
- ✅ Loading states and transitions
- ✅ Toast notifications

## What's Working

- **User Authentication**: Complete Clerk integration with role selection
- **Book Management**: CRUD operations for book listings
- **Search & Filtering**: Advanced filtering options for books
- **Responsive UI**: Full support for mobile, tablet, and desktop
- **Performance Optimizations**: Redis caching, lazy loading, and pagination
- **Data Persistence**: MongoDB integration through Prisma ORM

## What Needs Improvement

- **Email Handling in User Profile**: Currently experiencing an issue where the user's email is not being properly saved to MongoDB in some cases. This affects users signing up with email authentication. The issue is in the `src/app/api/user/route.ts` and `src/app/api/webhook/clerk/route.ts` files.

- **Redis Integration**: Redis is optional and falls back to in-memory caching if not configured, but full Redis support would improve performance at scale.

- **Image Upload**: Currently supporting image uploads through data URLs. A more scalable solution would be to integrate with a service like Cloudinary or AWS S3.

## Bonus Features Implemented

- ✅ **Book Cover Images**: Support for uploading book cover images
- ✅ **Advanced Filtering**: Filter books by genre, location, status, etc.
- ✅ **Edit/Delete Listings**: Book owners can manage their listings
- ✅ **User Dashboard**: Personalized dashboards with statistics
- ✅ **Real-time Form Validation**: Client-side validation for all forms
- ✅ **Related Books**: Recommendations based on genre or author
- ✅ **Loading Animations**: Enhanced user experience with loading states
- ✅ **Responsive Design**: Works on all device sizes

## AI Tools Used

- **GitHub Copilot**: Used for code completion and suggestions throughout the development process
- **ChatGPT/Claude**: Utilized for code review, debugging, and generating boilerplate components
- **Repomix**: Used to create a unified view of the codebase for easier analysis
- **Midjourney**: Used for generating concept art for the application design (not included in the final code)

## Tech Stack

- **Frontend Framework**: 
  - React 19
  - Next.js 15 (App Router)
  - TypeScript for type safety

- **Authentication & User Management**: 
  - Clerk with custom integration
  - Role-based access control
  - Secure webhook handling

- **Database & Data Management**: 
  - MongoDB with Prisma ORM
  - Redis for caching (optional, falls back to in-memory)
  - Zod for runtime schema validation and type safety

- **Styling & UI Components**: 
  - TailwindCSS for utility-first styling
  - shadcn/ui component library
  - Framer Motion for animations
  - Headless UI for accessible components
  - Lucide React for icons

- **State Management & Data Fetching**: 
  - React Context API for global state
  - Server actions for data mutations
  - Optimistic UI updates

- **Quality Assurance & Dev Tools**: 
  - ESLint for code quality
  - TypeScript for static type checking
  - Prettier for code formatting
  - React Hot Toast for notifications

- **Performance Optimization**: 
  - Edge runtime compatibility
  - React Server Components
  - Image optimization with Next.js
  - Incremental Static Regeneration

## How to Use the Application

### Authentication with Clerk

1. **Sign Up**: 
   - Visit the homepage and click "Sign Up"
   - Create an account using email, or social providers
   - Verify your email address if using email authentication

2. **Role Selection**:
   - After signing up, you'll be prompted to select a role:
     - **Book Owner**: For those who want to list books for exchange or rent
     - **Book Seeker**: For those looking to find books
   - This role determines your dashboard experience and permissions

3. **Profile Setup**:
   - Complete your profile by adding your name, location, mobile number, and optional bio
   - This information helps build trust in the community

### For Book Owners

1. **Dashboard**:
   - View statistics about your books (total, available, rented, exchanged)
   - Manage all your book listings in one place

2. **Adding Books**:
   - Click "Add New Book" from your dashboard
   - Fill in book details including title, author, genre, description, condition
   - Upload a cover image or select from provided templates
   - Add your location and contact information
   - Submit the listing to make it visible to seekers

3. **Managing Books**:
   - Edit book details at any time
   - Change book status (available, rented, exchanged)
   - Remove listings when no longer needed

### For Book Seekers

1. **Browse Books**:
   - View all available books from the "Browse Books" section
   - Use filters to find books by title, author, genre, or location
   - Click on a book to view detailed information

2. **Contacting Owners**:
   - From a book's detail page, use the "Contact Owner" button
   - Send a message expressing your interest in the book
   - Connect with the owner using their provided contact information

### Tips for All Users

- Keep your profile information up to date
- Respond promptly to messages and inquiries
- Update book statuses when they change
- Use the search and filter functions to find relevant content quickly
- Report any inappropriate content or behavior

## Future Improvements

- Fix email storage issue for proper user profile management
- Add notification system for book requests and messages
- Implement a rating system for users
- Add a proper messaging system for users to communicate
- Integrate with a CDN for image storage
- Add more social authentication options through Clerk
- Implement a proper payment system for book rentals
- Add a map view for book locations
- Email notifications for new book listings that match user preferences
- Mobile app with push notifications

## License

This project is for evaluation purposes only and is not licensed for commercial use.