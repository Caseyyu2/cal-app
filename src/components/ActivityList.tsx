import { Activity } from '../types';
import './ActivityList.css';

interface ActivityListProps {
  activities: Activity[];
  onSelectActivity: (id: number) => void;
  selectedActivityId?: number;
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit' 
  };
  return new Date(dateString).toLocaleString('en-US', options);
}

function ActivityList({ activities, onSelectActivity, selectedActivityId }: ActivityListProps) {
  if (!activities || activities.length === 0) {
    return <div className="empty-list">No activities found</div>;
  }

  // Sort activities by start time
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="activity-list">
      {sortedActivities.map(activity => (
        <div 
          key={activity.id}
          className={`activity-item ${selectedActivityId === activity.id ? 'selected' : ''} ${activity.category}`}
          onClick={() => onSelectActivity(activity.id)}
        >
          <div className="activity-time">{formatDate(activity.startTime)}</div>
          <h3 className="activity-title">{activity.title}</h3>
          <div className="activity-location">{activity.location}</div>
        </div>
      ))}
    </div>
  );
}

export default ActivityList;
