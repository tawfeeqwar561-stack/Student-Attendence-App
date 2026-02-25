export interface User {
  id: number;
  username: string;
  role: 'teacher' | 'student';
}

export interface Student {
  id: number;
  name: string;
  roll_number: string;
  class_name: string;
}

export interface AttendanceRecord {
  student_id: number;
  name: string;
  roll_number: string;
  status: 'present' | 'absent' | null;
  date: string;
}

export interface StudentStats {
  id: number;
  name: string;
  roll_number: string;
  present_count: number;
  total_days: number;
}
