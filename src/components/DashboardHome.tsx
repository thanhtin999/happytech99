/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Clock,
  CheckCircle,
  FileText,
  Activity,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';
import { Lesson, Assignment, Student } from '../types';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
  lessons: Lesson[];
  assignments: Assignment[];
  students: Student[];
  role: 'TEACHER' | 'STUDENT';
}

export default function DashboardHome({
  onNavigate,
  lessons,
  assignments,
  students,
  role
}: DashboardHomeProps) {
  // Recent 2 lessons
  const recentLessons = lessons.slice(0, 2);
  
  // Pending 2 assignments
  const pendingAssignments = assignments.filter(a => a.status !== 'Đã chấm').slice(0, 2);

  // Top students (highest GPA)
  const topStudents = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 3);

  // Hardcoded recent activities
  const activities = [
    { id: 1, text: 'Học sinh Trần Mai Anh vừa nộp bài tập "Thiết kế game học tập"', time: '10 phút trước', type: 'submission' },
    { id: 2, text: 'Giáo viên Dương Thành Tín đã thêm học liệu mới "Quy trình tạo video AI"', time: '2 giờ trước', type: 'material' },
    { id: 3, text: 'Học sinh Nguyễn Hoàng Minh đã hoàn thành Đề Quiz tự học đạt 10/10 điểm', time: '5 giờ trước', type: 'quiz' },
  ];

  return (
    <div id="dashboard-home" className="space-y-8">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[#2F7668] text-white p-8 md:p-12 rounded-[32px] shadow-xl"
      >
        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 top-10 opacity-10 pointer-events-none">
          <GraduationCap className="w-60 h-60 text-white" />
        </div>

        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 mb-3 block">
            Khơi nguồn cảm hứng
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
            Thành Tín - LMS
          </h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed font-light">
            Hành trình chuyển đổi số giáo dục, xây dựng kho học liệu trực quan, quản lý lớp học hiệu quả, giao nhiệm vụ học tập sáng tạo và phát triển toàn diện năng lực học sinh cùng sự đồng hành của Thành Tín AI.
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('Chương trình học')}
              className="px-6 py-3 bg-white text-[#2F7668] font-bold rounded-2xl shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center gap-2 text-sm"
            >
              <BookOpen className="w-4 h-4" /> Bắt đầu ngay
            </button>
            <button
              onClick={() => onNavigate('Sản phẩm sáng tạo')}
              className="px-6 py-3 bg-[#265D52] text-white border border-white/20 font-medium rounded-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2 text-sm"
            >
              <Award className="w-4 h-4" /> Khám phá kho liệu
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Chương trình học', value: '7 khối', desc: 'Từ Lớp 6 đến Lớp 12', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
          { label: 'Tài nguyên số', value: '120+', desc: 'Học liệu đa dạng số', icon: FileText, color: 'text-orange-600 bg-orange-50' },
          { label: 'Học sinh tham gia', value: `${students.length * 30}`, desc: 'Hoạt động sôi nổi', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Tỉ lệ hoàn thành', value: '92.5%', desc: 'Học sinh đạt chuẩn', icon: Award, color: 'text-purple-600 bg-purple-50' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-6 rounded-[24px] shadow-sm flex items-center gap-4 border border-cream-dark/50 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid Overview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Lessons */}
          <div className="bg-white p-6 rounded-xl-3 shadow-sm border border-cream-dark/40 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-cream-dark/30">
              <div>
                <h3 className="font-display font-bold text-gray-800 text-lg">Bài học gần đây</h3>
                <p className="text-xs text-gray-400">Xem tiến độ chương trình giảng dạy</p>
              </div>
              <button
                onClick={() => onNavigate('Chương trình học')}
                className="text-primary hover:text-primary-dark text-xs font-semibold flex items-center gap-1 hover:underline"
              >
                Tất cả <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentLessons.map((lesson) => (
                <div key={lesson.id} className="p-4 rounded-xl bg-cream-light border border-cream-dark hover:border-primary/50 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#2F7668]/10 text-primary rounded-full">
                        Tuần {lesson.week}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        lesson.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' :
                        lesson.status === 'Đang dạy' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {lesson.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[40px]">{lesson.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-2 line-clamp-2">{lesson.objective}</p>
                  </div>
                  
                  <div className="border-t border-cream-dark pt-3 mt-3 flex justify-between items-center text-[11px] text-gray-400">
                    <span>{lesson.grade} • {lesson.subject}</span>
                    <span className="font-medium text-gray-500">{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments or Tasks */}
          <div className="bg-white p-6 rounded-xl-3 shadow-sm border border-cream-dark/40 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-cream-dark/30">
              <div>
                <h3 className="font-display font-bold text-gray-800 text-lg">Bài tập & Nhiệm vụ</h3>
                <p className="text-xs text-gray-400">Các hoạt động đánh giá học tập</p>
              </div>
              <button
                onClick={() => onNavigate('Giao bài tập')}
                className="text-primary hover:text-primary-dark text-xs font-semibold flex items-center gap-1 hover:underline"
              >
                Quản lý <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingAssignments.map((assign) => (
                <div key={assign.id} className="p-4 rounded-xl bg-white border border-cream-dark hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        assign.status === 'Đã nộp' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {assign.status}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Hạn: {assign.dueDate}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">{assign.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{assign.description}</p>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 border-cream-dark pt-2 md:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">Hệ số {assign.coefficient}</p>
                      <p className="text-xs font-semibold text-gray-700">{assign.target}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('Giao bài tập')}
                      className="bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      {role === 'TEACHER' ? 'Chấm bài' : 'Làm bài'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column (1/3 width on desktop) */}
        <div className="space-y-8">

          {/* Top Students / Featured Students */}
          <div className="bg-white p-6 rounded-xl-3 shadow-sm border border-cream-dark/40 space-y-4">
            <div className="pb-2 border-b border-cream-dark/30">
              <h3 className="font-display font-bold text-gray-800 text-lg">Học sinh nổi bật</h3>
              <p className="text-xs text-gray-400">Thành tích rèn luyện xuất sắc</p>
            </div>

            <div className="space-y-3">
              {topStudents.map((st, idx) => (
                <div key={st.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream-light/50 transition-colors">
                  <div className="relative">
                    <img src={st.avatar} alt={st.name} className="w-11 h-11 rounded-full object-cover border-2 border-primary/20" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F4A261] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{st.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {st.badges.slice(0, 2).map((badge, bidx) => (
                        <span key={bidx} className="text-[9px] font-medium bg-[#3D5A80]/10 text-[#3D5A80] px-1.5 py-0.2 rounded">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary font-display">{st.gpa.toFixed(1)}</p>
                    <p className="text-[10px] text-gray-400">{st.grade}</p>
                  </div>
                </div>
              ))}
            </div>

            {role === 'TEACHER' && (
              <button
                onClick={() => onNavigate('Quản lý học sinh')}
                className="w-full text-center py-2.5 bg-cream-dark/30 hover:bg-cream-dark/50 text-gray-700 rounded-xl text-xs font-semibold transition-colors mt-2"
              >
                Quản lý hồ sơ học sinh
              </button>
            )}
          </div>

          {/* Activity Logs */}
          <div className="bg-white p-6 rounded-xl-3 shadow-sm border border-cream-dark/40 space-y-4">
            <div className="pb-2 border-b border-cream-dark/30">
              <h3 className="font-display font-bold text-gray-800 text-lg">Hoạt động mới nhất</h3>
              <p className="text-xs text-gray-400">Nhật ký sự kiện hệ thống</p>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 items-start text-xs">
                  <div className="mt-1 p-1 bg-primary-soft text-primary rounded-lg shrink-0">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-gray-700 leading-relaxed">{act.text}</p>
                    <span className="text-[10px] text-gray-400 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
