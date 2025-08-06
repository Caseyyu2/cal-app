import { useState } from 'react';
import { Activity } from '../types';
import './CalendarView.css';

interface CalendarViewProps {
  activities: Activity[];
  onSelectActivity: (id: number) => void;
}

function CalendarView({ activities, onSelectActivity }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Helper to format date to YYYY-MM-DD for comparison
  const formatDateForCompare = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Helper to check if a date has activities
  const getActivitiesForDate = (year: number, month: number, day: number): Activity[] => {
    const dateToCheck = new Date(year, month, day);
    const dateString = formatDateForCompare(dateToCheck);
    
    return activities.filter(activity => {
      const activityDate = formatDateForCompare(new Date(activity.startTime));
      return activityDate === dateString;
    });
  };
  
  // Previous month handler
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Next month handler
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Generate calendar days
  const calendarDays = [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateActivities = getActivitiesForDate(currentYear, currentMonth, day);
    const isToday = new Date().toDateString() === date.toDateString();
    
    calendarDays.push(
      <div 
        key={`day-${day}`} 
        className={`calendar-day ${isToday ? 'today' : ''} ${dateActivities.length > 0 ? 'has-events' : ''}`}
      >
        <div className="day-number">{day}</div>
        <div className="day-events">
          {dateActivities.map(activity => (
            <div 
              key={activity.id} 
              className={`event-marker ${activity.category}`}
              onClick={() => onSelectActivity(activity.id)}
              title={activity.title}
            >
              {activity.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="calendar-grid">
        {calendarDays}
      </div>
    </div>
  );
}

export default CalendarView;
