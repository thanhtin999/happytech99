/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Heart,
  ExternalLink,
  MessageSquare,
  Monitor,
  Headphones,
  Video,
  FileImage,
  Gamepad,
  Presentation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreativeProduct } from '../types';

interface CreativePageProps {
  products: CreativeProduct[];
  onAdd: () => void;
  onEdit: (product: CreativeProduct) => void;
  onDelete: (id: string) => void;
  onUpdateProduct: (product: CreativeProduct) => void;
  role: 'TEACHER' | 'STUDENT';
}

export default function CreativePage({
  products,
  onAdd,
  onEdit,
  onDelete,
  onUpdateProduct,
  role
}: CreativePageProps) {
  const [activeViewerProduct, setActiveViewerProduct] = useState<CreativeProduct | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Podcast': return <Headphones className="w-4 h-4 text-purple-600" />;
      case 'Video': return <Video className="w-4 h-4 text-red-600" />;
      case 'Poster': return <FileImage className="w-4 h-4 text-emerald-600" />;
      case 'Game': return <Gamepad className="w-4 h-4 text-indigo-600" />;
      case 'Web app': return <Monitor className="w-4 h-4 text-cyan-600" />;
      case 'Slide': return <Presentation className="w-4 h-4 text-orange-600" />;
      default: return <Sparkles className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleLike = (product: CreativeProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...product,
      likes: product.likes + 1
    };
    onUpdateProduct(updated);
  };

  return (
    <div id="creative-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Sản Phẩm Sáng Tạo Số</h2>
          <p className="text-xs text-gray-500">Không gian trưng bày, truyền cảm hứng từ các dự án thực tế, podcast, video, game học tập của học sinh thành viên.</p>
        </div>

        {role === 'TEACHER' && (
          <button
            onClick={onAdd}
            className="self-start md:self-auto bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Đăng Sản Phẩm Mới
          </button>
        )}
      </div>

      {/* Grid view of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            className="bg-white rounded-xl-3 border border-cream-dark/30 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Image Preview Box with Type tag */}
            <div className="relative h-44 bg-gray-100 overflow-hidden group">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 text-[10px] font-bold text-gray-800">
                {getTypeIcon(product.type)}
                <span>{product.type}</span>
              </div>
            </div>

            {/* Core details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tác giả: {product.author}</span>
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 min-h-[40px] leading-snug">{product.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{product.description}</p>
              </div>

              {/* Action and social interactions */}
              <div className="border-t border-cream-dark/20 pt-4 flex items-center justify-between mt-auto">
                <button
                  onClick={() => setActiveViewerProduct(product)}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở dự án
                </button>

                <div className="flex items-center gap-2">
                  {/* Likes counter button */}
                  <button
                    onClick={(e) => handleLike(product, e)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title="Yêu thích sản phẩm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                    <span className="font-semibold">{product.likes}</span>
                  </button>

                  {/* Teacher or Student specific actions */}
                  {role === 'TEACHER' && (
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Sửa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Viewer Screen Modal */}
      <AnimatePresence>
        {activeViewerProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl-4 max-w-xl w-full overflow-hidden shadow-2xl border border-cream-dark/30 flex flex-col max-h-[90vh]"
            >
              {/* Cover Photo */}
              <div className="relative h-56 bg-gray-100 overflow-hidden shrink-0">
                <img
                  src={activeViewerProduct.thumbnail}
                  alt={activeViewerProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <button
                  onClick={() => setActiveViewerProduct(null)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-full text-sm font-bold transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-5 left-5 text-white">
                  <span className="text-[10px] font-bold bg-white/25 backdrop-blur-md px-2.5 py-1 rounded-full uppercase">
                    {activeViewerProduct.type}
                  </span>
                  <h3 className="text-base font-bold font-display mt-2">{activeViewerProduct.title}</h3>
                </div>
              </div>

              {/* Content body */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="p-3 bg-cream-light rounded-xl border border-cream-dark/20 text-xs text-gray-500">
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">Tác giả biên soạn:</span>
                  <p className="text-sm font-semibold text-gray-700 mt-1">{activeViewerProduct.author}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-700">Ý tưởng & Mô tả dự án:</span>
                  <p className="text-xs text-gray-600 leading-relaxed bg-cream-light/30 p-4 border border-cream-dark/10 rounded-xl">
                    {activeViewerProduct.description}
                  </p>
                </div>

                {/* Simulated Interactive Preview Box */}
                <div className="h-28 bg-[#2F7668]/5 rounded-xl border border-dashed border-[#2F7668]/25 flex flex-col items-center justify-center text-center p-4 space-y-1">
                  <Sparkles className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-xs font-bold text-primary">Sản phẩm đang được lưu trữ trên Cloud Storage của Thành Tín AI</span>
                  <span className="text-[10px] text-gray-400">Trình phát bài học ảo đã sẵn sàng liên kết dữ liệu.</span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-cream-light p-4 border-t border-cream-dark/25 flex justify-between items-center shrink-0">
                <button
                  onClick={() => alert('Dự án đã được lưu vào mục yêu thích của hệ thống.')}
                  className="text-xs text-[#E07A5F] hover:underline font-bold flex items-center gap-1"
                >
                  ❤️ Nhận xét & Đánh giá dự án
                </button>
                <button
                  onClick={() => setActiveViewerProduct(null)}
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
