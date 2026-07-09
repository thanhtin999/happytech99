/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({ isOpen, title, onConfirm, onClose }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl-3 max-w-sm w-full p-6 shadow-2xl border border-cream-dark text-center space-y-4"
        >
          <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-800 font-bold font-display text-base">Xác nhận xóa dữ liệu?</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bạn có chắc chắn muốn xóa mục <span className="font-semibold text-gray-700">"{title}"</span>? Thao tác này không thể hoàn tác sau khi thực hiện.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Đồng ý xóa
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
