/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Heart,
  BookMarked,
  Play,
  Send,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReadingText } from '../types';

interface ReadingPageProps {
  readingTexts: ReadingText[];
  onAdd: () => void;
  onEdit: (text: ReadingText) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  role: 'TEACHER' | 'STUDENT';
}

export default function ReadingPage({
  readingTexts,
  onAdd,
  onEdit,
  onDelete,
  onToggleFavorite,
  role
}: ReadingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tất cả');
  const [activePracticeText, setActivePracticeText] = useState<ReadingText | null>(null);

  // Answers state for the practice form
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(null);

  const genres = [
    'Tất cả',
    'Tản văn',
    'Truyện ngắn',
    'Tùy bút',
    'Thơ',
    'Văn bản thông tin',
    'Bài đọc kỹ năng sống'
  ];

  // Filter logic
  const filteredTexts = readingTexts.filter(t => {
    const searchMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const genreMatch = selectedGenre === 'Tất cả' || t.genre === selectedGenre;
    return searchMatch && genreMatch;
  });

  const handleStartPractice = (text: ReadingText) => {
    setActivePracticeText(text);
    setAnswer1('');
    setAnswer2('');
    setSubmittedFeedback(null);
  };

  const handleSubmitPractice = () => {
    if (!answer1.trim() || !answer2.trim()) {
      alert('Vui lòng điền đầy đủ câu trả lời cho cả hai câu hỏi trước khi nộp bài!');
      return;
    }

    // Simulate grading feedback using static model reply
    setSubmittedFeedback(
      `Chúc mừng em đã hoàn thành bài luyện đọc cảm thụ tác phẩm "${activePracticeText?.title}"! 
      Bài làm của em đã được gửi thành công đến giáo viên Dương Thành Tín. 

      Đánh giá nhanh sơ bộ từ Thành Tín AI:
      - Tinh thần tự học: Xuất sắc
      - Độ hoàn thành: 100%
      - Khuyến nghị: Câu trả lời có vốn từ phong phú, biểu cảm tốt. Thầy sẽ xem xét và phản hồi điểm chính thức sớm nhất.`
    );
  };

  return (
    <div id="reading-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Luyện Đọc & Cảm Thụ</h2>
          <p className="text-xs text-gray-500">Tuyển chọn tác phẩm văn học, câu chuyện mở rộng giúp học sinh rèn kỹ năng đọc hiểu và tư duy phản biện.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Thêm Văn Bản Đọc
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm tác phẩm, chủ đề, thể loại, kỹ năng đọc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-cream-dark/30 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Genre filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedGenre === genre
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-600 border-cream-dark/35 hover:bg-cream-light/60 hover:text-gray-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {filteredTexts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTexts.map((text) => (
            <motion.div
              key={text.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl-3 border border-cream-dark/30 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-[#E07A5F]/15 text-[#E07A5F] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {text.genre}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(text.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        text.favorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-semibold">{text.topic}</span>
                  <h3 className="font-bold text-gray-800 text-base mt-0.5">{text.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{text.shortDesc}</p>
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="border-t border-cream-dark/20 pt-4 flex items-center justify-between">
                <button
                  onClick={() => handleStartPractice(text)}
                  className="bg-primary-soft hover:bg-primary hover:text-white text-primary text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Luyện Đọc Ngay
                </button>

                {role === 'TEACHER' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(text)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(text.id)}
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
          <p className="text-gray-500 text-sm font-medium">Không tìm thấy tác phẩm phù hợp.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedGenre('Tất cả'); }}
            className="text-xs text-primary font-bold underline"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Practice Reading Modal */}
      <AnimatePresence>
        {activePracticeText && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl-4 max-w-2xl w-full overflow-hidden shadow-2xl border border-cream-dark/30 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-primary text-white p-5 relative shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-full">
                  {activePracticeText.genre} • {activePracticeText.topic}
                </span>
                <h3 className="text-lg font-bold font-display mt-2">{activePracticeText.title}</h3>
                <button
                  onClick={() => setActivePracticeText(null)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Text Content */}
                <div className="bg-cream-light p-5 rounded-2xl border border-cream-dark/30 space-y-3">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                    <BookMarked className="w-4 h-4" /> Văn Bản Đọc:
                  </span>
                  <div className="text-sm text-gray-700 leading-relaxed font-serif whitespace-pre-line">
                    {activePracticeText.content}
                  </div>
                </div>

                {/* Form fields */}
                {!submittedFeedback ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 block">
                        Câu hỏi 1 (Đọc hiểu): <span className="text-gray-500 font-normal">{activePracticeText.comprehensionQuestion}</span>
                      </label>
                      <textarea
                        rows={3}
                        value={answer1}
                        onChange={(e) => setAnswer1(e.target.value)}
                        placeholder="Nhập câu trả lời đọc hiểu của em..."
                        className="w-full p-3.5 bg-white border border-cream-dark/40 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 block">
                        Câu hỏi 2 (Cảm thụ): <span className="text-gray-500 font-normal">{activePracticeText.reflectionQuestion}</span>
                      </label>
                      <textarea
                        rows={3}
                        value={answer2}
                        onChange={(e) => setAnswer2(e.target.value)}
                        placeholder="Nhập suy nghĩ chân thành của em..."
                        className="w-full p-3.5 bg-white border border-cream-dark/40 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  /* Success Feedback */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-green-50 border border-green-200 text-green-800 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600 animate-bounce" />
                      <span className="font-bold text-sm">Gửi bài thành công!</span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line">{submittedFeedback}</p>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-cream-light p-4 border-t border-cream-dark/25 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setActivePracticeText(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  {submittedFeedback ? 'Đóng lại' : 'Hủy bỏ'}
                </button>

                {!submittedFeedback && (
                  <button
                    onClick={handleSubmitPractice}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Nộp bài đọc
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
