import { Activity } from '../types';

// Helper function to generate dates for demo data
const generateDate = (year: number, month: number, day: number, hour = 0, minute = 0): string => {
  return new Date(year, month - 1, day, hour, minute).toISOString();
};

// Generate current date info for demo data
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

// Mock activities data
export const activities: Activity[] = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync to discuss project progress and blockers.",
    location: "Conference Room A",
    startTime: generateDate(currentYear, currentMonth, 10, 10, 0),
    endTime: generateDate(currentYear, currentMonth, 10, 11, 30),
    category: "work"
  },
  {
    id: 2,
    title: "Lunch with Sarah",
    description: "Catch up over lunch to discuss collaboration opportunities.",
    location: "Cafe Bistro",
    startTime: generateDate(currentYear, currentMonth, 12, 12, 0),
    endTime: generateDate(currentYear, currentMonth, 12, 13, 0),
    category: "personal"
  },
  {
    id: 3,
    title: "Product Demo",
    description: "Present the new features to the client.",
    location: "Online - Zoom",
    startTime: generateDate(currentYear, currentMonth, 14, 15, 0),
    endTime: generateDate(currentYear, currentMonth, 14, 16, 0),
    category: "work"
  },
  {
    id: 4,
    title: "Gym Session",
    description: "Weekly fitness training with personal trainer.",
    location: "Fitness Center",
    startTime: generateDate(currentYear, currentMonth, 15, 7, 0),
    endTime: generateDate(currentYear, currentMonth, 15, 8, 30),
    category: "health"
  },
  {
    id: 5,
    title: "Doctor Appointment",
    description: "Annual check-up with Dr. Johnson.",
    location: "City Health Clinic",
    startTime: generateDate(currentYear, currentMonth, 17, 9, 0),
    endTime: generateDate(currentYear, currentMonth, 17, 10, 0),
    category: "health"
  },
  {
    id: 6,
    title: "Project Deadline",
    description: "Submit final project deliverables for client review.",
    location: "Office",
    startTime: generateDate(currentYear, currentMonth, 20, 17, 0),
    endTime: generateDate(currentYear, currentMonth, 20, 17, 0),
    category: "work"
  },
  {
    id: 7,
    title: "Birthday Party",
    description: "Mike's surprise birthday celebration.",
    location: "Rooftop Bar",
    startTime: generateDate(currentYear, currentMonth, 25, 19, 0),
    endTime: generateDate(currentYear, currentMonth, 25, 22, 0),
    category: "personal"
  }
];
