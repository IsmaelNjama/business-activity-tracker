# Business Activity Tracker

A React-based web application for tracking business activities including expenses, sales, customer service, production, and storage management.

## Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Validation**: Zod
- **Form Handling**: React Hook Form
- **Routing**: React Router v6
- **Charts**: Recharts
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth/                  # Authentication components
│   ├── dashboard/             # Dashboard components
│   ├── activities/            # Activity logging components
│   └── shared/                # Shared/common components
├── pages/                     # Page components
├── layouts/                   # Layout components
├── contexts/                  # React contexts
├── hooks/                     # Custom React hooks
├── lib/
│   ├── validators.ts          # Zod schemas
│   ├── utils.ts               # Utility functions
│   └── constants.ts           # App constants
├── services/                  # Service layer
└── types/                     # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Features

- User registration and authentication
- Role-based access (Employee/Admin)
- Activity logging (Expenses, Sales, Customer Service, Production, Storage)
- Personal and organization-wide dashboards
- Image upload and management
- Real-time form validation
- Responsive design for all devices

## License

Private - All rights reserved
