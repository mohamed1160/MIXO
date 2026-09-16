import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAdminStore } from '../../../store/useAdminStore';
import { useTheme } from '../../../providers/ThemeContext';
import { getAdminData } from '../../../services/adminMockData';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../admin.css';

export default function AdminLayout() {
  const { sidebarCollapsed } = useAdminStore();
  const { isDark } = useTheme();
  const { stats } = getAdminData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /* ── Sync Theme attribute with global ThemeContext ── */
  useEffect(() => {
    const themeMode = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-admin-theme', themeMode);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.removeAttribute('data-admin-theme');
    };
  }, [isDark]);

  /* ── Set site navbar height to 0 for standalone admin layout ── */
  useEffect(() => {
    document.documentElement.style.setProperty('--site-navbar-height', '0px');
    return () => {
      document.documentElement.style.removeProperty('--site-navbar-height');
    };
  }, []);

  /* ── Track viewport for mobile sidebar ── */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveSidebarWidth = isMobile
    ? 0
    : sidebarCollapsed
    ? 72
    : 260;

  return (
    <div className={`admin-root admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ── Sidebar ── */}
      <Sidebar
        stats={stats}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        isMobile={isMobile}
      />

      {/* ── Mobile overlay backdrop ── */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          style={{ top: 0 }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div
        className="admin-main"
        style={{
          marginLeft: effectiveSidebarWidth,
          marginTop: 0,
        }}
      >
        <Topbar
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          isMobile={isMobile}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--admin-bg-secondary)',
            color: 'var(--admin-text)',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius-sm)',
            fontSize: '0.85rem',
            fontFamily: 'var(--admin-font)',
          },
        }}
      />
    </div>
  );
}