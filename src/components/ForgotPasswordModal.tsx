/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  triggerToast
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập Email của bạn');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Định dạng Email không đúng');
      return;
    }

    // Simulate recovery
    setIsSuccess(true);
    triggerToast('Yêu cầu khôi phục mật khẩu đã được ghi nhận');
    
    // Auto-close after 3 seconds or on confirm
    setTimeout(() => {
      setIsSuccess(false);
      setEmail('');
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isSuccess) onClose();
            }}
            className="fixed inset-0 bg-[#2D2D2D]/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white border border-[#E5E1D8] w-full max-w-md rounded-[24px] shadow-2xl p-6 z-10 text-[#2D2D2D]"
          >
            {/* Close Button */}
            {!isSuccess && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 hover:bg-[#F7F3EC] text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}

            {/* Content Switcher */}
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#2F7668]/10 text-[#2F7668] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#2D2D2D]">Khôi Phục Mật Khẩu</h3>
                    <p className="text-[10px] text-gray-400 font-semibold leading-none mt-0.5">THÀNH TÍN - LMS</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  Nhập địa chỉ email đăng ký của bạn. Hệ thống sẽ gửi hướng dẫn khôi phục mật khẩu trong vòng vài phút.
                </p>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Email khôi phục</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="username@gmail.com"
                      className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2.5 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-[#F7F3EC] hover:bg-[#E5E1D8] text-gray-600 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2F7668] hover:bg-[#265D52] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-xs cursor-pointer"
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-gray-800">Yêu cầu đã được ghi nhận</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Yêu cầu khôi phục mật khẩu đã được gửi đến email <span className="font-semibold text-[#2D2D2D]">{email}</span>. Vui lòng kiểm tra hộp thư đến.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                    onClose();
                  }}
                  className="bg-[#2F7668] hover:bg-[#265D52] text-white font-bold py-2 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
