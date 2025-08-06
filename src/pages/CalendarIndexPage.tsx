import * as React from 'react';
import { useLoaderData } from 'react-router-dom';
import CalendarLayout from '../components/CalendarLayout';
import { Activity } from '../types';

interface DeferredLoaderData {
  activities: Promise<Activity[]>;
  selectedActivity: Promise<Activity | null>;
}

function CalendarIndexPage() {
  const loaderData = useLoaderData() as DeferredLoaderData;

  return (
    <CalendarLayout 
      activities={loaderData.activities}
    />
  );
}

export default CalendarIndexPage;
