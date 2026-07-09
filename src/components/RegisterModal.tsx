/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, User, Lock, GraduationCap, Building2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerToast: (msg: string) => void;
  onRegisterSuccess?: (newAccount: any) => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  triggerToast,
  onRegisterSuccess
}: RegisterModalProps) {
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên');
      return;
    }
    if (!className.trim()) {
      setErrorMsg('Vui lòng nhập Lớp');
      return;
    }
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập Tên đăng nhập');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập Mật khẩu');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu không trùng khớp');
      return;
    }

    // Load registered accounts from localStorage
    const savedAccountsStr = localStorage.getItem('users');
    let accounts: any[] = [];
    try {
      accounts = savedAccountsStr ? JSON.parse(savedAccountsStr) : [];
    } catch (err) {
      console.error(err);
    }

    // Check if username already exists
    const usernameExists = accounts.some(
      (u: any) => (u.username || '').toLowerCase() === username.trim().toLowerCase()
    );
    if (usernameExists) {
      setErrorMsg('Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác.');
      return;
    }

    // Build student user object
    const seed = fullName.replace(/\s+/g, '');
    const newAccount = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      name: fullName.trim(), // for backup compatibility
      className: className.trim(),
      username: username.trim(),
      password: password,
      role: 'student',
      status: 'pending',
      createdAt: new Date().toISOString(),
      permissions: {
        home: true,
        curriculum: true,
        resources: true,
        reading: true,
        quiz: true,
        assignments: true,
        exams: true,
        products: true,
        profile: true
      },
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || 'random'}`
    };

    // Save back to localStorage
    accounts.push(newAccount);
    localStorage.setItem('users', JSON.stringify(accounts));

    if (onRegisterSuccess) {
      onRegisterSuccess(newAccount);
    }

    // Display requested success toast
    triggerToast('Đăng ký thành công. Tài khoản đang chờ giáo viên kích hoạt.');
    
    // Clear inputs and close
    setFullName('');
    setClassName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2D2D2D]/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white border border-[#E5E1D8] w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-[#2D2D2D]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E5E1D8] bg-[#F7F3EC]/40 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#2F7668] text-white rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#2D2D2D]">Đăng Ký Tài Khoản Học Sinh</h3>
                  <p className="text-[10px] text-gray-400 font-semibold leading-none mt-0.5">THÀNH TÍN - LMS</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#F7F3EC] text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Form Scroll Container */}
            <form onSubmit={handleRegister} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Full name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Họ và tên học sinh *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="register-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all text-[#2D2D2D]"
                  />
                </div>
              </div>

              {/* Class (Lớp) */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Lớp học *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    id="register-class"
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="E.g., 6A"
                    className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all text-[#2D2D2D]"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Tên đăng nhập *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên đăng nhập viết liền"
                    className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all text-[#2D2D2D]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Mật khẩu *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2 pl-9 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all text-[#2D2D2D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Xác nhận mật khẩu *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-confirmpassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận lại mật khẩu"
                    className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all text-[#2D2D2D]"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                id="register-submit-btn"
                type="submit"
                className="w-full bg-[#2F7668] hover:bg-[#205248] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                Gửi đăng ký
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
