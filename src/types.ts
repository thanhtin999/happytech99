/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  grade: string;
  semester: 'I' | 'II';
  objective: string;
  duration: string; // e.g., "45 phút", "2 tiết"
  week: number;
  status: 'Chưa dạy' | 'Đang dạy' | 'Đã hoàn thành';
}

export interface Material {
  id: string;
  title: string;
  type: 'Video bài giảng' | 'Audio bài học' | 'Sách & PDF' | 'Bài giảng Slide' | 'Sơ đồ tư duy' | 'Phiếu học tập' | 'Prompt AI' | 'Game học tập';
  size: string; // e.g., "12MB", "PDF - 4MB"
  description: string;
  grade: string;
  subject: string;
  createdAt: string; // e.g., "2026-06-15"
}

export interface ReadingText {
  id: string;
  title: string;
  genre: 'Tản văn' | 'Truyện ngắn' | 'Tùy bút' | 'Thơ' | 'Văn bản thông tin' | 'Bài đọc kỹ năng sống';
  topic: string;
  shortDesc: string;
  content: string;
  comprehensionQuestion: string; // Câu hỏi đọc hiểu
  reflectionQuestion: string; // Câu hỏi cảm nhận
  favorite?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // [A, B, C, D]
  correctOptionIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  grade: string;
  duration: string; // e.g., "15 phút"
  questionsCount: number;
  type: 'Trắc nghiệm' | 'Tự luận ngắn';
  questions: QuizQuestion[];
  shortAnswerPrompt?: string; // For short answer type
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Chưa nộp' | 'Đã nộp' | 'Đã chấm';
  coefficient: number; // Điểm hệ số e.g., 1, 2
  target: 'Cả lớp' | 'Cá nhân' | 'Nhóm';
  submittedCount: number;
  averageGrade?: number;
  studentSubmission?: string; // content submitted by demo student
  teacherFeedback?: string;
  gradeValue?: number;
}

export interface Exam {
  id: string;
  title: string;
  grade: string;
  duration: string; // e.g., "90 phút"
  totalScore: number; // e.g., 10
  structure: string; // e.g., "70% Trắc nghiệm, 30% Tự luận"
  createdAt: string;
  part1Mcqs: { question: string; options: string[]; answer: string }[];
  part2Essay: string;
  answerGuide: string;
  matrix: string; // Ma trận đề
}

export interface Student {
  id: string; // e.g., "HS001"
  name: string;
  grade: string; // e.g., "Lớp 6"
  progress: number; // 0-100
  gpa: number; // 0-10
  badges: string[]; // array of badge names e.g., "Chăm chỉ", "Sáng tạo"
  avatar: string;
}

export interface QuestionBankItem {
  id: string;
  subject: string;
  grade: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  topic: string;
  question: string;
  suggestedAnswer: string;
}

export interface CreativeProduct {
  id: string;
  title: string;
  type: 'Podcast' | 'Video' | 'Poster' | 'Game' | 'Web app' | 'Slide';
  author: string;
  description: string;
  likes: number;
  thumbnail: string;
}

export interface Account {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  status: string;
  avatar: string;
  username?: string;
  password?: string;
  fullName?: string;
  className?: string;
  permissions?: any;
  createdAt?: string;
  createdBy?: string;
}
