/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestionBankItem } from '../types';

interface QuestionBankPageProps {
  questionBank: QuestionBankItem[];
  onAdd: () => void;
  onEdit: (item: QuestionBankItem) => void;
  onDelete: (id: string) => void;
  role: 'TEACHER' | 'STUDENT';
  selectedGradeFilter: string; // From sidebar
  triggerToast?: (msg: string) => void;
}

export default function QuestionBankPage({
  questionBank,
  onAdd,
  onEdit,
  onDelete,
  role,
  selectedGradeFilter,
  triggerToast = () => {}
}: QuestionBankPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('Tất cả mức độ');
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [studentAnswers, setStudentAnswers] = useState<{ [key: string]: string }>({});
  const [completedItems, setCompletedItems] = useState<{ [key: string]: boolean }>({});

  const difficulties = ['Tất cả mức độ', 'Dễ', 'Trung bình', 'Khó'];

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter question bank items
  const filteredItems = questionBank.filter(item => {
    const searchMatch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const difficultyMatch = difficultyFilter === 'Tất cả mức độ' || item.difficulty === difficultyFilter;
    const gradeMatch = selectedGradeFilter === 'Tất cả' || item.grade === selectedGradeFilter;

    return searchMatch && difficultyMatch && gradeMatch;
  });

  return (
    <div id="question-bank-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Ngân Hàng Câu Hỏi</h2>
          <p className="text-xs text-gray-500">Lưu trữ và tổ chức câu hỏi tự luận, trắc nghiệm theo phân phối chương trình môn học phục vụ ra đề thi.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Thêm Câu Hỏi Mới
          </button>
        )}
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung câu hỏi, chủ đề, môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-cream-dark/30 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Difficulty filter */}
        <div className="relative shrink-0">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="pl-11 pr-8 py-3 bg-white border border-cream-dark/30 rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer min-w-[170px]"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and metadata status */}
      {selectedGradeFilter !== 'Tất cả' && (
        <p className="text-xs text-gray-400">
          Đang lọc ngân hàng câu hỏi của: <span className="font-semibold text-primary">{selectedGradeFilter}</span>
        </p>
      )}

      {/* Questions Stack */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = !!expandedItems[item.id];
            return (
              <motion.div
                key={item.id}
                layout
                className="bg-white rounded-xl-3 border border-cream-dark/30 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                {/* Horizontal Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cream-dark/20 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                      item.difficulty === 'Khó' ? 'bg-red-100 text-red-700' :
                      item.difficulty === 'Trung bình' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      Mức độ: {item.difficulty}
                    </span>
                    <span className="font-semibold bg-primary-soft text-primary px-2.5 py-0.5 rounded-full">
                      {item.grade}
                    </span>
                    <span className="text-gray-400 font-medium">{item.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Chủ đề: {item.topic}</span>
                  </div>
                </div>

                {/* Question core content */}
                <div className="pt-4 space-y-3">
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                    {item.question}
                  </p>

                   {/* Toggle Expansion of Answers */}
                  {role === 'STUDENT' ? (
                    <div className="mt-4 border-t border-cream-dark/15 pt-3 space-y-3">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-500">Luyện tập câu trả lời của em:</label>
                        <textarea
                          id={`student-ans-input-${item.id}`}
                          value={studentAnswers[item.id] || ''}
                          onChange={(e) => setStudentAnswers({ ...studentAnswers, [item.id]: e.target.value })}
                          disabled={completedItems[item.id]}
                          placeholder="Hãy gõ câu trả lời của em tại đây..."
                          className="w-full p-2.5 bg-[#F7F3EC]/30 border border-cream-dark/35 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2F7668] focus:border-[#2F7668] disabled:bg-gray-100 disabled:text-gray-400"
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            id={`student-submit-btn-${item.id}`}
                            onClick={() => {
                              if (!studentAnswers[item.id]?.trim()) {
                                triggerToast('Em vui lòng nhập câu trả lời trước khi nộp bài luyện tập!');
                                return;
                              }
                              setCompletedItems({ ...completedItems, [item.id]: true });
                              setExpandedItems({ ...expandedItems, [item.id]: true });
                              triggerToast('Đã hoàn thành luyện tập! Hãy so sánh câu trả lời của em với đáp án gợi ý.');
                            }}
                            disabled={completedItems[item.id]}
                            className="px-3 py-1.5 bg-[#2F7668] hover:bg-[#205248] text-white text-[11px] font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {completedItems[item.id] ? 'Đã hoàn thành' : 'Hoàn thành luyện tập'}
                          </button>
                          <button
                            id={`student-hint-btn-${item.id}`}
                            onClick={() => toggleExpand(item.id)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {isExpanded ? 'Ẩn gợi ý' : 'Xem đáp án gợi ý'}
                          </button>
                        </div>
                        {completedItems[item.id] && (
                          <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Đã luyện tập
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-primary hover:text-primary-dark text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <>Ẩn đáp án gợi ý <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>Xem đáp án gợi ý <ChevronDown className="w-4 h-4" /></>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa câu hỏi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Collapsible Answer Key box */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-cream-light/40 p-4 rounded-xl border border-cream-dark/15 text-xs text-gray-600 space-y-2"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider text-primary">
                          <CheckCircle className="w-4 h-4" /> Đáp án chính xác & Hướng dẫn chấm:
                        </div>
                        <p className="whitespace-pre-line leading-relaxed italic">{item.suggestedAnswer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl-3 border border-cream-dark/20 max-w-lg mx-auto space-y-3">
          <p className="text-gray-500 text-sm font-medium">Chưa có câu hỏi nào trong ngân hàng phù hợp bộ lọc.</p>
          {role === 'TEACHER' && (
            <button
              onClick={onAdd}
              className="text-xs text-primary font-bold underline"
            >
              Thêm câu hỏi đầu tiên
            </button>
          )}
        </div>
      )}
    </div>
  );
}
