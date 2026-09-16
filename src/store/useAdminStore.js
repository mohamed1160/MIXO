import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create()(
  persist(
    (set, get) => ({
      /* ── Theme ── */
      theme: 'light',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      /* ── Sidebar ── */
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarMobileOpen: (open) =>
        set({ sidebarMobileOpen: open }),

      /* ── Notifications ── */
      notifications: [],
      unreadCount: 0,
      addNotification: (notif) =>
        set((s) => ({
          notifications: [
            { id: Date.now(), read: false, time: new Date().toISOString(), ...notif },
            ...s.notifications,
          ],
          unreadCount: s.unreadCount + 1,
        })),
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, s.unreadCount - 1),
        })),

      /* ── Global search ── */
      globalSearch: '',
      setGlobalSearch: (q) => set({ globalSearch: q }),
    }),
    {
      name: 'MIXO-admin-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

