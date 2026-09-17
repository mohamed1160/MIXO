import { create } from 'zustand';
import { authService } from '../api/auth';
import { findSupabaseUser, saveSupabaseUser } from '../services/db.service';

const USERS_STORAGE_KEY = 'MIXO_registered_users';
const CURRENT_USER_KEY = 'MIXO_current_user';

const DEFAULT_USERS = [
  {
    id: 'CUS-ADMIN',
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@gmail.com',
    password: 'admin123',
    phone: '01000000000',
    role: 'admin',
    ordersCount: 5,
    totalPurchases: 1250,
    availablePoints: 350,
    status: 'Active',
    registeredAt: new Date().toISOString(),
  },
];

const getStoredUsers = () => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    if (!users) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(users);
  } catch (error) {
    return DEFAULT_USERS;
  }
};

const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error(error);
  }
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (phoneOrIdentifier, passwordArg) => {
    set({ isLoading: true, error: null });

    let identifier = '';
    let password = '';

    if (typeof phoneOrIdentifier === 'object' && phoneOrIdentifier !== null) {
      identifier = phoneOrIdentifier.phone || phoneOrIdentifier.identifier || phoneOrIdentifier.email || '';
      password = phoneOrIdentifier.password || '';
    } else {
      identifier = phoneOrIdentifier || '';
      password = passwordArg || '';
    }

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    // 1. Try Supabase Database First
    try {
      const supaUser = await findSupabaseUser(cleanIdentifier);
      if (supaUser) {
        if (supaUser.password === cleanPassword) {
          const { password: _, ...userData } = supaUser;
          if (cleanIdentifier === 'admin@gmail.com' || supaUser.phone === '01000000000') {
            userData.role = 'admin';
          }
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
          set({ user: userData, isAuthenticated: true, isLoading: false, error: null });
          return userData;
        } else {
          const errMsg = 'كلمة السر غير صحيحة، يرجى إعادة المحاولة ⚠️';
          set({ isLoading: false, error: errMsg });
          throw new Error(errMsg);
        }
      }
    } catch (e) {
      if (e.message?.includes('كلمة السر')) throw e;
      console.log('Supabase user login fallback:', e.message);
    }

    // 2. Try Strapi Backend
    try {
      const strapiRes = await authService.login({ identifier: cleanIdentifier, password: cleanPassword });
      if (strapiRes?.user) {
        const u = strapiRes.user;
        const userData = {
          id: u.id,
          email: u.email || `${u.phone}@mixo3d.com`,
          firstName: u.firstName || u.username,
          lastName: u.lastName || '',
          name: `${u.firstName || u.username} ${u.lastName || ''}`.trim(),
          phone: u.phone || cleanIdentifier,
          role: (cleanIdentifier === 'admin@gmail.com' || cleanIdentifier === '01000000000') ? 'admin' : (u.role?.type || 'user'),
          availablePoints: u.availablePoints || 0,
          registeredAt: u.registeredAt || u.createdAt,
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true, isLoading: false, error: null });
        return userData;
      }
    } catch (e) {
      console.log('Strapi auth login attempt fallback to local:', e.message);
    }

    // 3. Fallback to Local Account
    const users = getStoredUsers();
    const cleanPhoneSearch = cleanIdentifier.replace(/[\s\-\+]/g, '');

    const foundUser = users.find(
      (u) =>
        (u.phone && u.phone.replace(/[\s\-\+]/g, '') === cleanPhoneSearch) ||
        (u.email && u.email.trim().toLowerCase() === cleanIdentifier.toLowerCase())
    );

    if (!foundUser) {
      const errMsg = 'رقم الهاتف غير مسجل لدينا، يرجى إنشاء حساب جديد أولاً ⚠️';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }

    if (foundUser.password !== cleanPassword) {
      const errMsg = 'كلمة السر غير صحيحة، يرجى إعادة المحاولة ⚠️';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }

    const { password: _, ...userData } = foundUser;
    if (cleanIdentifier === 'admin@gmail.com' || foundUser.phone === '01000000000') {
      userData.role = 'admin';
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true, isLoading: false, error: null });
    return userData;
  },

  register: async (formData) => {
    set({ isLoading: true, error: null });

    const cleanPhone = formData.phone?.trim();
    const cleanEmail = formData.email?.trim().toLowerCase() || `${cleanPhone}@mixo3d.com`;
    const isSystemAdmin = cleanPhone === '01000000000' || cleanEmail === 'admin@gmail.com';

    const newUser = {
      id: `CUS-${Date.now().toString().slice(-4)}`,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: formData.password,
      role: isSystemAdmin ? 'admin' : 'user',
      ordersCount: 0,
      totalPurchases: 0,
      pointsEarned: 0,
      pointsRedeemed: 0,
      availablePoints: 0,
      wishlistCount: 0,
      addressesCount: 0,
      status: 'Active',
      registeredAt: new Date().toISOString(),
      joinedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Save to Supabase DB First
    try {
      await saveSupabaseUser(newUser);
    } catch (err) {
      console.warn('Supabase register sync warning:', err);
    }

    // Save to Local Account Fallback
    const users = getStoredUsers();
    const cleanPhoneSearch = cleanPhone.replace(/[\s\-\+]/g, '');

    const exists = users.some(
      (u) =>
        (u.phone && u.phone.replace(/[\s\-\+]/g, '') === cleanPhoneSearch) ||
        (u.email && u.email.trim().toLowerCase() === cleanEmail)
    );

    if (!exists) {
      const updatedUsers = [...users, newUser];
      saveStoredUsers(updatedUsers);
    }

    const { password: _, ...userSession } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
    set({ user: userSession, isAuthenticated: true, isLoading: false, unreadNotificationsCount: 1, error: null });
    return userSession;
  },

  changePassword: async (currentPassword, newPassword) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error("مطلوب تسجيل الدخول أولاً");

    const users = getStoredUsers();
    const userIndex = users.findIndex(
      (u) =>
        (u.id && currentUser.id && u.id === currentUser.id) ||
        (u.phone && currentUser.phone && u.phone.replace(/[\s\-\+]/g, '') === currentUser.phone.replace(/[\s\-\+]/g, '')) ||
        (u.email && currentUser.email && u.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
    );

    if (userIndex === -1) {
      throw new Error("لم يتم العثور على بيانات الحساب، يرجى إعادة تسجيل الدخول ⚠️");
    }

    const targetUser = users[userIndex];
    if (targetUser.password && targetUser.password !== currentPassword.trim()) {
      throw new Error("كلمة السر الحالية غير صحيحة، يرجى التثبت وإعادة المحاولة ⚠️");
    }

    // Update target password in local storage
    users[userIndex].password = newPassword.trim();
    saveStoredUsers(users);

    return true;
  },

  logout: async () => {
    try {
      await authService.logout();
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.error(e);
    }
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  updateUser: (updatedFields) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const newUserData = { ...currentUser, ...updatedFields };

    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUserData));
      authService.updateProfile(updatedFields).catch(() => {});
    } catch (e) {
      console.error(e);
    }

    set({ user: newUserData });
  },

  unreadNotificationsCount: 0,

  markAllNotificationsRead: () => {
    set({ unreadNotificationsCount: 0 });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('MIXO_jwt_token');
      if (token) {
        const me = await authService.getCurrentUser();
        if (me) {
          const userData = {
            id: me.id,
            email: me.email,
            firstName: me.firstName || me.username,
            lastName: me.lastName || '',
            name: `${me.firstName || me.username} ${me.lastName || ''}`.trim(),
            phone: me.phone || '',
            role: me.email === 'admin@gmail.com' ? 'admin' : (me.role?.type || 'user'),
            availablePoints: me.availablePoints || 0,
            registeredAt: me.registeredAt || me.createdAt,
          };
          set({ user: userData, isAuthenticated: true, isLoading: false, error: null });
          return;
        }
      }

      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData && typeof userData === 'object') {
          set({ user: userData, isAuthenticated: true, isLoading: false, error: null });
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },
}));
