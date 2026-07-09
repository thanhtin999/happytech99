/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; username: string; role: 'TEACHER' | 'STUDENT'; avatar: string }) => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
  triggerToast: (msg: string) => void;
}

export default function LoginPage({
  onLoginSuccess,
  onOpenRegister,
  onOpenForgotPassword,
  triggerToast
}: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations with exact error messages requested
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    // Load registered accounts from localStorage
    const savedAccountsStr = localStorage.getItem('users');
    let allAccounts = [];
    try {
      allAccounts = savedAccountsStr ? JSON.parse(savedAccountsStr) : [];
    } catch (err) {
      console.error(err);
    }

    // Default admin and sample users if not already in state
    const defaultAccounts = [
      {
        id: 'admin-thanhtin',
        username: 'ThanhtinAI',
        password: 'AI2026$$$',
        name: 'Dương Thành Tín',
        fullName: 'Dương Thành Tín',
        role: 'teacher',
        status: 'active',
        className: '',
        permissions: 'all',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      },
      {
        id: 'ACC_STUDENT_1',
        username: 'hoangminh',
        password: '123456',
        name: 'Nguyễn Hoàng Minh',
        fullName: 'Nguyễn Hoàng Minh',
        role: 'student',
        status: 'active',
        className: '6A',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
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
        }
      },
      {
        id: 'ACC_STUDENT_2',
        username: 'maianh',
        password: '123456',
        name: 'Trần Mai Anh',
        fullName: 'Trần Mai Anh',
        role: 'student',
        status: 'suspended',
        className: '6A',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mai',
        permissions: {
          home: true,
          curriculum: true,
          resources: true,
          reading: true,
          quiz: true,
          assignments: true,
          exams: true,
          questionBank: true,
          products: true,
          aiAssistant: true,
          studentManagement: false,
          accountManagement: false
        }
      }
    ];

    if (allAccounts.length === 0) {
      allAccounts = defaultAccounts;
      localStorage.setItem('users', JSON.stringify(defaultAccounts));
    } else {
      // Ensure ThanhtinAI always exists (Requirement 10)
      const adminExists = allAccounts.some(a => (a.username || '').trim().toLowerCase() === 'thanhtinai');
      if (!adminExists) {
        allAccounts.push(defaultAccounts[0]);
        localStorage.setItem('users', JSON.stringify(allAccounts));
      }
    }

    // Normalize all accounts as per Requirement 7
    allAccounts = allAccounts.map((acc: any) => {
      if (acc.loginName && !acc.username) {
        acc.username = acc.loginName;
      }
      if (acc.accountName && !acc.username) {
        acc.username = acc.accountName;
      }
      if (acc.pass && !acc.password) {
        acc.password = acc.pass;
      }
      if (acc.rawPassword && !acc.password) {
        acc.password = acc.rawPassword;
      }

      let rawStatus = String(acc.status || '').trim();
      let status = 'active';
      if (rawStatus) {
        const lowerStatus = rawStatus.toLowerCase();
        if (
          lowerStatus === 'suspended' ||
          lowerStatus === 'inactive' ||
          lowerStatus === 'tạm khóa' ||
          lowerStatus === 'tam_khoa' ||
          lowerStatus === 'locked'
        ) {
          status = 'suspended';
        }
      }

      let rawRole = String(acc.role || '').trim();
      let role = 'student';
      if (rawRole) {
        const lowerRole = rawRole.toLowerCase();
        if (lowerRole === 'teacher' || lowerRole === 'admin' || lowerRole === 'giáo viên') {
          role = 'teacher';
        }
      }

      return {
        ...acc,
        username: (acc.username || '').trim(),
        password: (acc.password || '').trim(),
        fullName: acc.fullName || acc.name || '',
        name: acc.name || acc.fullName || '',
        status,
        role
      };
    });
    // Write back normalized accounts
    localStorage.setItem('users', JSON.stringify(allAccounts));

    // Normalization helper for accented Vietnamese characters and spacing
    const normalizeString = (str: string) => {
      return String(str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]/g, '')
        .trim();
    };

    const inputNormalized = normalizeString(username);

    // Find matched account using case-insensitive lookup, with robust fallback to normalized username or full name
    const matchedAccount = allAccounts.find(user => {
      const uUsername = String(user.username || user.loginName || user.accountName || "").trim().toLowerCase();
      const uFullName = String(user.fullName || user.name || "").trim().toLowerCase();
      
      const matchExact = uUsername === username.trim().toLowerCase();
      const matchNormalizedUsername = normalizeString(uUsername) === inputNormalized;
      const matchNormalizedFullName = normalizeString(uFullName) === inputNormalized;
      
      return matchExact || matchNormalizedUsername || matchNormalizedFullName;
    });

    // Add debug console logs as required in Requirement 5
    console.log("Danh sách users từ localStorage:", allAccounts);
    console.log("Tên đăng nhập nhập vào:", username);
    console.log("Mật khẩu nhập vào:", password);
    console.log("Tài khoản tìm thấy:", matchedAccount);

    if (!matchedAccount) {
      setErrorMsg('Tên đăng nhập không chính xác hoặc chưa được đăng ký.');
      return;
    }

    // Validate password
    const dbPassword = String(matchedAccount.password || matchedAccount.pass || matchedAccount.rawPassword || "").trim();
    if (dbPassword !== password.trim()) {
      setErrorMsg('Mật khẩu nhập vào chưa chính xác. Vui lòng kiểm tra lại.');
      return;
    }

    // Normalize role & status
    const roleVal = (matchedAccount.role || 'student').toLowerCase();
    const statusVal = (matchedAccount.status || 'active').toLowerCase();

    // Validate account status
    const isSuspended = [
      "suspended",
      "inactive",
      "tạm khóa",
      "tam_khoa",
      "locked"
    ].includes(statusVal);

    if (isSuspended) {
      setErrorMsg('Tài khoản của em đang bị tạm khóa. Vui lòng liên hệ giáo viên.');
      return;
    }

    const roleUpper = (roleVal === 'teacher' || roleVal === 'admin') ? 'TEACHER' : 'STUDENT';

    // Success! Prepare user details
    const sessionUser = {
      name: matchedAccount.name || matchedAccount.fullName || matchedAccount.username,
      username: matchedAccount.username,
      role: roleUpper as 'TEACHER' | 'STUDENT',
      avatar: matchedAccount.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    };

    // Save session
    localStorage.setItem('tt_current_user', JSON.stringify(sessionUser));
    localStorage.setItem('tt_remember_user', JSON.stringify(sessionUser));

    triggerToast(`Đăng nhập thành công! Chào mừng ${sessionUser.name}`);
    onLoginSuccess(sessionUser);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F3EC] p-4 md:p-8 font-sans text-[#2D2D2D]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-[28px] border border-[#E5E1D8]/80 shadow-lg p-8 space-y-6"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-[#2F7668] rounded-2xl flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl text-[#2F7668] tracking-tight">Thành Tín - LMS</h1>
            <p className="text-xs text-gray-500 font-medium">Hệ thống Giáo án điện tử & LMS kết hợp</p>
          </div>
        </div>

        {/* Error Message banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs flex items-center gap-2 font-medium leading-relaxed"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Tên đăng nhập:</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập tên đăng nhập của bạn"
                className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-[#2D2D2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Mật khẩu:</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập mật khẩu"
                className="w-full bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-[#2D2D2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#2D2D2D] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            className="w-full bg-[#2F7668] hover:bg-[#205248] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>

        {/* Links section */}
        <div className="border-t border-[#E5E1D8]/40 pt-4 flex flex-col items-center gap-3 text-xs">
          <button
            id="login-forgot-btn"
            type="button"
            onClick={onOpenForgotPassword}
            className="text-gray-400 hover:text-[#2D2D2D] font-semibold transition-colors cursor-pointer"
          >
            Quên mật khẩu?
          </button>
          <p className="text-[11px] text-gray-500 font-medium text-center">
            Học sinh vui lòng liên hệ giáo viên để được cấp tài khoản.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
