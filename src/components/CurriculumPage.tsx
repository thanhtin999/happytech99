/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, HelpCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson } from '../types';

interface CurriculumPageProps {
  lessons: Lesson[];
  onAdd: () => void;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
  role: 'TEACHER' | 'STUDENT';
  selectedGradeFilter: string; // From sidebar
}

export default function CurriculumPage({
  lessons,
  onAdd,
  onEdit,
  onDelete,
  role,
  selectedGradeFilter
}: CurriculumPageProps) {
  const [activeSemester, setActiveSemester] = useState<'I' | 'II'>('I');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Filter lessons by active semester AND sidebar grade filter
  const filteredLessons = lessons.filter(lesson => {
    const semesterMatch = lesson.semester === activeSemester;
    const gradeMatch = selectedGradeFilter === 'Tất cả' || lesson.grade === selectedGradeFilter;
    return semesterMatch && gradeMatch;
  });

  return (
    <div id="curriculum-page" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Chương Trình Học</h2>
          <p className="text-xs text-gray-500">Quản lý lộ trình bài học theo năm học, học kỳ, khối lớp và môn học.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Thêm Bài Học Mới
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex justify-between items-center bg-cream-dark/20 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveSemester('I')}
          className={`flex-1 text-center py-2 text-sm font-semibold rounded-xl transition-all ${
            activeSemester === 'I' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Học kỳ I
        </button>
        <button
          onClick={() => setActiveSemester('II')}
          className={`flex-1 text-center py-2 text-sm font-semibold rounded-xl transition-all ${
            activeSemester === 'II' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Học kỳ II
        </button>
      </div>

      {/* Active filters summary */}
      {selectedGradeFilter !== 'Tất cả' && (
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <span>Đang lọc theo:</span>
          <span className="font-semibold bg-primary-soft text-primary px-2.5 py-0.5 rounded-full">{selectedGradeFilter}</span>
          <span>• Học kỳ {activeSemester}</span>
        </div>
      )}

      {/* Lessons List Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-xl-3 border border-cream-dark/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Upper tags */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-cream text-primary-dark rounded-full">
                    Tuần {lesson.week}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    lesson.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' :
                    lesson.status === 'Đang dạy' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {lesson.status}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-gray-800 text-base line-clamp-2">{lesson.title}</h3>
                  <div className="flex gap-2 text-[11px] text-gray-400 mt-1">
                    <span>{lesson.grade}</span>
                    <span>•</span>
                    <span>{lesson.subject}</span>
                  </div>
                </div>

                {/* Objective */}
                <div className="bg-cream-light/60 p-3 rounded-xl border border-cream-dark/15">
                  <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Mục tiêu bài học:
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {lesson.objective}
                  </p>
                </div>
              </div>

              {/* Bottom bar & actions */}
              <div className="border-t border-cream-dark/20 pt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Thời lượng: {lesson.duration}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLesson(lesson)}
                    className="p-2 text-primary bg-primary-soft hover:bg-primary hover:text-white rounded-lg transition-all"
                    title="Mở bài học"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {role === 'TEACHER' && (
                    <>
                      <button
                        onClick={() => onEdit(lesson)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lesson.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white text-center p-12 rounded-xl-3 border border-cream-dark/20 max-w-xl mx-auto space-y-4">
          <div className="p-4 bg-cream text-primary-dark rounded-full inline-block">
            <HelpCircle className="w-8 h-8" />
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Chưa cập nhật bài học cho kỳ này. Vui lòng thêm bài học mới hoặc chọn học kỳ khác.
          </p>
          {role === 'TEACHER' && (
            <button
              onClick={onAdd}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
            >
              Thêm bài học đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Lesson Details Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl-4 max-w-lg w-full overflow-hidden shadow-2xl border border-cream-dark/30"
            >
              {/* Modal header */}
              <div className="bg-primary text-white p-6 relative">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-white/20 rounded-full">
                  Chi tiết Giáo án điện tử
                </span>
                <h3 className="text-xl font-bold font-display mt-2">{selectedLesson.title}</h3>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white text-xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-cream-light p-3 rounded-xl border border-cream-dark/20">
                    <span className="text-gray-400 block font-medium">Khối Lớp:</span>
                    <span className="text-gray-800 font-semibold text-sm mt-0.5 block">{selectedLesson.grade}</span>
                  </div>
                  <div className="bg-cream-light p-3 rounded-xl border border-cream-dark/20">
                    <span className="text-gray-400 block font-medium">Môn Học:</span>
                    <span className="text-gray-800 font-semibold text-sm mt-0.5 block">{selectedLesson.subject}</span>
                  </div>
                  <div className="bg-cream-light p-3 rounded-xl border border-cream-dark/20">
                    <span className="text-gray-400 block font-medium">Học Kỳ:</span>
                    <span className="text-gray-800 font-semibold text-sm mt-0.5 block">Học kỳ {selectedLesson.semester}</span>
                  </div>
                  <div className="bg-cream-light p-3 rounded-xl border border-cream-dark/20">
                    <span className="text-gray-400 block font-medium">Thời Lượng:</span>
                    <span className="text-gray-800 font-semibold text-sm mt-0.5 block">{selectedLesson.duration}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400">Tuần Học</span>
                  <p className="text-sm font-semibold text-gray-800">Tuần thứ {selectedLesson.week}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400">Trạng Thái Thực Hiện</span>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                    selectedLesson.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' :
                    selectedLesson.status === 'Đang dạy' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedLesson.status}
                  </span>
                </div>

                <div className="space-y-2 border-t border-cream-dark/20 pt-4">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-primary" /> Mục tiêu & Yêu cầu cần đạt của bài học:
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed bg-cream-light/40 p-3 rounded-xl border border-cream-dark/10">
                    {selectedLesson.objective}
                  </p>
                </div>
              </div>

              {/* Modal footer */}
              <div className="bg-cream-light p-4 flex justify-end border-t border-cream-dark/20">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
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
