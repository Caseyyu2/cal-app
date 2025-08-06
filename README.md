# Calendar SPA

A simple calendar Single Page Application (SPA) built with React and React Router.

## Features

- Left side panel with a list of activities
- Right side calendar view showing activities on specific dates
- Activity detail panel that appears when clicking on an activity
- Responsive design that works on mobile, tablet, and desktop devices
- URL-based routing for direct access to activity details

## Project Structure

```
cal-app/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── activitiesApi.js       # Mock API services
│   │   └── mockData.js            # Mock activity data
│   ├── components/
│   │   ├── ActivityList.jsx       # List of activities component
│   │   ├── ActivityList.css
│   │   ├── ActivityDetail.jsx     # Activity detail panel component
│   │   ├── ActivityDetail.css
│   │   ├── CalendarView.jsx       # Calendar view component
│   │   └── CalendarView.css
│   ├── context/
│   │   └── ActivityContext.jsx    # Activity state management
│   ├── pages/
│   │   ├── CalendarPage.jsx       # Main calendar page
│   │   └── CalendarPage.css
│   ├── styles/
│   │   └── responsive.css         # Responsive design styles
│   ├── App.jsx                    # App component with routes
│   ├── App.css
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the development server:

```
npm run dev
```

This will launch the application at http://localhost:5173/

## Building for Production

To build the application for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Preview Production Build

To preview the production build:

```
npm run preview
```