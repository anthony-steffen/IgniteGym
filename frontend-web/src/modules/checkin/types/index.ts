export interface Checkin {
  id: string;
  student_id: string;
  created_at?: string;
  checked_in_at?: string;
  createdAt?: string;
  student?: {
    name: string;
    user?: {
      name: string;
    };
  };
}

export interface CreateCheckinData {
  studentId: string;
}
