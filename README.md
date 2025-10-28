# MERN Perfume Store - Frontend

A modern, responsive perfume e-commerce application built with React, TypeScript, and Tailwind CSS, featuring AI-powered recommendations and Firebase authentication.

## Features

- **Browse Perfumes** - Explore a curated collection of luxury perfumes with advanced filtering
- **AI Assistant** - Get personalized recommendations powered by Gemini AI
- **User Authentication** - Google Sign-In via Firebase
- **Reviews & Ratings** - Read and write perfume reviews
- **Admin Dashboard** - Manage perfumes, brands, and view members (admin only)
- **Responsive Design** - Beautiful UI with shadcn/ui components and Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router DOM** for routing
- **React Query** (@tanstack/react-query) for data management
- **Tailwind CSS v4** with @tailwindcss/vite
- **shadcn/ui** for UI components
- **Firebase** for authentication
- **Axios** for API communication
- **Lucide React** for icons

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Google authentication enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - Set up Firebase project at https://console.firebase.google.com
   - Enable Google authentication in Firebase Console
   - Copy your Firebase config values to `.env`
   - Set `VITE_API_BASE_URL` to your backend API URL

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and mock data
│   │   ├── client.ts     # Axios instance
│   │   └── mockData.ts   # Mock data for development
│   ├── components/       # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navigation.tsx
│   │   └── CommentSection.tsx
│   ├── context/          # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── usePerfumes.ts
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── PerfumeDetail.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── GeminiAssistant.tsx
│   ├── utils/            # Utility functions
│   │   └── roles.ts
│   ├── lib/              # Library utilities
│   │   └── utils.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## User Roles

### Guest
- Browse all perfumes
- Search and filter perfumes
- View perfume details and reviews

### Member (Authenticated User)
- All guest features
- Leave reviews (one per perfume)
- Edit profile
- View AI recommendations

### Admin
- All member features
- Manage perfumes (CRUD operations)
- Manage brands (CRUD operations)
- View all members

## Admin Access

To test admin features, sign in with the email configured in `src/utils/roles.ts`:
- Default admin email: `admin@example.com`

## Mock Data

The application includes comprehensive mock data for development:
- 12 perfumes across 6 brands
- 4 mock members (1 admin, 3 regular members)
- 8 sample reviews
- AI summaries and recommendations

Mock data is used as fallback when the backend API is unavailable.

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Google authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
3. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the config values to your `.env` file

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The build output in `dist/` folder can be deployed to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## API Integration

The app expects the following backend endpoints:

### Authentication
- `POST /register` - Register new member
- `POST /login` - Login with credentials
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

### Perfumes
- `GET /perfumes` - List all perfumes (supports filtering)
- `GET /perfumes/:id` - Get perfume details
- `POST /perfumes` - Create perfume (admin)
- `PUT /perfumes/:id` - Update perfume (admin)
- `DELETE /perfumes/:id` - Delete perfume (admin)

### Brands
- `GET /brands` - List all brands
- `POST /brands` - Create brand (admin)
- `PUT /brands/:id` - Update brand (admin)
- `DELETE /brands/:id` - Delete brand (admin)

### Comments
- `GET /perfumes/:id/comments` - Get comments for perfume
- `POST /perfumes/:id/comments` - Add comment (member)

### AI Features
- `GET /ai/similar/:perfumeId` - Get similar perfumes
- `GET /ai/summary/:perfumeId` - Get review summary
- `POST /ai/chat` - Chat with AI assistant

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
