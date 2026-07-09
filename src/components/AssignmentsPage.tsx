/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Users,
  Award,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assignment } from '../types';

interface AssignmentsPageProps {
  assignments: Assignment[];
  onAdd: () => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  role: 'TEACHER' | 'STUDENT';
}

export default function AssignmentsPage({
  assignments,
  onAdd,
  onEdit,
  onDelete,
  onUpdateAssignment,
  role
}: AssignmentsPageProps) {
  const [activeInteractiveAssign, setActiveInteractiveAssign] = useState<Assignment | null>(null);
  
  // Interactive student submit state
  const [submissionText, setSubmissionText] = useState('');
  
  // Interactive teacher grading state
  const [gradeInput, setGradeInput] = useState<number>(10);
  const [feedbackInput, setFeedbackInput] = useState('');

  const handleOpenInteraction = (assign: Assignment) => {
    setActiveInteractiveAssign(assign);
    setSubmissionText(assign.studentSubmission || '');
    setGradeInput(assign.gradeValue || 9);
    setFeedbackInput(assign.teacherFeedback || '');
  };

  const handleStudentSubmit = () => {
    if (!submissionText.trim()) {
      alert('Vui lòng nhập nội dung bài nộp trước khi gửi!');
      return;
    }

    if (!activeInteractiveAssign) return;

    const updated: Assignment = {
      ...activeInteractiveAssign,
      status: 'Đã nộp',
      studentSubmission: submissionText,
      submittedCount: activeInteractiveAssign.submittedCount + 1
    };

    onUpdateAssignment(updated);
    setActiveInteractiveAssign(null);
    alert('Nộp bài tập thành công! Trạng thái bài tập đã chuyển sang "Đã nộp". Giáo viên Dương Thành Tín sẽ chấm điểm sớm nhất.');
  };

  const handleTeacherGrade = () => {
    if (gradeInput < 0 || gradeInput > 10) {
      alert('Điểm số phải nằm trong khoảng từ 0 đến 10!');
      return;
    }

    if (!activeInteractiveAssign) return;

    const updated: Assignment = {
      ...activeInteractiveAssign,
      status: 'Đã chấm',
      gradeValue: gradeInput,
      teacherFeedback: feedbackInput || 'Đã duyệt đạt chuẩn chất lượng.',
      averageGrade: activeInteractiveAssign.averageGrade 
        ? Math.round(((activeInteractiveAssign.averageGrade * activeInteractiveAssign.submittedCount + gradeInput) / (activeInteractiveAssign.submittedCount + 1)) * 10) / 10 
        : gradeInput
    };

    onUpdateAssignment(updated);
    setActiveInteractiveAssign(null);
    alert('Chấm điểm bài nộp và gửi nhận xét thành công!');
  };

  return (
    <div id="assignments-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Giao Bài Tập & Nhiệm Vụ</h2>
          <p className="text-xs text-gray-500">Phân công nhiệm vụ học tập, bài viết, sản phẩm sáng tạo, video, audio hoặc dự án nhóm.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Giao Bài Mới
          </button>
        )}
      </div>

      {/* Grid List */}
      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assign) => (
            <motion.div
              key={assign.id}
              layout
              className="bg-white rounded-xl-3 border border-cream-dark/30 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header status tags */}
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold px-2.5 py-1 rounded-full ${
                    assign.status === 'Đã chấm' ? 'bg-green-100 text-green-700' :
                    assign.status === 'Đã nộp' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {assign.status}
                  </span>
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Hạn nộp: {assign.dueDate}
                  </span>
                </div>

                {/* Title and stats */}
                <div>
                  <h3 className="font-bold text-gray-800 text-base leading-snug">{assign.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 font-medium">
                    <span className="bg-cream px-2 py-0.5 rounded text-primary-dark">Hệ số {assign.coefficient}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{assign.target}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-3">{assign.description}</p>
                </div>

                {/* Statistics Box */}
                <div className="bg-cream-light/50 p-3.5 rounded-xl border border-cream-dark/20 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Đã nộp:</span>
                    <p className="font-bold text-gray-800 mt-0.5">{assign.submittedCount} học sinh</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Điểm trung bình:</span>
                    <p className="font-bold text-primary mt-0.5">
                      {assign.averageGrade ? `${assign.averageGrade.toFixed(1)}/10` : 'Chưa có'}
                    </p>
                  </div>
                </div>

                {/* Submissions feedback for Student if graded */}
                {role === 'STUDENT' && assign.status === 'Đã chấm' && (
                  <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-xs text-green-800">
                    <span className="font-bold">Nhận xét từ thầy Tín (Điểm: {assign.gradeValue}/10):</span>
                    <p className="italic mt-1">"{assign.teacherFeedback}"</p>
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="border-t border-cream-dark/20 pt-4 flex items-center justify-between">
                <button
                  onClick={() => handleOpenInteraction(assign)}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {role === 'TEACHER' ? 'Chấm & Xem bài' : 'Làm bài & Nộp bài'}
                </button>

                {role === 'TEACHER' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(assign)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(assign.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl-3 border border-cream-dark/20 max-w-lg mx-auto space-y-3">
          <p className="text-gray-500 text-sm font-medium">Chưa có bài tập nào được giao.</p>
        </div>
      )}

      {/* Assignment Interaction Modal */}
      <AnimatePresence>
        {activeInteractiveAssign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl-4 max-w-lg w-full overflow-hidden shadow-2xl border border-cream-dark/30 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-primary text-white p-5 shrink-0">
                <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase">
                  {activeInteractiveAssign.target} • Hạn nộp: {activeInteractiveAssign.dueDate}
                </span>
                <h3 className="text-base font-bold font-display mt-2">{activeInteractiveAssign.title}</h3>
                <button
                  onClick={() => setActiveInteractiveAssign(null)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Objective Description */}
                <div className="p-4 bg-cream-light rounded-xl border border-cream-dark/20 text-xs">
                  <span className="font-bold text-gray-700 block mb-1">Mô tả nhiệm vụ:</span>
                  <p className="text-gray-600 leading-relaxed">{activeInteractiveAssign.description}</p>
                </div>

                {role === 'STUDENT' ? (
                  /* STUDENT ACTION FORM */
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-gray-700 block">BÀI LÀM CỦA HỌC SINH</span>
                    
                    {activeInteractiveAssign.status === 'Chưa nộp' ? (
                      <div className="space-y-3">
                        <textarea
                          rows={6}
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Dán đường dẫn bài làm (ví dụ: Google Drive, Canva, Youtube) hoặc viết trực tiếp nội dung bài làm của em tại đây..."
                          className="w-full p-3.5 bg-white border border-cream-dark/40 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                          onClick={handleStudentSubmit}
                          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Check className="w-4 h-4" /> Gửi bài nộp
                        </button>
                      </div>
                    ) : (
                      <div className="bg-cream-light/50 p-4 rounded-xl border border-cream-dark/15 text-xs space-y-3">
                        <div>
                          <span className="text-gray-400">Nội dung đã nộp:</span>
                          <p className="text-gray-700 font-medium whitespace-pre-line mt-1">{activeInteractiveAssign.studentSubmission}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 italic">Trạng thái bài nộp: {activeInteractiveAssign.status}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* TEACHER GRADING FORM */
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-gray-700 block">CHẤM ĐIỂM HỌC SINH LỚP 6 (DEMO)</span>

                    {/* Demonstration submission */}
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                      <span className="font-semibold text-gray-500 block">Bài nộp của Học sinh Nguyễn Hoàng Minh:</span>
                      <p className="text-gray-700 mt-1 italic">"{activeInteractiveAssign.studentSubmission || 'Đường link Canva/CapCut chứa bài nộp video AI 24 giây giới thiệu bài học.'}"</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 block">Điểm số (Thang 10):</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={gradeInput}
                            onChange={(e) => setGradeInput(parseFloat(e.target.value) || 0)}
                            className="w-full p-2.5 bg-white border border-cream-dark/40 rounded-xl text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 block">Hệ số bài tập:</label>
                          <p className="p-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-500">Hệ số {activeInteractiveAssign.coefficient}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Lời phê / Nhận xét của giáo viên:</label>
                        <textarea
                          rows={3}
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          placeholder="Nhập lời phê bình và hướng dẫn hoàn thiện..."
                          className="w-full p-3 bg-white border border-cream-dark/40 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <button
                        onClick={handleTeacherGrade}
                        className="w-full bg-[#E07A5F] hover:bg-[#c9694e] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors mt-2"
                      >
                        <Award className="w-4 h-4" /> Hoàn thành chấm điểm
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-cream-light p-4 border-t border-cream-dark/25 flex justify-end shrink-0">
                <button
                  onClick={() => setActiveInteractiveAssign(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Đóng lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
