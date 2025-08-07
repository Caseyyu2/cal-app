import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Activity } from '../types';
import { UpdateActivityDocument, ActivityCategory } from '../gql/graphql';
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

function ActivityDetailGraphQL({ activity, onClose }: ActivityDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: activity.title,
    description: activity.description,
    location: activity.location,
    startTime: formatDateTimeLocal(activity.startTime),
    endTime: formatDateTimeLocal(activity.endTime),
    category: activity.category
  });

  // Update form data when activity prop changes
  React.useEffect(() => {
    setFormData({
      title: activity.title,
      description: activity.description,
      location: activity.location,
      startTime: formatDateTimeLocal(activity.startTime),
      endTime: formatDateTimeLocal(activity.endTime),
      category: activity.category
    });
  }, [activity]);

  // Map category string to GraphQL enum
  const categoryMap: Record<string, ActivityCategory> = {
    'work': ActivityCategory.Work,
    'personal': ActivityCategory.Personal,
    'health': ActivityCategory.Health
  };

  const [updateActivity, { data, loading, error }] = useMutation(UpdateActivityDocument, {
    onCompleted: (data) => {
      console.log('Mutation completed with data:', data);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  // Log mutation data changes
  React.useEffect(() => {
    if (data) {
      console.log('Mutation data updated:', data);
    }
  }, [data]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      alert('Invalid date format');
      return;
    }
    
    if (endTime <= startTime) {
      alert('End time must be after start time');
      return;
    }

    await updateActivity({
      variables: {
        id: activity.id.toString(),
        input: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          location: formData.location.trim(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          category: categoryMap[formData.category]
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateActivity: {
          __typename: 'Activity',
          id: activity.id.toString(),
          title: formData.title.trim(),
          description: formData.description.trim(),
          location: formData.location.trim(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          category: categoryMap[formData.category]
        }
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <div className="activity-detail-overlay">
        <form onSubmit={handleSubmit} className={`activity-detail editing ${activity.category}`}>
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
              value={formData.title}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              className="action-button cancel"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Error: {error.message}
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="activity-detail-overlay">
      <div className={`activity-detail ${activity.category}`}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="activity-header">
          <span className={`category-badge ${activity.category}`}>{activity.category}</span>
          <h2>{activity.title}</h2>
        </div>
        
        <div className="activity-info">
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"/>
            </svg>
            <span>{formatDateTime(activity.startTime)}</span>
          </div>
          
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-8H7v2h6v5h2v-7h-4z"/>
            </svg>
            <span>{formatDateTime(activity.endTime)}</span>
          </div>
          
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"/>
            </svg>
            <span>Duration: {formatDuration(activity.startTime, activity.endTime)}</span>
          </div>
          
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 20.9l4.95-4.95a7 7 0 1 0-9.9 0L12 20.9zm0 2.828l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
            </svg>
            <span>{activity.location}</span>
          </div>
        </div>
        
        <div className="activity-description">
          <h3>Description</h3>
          <p>{activity.description}</p>
        </div>
        
        <div className="activity-actions">
          <button 
            className="action-button edit"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button className="action-button delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetailGraphQL;
