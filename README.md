# Robin-2

A modern full-stack Next.js application with TypeScript, Tailwind CSS, and API routes.

## Features

- ⚡ **Next.js 14** - App Router with Server Components
- 📘 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Utility-first CSS with mobile-responsive design
- 🔌 **API Routes** - Backend functionality built-in
- 📱 **Mobile Ready** - Fully responsive design
- 🌙 **Dark Mode** - Automatic theme switching

## Project Structure

```
Robin-2/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   │   ├── hello/
│   │   │   └── users/
│   │   ├── about/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   └── components/           # Reusable components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Navbar.tsx
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

The following API endpoints are available:

### Hello Endpoint
- `GET /api/hello` - Returns a simple hello message

### Users API
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get a specific user
- `PUT /api/users/[id]` - Update a user
- `DELETE /api/users/[id]` - Delete a user
- `DELETE /api/users` - Delete all users

## Components

Reusable components are available in `src/components/`:

- **Button** - Customizable button with variants
- **Card** - Container component for content
- **Input** - Form input with validation
- **Navbar** - Responsive navigation bar

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Mobile Responsiveness

All pages and components are built with a mobile-first approach using Tailwind CSS breakpoints:

- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

MIT
