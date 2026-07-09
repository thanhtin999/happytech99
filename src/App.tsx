/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Library,
  BookMarked,
  Award,
  FileText,
  CheckSquare,
  Users,
  Database,
  Sparkles,
  UserCog,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  ChevronDown,
  Info,
  LogOut,
  User,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data models
import {
  Lesson,
  Material,
  ReadingText,
  Quiz,
  Assignment,
  Exam,
  Student,
  QuestionBankItem,
  CreativeProduct,
  Account
} from './types';

export interface MenuItem {
  name: string;
  icon: any;
  alias?: string;
}

// Default mock data
import {
  initialLessons,
  initialMaterials,
  initialReadingTexts,
  initialQuizzes,
  initialAssignments,
  initialExams,
  initialStudents,
  initialQuestionBankItems,
  initialCreativeProducts,
  initialAccounts,
  getFromStorage,
  saveToStorage
} from './data';

// Custom sub-components
import Toast from './components/Toast';
import FormModal from './components/FormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DashboardHome from './components/DashboardHome';
import CurriculumPage from './components/CurriculumPage';
import MaterialsPage from './components/MaterialsPage';
import ReadingPage from './components/ReadingPage';
import QuizzesPage from './components/QuizzesPage';
import AssignmentsPage from './components/AssignmentsPage';
import ExamsPage from './components/ExamsPage';
import StudentsPage from './components/StudentsPage';
import QuestionBankPage from './components/QuestionBankPage';
import CreativePage from './components/CreativePage';
import AccountsPage from './components/AccountsPage';
import LoginPage from './components/LoginPage';
import RegisterModal from './components/RegisterModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import AiAssistantPage from './components/AiAssistantPage';

export default function App() {
  // Authentication & Session state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: 'TEACHER' | 'STUDENT';
    avatar: string;
  } | null>(() => {
    const session = localStorage.getItem('tt_current_user');
    if (session) return JSON.parse(session);
    const remember = localStorage.getItem('tt_remember_user');
    if (remember) return JSON.parse(remember);
    return null;
  });

  // Modal controls
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Theme and role configurations
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [role, setRole] = useState<'TEACHER' | 'STUDENT'>(() => {
    const session = localStorage.getItem('tt_current_user') || localStorage.getItem('tt_remember_user');
    if (session) {
      const u = JSON.parse(session);
      return u.role;
    }
    return 'TEACHER';
  });
  
  // Grade and year filters
  const [selectedYear, setSelectedYear] = useState<string>('2026-2027');
  const [selectedGrade, setSelectedGrade] = useState<string>('Tất cả');

  // Page tracking state
  const [activeTab, setActiveTab] = useState<string>('Trang chủ');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Lists state connected to local storage
  const [lessons, setLessons] = useState<Lesson[]>(() => getFromStorage('tt_lessons', initialLessons));
  const [materials, setMaterials] = useState<Material[]>(() => getFromStorage('tt_materials', initialMaterials));
  const [readingTexts, setReadingTexts] = useState<ReadingText[]>(() => getFromStorage('tt_reading_texts', initialReadingTexts));
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getFromStorage('tt_quizzes', initialQuizzes));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getFromStorage('tt_assignments', initialAssignments));
  const [exams, setExams] = useState<Exam[]>(() => getFromStorage('tt_exams', initialExams));
  const [students, setStudents] = useState<Student[]>(() => getFromStorage('tt_students', initialStudents));
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(() => getFromStorage('tt_question_bank', initialQuestionBankItems));
  const [creativeProducts, setCreativeProducts] = useState<CreativeProduct[]>(() => getFromStorage('tt_creative_products', initialCreativeProducts));
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('users');
    let parsed: any[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if (parsed.length > 0) {
      // Normalize and sanitize loaded accounts to avoid any bad status/role mismatches
      parsed = parsed.map((acc: any) => {
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

      // Ensure ThanhtinAI always exists (Requirement 10 / Requirement 8)
      const adminExists = parsed.some((acc: any) => (acc.username || '').trim().toLowerCase() === 'thanhtinai');
      if (!adminExists) {
        const defaultAdmin = {
          id: 'admin-thanhtin',
          username: 'ThanhtinAI',
          password: 'AI2026$$$',
          fullName: 'Dương Thành Tín',
          name: 'Dương Thành Tín',
          role: 'teacher',
          status: 'active',
          permissions: 'all',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        };
        parsed.push(defaultAdmin);
      } else {
        // Enforce exact admin fields for ThanhtinAI to ensure it matches the requirements
        parsed = parsed.map((acc: any) => {
          if ((acc.username || '').trim().toLowerCase() === 'thanhtinai') {
            return {
              ...acc,
              id: 'admin-thanhtin',
              password: 'AI2026$$$',
              fullName: 'Dương Thành Tín',
              name: 'Dương Thành Tín',
              role: 'teacher',
              status: 'active',
              permissions: 'all'
            };
          }
          return acc;
        });
      }
      localStorage.setItem('users', JSON.stringify(parsed));
      return parsed;
    }

    // Default accounts for first time
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
          questionBank: true,
          products: true,
          aiAssistant: true,
          studentManagement: false,
          accountManagement: false
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
    localStorage.setItem('users', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  });

  // Sync to LocalStorage on updates
  useEffect(() => { saveToStorage('tt_lessons', lessons); }, [lessons]);
  useEffect(() => { saveToStorage('tt_materials', materials); }, [materials]);
  useEffect(() => { saveToStorage('tt_reading_texts', readingTexts); }, [readingTexts]);
  useEffect(() => { saveToStorage('tt_quizzes', quizzes); }, [quizzes]);
  useEffect(() => { saveToStorage('tt_assignments', assignments); }, [assignments]);
  useEffect(() => { saveToStorage('tt_exams', exams); }, [exams]);
  useEffect(() => { saveToStorage('tt_students', students); }, [students]);
  useEffect(() => { saveToStorage('tt_question_bank', questionBank); }, [questionBank]);
  useEffect(() => { saveToStorage('tt_creative_products', creativeProducts); }, [creativeProducts]);
  useEffect(() => { saveToStorage('users', accounts); }, [accounts]);

  // Notifications
  const [notifications, setNotifications] = useState<string[]>([
    'Chào mừng thầy cô đến với Thành Tín - LMS phiên bản 1.0!',
    'Có 12 học sinh vừa nộp bài tập "Thiết kế game học tập".',
    'Thành Tín AI vừa bổ sung kịch bản prompt sáng tạo mới.'
  ]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  // Form Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalType, setFormModalType] = useState<any>('Lesson');
  const [formModalItem, setFormModalItem] = useState<any>(null);

  // Delete Confirm Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemTitle, setDeleteItemTitle] = useState('');
  const [deleteItemId, setDeleteItemId] = useState('');
  const [deleteItemType, setDeleteItemType] = useState<string>('');

  // Auto redirect students if they are on a forbidden page
  useEffect(() => {
    if (role === 'STUDENT' && currentUser) {
      // Find out if the activeTab matches any allowed menu item (either by name or alias)
      const isAllowed = filteredMenu.some(
        item => item.name === activeTab || item.alias === activeTab || (item.alias && item.alias === activeTab)
      );
      if (!isAllowed) {
        setActiveTab('Trang chủ');
      }
    }
  }, [role, activeTab, accounts, currentUser]);

  // Handle addition & editing actions
  const openAddModal = (type: string) => {
    setFormModalType(type);
    setFormModalItem(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (type: string, item: any) => {
    setFormModalType(type);
    setFormModalItem(item);
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (savedItem: any) => {
    setIsFormModalOpen(false);
    
    // Add new or update existing
    switch (formModalType) {
      case 'Lesson':
        if (formModalItem) {
          setLessons(prev => prev.map(l => l.id === savedItem.id ? savedItem : l));
          triggerToast('Đã sửa bài học thành công');
        } else {
          setLessons(prev => [savedItem, ...prev]);
          triggerToast('Đã thêm bài học mới thành công');
        }
        break;
      case 'Material':
        if (formModalItem) {
          setMaterials(prev => prev.map(m => m.id === savedItem.id ? savedItem : m));
          triggerToast('Đã sửa học liệu thành công');
        } else {
          setMaterials(prev => [savedItem, ...prev]);
          triggerToast('Đã thêm học liệu mới thành công');
        }
        break;
      case 'ReadingText':
        if (formModalItem) {
          setReadingTexts(prev => prev.map(t => t.id === savedItem.id ? savedItem : t));
          triggerToast('Đã sửa văn bản luyện đọc thành công');
        } else {
          setReadingTexts(prev => [savedItem, ...prev]);
          triggerToast('Đã thêm văn bản đọc mới thành công');
        }
        break;
      case 'Quiz':
        if (formModalItem) {
          setQuizzes(prev => prev.map(q => q.id === savedItem.id ? savedItem : q));
          triggerToast('Đã sửa đề quiz trắc nghiệm thành công');
        } else {
          setQuizzes(prev => [savedItem, ...prev]);
          triggerToast('Đã tạo đề trắc nghiệm mới thành công');
        }
        break;
      case 'Assignment':
        if (formModalItem) {
          setAssignments(prev => prev.map(a => a.id === savedItem.id ? savedItem : a));
          triggerToast('Đã sửa nhiệm vụ thành công');
        } else {
          setAssignments(prev => [savedItem, ...prev]);
          triggerToast('Đã giao nhiệm vụ mới thành công');
        }
        break;
      case 'Exam':
        if (formModalItem) {
          setExams(prev => prev.map(e => e.id === savedItem.id ? savedItem : e));
          triggerToast('Đã sửa đề kiểm tra thành công');
        } else {
          setExams(prev => [savedItem, ...prev]);
          triggerToast('Đã thêm đề kiểm tra thành công');
        }
        break;
      case 'Student':
        if (formModalItem) {
          setStudents(prev => prev.map(s => s.id === savedItem.id ? savedItem : s));
          triggerToast('Đã sửa hồ sơ học sinh thành công');
        } else {
          setStudents(prev => [savedItem, ...prev]);
          triggerToast('Đã thêm hồ sơ học sinh thành công');
        }
        break;
      case 'QuestionBankItem':
        if (formModalItem) {
          setQuestionBank(prev => prev.map(q => q.id === savedItem.id ? savedItem : q));
          triggerToast('Đã sửa câu hỏi ngân hàng thành công');
        } else {
          setQuestionBank(prev => [savedItem, ...prev]);
          triggerToast('Đã lưu câu hỏi vào ngân hàng thành công');
        }
        break;
      case 'CreativeProduct':
        if (formModalItem) {
          setCreativeProducts(prev => prev.map(p => p.id === savedItem.id ? savedItem : p));
          triggerToast('Đã sửa sản phẩm sáng tạo thành công');
        } else {
          setCreativeProducts(prev => [savedItem, ...prev]);
          triggerToast('Đã đăng sản phẩm sáng tạo thành công');
        }
        break;
      case 'Account':
        if (formModalItem) {
          setAccounts(prev => prev.map(a => a.id === savedItem.id ? savedItem : a));
          triggerToast('Đã sửa tài khoản thành công');
        } else {
          setAccounts(prev => [savedItem, ...prev]);
          triggerToast('Đã tạo tài khoản mới thành công');
        }
        break;
    }
  };

  const handleUpdateAccountStatus = (accountId: string, newStatus: string) => {
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, status: newStatus } : acc));
  };

  const handleUpdateAccountPermissions = (accountId: string, permissions: any) => {
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, permissions: typeof permissions === 'string' ? permissions : JSON.stringify(permissions) } : acc));
  };

  // Delete confirmation action
  const openDeleteModal = (type: string, id: string, title: string) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setDeleteItemTitle(title);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);

    switch (deleteItemType) {
      case 'Lesson':
        setLessons(prev => prev.filter(l => l.id !== deleteItemId));
        break;
      case 'Material':
        setMaterials(prev => prev.filter(m => m.id !== deleteItemId));
        break;
      case 'ReadingText':
        setReadingTexts(prev => prev.filter(t => t.id !== deleteItemId));
        break;
      case 'Quiz':
        setQuizzes(prev => prev.filter(q => q.id !== deleteItemId));
        break;
      case 'Assignment':
        setAssignments(prev => prev.filter(a => a.id !== deleteItemId));
        break;
      case 'Exam':
        setExams(prev => prev.filter(e => e.id !== deleteItemId));
        break;
      case 'Student':
        setStudents(prev => prev.filter(s => s.id !== deleteItemId));
        break;
      case 'QuestionBankItem':
        setQuestionBank(prev => prev.filter(q => q.id !== deleteItemId));
        break;
      case 'CreativeProduct':
        setCreativeProducts(prev => prev.filter(p => p.id !== deleteItemId));
        break;
      case 'Account':
        setAccounts(prev => prev.filter(a => a.id !== deleteItemId));
        break;
    }

    triggerToast('Xóa dữ liệu thành công!');
  };

  // Toggle Reading Text Favorite
  const handleToggleFavorite = (id: string) => {
    setReadingTexts(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, favorite: !t.favorite };
        triggerToast(updated.favorite ? 'Đã thêm vào tác phẩm yêu thích' : 'Đã bỏ yêu thích');
        return updated;
      }
      return t;
    }));
  };

  // Generic lists modifier for subpages (e.g. Assignment grading or Product likes)
  const handleUpdateAssignment = (updated: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
    triggerToast('Đã cập nhật bài tập của học sinh');
    
    // Add simple notification for grading or nộp bài
    if (updated.status === 'Đã chấm') {
      setNotifications(prev => [`Đã hoàn thành chấm điểm bài: "${updated.title}"`, ...prev]);
    } else if (updated.status === 'Đã nộp') {
      setNotifications(prev => [`Học sinh vừa nộp bài tập mới: "${updated.title}"`, ...prev]);
    }
  };

  const handleUpdateProduct = (updated: CreativeProduct) => {
    setCreativeProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Distinct sidebar menus for Teachers vs Students (no CSS-based hiding)
  const teacherMenuItems: MenuItem[] = [
    { name: 'Trang chủ', icon: GraduationCap },
    { name: 'Chương trình học', icon: BookOpen },
    { name: 'Kho học liệu', icon: Library },
    { name: 'Thực hành đọc', icon: BookMarked },
    { name: 'Đề Quiz tự học', icon: Award },
    { name: 'Giao bài tập', icon: CheckSquare },
    { name: 'Đề kiểm tra', icon: FileText },
    { name: 'Quản lý học sinh', icon: Users },
    { name: 'Ngân hàng câu hỏi', icon: Database },
    { name: 'Sản phẩm sáng tạo', icon: Sparkles },
    { name: 'Quản lý tài khoản', icon: UserCog },
    { name: 'Trợ lý AI', icon: Bot }
  ];

  const studentMenuItems: MenuItem[] = [
    { name: 'Trang chủ', icon: GraduationCap },
    { name: 'Chương trình học', icon: BookOpen },
    { name: 'Kho học liệu', icon: Library },
    { name: 'Thực hành đọc', icon: BookMarked },
    { name: 'Đề Quiz tự học', icon: Award },
    { name: 'Bài tập của em', alias: 'Giao bài tập', icon: CheckSquare },
    { name: 'Đề kiểm tra', icon: FileText },
    { name: 'Ngân hàng câu hỏi', icon: Database },
    { name: 'Sản phẩm sáng tạo', icon: Sparkles },
    { name: 'Trợ lý AI', icon: Bot }
  ];

  const activeMenuArray = role === 'TEACHER' ? teacherMenuItems : studentMenuItems;

  // Filter menu depending on role and teacher-managed permissions
  const filteredMenu = activeMenuArray.filter(item => {
    if (role === 'TEACHER') return true;
    
    // Always show essential pages (Trang chủ)
    if (item.name === 'Trang chủ') {
      return true;
    }

    // Find the student's account to read permissions dynamically
    const studentAccount = accounts.find(
      a => (a.username || '').toLowerCase() === (currentUser?.username || '').toLowerCase()
    );

    if (studentAccount) {
      let studentPermissions: any = null;
      try {
        studentPermissions = typeof studentAccount.permissions === 'string'
          ? JSON.parse(studentAccount.permissions)
          : studentAccount.permissions;
      } catch (e) {
        console.error(e);
      }

      if (studentPermissions) {
        const permKey = item.alias || item.name;
        // Check if explicitly set to false
        if (studentPermissions[permKey] === false) {
          return false;
        }
      }
    }
    return true;
  });

  // Proactive student route protection and redirects
  useEffect(() => {
    if (!currentUser) return;
    if (role === 'STUDENT') {
      // 1. Is activeTab allowed for students at all?
      const isAllowedTab = studentMenuItems.some(item => (item.alias || item.name) === activeTab);
      if (!isAllowedTab) {
        setActiveTab('Trang chủ');
        triggerToast('Học sinh không được phép truy cập chức năng này!');
        return;
      }

      // 2. Has the teacher disabled this page for this student?
      if (activeTab !== 'Trang chủ') {
        const studentAccount = accounts.find(
          a => (a.username || '').toLowerCase() === (currentUser?.username || '').toLowerCase()
        );
        if (studentAccount) {
          let studentPermissions: any = null;
          try {
            studentPermissions = typeof studentAccount.permissions === 'string'
              ? JSON.parse(studentAccount.permissions)
              : studentAccount.permissions;
          } catch (e) {
            console.error(e);
          }
          if (studentPermissions) {
            const key = activeTab === 'Bài tập của em' ? 'Giao bài tập' : activeTab;
            if (studentPermissions[key] === false) {
              setActiveTab('Trang chủ');
              triggerToast('Quyền truy cập trang này đã bị giáo viên tạm tắt!');
            }
          }
        }
      }
    }
  }, [role, activeTab, currentUser, accounts]);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('tt_current_user');
      localStorage.removeItem('tt_remember_user');
      setCurrentUser(null);
      triggerToast('Đã đăng xuất thành công.');
    }
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen transition-colors duration-300 font-sans ${
        theme === 'dark' ? 'bg-[#151c1a] text-gray-200' : 'bg-cream text-[#2D2D2D]'
      }`}>
        <LoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setRole(user.role);
            setActiveTab('Trang chủ');
          }}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
          triggerToast={triggerToast}
        />

        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          triggerToast={triggerToast}
          onRegisterSuccess={(newAcc) => setAccounts(prev => [...prev, newAcc])}
        />

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          triggerToast={triggerToast}
        />

        <Toast
          message={toastMessage}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      theme === 'dark' ? 'bg-[#151c1a] text-gray-200' : 'bg-cream text-[#2D2D2D]'
    }`}>
      
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

      {/* Dynamic unified editor modal */}
      <FormModal
        isOpen={isFormModalOpen}
        type={formModalType}
        item={formModalItem}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveForm}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title={deleteItemTitle}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Master Layout */}
      <div className="flex h-screen overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-72 border-r transition-colors shrink-0 bg-white dark:bg-[#1E2523] border-cream-dark dark:border-white/5 relative z-10">
          
          {/* Logo & Subheader */}
          <div className="p-6 border-b border-cream-dark dark:border-white/5 space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-black text-base leading-none text-primary dark:text-[#A4D6CD]">
                  THÀNH TÍN - LMS
                </h1>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">By Thành Tín AI</p>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="p-4 bg-cream-light dark:bg-black/10 border-b border-cream-dark dark:border-white/5 space-y-3 text-xs">
            {/* Year selector */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Năm học:</span>
              <div className="p-2 bg-cream dark:bg-[#151C1A] border-none rounded-xl font-bold text-primary dark:text-[#A4D6CD] flex items-center justify-between">
                <span>{selectedYear}</span>
                <span className="w-2 h-2 bg-[#2F7668] rounded-full animate-ping"></span>
              </div>
            </div>

            {/* Grade selector */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Lớp học:</span>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  triggerToast(`Đang hiển thị nội dung cho ${e.target.value}`);
                }}
                className="w-full p-2 bg-cream dark:bg-[#151C1A] border-none rounded-xl text-primary dark:text-[#A4D6CD] font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {['Tất cả', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sidebar Menu navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredMenu.map((item) => {
              const tabKey = item.alias || item.name;
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(tabKey)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-cream dark:hover:bg-white/5 hover:text-[#2D2D2D] dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-primary dark:text-[#A4D6CD]'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Account Profile Bottom bar */}
          <div className="p-4 border-t border-cream-dark bg-cream-light dark:bg-black/15 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D1DAD7] overflow-hidden shrink-0">
              <img
                src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                alt={currentUser?.name || 'Dương Thành Tín'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-gray-800 dark:text-white truncate">
                {currentUser?.name || 'Dương Thành Tín'}
              </h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold truncate">
                {role === 'TEACHER' ? 'G.Viên / Giáo viên' : 'H.Sinh / Học sinh'}
              </p>
            </div>
          </div>

        </aside>

        {/* MOBILE SIDEBAR PANEL (Drawer overlay) */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              {/* Back background blur filter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute inset-0 bg-black"
              />

              {/* Sidebar Content drawer */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="relative flex flex-col w-64 h-full bg-white dark:bg-[#1E2523] border-r border-cream-dark/30 dark:border-white/5 shadow-2xl shrink-0"
              >
                <div className="p-5 border-b border-cream-dark/30 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-primary text-white rounded-lg">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="font-display font-black text-sm text-primary dark:text-white">THÀNH TÍN - LMS</span>
                  </div>
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-cream-dark/15 text-xs bg-cream-light/30 dark:bg-black/5 space-y-3">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Năm học:</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 block mt-0.5">{selectedYear}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Lớp học:</span>
                    <select
                      value={selectedGrade}
                      onChange={(e) => {
                        setSelectedGrade(e.target.value);
                        triggerToast(`Đang lọc: ${e.target.value}`);
                      }}
                      className="w-full mt-1 p-2 bg-white dark:bg-[#151C1A] border rounded-lg text-xs"
                    >
                      {['Tất cả', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {filteredMenu.map((item) => {
                    const tabKey = item.alias || item.name;
                    const isActive = activeTab === tabKey;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setActiveTab(tabKey);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-cream-dark/20 flex items-center justify-between gap-2 bg-cream-light/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      className="w-8 h-8 rounded-full shrink-0"
                    />
                    <span className="font-bold text-xs text-gray-800 dark:text-white truncate">
                      {currentUser?.name || 'Dương Thành Tín'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      handleLogout();
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN BODY LAYOUT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* HEADER NAV */}
          <header className="h-16 border-b transition-colors bg-white dark:bg-[#1E2523] border-cream-dark dark:border-white/5 flex items-center justify-between px-6 shrink-0 relative z-10">
            
            {/* Left side: Hamburger and Status Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 bg-cream dark:bg-black/10 text-gray-500 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-cream dark:bg-[#2F7668]/15 text-primary dark:text-[#A4D6CD] text-xs font-semibold rounded-full border border-primary/10">
                Hệ thống Giáo án điện tử & LMS kết hợp
              </span>
            </div>

            {/* Right side: Actions, Notifications, Role Toggles */}
            <div className="flex items-center gap-3">
              
              {/* Role Toggle Selector - ONLY visible if actual user is a TEACHER */}
              {currentUser?.role === 'TEACHER' && (
                <div className="flex bg-cream dark:bg-black/20 p-1 rounded-full text-xs font-bold tracking-wide border border-cream-dark/30 dark:border-white/5">
                  <button
                    onClick={() => {
                      setRole('TEACHER');
                      triggerToast('Đã chuyển sang vai trò Giáo viên!');
                    }}
                    className={`px-4 py-1 rounded-full transition-all text-xs font-bold cursor-pointer ${
                      role === 'TEACHER' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    G.Viên
                  </button>
                  <button
                    onClick={() => {
                      setRole('STUDENT');
                      triggerToast('Đã chuyển sang vai trò Học sinh!');
                    }}
                    className={`px-4 py-1 rounded-full transition-all text-xs font-bold cursor-pointer ${
                      role === 'STUDENT' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    H.Sinh
                  </button>
                </div>
              )}

              {/* Theme Switcher Button */}
              <button
                onClick={() => {
                  setTheme(theme === 'light' ? 'dark' : 'light');
                  triggerToast(`Đã bật Giao diện ${theme === 'light' ? 'Tối' : 'Sáng'}`);
                }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-cream dark:hover:bg-black/10 rounded-full transition-colors cursor-pointer"
                title="Chuyển đổi giao diện sáng/tối"
              >
                {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
              </button>

              {/* Notification icon & interactive dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  className="p-2 text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors relative cursor-pointer"
                  title="Thông báo"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                  )}
                </button>

                {/* Notifications Panel Dropdown */}
                <AnimatePresence>
                  {showNotificationsDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotificationsDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1E2523] rounded-xl shadow-xl border border-cream-dark/30 dark:border-white/5 z-50 overflow-hidden"
                      >
                        <div className="p-3.5 border-b border-cream-dark/20 bg-cream-light/30 dark:bg-black/10 flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700 dark:text-white">Thông báo hệ thống</span>
                          <button
                            onClick={() => setNotifications([])}
                            className="text-[10px] text-primary hover:underline font-bold"
                          >
                            Xóa hết
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto text-xs divide-y divide-cream-dark/15 dark:divide-white/5">
                          {notifications.length > 0 ? (
                            notifications.map((notif, idx) => (
                              <div key={idx} className="p-3 hover:bg-cream-light/30 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300 leading-relaxed">
                                {notif}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-400 text-[11px]">Không có thông báo mới.</div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* User Account Menu with interactive dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 bg-cream/50 dark:bg-black/10 hover:bg-cream dark:hover:bg-black/20 rounded-full pl-1.5 pr-3 transition-colors text-left cursor-pointer border border-cream-dark/30 dark:border-white/5"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-7 h-7 rounded-full object-cover shadow-sm border border-primary/20"
                  />
                  <div className="hidden md:block">
                    <p className="text-[11px] font-bold text-gray-700 dark:text-white leading-none">
                      {currentUser?.name}
                    </p>
                    <span className="text-[8px] font-semibold text-gray-400 block mt-0.5 uppercase tracking-wider">
                      {role === 'TEACHER' ? 'G.Viên' : 'H.Sinh'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {/* Profile dropdown box */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E2523] rounded-xl shadow-xl border border-cream-dark/30 dark:border-white/5 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-cream-dark/20 bg-cream-light/30 dark:bg-black/10 flex items-center gap-3">
                          <img
                            src={currentUser?.avatar}
                            alt={currentUser?.name}
                            className="w-10 h-10 rounded-full object-cover border border-primary/10 shadow-sm"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-gray-800 dark:text-white truncate">
                              {currentUser?.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>

                        <div className="p-1.5">
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setActiveTab('Quản lý tài khoản'); // Maps to "Hồ sơ của em" if STUDENT
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-700 dark:text-gray-200 hover:bg-[#F7F3EC]/50 dark:hover:bg-white/5 transition-colors font-semibold"
                          >
                            <User className="w-4 h-4 text-primary" />
                            {role === 'TEACHER' ? 'Quản lý tài khoản' : 'Hồ sơ của em'}
                          </button>
                          
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold border-t border-cream-dark/15 dark:border-white/5 mt-1.5 pt-2"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </header>

          {/* MAIN SCROLLABLE CONTENT */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
            
            {/* Active section routing manager */}
            <div className="max-w-7xl mx-auto space-y-6">
              
              {activeTab === 'Trang chủ' && (
                <DashboardHome
                  onNavigate={(tab) => {
                    setActiveTab(tab);
                    triggerToast(`Đang chuyển hướng sang ${tab}...`);
                  }}
                  lessons={lessons}
                  assignments={assignments}
                  students={students}
                  role={role}
                />
              )}

              {activeTab === 'Chương trình học' && (
                <CurriculumPage
                  lessons={lessons}
                  onAdd={() => openAddModal('Lesson')}
                  onEdit={(lesson) => openEditModal('Lesson', lesson)}
                  onDelete={(id) => openDeleteModal('Lesson', id, lessons.find(l => l.id === id)?.title || '')}
                  role={role}
                  selectedGradeFilter={selectedGrade}
                />
              )}

              {activeTab === 'Kho học liệu' && (
                <MaterialsPage
                  materials={materials}
                  onAdd={() => openAddModal('Material')}
                  onEdit={(mat) => openEditModal('Material', mat)}
                  onDelete={(id) => openDeleteModal('Material', id, materials.find(m => m.id === id)?.title || '')}
                  role={role}
                  selectedGradeFilter={selectedGrade}
                />
              )}

              {activeTab === 'Thực hành đọc' && (
                <ReadingPage
                  readingTexts={readingTexts}
                  onAdd={() => openAddModal('ReadingText')}
                  onEdit={(text) => openEditModal('ReadingText', text)}
                  onDelete={(id) => openDeleteModal('ReadingText', id, readingTexts.find(t => t.id === id)?.title || '')}
                  onToggleFavorite={handleToggleFavorite}
                  role={role}
                />
              )}

              {activeTab === 'Đề Quiz tự học' && (
                <QuizzesPage
                  quizzes={quizzes}
                  onAdd={() => openAddModal('Quiz')}
                  onEdit={(quiz) => openEditModal('Quiz', quiz)}
                  onDelete={(id) => openDeleteModal('Quiz', id, quizzes.find(q => q.id === id)?.title || '')}
                  role={role}
                  selectedGradeFilter={selectedGrade}
                />
              )}

              {activeTab === 'Giao bài tập' && (
                <AssignmentsPage
                  assignments={assignments}
                  onAdd={() => openAddModal('Assignment')}
                  onEdit={(assign) => openEditModal('Assignment', assign)}
                  onDelete={(id) => openDeleteModal('Assignment', id, assignments.find(a => a.id === id)?.title || '')}
                  onUpdateAssignment={handleUpdateAssignment}
                  role={role}
                />
              )}

              {activeTab === 'Đề kiểm tra' && (
                <ExamsPage
                  exams={exams}
                  onAdd={() => openAddModal('Exam')}
                  onEdit={(exam) => openEditModal('Exam', exam)}
                  onDelete={(id) => openDeleteModal('Exam', id, exams.find(e => e.id === id)?.title || '')}
                  role={role}
                  selectedGradeFilter={selectedGrade}
                />
              )}

              {activeTab === 'Quản lý học sinh' && (
                <StudentsPage
                  students={students}
                  onAdd={() => openAddModal('Student')}
                  onEdit={(st) => openEditModal('Student', st)}
                  onDelete={(id) => openDeleteModal('Student', id, students.find(s => s.id === id)?.name || '')}
                  role={role}
                />
              )}

              {activeTab === 'Ngân hàng câu hỏi' && (
                <QuestionBankPage
                  questionBank={questionBank}
                  onAdd={() => openAddModal('QuestionBankItem')}
                  onEdit={(item) => openEditModal('QuestionBankItem', item)}
                  onDelete={(id) => openDeleteModal('QuestionBankItem', id, questionBank.find(q => q.id === id)?.question.substring(0, 30) || '')}
                  role={role}
                  selectedGradeFilter={selectedGrade}
                />
              )}

              {activeTab === 'Sản phẩm sáng tạo' && (
                <CreativePage
                  products={creativeProducts}
                  onAdd={() => openAddModal('CreativeProduct')}
                  onEdit={(product) => openEditModal('CreativeProduct', product)}
                  onDelete={(id) => openDeleteModal('CreativeProduct', id, creativeProducts.find(p => p.id === id)?.title || '')}
                  onUpdateProduct={handleUpdateProduct}
                  role={role}
                />
              )}

              {activeTab === 'Quản lý tài khoản' && (
                <AccountsPage
                  accounts={accounts}
                  onAdd={() => openAddModal('Account')}
                  onEdit={(acc) => openEditModal('Account', acc)}
                  onDelete={(id) => openDeleteModal('Account', id, accounts.find(a => a.id === id)?.name || '')}
                  role={role}
                  currentUser={currentUser}
                  students={students}
                  onUpdateStatus={handleUpdateAccountStatus}
                  onUpdatePermissions={handleUpdateAccountPermissions}
                  triggerToast={triggerToast}
                  setAccounts={setAccounts}
                  onRefresh={() => {
                    const latest = localStorage.getItem('users');
                    if (latest) {
                      try {
                        setAccounts(JSON.parse(latest));
                        triggerToast('Đã làm mới danh sách tài khoản từ hệ thống!');
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                />
              )}

              {activeTab === 'Trợ lý AI' && (
                <AiAssistantPage />
              )}

            </div>

            {/* Standard Footer */}
            <footer className="pt-8 border-t border-cream-dark dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 space-y-2 sm:space-y-0 py-4 shrink-0">
              <p className="font-display font-black text-[#2F7668] dark:text-[#A4D6CD] tracking-widest uppercase text-xs">
                THÀNH TÍN - LMS PLATFORM v1.0
              </p>
              <p className="font-semibold text-[11px] text-center sm:text-right text-gray-500 dark:text-gray-400">
                © 2026 Toàn bộ nội dung thuộc hệ thống Thành Tín AI.
              </p>
            </footer>

          </main>

        </div>

      </div>

    </div>
  );
}
