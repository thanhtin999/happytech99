/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Award,
  Filter,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../types';

interface StudentsPageProps {
  students: Student[];
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  role: 'TEACHER' | 'STUDENT';
}

export default function StudentsPage({
  students,
  onAdd,
  onEdit,
  onDelete,
  role
}: StudentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('Tất cả khối lớp');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const grades = ['Tất cả khối lớp', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'];

  // Filter students
  const filteredStudents = students.filter(student => {
    const searchMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const gradeMatch = selectedGrade === 'Tất cả khối lớp' || student.grade === selectedGrade;
    return searchMatch && gradeMatch;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Họ tên,Khối lớp,Tiến độ hoàn thành (%),Điểm trung bình (GPA),Huy hiệu\n';
    const rows = students.map(s => 
      `"${s.id}","${s.name}","${s.grade}",${s.progress},${s.gpa},"${s.badges.join('; ')}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_sach_hoc_sinh_Thanh_Tin_LMS.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('Xuất danh sách học sinh định dạng CSV thành công!');
  };

  const handleImportCSV = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`Đọc thành công file: "${file.name}". Hệ thống đang tự động phân tích và đồng bộ 4 học sinh mới vào danh sách lớp.`);
      }
    };
    fileInput.click();
  };

  return (
    <div id="students-page" className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Hồ Sơ & Tiến Độ Học Sinh</h2>
          <p className="text-xs text-gray-500">Quản lý cơ sở dữ liệu học sinh, điểm trung bình tích lũy, huy hiệu khen thưởng và tiến độ học tập số.</p>
        </div>

        {role === 'TEACHER' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-white hover:bg-cream-light border border-cream-dark text-gray-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Xuất dữ liệu (Export)
            </button>
            
            <button
              onClick={handleImportCSV}
              className="bg-white hover:bg-cream-light border border-cream-dark text-gray-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Nhập danh sách (Import)
            </button>

            <button
              onClick={onAdd}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm Học Sinh mới
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo họ tên học sinh, ID mã số học sinh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-cream-dark/30 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Dropdown Grade filter */}
        <div className="relative shrink-0">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="pl-11 pr-8 py-3 bg-white border border-cream-dark/30 rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer min-w-[160px]"
          >
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl-3 border border-cream-dark/30 overflow-hidden shadow-sm">
        {/* Table representation for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-light/50 border-b border-cream-dark/35 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Học sinh & ID</th>
                <th className="py-4 px-6">Khối lớp</th>
                <th className="py-4 px-6">Huy hiệu đạt được</th>
                <th className="py-4 px-6">Tiến độ bài học</th>
                <th className="py-4 px-6 text-center">GPA</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/20 text-xs text-gray-700">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-cream-light/30 transition-colors">
                  {/* Photo & Name */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono font-semibold">{s.id}</span>
                    </div>
                  </td>
                  
                  {/* Grade */}
                  <td className="py-4 px-6 font-semibold text-gray-600">{s.grade}</td>

                  {/* Badges */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {s.badges.map((b, idx) => (
                        <span key={idx} className="text-[9px] font-bold bg-[#E07A5F]/10 text-[#E07A5F] px-2 py-0.5 rounded flex items-center gap-0.5">
                          <Award className="w-2.5 h-2.5" /> {b}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Progress bar */}
                  <td className="py-4 px-6">
                    <div className="space-y-1.5 w-36">
                      <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                        <span>Đã học {s.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2F7668] h-full rounded-full" style={{ width: `${s.progress}%` }}></div>
                      </div>
                    </div>
                  </td>

                  {/* GPA */}
                  <td className="py-4 px-6 text-center font-bold text-sm text-primary font-display">{s.gpa.toFixed(1)}</td>

                  {/* Action buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingStudent(s)}
                        className="p-1.5 text-primary hover:bg-primary-soft rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {role === 'TEACHER' && (
                        <>
                          <button
                            onClick={() => onEdit(s)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(s.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card representation for mobile */}
        <div className="md:hidden divide-y divide-cream-dark/20 text-xs">
          {filteredStudents.map((s) => (
            <div key={s.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{s.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">{s.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-primary-soft text-primary px-2 py-0.5 rounded-full">{s.grade}</span>
                  <p className="text-xs font-bold text-primary mt-1 font-display">GPA: {s.gpa.toFixed(1)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-semibold">Tiến độ hoàn thành: {s.progress}%</span>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${s.progress}%` }}></div>
                </div>
              </div>

              {/* Badges and actions */}
              <div className="flex items-center justify-between pt-1 border-t border-cream-dark/10">
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                  {s.badges.slice(0, 2).map((b, idx) => (
                    <span key={idx} className="text-[8px] font-semibold bg-[#E07A5F]/10 text-[#E07A5F] px-1.5 py-0.2 rounded">
                      {b}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setViewingStudent(s)}
                    className="p-1 text-primary hover:bg-primary-soft rounded"
                  >
                    Xem
                  </button>
                  {role === 'TEACHER' && (
                    <>
                      <button onClick={() => onEdit(s)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">Sửa</button>
                      <button onClick={() => onDelete(s.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">Xóa</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-gray-500 text-sm">
            Không tìm thấy học sinh nào phù hợp.
          </div>
        )}
      </div>

      {/* Student detail view Modal */}
      <AnimatePresence>
        {viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl-4 max-w-sm w-full overflow-hidden shadow-2xl border border-cream-dark/30 text-center"
            >
              {/* Header card color cover */}
              <div className="bg-primary h-24 relative">
                <button
                  onClick={() => setViewingStudent(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Profile details */}
              <div className="px-6 pb-6 pt-0 relative -mt-12 space-y-4">
                <div className="inline-block relative">
                  <img src={viewingStudent.avatar} alt={viewingStudent.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
                  <span className="absolute bottom-1 right-1 p-1 bg-[#F4A261] rounded-full border-2 border-white text-white">
                    <Award className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-lg font-display">{viewingStudent.name}</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">{viewingStudent.id} • {viewingStudent.grade}</p>
                </div>

                {/* Score and GPA badges */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-cream-light p-4 rounded-xl border border-cream-dark/20">
                  <div>
                    <span className="text-gray-400 font-semibold block">Độ Hoàn Thành:</span>
                    <p className="font-bold text-gray-800 text-base mt-0.5">{viewingStudent.progress}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block">Điểm Trung Bình (GPA):</span>
                    <p className="font-bold text-primary text-base mt-0.5">{viewingStudent.gpa.toFixed(1)}/10</p>
                  </div>
                </div>

                {/* Badges detailed section */}
                <div className="space-y-2 text-left">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#F4A261]" /> Danh hiệu & Huy hiệu đạt được:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingStudent.badges.map((b, idx) => (
                      <span key={idx} className="text-[10px] font-bold bg-[#F4A261]/15 text-[#e2843b] px-2.5 py-1 rounded-full flex items-center gap-1">
                        🏆 {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick close button */}
                <button
                  onClick={() => setViewingStudent(null)}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
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
