export interface Activity {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'health';
}
