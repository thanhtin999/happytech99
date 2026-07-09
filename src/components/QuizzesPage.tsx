/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quiz, QuizQuestion } from '../types';

interface QuizzesPageProps {
  quizzes: Quiz[];
  onAdd: () => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
  role: 'TEACHER' | 'STUDENT';
  selectedGradeFilter: string; // From sidebar
}

export default function QuizzesPage({
  quizzes,
  onAdd,
  onEdit,
  onDelete,
  role,
  selectedGradeFilter
}: QuizzesPageProps) {
  const [activeQuizToSolve, setActiveQuizToSolve] = useState<Quiz | null>(null);
  
  // Quiz solver states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [shortEssayAnswer, setShortEssayAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    completed: boolean;
    answersStatus: { qId: string; correct: boolean; chosenIdx: number; correctIdx: number }[];
  } | null>(null);

  // Filter quizzes based on sidebar grade filter
  const filteredQuizzes = quizzes.filter(quiz => {
    return selectedGradeFilter === 'Tất cả' || quiz.grade === selectedGradeFilter;
  });

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuizToSolve(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShortEssayAnswer('');
    setQuizResult(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (activeQuizToSolve && currentQuestionIndex < activeQuizToSolve.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizToSolve) return;

    // Check if all questions are answered
    const unansweredCount = activeQuizToSolve.questions.filter(q => selectedAnswers[q.id] === undefined).length;
    if (unansweredCount > 0 && activeQuizToSolve.type === 'Trắc nghiệm') {
      const confirmSubmit = window.confirm(`Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?`);
      if (!confirmSubmit) return;
    }

    // Calculate score
    let correctCount = 0;
    const answersStatus = activeQuizToSolve.questions.map(q => {
      const chosen = selectedAnswers[q.id] ?? -1;
      const isCorrect = chosen === q.correctOptionIndex;
      if (isCorrect) correctCount++;
      return {
        qId: q.id,
        correct: isCorrect,
        chosenIdx: chosen,
        correctIdx: q.correctOptionIndex
      };
    });

    const finalScore = Math.round((correctCount / activeQuizToSolve.questions.length) * 10 * 10) / 10;

    setQuizResult({
      score: finalScore,
      total: activeQuizToSolve.questions.length,
      completed: true,
      answersStatus
    });
  };

  return (
    <div id="quizzes-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Hệ Thống Trắc Nghiệm Đánh Giá</h2>
          <p className="text-xs text-gray-500">Học sinh tự luyện trắc nghiệm trực quan; giáo viên quản lý ngân hàng câu hỏi, tạo đề và xem điểm số.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Tạo Đề Trắc Nghiệm
          </button>
        )}
      </div>

      {/* Grade indicator */}
      {selectedGradeFilter !== 'Tất cả' && (
        <div className="text-xs text-gray-500">
          Đang xem đề kiểm tra trắc nghiệm của: <span className="font-semibold text-primary">{selectedGradeFilter}</span>
        </div>
      )}

      {/* Quizzes List */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              layout
              className="bg-white rounded-xl-3 border border-cream-dark/30 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold bg-primary-soft text-primary px-2.5 py-0.5 rounded-full">
                    {quiz.grade}
                  </span>
                  <span className="text-gray-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> {quiz.duration}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#3D5A80] bg-[#3D5A80]/10 px-2 py-0.5 rounded font-semibold">
                    {quiz.topic}
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm mt-2 line-clamp-1">{quiz.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">Cấu trúc: {quiz.questionsCount} câu hỏi ({quiz.type})</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-cream-dark/20 pt-4 mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition-all"
                >
                  <Play className="w-3.5 h-3.5" /> Bắt đầu làm bài
                </button>

                {role === 'TEACHER' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(quiz)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(quiz.id)}
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
          <p className="text-gray-500 text-sm font-medium">Chưa có đề trắc nghiệm cho khối học này.</p>
          {role === 'TEACHER' && (
            <button
              onClick={onAdd}
              className="text-xs text-primary font-bold underline"
            >
              Tạo đề mới ngay
            </button>
          )}
        </div>
      )}

      {/* Quiz Solver Modal */}
      <AnimatePresence>
        {activeQuizToSolve && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl-4 max-w-2xl w-full overflow-hidden shadow-2xl border border-cream-dark/30 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-primary text-white p-5 relative shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-full">
                    {activeQuizToSolve.grade} • {activeQuizToSolve.topic}
                  </span>
                  <span className="text-xs text-white/80 flex items-center gap-0.5 ml-auto mr-8">
                    <Clock className="w-3.5 h-3.5" /> {activeQuizToSolve.duration}
                  </span>
                </div>
                <h3 className="text-base font-bold font-display mt-2">{activeQuizToSolve.title}</h3>
                <button
                  onClick={() => setActiveQuizToSolve(null)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white font-bold text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {!quizResult ? (
                  /* Solving State */
                  <div className="space-y-6">
                    {/* Progress indicators */}
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Câu hỏi {currentQuestionIndex + 1} / {activeQuizToSolve.questions.length}</span>
                      <div className="w-2/3 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all"
                          style={{ width: `${((currentQuestionIndex + 1) / activeQuizToSolve.questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Active Question Box */}
                    {activeQuizToSolve.questions[currentQuestionIndex] && (
                      <div className="space-y-4">
                        <div className="p-4 bg-cream-light rounded-xl border border-cream-dark/20">
                          <p className="font-bold text-gray-800 text-sm">
                            {currentQuestionIndex + 1}. {activeQuizToSolve.questions[currentQuestionIndex].question}
                          </p>
                        </div>

                        {/* Options A, B, C, D */}
                        <div className="grid grid-cols-1 gap-3">
                          {activeQuizToSolve.questions[currentQuestionIndex].options.map((option, oIdx) => {
                            const qId = activeQuizToSolve.questions[currentQuestionIndex].id;
                            const isSelected = selectedAnswers[qId] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qId, oIdx)}
                                className={`text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-primary/5 border-primary text-primary shadow-sm'
                                    : 'bg-white border-cream-dark/30 text-gray-700 hover:bg-cream-light/40'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + oIdx)}. {option}</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                                }`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Result / Evaluation State */
                  <div className="space-y-6">
                    {/* Result Header */}
                    <div className="text-center p-5 bg-primary-soft/50 border border-primary/10 rounded-2xl space-y-2">
                      <Award className="w-12 h-12 text-[#F4A261] mx-auto animate-bounce" />
                      <h4 className="font-bold text-gray-800 text-base">KẾT QUẢ ĐẠT ĐƯỢC</h4>
                      <p className="text-2xl font-black text-primary font-display">{quizResult.score} / 10 điểm</p>
                      <p className="text-xs text-gray-500">
                        Đúng {quizResult.answersStatus.filter(a => a.correct).length} trên tổng số {quizResult.total} câu hỏi trắc nghiệm
                      </p>
                    </div>

                    {/* Explanations List */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-gray-700 block">CHI TIẾT ĐÁP ÁN VÀ GIẢI THÍCH</span>
                      {activeQuizToSolve.questions.map((q, idx) => {
                        const status = quizResult.answersStatus.find(a => a.qId === q.id);
                        return (
                          <div key={q.id} className="p-4 rounded-xl border border-cream-dark/20 bg-cream-light/30 space-y-3">
                            <div className="flex items-start gap-2">
                              {status?.correct ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              )}
                              <p className="font-semibold text-gray-800 text-xs">
                                Câu {idx + 1}: {q.question}
                              </p>
                            </div>

                            <div className="text-xs space-y-1.5 pl-6">
                              <p className="text-gray-600">
                                • Lựa chọn của bạn: <span className="font-medium text-gray-800">
                                  {status?.chosenIdx !== -1 ? `${String.fromCharCode(65 + status!.chosenIdx)}. ${q.options[status!.chosenIdx]}` : 'Chưa trả lời'}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                • Đáp án đúng: <span className="font-semibold text-green-700">
                                  {String.fromCharCode(65 + q.correctOptionIndex)}. {q.options[q.correctOptionIndex]}
                                </span>
                              </p>
                            </div>

                            {/* Explanation */}
                            <div className="bg-white p-3 rounded-lg border border-cream-dark/15 text-[11px] text-gray-500 flex gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-[#F4A261] shrink-0 mt-0.5" />
                              <p className="leading-relaxed"><span className="font-semibold text-gray-700">Giải thích:</span> {q.explanation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-cream-light p-4 border-t border-cream-dark/25 flex justify-between items-center shrink-0">
                {!quizResult ? (
                  <>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="bg-white border border-cream-dark/30 text-gray-600 disabled:opacity-40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === activeQuizToSolve.questions.length - 1}
                        className="bg-white border border-cream-dark/30 text-gray-600 disabled:opacity-40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Tiếp theo
                      </button>
                    </div>

                    {currentQuestionIndex === activeQuizToSolve.questions.length - 1 ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Nộp bài thi
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        className="bg-primary/20 text-primary-dark border border-primary/10 hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Nộp bài sớm
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartQuiz(activeQuizToSolve)}
                      className="bg-primary-soft hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Làm lại đề này
                    </button>
                    <button
                      onClick={() => setActiveQuizToSolve(null)}
                      className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Đóng lại
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
