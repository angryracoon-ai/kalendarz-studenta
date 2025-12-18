
export type TaskType = 'exam' | 'assignment' | 'project' | 'other';

export interface Subject {
  id: string;
  name: string;
  color: string;
  professorId?: string; // Changed from professor string to ID link
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  email: string;
  consultations: string;
  office: string;
  notes: string;
}

export interface AcademicTask {
  id: string;
  title: string;
  type: TaskType;
  dueDate: string;
  subjectId: string;
  description: string;
  isCompleted: boolean;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 0-6 (Mon-Sun)
  startTime: string; // HH:mm
  endTime: string;
  room: string;
}

export interface StudyTopic {
  id: string;
  subjectId: string;
  title: string;
  keywords: string[];
  notes: string;
}

export interface AppState {
  subjects: Subject[];
  tasks: AcademicTask[];
  sessions: ClassSession[];
  topics: StudyTopic[];
  professors: Professor[];
}
