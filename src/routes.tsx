import { Navigate } from 'react-router'
import App from './App'
import { calendarClientLoader } from './pages/CalendarPage'
import CalendarIndexPage from './pages/CalendarIndexPage'
import { activityClientLoader } from "./pages/ActivityDetailPage"
import ActivityDetailPage from './pages/ActivityDetailPage'
import { updateActivityAction } from './action/appointment-action'


export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <CalendarIndexPage />,
        loader: calendarClientLoader
      },
      {
        path: 'activity/:id',
        element: <ActivityDetailPage />,
        loader: activityClientLoader,
        action: updateActivityAction
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]
