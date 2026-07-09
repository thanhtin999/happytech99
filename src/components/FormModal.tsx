/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Save, X } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  type: 'Lesson' | 'Material' | 'ReadingText' | 'Quiz' | 'Assignment' | 'Exam' | 'Student' | 'QuestionBankItem' | 'CreativeProduct' | 'Account';
  item: any | null; // Null if adding
  onClose: () => void;
  onSave: (savedItem: any) => void;
}

export default function FormModal({ isOpen, type, item, onClose, onSave }: FormModalProps) {
  const [formData, setFormData] = useState<any>({});

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...item });
      } else {
        // Default values for new items
        setFormData(getDefaultDataForType(type));
      }
    }
  }, [isOpen, type, item]);

  const getDefaultDataForType = (entityType: string) => {
    const id = `${entityType.toUpperCase().substring(0, 3)}_${Date.now().toString().substring(8)}`;
    switch (entityType) {
      case 'Lesson':
        return {
          id,
          title: '',
          subject: 'Tin học / Năng lực số',
          grade: 'Lớp 6',
          semester: 'I',
          objective: '',
          duration: '2 tiết (90 phút)',
          week: 1,
          status: 'Chưa dạy'
        };
      case 'Material':
        return {
          id,
          title: '',
          type: 'Video bài giảng',
          size: '15MB',
          description: '',
          grade: 'Lớp 6',
          subject: 'Năng lực số',
          createdAt: new Date().toISOString().split('T')[0]
        };
      case 'ReadingText':
        return {
          id,
          title: '',
          genre: 'Tản văn',
          topic: '',
          shortDesc: '',
          content: '',
          comprehensionQuestion: 'Nêu ý nghĩa tác phẩm?',
          reflectionQuestion: 'Hãy viết cảm nghĩ của em?',
          favorite: false
        };
      case 'Quiz':
        return {
          id,
          title: '',
          topic: '',
          grade: 'Lớp 6',
          duration: '15 phút',
          questionsCount: 3,
          type: 'Trắc nghiệm',
          questions: [
            {
              id: `QQ_${Date.now()}_1`,
              question: 'Câu hỏi số 1?',
              options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
              correctOptionIndex: 0,
              explanation: 'Giải thích câu hỏi số 1.'
            }
          ]
        };
      case 'Assignment':
        return {
          id,
          title: '',
          description: '',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Chưa nộp',
          coefficient: 1,
          target: 'Cả lớp',
          submittedCount: 0
        };
      case 'Exam':
        return {
          id,
          title: '',
          grade: 'Lớp 6',
          duration: '45 phút',
          totalScore: 10,
          structure: '70% Trắc nghiệm, 30% Tự luận',
          createdAt: new Date().toISOString().split('T')[0],
          part1Mcqs: [
            { question: 'Câu hỏi trắc nghiệm số 1?', options: ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'], answer: 'Lựa chọn A' }
          ],
          part2Essay: 'Câu hỏi tự luận mẫu.',
          answerGuide: 'Đáp án chi tiết.',
          matrix: 'Nhận biết 50% | Thông hiểu 50%'
        };
      case 'Student':
        return {
          id: `HS_${Date.now().toString().substring(8)}`,
          name: '',
          grade: 'Lớp 6',
          progress: 80,
          gpa: 8.5,
          badges: ['Chăm chỉ'],
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        };
      case 'QuestionBankItem':
        return {
          id,
          subject: 'Tin học',
          grade: 'Lớp 6',
          difficulty: 'Trung bình',
          topic: '',
          question: '',
          suggestedAnswer: ''
        };
      case 'CreativeProduct':
        return {
          id,
          title: '',
          type: 'Video',
          author: '',
          description: '',
          likes: 5,
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
        };
      case 'Account':
        return {
          id,
          name: '',
          role: 'STUDENT',
          email: '',
          phone: '',
          status: 'Đang hoạt động',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        };
      default:
        return { id };
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getTitleText = () => {
    const action = item ? 'Sửa thông tin' : 'Thêm mới';
    switch (type) {
      case 'Lesson': return `${action} Bài Học`;
      case 'Material': return `${action} Học Liệu`;
      case 'ReadingText': return `${action} Văn Bản Luyện Đọc`;
      case 'Quiz': return `${action} Đề Quiz Trắc Nghiệm`;
      case 'Assignment': return `${action} Bài Tập / Nhiệm Vụ`;
      case 'Exam': return `${action} Đề Thi Kiểm Tra`;
      case 'Student': return `${action} Hồ Sơ Học Sinh`;
      case 'QuestionBankItem': return `${action} Câu Hỏi Ngân Hàng`;
      case 'CreativeProduct': return `${action} Sản Phẩm Sáng Tạo`;
      case 'Account': return `${action} Tài Khoản Hệ Thống`;
      default: return `${action} dữ liệu`;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-xl-4 max-w-lg w-full overflow-hidden shadow-2xl border border-cream-dark/30 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-primary text-white p-5 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-base font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F4A261] animate-spin" /> {getTitleText()}
            </h3>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold">
              ✕
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            
            {/* TYPE 1: LESSON FORM */}
            {type === 'Lesson' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tên bài học / Chuyên đề:</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Môn học:</label>
                    <input
                      type="text"
                      required
                      value={formData.subject || ''}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Khối Lớp:</label>
                    <select
                      value={formData.grade || 'Lớp 6'}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Học kỳ:</label>
                    <select
                      value={formData.semester || 'I'}
                      onChange={(e) => handleInputChange('semester', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      <option value="I">Kỳ I</option>
                      <option value="II">Kỳ II</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Tuần dạy:</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={40}
                      value={formData.week || 1}
                      onChange={(e) => handleInputChange('week', parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Trạng thái:</label>
                    <select
                      value={formData.status || 'Chưa dạy'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      <option value="Chưa dạy">Chưa dạy</option>
                      <option value="Đang dạy">Đang dạy</option>
                      <option value="Đã hoàn thành">Đã hoàn thành</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Mục tiêu bài học (Yêu cầu cần đạt):</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.objective || ''}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 2: MATERIAL FORM */}
            {type === 'Material' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tên học liệu điện tử:</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Loại học liệu:</label>
                    <select
                      value={formData.type || 'Video bài giảng'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {[
                        'Video bài giảng',
                        'Audio bài học',
                        'Sách & PDF',
                        'Bài giảng Slide',
                        'Sơ đồ tư duy',
                        'Phiếu học tập',
                        'Prompt AI',
                        'Game học tập'
                      ].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Khối Lớp:</label>
                    <select
                      value={formData.grade || 'Lớp 6'}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Môn học:</label>
                    <input
                      type="text"
                      required
                      value={formData.subject || ''}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Dung lượng / Định dạng file:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12MB, PDF - 4MB"
                      value={formData.size || ''}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Mô tả tóm tắt học liệu:</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 3: READING TEXT FORM */}
            {type === 'ReadingText' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tên tác phẩm / Văn bản:</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Thể loại:</label>
                    <select
                      value={formData.genre || 'Tản văn'}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Tản văn', 'Truyện ngắn', 'Tùy bút', 'Thơ', 'Văn bản thông tin', 'Bài đọc kỹ năng sống'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Chủ đề:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Văn học quê hương"
                      value={formData.topic || ''}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Đoạn giới thiệu ngắn (30-50 chữ):</label>
                  <input
                    type="text"
                    required
                    value={formData.shortDesc || ''}
                    onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Nội dung văn bản đọc chi tiết:</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Câu hỏi đọc hiểu 1:</label>
                  <input
                    type="text"
                    required
                    value={formData.comprehensionQuestion || ''}
                    onChange={(e) => handleInputChange('comprehensionQuestion', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Câu hỏi cảm thụ 2:</label>
                  <input
                    type="text"
                    required
                    value={formData.reflectionQuestion || ''}
                    onChange={(e) => handleInputChange('reflectionQuestion', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 4: QUIZ FORM */}
            {type === 'Quiz' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tên đề trắc nghiệm:</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Chủ đề kiểm tra:</label>
                    <input
                      type="text"
                      required
                      value={formData.topic || ''}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Khối lớp:</label>
                    <select
                      value={formData.grade || 'Lớp 6'}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Thời gian làm bài:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15 phút, 30 phút"
                      value={formData.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Loại câu hỏi:</label>
                    <select
                      value={formData.type || 'Trắc nghiệm'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      <option value="Trắc nghiệm">Trắc nghiệm</option>
                      <option value="Tự luận ngắn">Tự luận ngắn</option>
                    </select>
                  </div>
                </div>
                {/* Embedded simple single question creation for demo */}
                <div className="bg-cream-light p-3.5 rounded-xl border border-cream-dark/30 space-y-2">
                  <p className="font-bold text-primary">Cấu hình Câu hỏi trắc nghiệm số 1:</p>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-semibold">Nội dung câu hỏi:</label>
                    <input
                      type="text"
                      required
                      value={formData.questions?.[0]?.question || 'Câu hỏi số 1?'}
                      onChange={(e) => {
                        const qs = [...(formData.questions || [])];
                        if (qs[0]) {
                          qs[0].question = e.target.value;
                          handleInputChange('questions', qs);
                        }
                      }}
                      className="w-full p-2 bg-white border border-cream-dark rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {['A', 'B', 'C', 'D'].map((char, idx) => (
                      <div key={char} className="space-y-0.5">
                        <label className="text-gray-400 font-bold">Lựa chọn {char}:</label>
                        <input
                          type="text"
                          required
                          value={formData.questions?.[0]?.options?.[idx] || `Đáp án ${char}`}
                          onChange={(e) => {
                            const qs = [...(formData.questions || [])];
                            if (qs[0] && qs[0].options) {
                              qs[0].options[idx] = e.target.value;
                              handleInputChange('questions', qs);
                            }
                          }}
                          className="w-full p-1.5 bg-white border border-cream-dark rounded-md text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 mt-2">
                    <label className="text-[10px] text-gray-500 font-bold block">Chỉ số đáp án đúng (0 cho A, 1 cho B, 2 cho C, 3 cho D):</label>
                    <select
                      value={formData.questions?.[0]?.correctOptionIndex || 0}
                      onChange={(e) => {
                        const qs = [...(formData.questions || [])];
                        if (qs[0]) {
                          qs[0].correctOptionIndex = parseInt(e.target.value) || 0;
                          handleInputChange('questions', qs);
                        }
                      }}
                      className="w-24 p-1.5 bg-white border border-cream-dark rounded-lg text-xs"
                    >
                      <option value={0}>A (0)</option>
                      <option value={1}>B (1)</option>
                      <option value={2}>C (2)</option>
                      <option value={3}>D (3)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 5: ASSIGNMENT FORM */}
            {type === 'Assignment' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tiêu đề bài tập:</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Hạn nộp bài:</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate || ''}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Hệ số điểm:</label>
                    <select
                      value={formData.coefficient || 1}
                      onChange={(e) => handleInputChange('coefficient', parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      <option value={1}>Hệ số 1</option>
                      <option value={2}>Hệ số 2</option>
                      <option value={3}>Hệ số 3</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Đối tượng giao bài:</label>
                  <select
                    value={formData.target || 'Cả lớp'}
                    onChange={(e) => handleInputChange('target', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  >
                    <option value="Cả lớp">Toàn bộ lớp học</option>
                    <option value="Cá nhân">Cá nhân học sinh</option>
                    <option value="Nhóm">Dự án Nhóm</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Mô tả chi tiết nhiệm vụ và yêu cầu nộp bài:</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 6: EXAM FORM */}
            {type === 'Exam' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tiêu đề đề thi / đề kiểm tra:</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Khối Lớp:</label>
                    <select
                      value={formData.grade || 'Lớp 6'}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Thời gian:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 45 phút, 90 phút"
                      value={formData.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Tổng điểm:</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={100}
                      value={formData.totalScore || 10}
                      onChange={(e) => handleInputChange('totalScore', parseInt(e.target.value) || 10)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Cấu trúc đề:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 70% Trắc nghiệm, 30% Tự luận"
                      value={formData.structure || ''}
                      onChange={(e) => handleInputChange('structure', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Ma trận đề:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nhận biết 40% | Thông hiểu 30%..."
                    value={formData.matrix || ''}
                    onChange={(e) => handleInputChange('matrix', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Câu hỏi tự luận chính:</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.part2Essay || ''}
                    onChange={(e) => handleInputChange('part2Essay', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Lời giải hướng dẫn chấm chi tiết:</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.answerGuide || ''}
                    onChange={(e) => handleInputChange('answerGuide', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 7: STUDENT FORM */}
            {type === 'Student' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Họ và tên học sinh:</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Khối Lớp:</label>
                    <select
                      value={formData.grade || 'Lớp 6'}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Mã ID học sinh:</label>
                    <input
                      type="text"
                      required
                      value={formData.id || ''}
                      onChange={(e) => handleInputChange('id', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Điểm GPA trung bình:</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.gpa || 8.0}
                      onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value) || 8.0)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Tiến độ bài học (%):</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.progress || 80}
                      onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Mã ảnh đại diện (avatar URL):</label>
                  <input
                    type="text"
                    required
                    value={formData.avatar || ''}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Huy hiệu đạt được (phân cách bằng dấu phẩy):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chăm chỉ, Sáng tạo, Đồng đội"
                    value={formData.badges ? formData.badges.join(', ') : ''}
                    onChange={(e) => handleInputChange('badges', e.target.value.split(',').map((s: string) => s.trim()))}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 8: QUESTION BANK FORM */}
            {type === 'QuestionBankItem' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Môn học:</label>
                    <input
                      type="text"
                      required
                      value={formData.subject || ''}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Khối lớp:</label>
                    <select
                      value={formData.grade || 'Lớp 6'}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Độ khó:</label>
                    <select
                      value={formData.difficulty || 'Trung bình'}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      <option value="Dễ">Dễ</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Khó">Khó</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Chủ đề:</label>
                    <input
                      type="text"
                      required
                      value={formData.topic || ''}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Nội dung câu hỏi:</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.question || ''}
                    onChange={(e) => handleInputChange('question', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Đáp án gợi ý / Gợi ý làm bài:</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.suggestedAnswer || ''}
                    onChange={(e) => handleInputChange('suggestedAnswer', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 9: CREATIVE PRODUCT FORM */}
            {type === 'CreativeProduct' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tên sản phẩm sáng tạo:</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Loại sản phẩm:</label>
                    <select
                      value={formData.type || 'Video'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      {['Podcast', 'Video', 'Poster', 'Game', 'Web app', 'Slide'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Tác giả (Ví dụ: Nguyễn Minh - Lớp 6):</label>
                    <input
                      type="text"
                      required
                      value={formData.author || ''}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Đường dẫn ảnh thu nhỏ (Thumbnail image URL):</label>
                  <input
                    type="text"
                    required
                    value={formData.thumbnail || ''}
                    onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Ý nghĩa & Mô tả sản phẩm:</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* TYPE 10: ACCOUNT FORM */}
            {type === 'Account' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Họ và tên thành viên:</label>
                    <input
                      id="account-name"
                      type="text"
                      required
                      value={formData.name || formData.fullName || ''}
                      onChange={(e) => {
                        handleInputChange('name', e.target.value);
                        handleInputChange('fullName', e.target.value);
                      }}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Tên đăng nhập:</label>
                    <input
                      id="account-username"
                      type="text"
                      required
                      disabled={formData.username === 'ThanhtinAI'}
                      value={formData.username || ''}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Mật khẩu:</label>
                    <input
                      id="account-password"
                      type="text"
                      required
                      value={formData.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Lớp học (nếu là Học sinh):</label>
                    <input
                      id="account-classname"
                      type="text"
                      placeholder="e.g., 6A"
                      value={formData.className || ''}
                      onChange={(e) => handleInputChange('className', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Vai trò phân quyền:</label>
                    <select
                      id="account-role"
                      value={formData.role || 'STUDENT'}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      <option value="TEACHER">TEACHER (Giáo viên / Quản trị)</option>
                      <option value="STUDENT">STUDENT (Học sinh)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Trạng thái tài khoản:</label>
                    <select
                      id="account-status"
                      value={formData.status || 'Chờ kích hoạt'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                    >
                      <option value="Chờ kích hoạt">Chờ kích hoạt</option>
                      <option value="Đã kích hoạt">Đã kích hoạt</option>
                      <option value="Tạm khóa">Tạm khóa</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Ảnh đại diện mẫu (URL):</label>
                  <input
                    id="account-avatar"
                    type="text"
                    required
                    value={formData.avatar || ''}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    className="w-full p-2.5 bg-white border border-cream-dark rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Save Buttons */}
            <div className="bg-cream-light p-4 border-t border-cream-dark/25 flex justify-end gap-3 shrink-0 pt-4 -mx-6 -mb-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-bold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" /> Lưu thông tin
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
