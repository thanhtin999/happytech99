/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Award,
  TrendingUp,
  CheckCircle,
  Calendar,
  Lock,
  Unlock,
  Settings,
  BookOpen,
  Library,
  BookMarked,
  CheckSquare,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { Account, Student } from '../types';

interface AccountsPageProps {
  accounts: Account[];
  onAdd: () => void;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  role: string;
  currentUser?: { name: string; username?: string; email?: string; role: string; avatar: string } | null;
  students?: Student[];
  onUpdateStatus?: (id: string, newStatus: string) => void;
  onUpdatePermissions?: (id: string, permissions: any) => void;
  triggerToast?: (msg: string) => void;
  onRefresh?: () => void;
  setAccounts?: React.Dispatch<React.SetStateAction<Account[]>>;
}

export default function AccountsPage({
  accounts,
  onAdd,
  onEdit,
  onDelete,
  role,
  currentUser,
  students = [],
  onUpdateStatus,
  onUpdatePermissions,
  triggerToast = () => {},
  onRefresh,
  setAccounts
}: AccountsPageProps) {
  const [activeTab, setActiveTab] = useState<'lists' | 'permissions'>('lists');
  const [listSubTab, setListSubTab] = useState<'students' | 'teachers'>('students');
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  // Modal State for custom create/edit account
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalGrade, setModalGrade] = useState('Lớp 6');
  const [modalUsername, setModalUsername] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalConfirmPassword, setModalConfirmPassword] = useState('');
  const [modalStatus, setModalStatus] = useState('Đang hoạt động');
  const [modalPermissions, setModalPermissions] = useState<any>({
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
  });

  // Normalize/Accent-stripping generator for username
  const handleAutoGenerateUsername = () => {
    if (!modalName.trim()) {
      triggerToast('Vui lòng nhập họ và tên trước khi tạo nhanh tên đăng nhập!');
      return;
    }
    const clean = modalName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '');
    setModalUsername(clean);
    triggerToast('Đã tạo nhanh tên đăng nhập gợi ý!');
  };

  const handleAutoGeneratePassword = () => {
    const randomPw = 'HS' + Math.floor(100000 + Math.random() * 900000);
    setModalPassword(randomPw);
    setModalConfirmPassword(randomPw);
    triggerToast(`Đã tạo nhanh mật khẩu ngẫu nhiên: ${randomPw}`);
  };

  // If student: show their personal statistics and badges profile
  if (role === 'STUDENT') {
    const studentInfo = students.find(
      s => s.name.trim().toLowerCase() === currentUser?.name.trim().toLowerCase()
    ) || {
      id: 'HS001',
      name: currentUser?.name || 'Nguyễn Hoàng Minh',
      grade: 'Lớp 6',
      progress: 85,
      gpa: 9.2,
      badges: ['Chăm chỉ', 'Sáng tạo', 'Tự học xuất sắc'],
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    return (
      <div id="accounts-page" className="space-y-6 text-[#2D2D2D]">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">Hồ Sơ Của Em</h2>
          <p className="text-xs text-gray-500">Thông tin cá nhân, kết quả học tập và huy hiệu thành tích của em trên hệ thống.</p>
        </div>

        {/* Profile Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left card: Main Avatar & details */}
          <div className="lg:col-span-4 bg-white rounded-[24px] border border-cream-dark/40 shadow-sm p-6 text-center flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative w-28 h-28 mx-auto">
                <img
                  src={studentInfo.avatar}
                  alt={studentInfo.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#2F7668]/20 shadow-md"
                />
                <span className="absolute bottom-1 right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full" title="Đang trực tuyến"></span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800">{studentInfo.name}</h3>
                <p className="text-xs text-gray-400 font-semibold">Tên đăng nhập: <span className="font-mono text-[#2F7668]">{currentUser?.username || 'hocsinh'}</span></p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-1 bg-[#2F7668]/10 text-[#2F7668] rounded-full uppercase tracking-wider">
                  Học sinh
                </span>
              </div>

              <div className="border-t border-cream-dark/20 pt-4 space-y-2.5 text-left text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{currentUser?.email || 'hocsinh@thanhtinlms.vn'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Lớp học: {studentInfo.grade}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-cream-dark/20 pt-4 text-center">
              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Tài khoản đã được kích hoạt
              </span>
            </div>
          </div>

          {/* Right card: Learning Stats & Badges */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stat 1: GPA */}
              <div className="bg-white p-5 rounded-2xl border border-cream-dark/40 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{studentInfo.gpa}</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Điểm trung bình</p>
                </div>
              </div>

              {/* Stat 2: Progress */}
              <div className="bg-white p-5 rounded-2xl border border-cream-dark/40 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{studentInfo.progress}%</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Hoàn thành bài học</p>
                </div>
              </div>

              {/* Stat 3: Badge counts */}
              <div className="bg-white p-5 rounded-2xl border border-cream-dark/40 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2F7668]/10 flex items-center justify-center text-[#2F7668] shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{studentInfo.badges.length}</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Huy hiệu thành tích</p>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="bg-white p-6 rounded-[24px] border border-cream-dark/40 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-gray-800 font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2F7668]" /> Tiến độ học tập của em
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-gray-600 font-medium mb-1">
                    <span>Chương trình số hóa Ngữ Văn & Kỹ năng số</span>
                    <span>{studentInfo.progress}%</span>
                  </div>
                  <div className="w-full bg-cream-dark/20 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#2F7668] h-full rounded-full transition-all duration-500" style={{ width: `${studentInfo.progress}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-600 font-medium mb-1">
                    <span>Thực hành đọc và tự học Quiz trắc nghiệm</span>
                    <span>90%</span>
                  </div>
                  <div className="w-full bg-cream-dark/20 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-600 font-medium mb-1">
                    <span>Bài tập thực hành sáng tạo học đường</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-cream-dark/20 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges container */}
            <div className="bg-white p-6 rounded-[24px] border border-cream-dark/40 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-gray-800 font-display flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#2F7668]" /> Huy hiệu vinh danh đạt được
              </h4>
              <div className="flex flex-wrap gap-2">
                {studentInfo.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    👑 {badge}
                  </span>
                ))}
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  ⚡ Thành viên tích cực
                </span>
                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  🎨 Kỹ năng số 4.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Mode: Multi-tab layout
  // Tab 1: Danh sách tài khoản (separating Pending, Active, Teacher lists)
  // Tab 2: Phân quyền học sinh (matrix control panel)

  // Filtering Accounts case-insensitively into 2 groups
  const studentsGroup = accounts.filter(acc => {
    const r = (acc.role || '').toLowerCase();
    return r === 'student';
  });

  const teachersGroup = accounts.filter(acc => {
    const r = (acc.role || '').toLowerCase();
    return r === 'teacher' || r === 'admin';
  });

  // Action helpers to handle status changes gracefully
  const handleToggleStatus = (id: string, currentStatus?: string) => {
    const s = (currentStatus || 'active').trim().toLowerCase();
    const newStatus = s === 'active' ? 'suspended' : 'active';
    
    const savedAccountsStr = localStorage.getItem('users') || '[]';
    try {
      const list = JSON.parse(savedAccountsStr);
      const updated = list.map((a: any) => a.id === id ? { ...a, status: newStatus } : a);
      localStorage.setItem('users', JSON.stringify(updated));
      if (setAccounts) {
        setAccounts(updated);
      }
      triggerToast(newStatus === 'active' ? 'Đã kích hoạt tài khoản hoạt động.' : 'Đã tạm khóa tài khoản học sinh.');
    } catch (e) {
      console.error(e);
      triggerToast('Có lỗi xảy ra khi đổi trạng thái.');
    }
  };

  const handleCopyCredentials = (acc: Account) => {
    const loginUrl = window.location.origin;
    const text = `THÔNG TIN TÀI KHOẢN HỌC SINH\nHọ tên: ${acc.name || acc.fullName || ''}\nLớp: ${acc.className || ''}\nTên đăng nhập: ${acc.username || ''}\nMật khẩu: ${acc.password || '123456'}\nLink đăng nhập: ${loginUrl}`;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        triggerToast('Đã sao chép thông tin tài khoản học sinh vào clipboard!');
      })
      .catch((err) => {
        console.error(err);
        triggerToast('Lỗi khi sao chép thông tin.');
      });
  };

  const mapAliasToKey = (key: string): string => {
    switch (key) {
      case 'Trang chủ': return 'home';
      case 'Chương trình học': return 'curriculum';
      case 'Kho học liệu': return 'resources';
      case 'Thực hành đọc': return 'reading';
      case 'Đề Quiz tự học': return 'quiz';
      case 'Giao bài tập': return 'assignments';
      case 'Đề kiểm tra': return 'exams';
      case 'Ngân hàng câu hỏi': return 'questionBank';
      case 'Sản phẩm sáng tạo': return 'products';
      case 'Trợ lý AI': return 'aiAssistant';
      default: return key;
    }
  };

  const togglePermission = (accId: string, itemKey: string) => {
    const account = accounts.find(a => a.id === accId);
    if (!account) return;

    let perms: any = {
      home: true,
      curriculum: true,
      resources: true,
      reading: true,
      quiz: true,
      assignments: true,
      exams: true,
      questionBank: true,
      products: true,
      aiAssistant: true
    };

    if (account.permissions) {
      try {
        perms = typeof account.permissions === 'string'
          ? JSON.parse(account.permissions)
          : account.permissions;
      } catch (e) {
        console.error(perms);
      }
    }

    const lowercaseKey = mapAliasToKey(itemKey);
    const isNowAllowed = !(perms[itemKey] !== false && perms[lowercaseKey] !== false);
    const updatedPerms = {
      ...perms,
      [itemKey]: isNowAllowed,
      [lowercaseKey]: isNowAllowed
    };

    const savedAccountsStr = localStorage.getItem('users') || '[]';
    try {
      const list = JSON.parse(savedAccountsStr);
      const updated = list.map((a: any) => a.id === accId ? { ...a, permissions: updatedPerms } : a);
      localStorage.setItem('users', JSON.stringify(updated));
      if (setAccounts) {
        setAccounts(updated);
      }
    } catch (e) {
      console.error(e);
    }

    triggerToast(`Đã ${isNowAllowed ? 'bật' : 'tắt'} quyền truy cập "${itemKey}" cho ${account.name || account.fullName}.`);
  };

  // Safe checks for permissions checkbox state
  const hasPermission = (account: Account, itemKey: string): boolean => {
    if (!account.permissions) return true; // Default is true if no settings
    try {
      const perms = typeof account.permissions === 'string'
        ? JSON.parse(account.permissions)
        : account.permissions;
      const lowercaseKey = mapAliasToKey(itemKey);
      return perms[itemKey] !== false && perms[lowercaseKey] !== false;
    } catch (e) {
      return true;
    }
  };

  const openCreateModal = () => {
    setEditingAccount(null);
    setModalName('');
    setModalGrade('Lớp 6');
    setModalUsername('');
    setModalPassword('');
    setModalConfirmPassword('');
    setModalStatus('Đang hoạt động');
    setModalPermissions({
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
    });
    setIsModalOpen(true);
  };

  const openEditModal = (acc: Account) => {
    setEditingAccount(acc);
    setModalName(acc.name || acc.fullName || '');
    setModalGrade(acc.className || 'Lớp 6');
    setModalUsername(acc.username || '');
    setModalPassword(acc.password || '');
    setModalConfirmPassword(acc.password || '');
    
    const s = (acc.status || '').toLowerCase();
    setModalStatus((s === 'active' || s === 'đang hoạt động' || s === 'đã kích hoạt') ? 'Đang hoạt động' : 'Tạm khóa');
    
    let perms: any = {
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
    };
    if (acc.permissions) {
      try {
        perms = typeof acc.permissions === 'string' ? JSON.parse(acc.permissions) : acc.permissions;
      } catch (e) {
        console.error(e);
      }
    }
    setModalPermissions(perms);
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) {
      triggerToast('Vui lòng nhập họ và tên.');
      return;
    }
    if (!modalUsername.trim()) {
      triggerToast('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (!modalPassword.trim()) {
      triggerToast('Vui lòng nhập mật khẩu.');
      return;
    }
    if (modalPassword !== modalConfirmPassword) {
      triggerToast('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Check uniqueness of username
    const existingUsersStr = localStorage.getItem('users') || '[]';
    let usersList: Account[] = [];
    try {
      usersList = JSON.parse(existingUsersStr);
    } catch (err) {
      usersList = [];
    }

    const isTaken = usersList.some(
      u => (u.username || '').trim().toLowerCase() === modalUsername.trim().toLowerCase() && (!editingAccount || u.id !== editingAccount.id)
    );
    if (isTaken) {
      triggerToast('Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác.');
      return;
    }

    let updatedList: Account[] = [];
    if (editingAccount) {
      updatedList = usersList.map(u => {
        if (u.id === editingAccount.id) {
          return {
            ...u,
            name: modalName.trim(),
            fullName: modalName.trim(),
            className: modalGrade.trim(),
            username: modalUsername.trim(),
            password: modalPassword.trim(),
            status: modalStatus === 'Đang hoạt động' ? 'active' : 'suspended',
            permissions: {
              home: modalPermissions.home !== false,
              curriculum: modalPermissions.curriculum !== false,
              resources: modalPermissions.resources !== false,
              reading: modalPermissions.reading !== false,
              quiz: modalPermissions.quiz !== false,
              assignments: modalPermissions.assignments !== false,
              exams: modalPermissions.exams !== false,
              questionBank: modalPermissions.questionBank !== false,
              products: modalPermissions.products !== false,
              aiAssistant: modalPermissions.aiAssistant !== false,
              studentManagement: false,
              accountManagement: false
            }
          };
        }
        return u;
      });
      triggerToast('Đã cập nhật tài khoản học sinh thành công.');
    } else {
      const newId = Date.now().toString();
      const newAcc: Account = {
        id: newId,
        name: modalName.trim(),
        fullName: modalName.trim(),
        className: modalGrade.trim(),
        username: modalUsername.trim(),
        password: modalPassword.trim(),
        role: 'student',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        createdBy: 'teacher',
        createdAt: new Date().toISOString(),
        permissions: {
          home: modalPermissions.home !== false,
          curriculum: modalPermissions.curriculum !== false,
          resources: modalPermissions.resources !== false,
          reading: modalPermissions.reading !== false,
          quiz: modalPermissions.quiz !== false,
          assignments: modalPermissions.assignments !== false,
          exams: modalPermissions.exams !== false,
          questionBank: modalPermissions.questionBank !== false,
          products: modalPermissions.products !== false,
          aiAssistant: modalPermissions.aiAssistant !== false,
          studentManagement: false,
          accountManagement: false
        }
      };
      updatedList = [...usersList, newAcc];
      triggerToast('Đã tạo tài khoản học sinh thành công.');
    }

    localStorage.setItem('users', JSON.stringify(updatedList));
    if (setAccounts) {
      setAccounts(updatedList);
    }
    setIsModalOpen(false);
  };

  const handleDeleteLocalAccount = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
      const existingUsersStr = localStorage.getItem('users') || '[]';
      let usersList: Account[] = [];
      try {
        usersList = JSON.parse(existingUsersStr);
      } catch (e) {
        usersList = [];
      }
      const updatedList = usersList.filter(u => u.id !== id);
      localStorage.setItem('users', JSON.stringify(updatedList));
      if (setAccounts) {
        setAccounts(updatedList);
      }
      triggerToast('Đã xóa tài khoản thành công.');
    }
  };

  const getStatusLabel = (status?: string) => {
    const s = (status || 'active').trim().toLowerCase();
    if (s === 'active') {
      return { text: 'Đang hoạt động', colorClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
    }
    if (s === 'suspended') {
      return { text: 'Tạm khóa', colorClass: 'bg-red-50 text-red-600 border border-red-100' };
    }
    return { text: 'Tạm khóa', colorClass: 'bg-red-50 text-red-600 border border-red-100' };
  };

  return (
    <div id="accounts-page" className="space-y-6 text-[#2D2D2D]">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2F7668] font-display">Phân Quyền & Quản Lý Tài Khoản</h2>
          <p className="text-xs text-gray-500">Tạo tài khoản học sinh, quản lý trạng thái hoạt động và phân quyền truy cập nội dung học tập.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            className="self-start md:self-auto bg-white hover:bg-[#F7F3EC] text-[#2F7668] border border-[#2F7668]/30 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới danh sách
          </button>
          <button
            onClick={() => setIsInspectOpen(true)}
            className="self-start md:self-auto bg-[#F4A261] hover:bg-[#E76F51] text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            🔍 Kiểm tra dữ liệu tài khoản
          </button>
          <button
            onClick={openCreateModal}
            className="self-start md:self-auto bg-[#2F7668] hover:bg-[#205248] text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo tài khoản học sinh
          </button>
        </div>
      </div>

      {/* Tabs list switchers */}
      <div className="flex border-b border-cream-dark/30 gap-2">
        <button
          onClick={() => setActiveTab('lists')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'lists'
              ? 'border-[#2F7668] text-[#2F7668]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <UserCog className="w-4 h-4" /> Danh sách tài khoản
          </span>
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'permissions'
              ? 'border-[#2F7668] text-[#2F7668]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Phân quyền học sinh
          </span>
        </button>
      </div>

      {/* TAB 1: ACCOUNTS LISTS */}
      {activeTab === 'lists' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Sub-tabs inside lists */}
          <div className="flex bg-[#F7F3EC] p-1 rounded-xl border border-cream-dark/20 w-fit gap-1 text-xs">
            <button
              onClick={() => setListSubTab('students')}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                listSubTab === 'students'
                  ? 'bg-[#2F7668] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Học sinh ({studentsGroup.length})
            </button>
            <button
              onClick={() => setListSubTab('teachers')}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                listSubTab === 'teachers'
                  ? 'bg-[#2F7668] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Giáo viên / Quản trị ({teachersGroup.length})
            </button>
          </div>

          {/* NHÓM 1: Danh sách học sinh */}
          {listSubTab === 'students' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F7668] shrink-0"></span>
                <h3 className="font-bold text-sm text-gray-800 font-display">
                  Danh sách tài khoản học sinh ({studentsGroup.length})
                </h3>
              </div>

              {studentsGroup.length === 0 ? (
                <div className="bg-white border border-[#E5E1D8]/80 rounded-2xl p-6 text-center text-xs text-gray-400 font-medium">
                  Chưa có tài khoản học sinh nào. Hãy bấm "Tạo tài khoản học sinh" ở góc trên để tạo mới.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentsGroup.map(acc => {
                    const statusInfo = getStatusLabel(acc.status);
                    const isSuspended = (acc.status || '').toLowerCase() === 'suspended' || (acc.status || '').toLowerCase() === 'tạm khóa';
                    return (
                      <div key={acc.id} className="bg-white rounded-2xl border border-cream-dark/50 shadow-sm p-4 flex flex-col justify-between space-y-4">
                        <div className="flex items-center gap-3">
                          <img src={acc.avatar} alt={acc.name} className="w-11 h-11 rounded-full object-cover border-2 border-cream-dark/40" />
                          <div>
                            <h4 className="font-bold text-gray-800 text-xs">{acc.name || acc.fullName}</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">Tên đăng nhập: {acc.username}</p>
                            <span className="inline-block mt-1.5 text-[9px] font-extrabold px-2 py-0.5 bg-cream text-gray-600 border border-cream-dark/30 rounded">
                              Lớp {acc.className || 'Chưa xếp'} • HỌC SINH
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-cream-dark/15 pt-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shrink-0 ${statusInfo.colorClass}`}>
                              {isSuspended ? <Lock className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                              {statusInfo.text}
                            </span>
                            <span className="text-[9px] text-gray-400 font-medium">MK: <span className="font-mono text-[#2F7668]">{acc.password}</span></span>
                          </div>

                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <button
                              onClick={() => handleToggleStatus(acc.id, acc.status)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer text-white ${
                                isSuspended ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'
                              }`}
                              title={isSuspended ? 'Mở khóa tài khoản' : 'Tạm khóa tài khoản'}
                            >
                              {isSuspended ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                              {isSuspended ? 'Mở khóa' : 'Tạm khóa'}
                            </button>
                            <button
                              onClick={() => openEditModal(acc)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors cursor-pointer"
                              title="Sửa thông tin"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab('permissions');
                                triggerToast(`Hãy tìm học sinh "${acc.name || acc.fullName}" bên bảng Phân Quyền!`);
                              }}
                              className="p-1.5 text-[#2F7668] hover:bg-[#2F7668]/10 border border-[#2F7668]/20 rounded-lg transition-colors cursor-pointer"
                              title="Phân quyền chi tiết"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCopyCredentials(acc)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 border border-purple-100 rounded-lg transition-colors cursor-pointer"
                              title="Sao chép tài khoản học sinh"
                            >
                              <RefreshCw className="w-3.5 h-3.5 rotate-45" />
                            </button>
                            <button
                              onClick={() => handleDeleteLocalAccount(acc.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* NHÓM 2: Danh sách giáo viên / quản trị */}
          {listSubTab === 'teachers' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                <h3 className="font-bold text-sm text-gray-800 font-display">
                  Giáo viên và Quản trị hệ thống ({teachersGroup.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachersGroup.map(acc => (
                  <div key={acc.id} className="bg-white rounded-2xl border border-cream-dark/50 shadow-sm p-4 flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar} alt={acc.name} className="w-11 h-11 rounded-full object-cover border-2 border-blue-200" />
                      <div>
                        <h4 className="font-bold text-gray-800 text-xs">{acc.name || acc.fullName}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Tài khoản: {acc.username}</p>
                        <span className="inline-block mt-1.5 text-[9px] font-extrabold px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded uppercase">
                          {acc.username === 'ThanhtinAI' ? 'Quản Trị Tối Cao' : 'Giáo viên'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-cream-dark/15 pt-3.5 flex items-center justify-between text-xs">
                      <span className="text-[9px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Đang hoạt động
                      </span>
                      <span className="text-gray-400 font-mono text-[10px]">Quyền quản trị</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: STUDENT PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-3xl border border-cream-dark/50 shadow-sm p-6 overflow-hidden animate-fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-dark/15 pb-4">
            <div>
              <h3 className="font-bold text-sm text-gray-800 font-display flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-[#2F7668]" /> Bảng phân quyền chi tiết của học sinh
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 font-semibold leading-relaxed">
                Tích chọn để bật hoặc bỏ chọn để tắt quyền truy cập chức năng trên thanh sidebar của từng học sinh.
              </p>
            </div>
            <div className="text-[10px] bg-[#2F7668]/10 text-[#2F7668] px-3 py-1 rounded-full font-bold self-start sm:self-auto">
              Tự động lưu & áp dụng tức thì
            </div>
          </div>

          {/* Table container with responsive overflow */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cream-dark/30 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 min-w-[150px]">Học sinh</th>
                  <th className="py-3 px-3">Lớp</th>
                  <th className="py-3 px-3 text-center">Trang chủ</th>
                  <th className="py-3 px-3 text-center">Chương trình</th>
                  <th className="py-3 px-3 text-center">Học liệu</th>
                  <th className="py-3 px-3 text-center">Luyện đọc</th>
                  <th className="py-3 px-3 text-center">Quiz tự học</th>
                  <th className="py-3 px-3 text-center">Bài tập</th>
                  <th className="py-3 px-3 text-center">Kiểm tra</th>
                  <th className="py-3 px-3 text-center">Sáng tạo</th>
                  <th className="py-3 px-3 text-center">Trợ lý AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark/15 font-semibold text-gray-700">
                {studentsGroup.map(acc => (
                  <tr key={acc.id} className="hover:bg-[#F7F3EC]/30 transition-colors">
                    {/* User profile details */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-full object-cover border border-[#2F7668]/15" />
                      <div>
                        <span className="block font-bold text-gray-800 text-[11px] leading-tight">{acc.name || acc.fullName}</span>
                        <span className="text-[9px] text-gray-400 font-mono block">@{acc.username}</span>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-cream rounded text-[10px] font-bold">
                        {acc.className || '6A'}
                      </span>
                    </td>

                    {/* Checkbox columns */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Trang chủ')}
                        onChange={() => togglePermission(acc.id, 'Trang chủ')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Chương trình học')}
                        onChange={() => togglePermission(acc.id, 'Chương trình học')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Kho học liệu')}
                        onChange={() => togglePermission(acc.id, 'Kho học liệu')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Thực hành đọc')}
                        onChange={() => togglePermission(acc.id, 'Thực hành đọc')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Đề Quiz tự học')}
                        onChange={() => togglePermission(acc.id, 'Đề Quiz tự học')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Giao bài tập')}
                        onChange={() => togglePermission(acc.id, 'Giao bài tập')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Đề kiểm tra')}
                        onChange={() => togglePermission(acc.id, 'Đề kiểm tra')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Sản phẩm sáng tạo')}
                        onChange={() => togglePermission(acc.id, 'Sản phẩm sáng tạo')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={hasPermission(acc, 'Trợ lý AI')}
                        onChange={() => togglePermission(acc.id, 'Trợ lý AI')}
                        className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-[#2F7668] focus:ring-offset-0 accent-[#2F7668] cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE & EDIT ACCOUNT MODAL (SELF-CONTAINED) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-cream-dark/50 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-cream-dark/15 bg-[#F7F3EC]/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm font-display flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#2F7668]" /> {editingAccount ? 'Cập nhật tài khoản học sinh' : 'Tạo tài khoản học sinh mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-cream-dark/20 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 rotate-45" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <form onSubmit={handleSaveAccount} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {/* Họ tên học sinh */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700">Họ và tên học sinh *</label>
                <input
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full p-2.5 bg-gray-50 border border-cream-dark/30 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2F7668] focus:border-[#2F7668]"
                />
              </div>

              {/* Lớp */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700">Lớp *</label>
                <select
                  value={modalGrade}
                  onChange={(e) => setModalGrade(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-cream-dark/30 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2F7668] focus:border-[#2F7668] cursor-pointer"
                >
                  <option value="Lớp 6">Lớp 6</option>
                  <option value="Lớp 7">Lớp 7</option>
                  <option value="Lớp 8">Lớp 8</option>
                  <option value="Lớp 9">Lớp 9</option>
                </select>
              </div>

              {/* Tên đăng nhập */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 flex justify-between">
                  <span>Tên đăng nhập *</span>
                  <button
                    type="button"
                    onClick={handleAutoGenerateUsername}
                    className="text-[#2F7668] hover:underline font-extrabold cursor-pointer"
                  >
                    Tạo nhanh tên đăng nhập
                  </button>
                </label>
                <input
                  type="text"
                  required
                  value={modalUsername}
                  onChange={(e) => setModalUsername(e.target.value)}
                  placeholder="Ví dụ: nguyenvanan"
                  className="w-full p-2.5 bg-gray-50 border border-cream-dark/30 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2F7668] focus:border-[#2F7668]"
                />
              </div>

              {/* Mật khẩu */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 flex justify-between">
                  <span>Mật khẩu *</span>
                  <button
                    type="button"
                    onClick={handleAutoGeneratePassword}
                    className="text-[#2F7668] hover:underline font-extrabold cursor-pointer"
                  >
                    Tạo nhanh mật khẩu
                  </button>
                </label>
                <input
                  type="password"
                  required
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full p-2.5 bg-gray-50 border border-cream-dark/30 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2F7668] focus:border-[#2F7668]"
                />
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  required
                  value={modalConfirmPassword}
                  onChange={(e) => setModalConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu để xác nhận"
                  className="w-full p-2.5 bg-gray-50 border border-cream-dark/30 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2F7668] focus:border-[#2F7668]"
                />
              </div>

              {/* Trạng thái hoạt động */}
              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700">Trạng thái tài khoản *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="modalStatus"
                      checked={modalStatus === 'Đang hoạt động'}
                      onChange={() => setModalStatus('Đang hoạt động')}
                      className="accent-[#2F7668]"
                    />
                    Đang hoạt động
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="modalStatus"
                      checked={modalStatus === 'Tạm khóa'}
                      onChange={() => setModalStatus('Tạm khóa')}
                      className="accent-[#2F7668]"
                    />
                    Tạm khóa
                  </label>
                </div>
              </div>

              {/* Phân quyền nhanh */}
              <div className="space-y-1.5 pt-2 border-t border-cream-dark/15">
                <label className="block font-bold text-gray-700">Quyền truy cập nhanh (10 tab chức năng) *</label>
                <p className="text-[10px] text-gray-400">Chọn các tab học sinh được phép nhìn thấy trên sidebar:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.keys(modalPermissions).map(key => {
                    // Friendly labels
                    let label = key;
                    if (key === 'home') label = 'Trang chủ';
                    if (key === 'curriculum') label = 'Chương trình học';
                    if (key === 'resources') label = 'Kho học liệu';
                    if (key === 'reading') label = 'Thực hành đọc';
                    if (key === 'quiz') label = 'Đề Quiz tự học';
                    if (key === 'assignments') label = 'Giao bài tập';
                    if (key === 'exams') label = 'Đề kiểm tra';
                    if (key === 'questionBank') label = 'Ngân hàng câu hỏi';
                    if (key === 'products') label = 'Sản phẩm sáng tạo';
                    if (key === 'aiAssistant') label = 'Trợ lý AI';

                    return (
                      <label key={key} className="flex items-center gap-2 font-semibold bg-[#F7F3EC]/30 p-2 border border-cream-dark/15 rounded-lg hover:bg-cream/20 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={modalPermissions[key] !== false}
                          onChange={(e) => setModalPermissions({ ...modalPermissions, [key]: e.target.checked })}
                          className="w-4 h-4 text-[#2F7668] rounded border-gray-300 focus:ring-0 accent-[#2F7668]"
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-4 border-t border-cream-dark/15 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2F7668] hover:bg-[#205248] text-white rounded-xl font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {editingAccount ? 'Cập nhật' : 'Tạo tài khoản'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Inspect Local Storage Modal */}
      {isInspectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-xs text-gray-700">
          <div className="bg-white rounded-3xl border border-cream-dark/50 shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-cream-dark/15 bg-[#F7F3EC]/50 flex items-center justify-between">
              <h3 className="font-display font-black text-gray-800 text-xs flex items-center gap-2">
                🔎 Kiểm tra dữ liệu tài khoản trong LocalStorage
              </h3>
              <button
                onClick={() => setIsInspectOpen(false)}
                className="p-1.5 hover:bg-cream-dark/20 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Danh sách bên dưới được đọc trực tiếp từ <strong>localStorage key "users"</strong> để giáo viên đối chiếu:
              </p>

              <div className="overflow-x-auto border border-cream-dark/30 rounded-xl">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-cream-dark/30 bg-cream-light/40 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Họ tên</th>
                      <th className="py-2.5 px-3">Tên đăng nhập</th>
                      <th className="py-2.5 px-3">Mật khẩu</th>
                      <th className="py-2.5 px-3">Vai trò</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-dark/15 font-semibold text-gray-700">
                    {(() => {
                      let inspectUsers = [];
                      try {
                        inspectUsers = JSON.parse(localStorage.getItem('users') || '[]');
                      } catch (e) {
                        console.error(e);
                      }
                      if (inspectUsers.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-400">Không có dữ liệu tài khoản nào trong LocalStorage.</td>
                          </tr>
                        );
                      }
                      return inspectUsers.map((u: any, idx: number) => (
                        <tr key={u.id || idx} className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-800 font-bold">{u.fullName || u.name || 'N/A'}</td>
                          <td className="py-2 px-3 font-mono text-[#2F7668]">{u.username || 'N/A'}</td>
                          <td className="py-2 px-3 font-mono text-gray-500">{u.password || 'N/A'}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (u.role || '').toLowerCase() === 'teacher' || (u.role || '').toLowerCase() === 'admin'
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'bg-green-50 text-green-600 border border-green-100'
                            }`}>
                              {(u.role || 'student').toLowerCase() === 'teacher' ? 'TEACHER' : 'STUDENT'}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (u.status || '').toLowerCase() === 'active'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                              {(u.status || '').toLowerCase() === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E5E1D8]/40 bg-cream-light/30 flex justify-end">
              <button
                onClick={() => setIsInspectOpen(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer text-xs"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
