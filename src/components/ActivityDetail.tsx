import React, { useState } from 'react';
import { useFetcher } from 'react-router-dom';
import { Activity } from '../types';
import './ActivityDetail.css';

interface ActivityDetailProps {
  activity: Activity;
  onClose: () => void;
}

function formatDateTime(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString('en-US', options);
}

function formatDuration(startDateString: string, endDateString: string): string {
  const start = new Date(startDateString);
  const end = new Date(endDateString);
  
  const diffMs = end.getTime() - start.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs === 0) {
    return `${diffMins} minutes`;
  } else if (diffMins === 0) {
    return `${diffHrs} hour${diffHrs > 1 ? 's' : ''}`;
  } else {
    return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} and ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  }
}

// Helper to format datetime-local input value
function formatDateTimeLocal(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function ActivityDetail({ activity, onClose }: ActivityDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const fetcher = useFetcher();
  
  // Close edit mode immediately when form is submitted (optimistic)
  React.useEffect(() => {
    if (fetcher.state === 'submitting') {
      setIsEditing(false);
    }
  }, [fetcher.state]);
  
  // Handle errors by reopening edit mode
  React.useEffect(() => {
    if (fetcher.data?.error && fetcher.state === 'idle') {
      setIsEditing(true);
    }
  }, [fetcher.data, fetcher.state]);

  // Optimistic UI - use form data if available, otherwise use current activity data
  const optimisticActivity = React.useMemo(() => {
    if (fetcher.formData) {
      return {
        ...activity,
        title: fetcher.formData.get('title') as string || activity.title,
        description: fetcher.formData.get('description') as string || activity.description,
        location: fetcher.formData.get('location') as string || activity.location,
        category: fetcher.formData.get('category') as Activity['category'] || activity.category,
        // Note: startTime and endTime would need to be converted from datetime-local format
        // For now, we'll keep the original times during optimistic update
      };
    }
    return activity;
  }, [activity, fetcher.formData]);
  if (isEditing) {
    return (
      <div className="activity-detail-overlay">
        <fetcher.Form method="post" action={`/activity/${activity.id}`} className={`activity-detail editing ${activity.category}`}>
          <button type="button" className="close-button" onClick={onClose}>&times;</button>
          
          <div className="activity-header">
            <h2>Edit Activity</h2>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={activity.title}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={activity.description}
              rows={3}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={activity.location}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              defaultValue={formatDateTimeLocal(activity.startTime)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              defaultValue={formatDateTimeLocal(activity.endTime)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              defaultValue={activity.category}
              required
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
            </select>
          </div>
          
          <div className="activity-actions">
            <button 
              type="submit" 
              className="action-button save"
              disabled={fetcher.state === 'submitting'}
            >
              {fetcher.state === 'submitting' ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              className="action-button cancel"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </fetcher.Form>
      </div>
    );
  }

  // Use optimistic data for display
  // const displayActivity = fetcher.state !== 'idle' ? optimisticActivity : activity;
  const displayActivity = activity;

  return (
    <div className="activity-detail-overlay">
      <div className={`activity-detail ${displayActivity.category}`}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="activity-header">
          <span className={`category-badge ${displayActivity.category}`}>{displayActivity.category}</span>
          <h2>{displayActivity.title}</h2>
        </div>
        
        <div className="activity-info">
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"/>
            </svg>
            <span>{formatDateTime(displayActivity.startTime)}</span>
          </div>
          
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-8H7v2h6v5h2v-7h-4z"/>
            </svg>
            <span>{formatDateTime(displayActivity.endTime)}</span>
          </div>
          
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"/>
            </svg>
            <span>Duration: {formatDuration(displayActivity.startTime, displayActivity.endTime)}</span>
          </div>
          
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 20.9l4.95-4.95a7 7 0 1 0-9.9 0L12 20.9zm0 2.828l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
            </svg>
            <span>{displayActivity.location}</span>
          </div>
        </div>
        
        <div className="activity-description">
          <h3>Description</h3>
          <p>{displayActivity.description}</p>
        </div>
        
        <div className="activity-actions">
          <button 
            className="action-button edit"
            onClick={() => setIsEditing(true)}
            disabled={fetcher.state !== 'idle'}
          >
            Edit
          </button>
          <button className="action-button delete" disabled={fetcher.state !== 'idle'}>
            Delete
          </button>
        </div>
        
        {fetcher.data?.error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Error: {fetcher.data.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityDetail;
