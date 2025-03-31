# Farewell Memories App

This application creates personalized farewell pages with photos, messages, and music for 32 individuals, each accessible via unique QR codes.

## Features

- Admin dashboard to manage all farewell pages
- Individual personalized pages with:
  - Person's name and title
  - Farewell message
  - Profile photo
  - Background music player
  - QR code generation for easy sharing
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Extract the zip file to your preferred location
2. Navigate to the project directory in your terminal

```bash
cd path/to/farewell-app
```

3. Install dependencies

```bash
npm install
```

## Configuration

No special configuration is needed. The app uses in-memory storage by default for development and demonstration purposes.

## Running the App

Start the development server:

```bash
npm run dev
```

This will start the application in development mode. Open your browser and navigate to:

```
http://localhost:5000
```

## Usage Guide

### Admin Dashboard

The home page (`/`) shows the admin dashboard with all farewell pages:

- **Add Person**: Add a new person with their details, photo URL, and music
- **Edit**: Modify existing person details
- **Delete**: Remove a person from the system
- **View**: See the personalized farewell page
- **QR Code**: Generate and download QR codes for sharing

### Person Page

Individual farewell pages are accessible at `/person/:id` where `:id` is the person's unique identifier. These pages show:

- Person's name and title
- Profile photo
- Farewell message
- Music player with selected song
- Share button

## File Structure Overview

```
├── client/               # Frontend code
│   ├── src/              
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
├── server/               # Backend code
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # In-memory data storage
├── shared/               # Shared code
│   └── schema.ts         # Data schemas
└── package.json          # Dependencies and scripts
```

## Development Notes

- The app uses React with Typescript for the frontend
- Backend uses Express.js with in-memory storage
- The UI is built with Tailwind CSS and shadcn components
- React Query is used for data fetching and state management

## Local Deployment Tips

- For a real-world scenario, you would replace the in-memory storage with a proper database
- Media files (images, audio) should be hosted on a proper storage service
- You may need to adjust the server port (currently 5000) if there are conflicts

## QR Code Testing

When you generate QR codes, they will point to URLs on your local development server. To test QR codes with mobile devices:

1. Make sure your computer and mobile device are on the same network
2. Replace `localhost` with your computer's local IP address in the QR code URL
3. Start the server with `npm run dev`
4. Scan the QR code with a mobile device

## Troubleshooting

- If you encounter CORS issues, make sure you're accessing the app through the correct port
- If images don't load, check that the image URLs are accessible
- If audio doesn't play, ensure the audio files are in a compatible format (MP3 recommended)