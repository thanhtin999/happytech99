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
  Download,
  Eye,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Exam } from '../types';

interface ExamsPageProps {
  exams: Exam[];
  onAdd: () => void;
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => void;
  role: 'TEACHER' | 'STUDENT';
  selectedGradeFilter: string; // From sidebar
}

export default function ExamsPage({
  exams,
  onAdd,
  onEdit,
  onDelete,
  role,
  selectedGradeFilter
}: ExamsPageProps) {
  const [activeExamDetails, setActiveExamDetails] = useState<Exam | null>(null);

  // Filter exams based on sidebar grade filter
  const filteredExams = exams.filter(exam => {
    return selectedGradeFilter === 'Tất cả' || exam.grade === selectedGradeFilter;
  });

  const handleExportPDF = (exam: Exam) => {
    const fileContent = `
=========================================
HỆ THỐNG GIÁO ÁN ĐIỆN TỬ & LMS THÀNH TÍN
         ĐỀ THI / KIỂM TRA ĐỊNH KỲ
=========================================

Tên đề thi: ${exam.title}
Khối lớp: ${exam.grade}
Thời gian làm bài: ${exam.duration}
Thang điểm tổng: ${exam.totalScore}
Cấu trúc: ${exam.structure}

-----------------------------------------
I. PHẦN TRẮC NGHIỆM:
${exam.part1Mcqs.map((q, idx) => `
Câu ${idx + 1}: ${q.question}
A. ${q.options[0]}
B. ${q.options[1]}
C. ${q.options[2]}
D. ${q.options[3]}
`).join('\n')}

-----------------------------------------
II. PHẦN TỰ LUẬN:
${exam.part2Essay}

-----------------------------------------
MA TRẬN ĐỀ:
${exam.matrix}

-----------------------------------------
HƯỚNG DẪN CHẤM & ĐÁP ÁN:
${exam.answerGuide}

=========================================
© 2026 Toàn bộ nội dung thuộc hệ thống Thành Tín AI.
    `;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.title.replace(/\s+/g, '_')}_De_Ki_Thi.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('Xuất bản đề thi thành công! Đã tải file text định dạng đề kiểm tra về máy của bạn.');
  };

  return (
    <div id="exams-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Đề Thi & Đề Kiểm Tra Định Kỳ</h2>
          <p className="text-xs text-gray-500">Quản lý và biên soạn đề kiểm tra giữa kỳ, cuối kỳ, khảo sát chất lượng bám sát ma trận năng lực.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Soạn Đề Kiểm Tra
          </button>
        )}
      </div>

      {/* Grade status indicator */}
      {selectedGradeFilter !== 'Tất cả' && (
        <div className="text-xs text-gray-500">
          Đang xem đề kiểm tra định kỳ cho: <span className="font-semibold text-primary">{selectedGradeFilter}</span>
        </div>
      )}

      {/* Grid of Exams */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <motion.div
              key={exam.id}
              layout
              className="bg-white rounded-xl-3 border border-cream-dark/30 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold bg-primary-soft text-primary px-2.5 py-0.5 rounded-full">
                    {exam.grade}
                  </span>
                  <span className="text-gray-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {exam.duration}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-sm mt-2 line-clamp-2" title={exam.title}>{exam.title}</h3>
                  <p className="text-[11px] font-semibold text-primary-light block mt-1">Tổng thang điểm: {exam.totalScore} điểm</p>
                  <p className="text-xs text-gray-500 mt-2">Cấu trúc: {exam.structure}</p>
                </div>
              </div>

              {/* Bottom bar with action buttons */}
              <div className="border-t border-cream-dark/20 pt-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveExamDetails(exam)}
                    className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Mở đề thi
                  </button>
                  <button
                    onClick={() => handleExportPDF(exam)}
                    className="p-1.5 text-primary hover:bg-primary-soft rounded-lg transition-colors border border-primary/20"
                    title="Tải xuống đề thi"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                {role === 'TEACHER' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(exam)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(exam.id)}
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
          <p className="text-gray-500 text-sm font-medium">Chưa có đề kiểm tra định kỳ cho khối lớp này.</p>
          {role === 'TEACHER' && (
            <button
              onClick={onAdd}
              className="text-xs text-primary font-bold underline"
            >
              Soạn đề mới ngay
            </button>
          )}
        </div>
      )}

      {/* Exam Detail Viewer Modal */}
      <AnimatePresence>
        {activeExamDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl-4 max-w-2xl w-full overflow-hidden shadow-2xl border border-cream-dark/30 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-primary text-white p-5 shrink-0 relative">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  {activeExamDetails.grade} • Thang điểm {activeExamDetails.totalScore}
                </span>
                <h3 className="text-base font-bold font-display mt-2">{activeExamDetails.title}</h3>
                <button
                  onClick={() => setActiveExamDetails(null)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Structure info block */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-cream-light p-4 rounded-xl border border-cream-dark/20">
                  <div>
                    <span className="text-gray-400 block font-medium">Thời gian:</span>
                    <span className="text-gray-800 font-bold block mt-0.5">{activeExamDetails.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Cấu trúc bài thi:</span>
                    <span className="text-gray-800 font-bold block mt-0.5">{activeExamDetails.structure}</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-gray-400 block font-medium">Ngày phát hành:</span>
                    <span className="text-gray-800 font-bold block mt-0.5">{activeExamDetails.createdAt}</span>
                  </div>
                </div>

                {/* Section I: Multiple Choice Questions */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" /> Phần I: Trắc nghiệm (70%)
                  </span>
                  <div className="space-y-3">
                    {activeExamDetails.part1Mcqs.map((q, idx) => (
                      <div key={idx} className="p-3.5 bg-cream-light/30 rounded-xl border border-cream-dark/15 space-y-2">
                        <p className="text-xs font-bold text-gray-800">Câu {idx + 1}: {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-3">
                          {q.options.map((opt, oIdx) => (
                            <p key={oIdx} className="text-xs text-gray-600">
                              <span className="font-semibold text-gray-400 mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section II: Essay Questions */}
                <div className="space-y-3 border-t border-cream-dark/20 pt-4">
                  <span className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                    <FileText className="w-4 h-4" /> Phần II: Tự luận (30%)
                  </span>
                  <div className="p-4 bg-cream-light/40 border border-cream-dark/20 rounded-xl">
                    <p className="text-xs text-gray-800 leading-relaxed font-serif whitespace-pre-line">{activeExamDetails.part2Essay}</p>
                  </div>
                </div>

                {/* Answer Keys and Matrix */}
                <div className="space-y-3 border-t border-cream-dark/20 pt-4">
                  <span className="text-xs font-bold text-[#E07A5F] flex items-center gap-1 uppercase tracking-wider">
                    <Grid className="w-4 h-4" /> Ma trận đề & Đáp án hướng dẫn chấm
                  </span>
                  <div className="bg-[#E07A5F]/5 p-4 rounded-xl border border-[#E07A5F]/20 text-xs space-y-3 text-gray-700">
                    <div>
                      <span className="font-semibold text-[#E07A5F]">Ma trận phân hóa:</span>
                      <p className="mt-0.5">{activeExamDetails.matrix}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[#E07A5F]">Đáp án chính thức:</span>
                      <p className="mt-1 whitespace-pre-line leading-relaxed italic">{activeExamDetails.answerGuide}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-cream-light p-4 border-t border-cream-dark/25 flex justify-between items-center shrink-0">
                <button
                  onClick={() => handleExportPDF(activeExamDetails)}
                  className="bg-[#E07A5F] hover:bg-[#c9694e] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Đề Thi Giả Lập (.TXT)
                </button>
                <button
                  onClick={() => setActiveExamDetails(null)}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
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
