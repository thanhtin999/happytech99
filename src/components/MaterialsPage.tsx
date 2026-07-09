/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Video,
  Headphones,
  Book,
  Presentation,
  GitFork,
  FileCheck,
  Sparkles,
  Gamepad,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Download,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Material } from '../types';

interface MaterialsPageProps {
  materials: Material[];
  onAdd: () => void;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  role: 'TEACHER' | 'STUDENT';
  selectedGradeFilter: string; // From sidebar
}

export default function MaterialsPage({
  materials,
  onAdd,
  onEdit,
  onDelete,
  role,
  selectedGradeFilter
}: MaterialsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Tất cả học liệu');
  const [activePreview, setActivePreview] = useState<Material | null>(null);

  const materialTypes = [
    'Tất cả học liệu',
    'Video bài giảng',
    'Audio bài học',
    'Sách & PDF',
    'Bài giảng Slide',
    'Sơ đồ tư duy',
    'Phiếu học tập',
    'Prompt AI',
    'Game học tập'
  ];

  // Map icon to type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video bài giảng': return <Video className="w-5 h-5 text-red-500" />;
      case 'Audio bài học': return <Headphones className="w-5 h-5 text-purple-500" />;
      case 'Sách & PDF': return <Book className="w-5 h-5 text-blue-500" />;
      case 'Bài giảng Slide': return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'Sơ đồ tư duy': return <GitFork className="w-5 h-5 text-green-500" />;
      case 'Phiếu học tập': return <FileCheck className="w-5 h-5 text-teal-500" />;
      case 'Prompt AI': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Game học tập': return <Gamepad className="w-5 h-5 text-indigo-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Filter logic
  const filteredMaterials = materials.filter(m => {
    const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const typeMatch = selectedType === 'Tất cả học liệu' || m.type === selectedType;
    const gradeMatch = selectedGradeFilter === 'Tất cả' || m.grade === selectedGradeFilter;

    return searchMatch && typeMatch && gradeMatch;
  });

  return (
    <div id="materials-page" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Kho Học Liệu Điện Tử</h2>
          <p className="text-xs text-gray-500">Tổng hợp và biên soạn học liệu trực quan, sinh động phục vụ học tập & giảng dạy.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Thêm Học Liệu
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, bài giảng, video, audio, sơ đồ tư duy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-cream-dark/30 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {materialTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedType === type
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-600 border-cream-dark/35 hover:bg-cream-light/60 hover:text-gray-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grade status indicator */}
      {selectedGradeFilter !== 'Tất cả' && (
        <div className="text-xs text-gray-500">
          Đang hiển thị tài liệu cho: <span className="font-semibold text-primary">{selectedGradeFilter}</span>
        </div>
      )}

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => (
            <motion.div
              key={mat.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl-3 border border-cream-dark/30 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="p-2.5 rounded-xl bg-cream-light border border-cream-dark/20">
                    {getTypeIcon(mat.type)}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-primary-soft text-primary px-2 py-0.5 rounded-full inline-block">
                      {mat.grade}
                    </span>
                    <span className="text-[10px] block text-gray-400 mt-1">{mat.size}</span>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-2" title={mat.title}>{mat.title}</h4>
                  <span className="text-[11px] font-semibold text-primary-light block mt-1">{mat.subject}</span>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{mat.description}</p>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t border-cream-dark/20 pt-4 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {mat.createdAt}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActivePreview(mat)}
                    className="text-xs font-semibold px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> Mở tài liệu
                  </button>

                  {role === 'TEACHER' && (
                    <>
                      <button
                        onClick={() => onEdit(mat)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(mat.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl-3 border border-cream-dark/20 max-w-lg mx-auto space-y-3">
          <p className="text-gray-500 text-sm font-medium">Không tìm thấy tài liệu phù hợp với tìm kiếm của bạn.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedType('Tất cả học liệu'); }}
            className="text-xs text-primary font-bold underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Resource Preview Modal */}
      <AnimatePresence>
        {activePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl-4 max-w-lg w-full overflow-hidden shadow-2xl border border-cream-dark/30"
            >
              {/* Header */}
              <div className="bg-primary text-white p-6 relative">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-white/20 rounded-lg text-white">
                    {getTypeIcon(activePreview.type)}
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-white/25 px-2.5 py-0.5 rounded-full">
                    {activePreview.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display mt-3 leading-snug">{activePreview.title}</h3>
                <button
                  onClick={() => setActivePreview(null)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white font-bold text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="p-4 bg-cream-light rounded-xl border border-cream-dark/20">
                  <span className="text-[11px] text-gray-400 block font-semibold uppercase tracking-wider">Mô Tả Học Liệu</span>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">{activePreview.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Khối lớp:</span>
                    <p className="font-semibold text-gray-800">{activePreview.grade}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Môn học:</span>
                    <p className="font-semibold text-gray-800">{activePreview.subject}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Dung lượng:</span>
                    <p className="font-semibold text-gray-800">{activePreview.size}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Ngày xuất bản:</span>
                    <p className="font-semibold text-gray-800">{activePreview.createdAt}</p>
                  </div>
                </div>

                {/* Simulated Viewer Area */}
                <div className="h-32 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 p-4">
                  <FileText className="w-8 h-8 text-primary/40 animate-bounce" />
                  <span className="text-[11px] text-center">Bản xem trước trực quan của tài liệu đang tải trên nền tảng Thành Tín AI...</span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-cream-light p-4 border-t border-cream-dark/25 flex justify-between items-center">
                <button
                  onClick={() => alert(`Bắt đầu tải xuống file ${activePreview.title} (${activePreview.size})...`)}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Tải Xuống File
                </button>
                <button
                  onClick={() => setActivePreview(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
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
