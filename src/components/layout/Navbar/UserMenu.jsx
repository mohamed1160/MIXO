import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useShopStore } from '../../../store/useShopStore';

export default function UserMenu({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlist = useShopStore((state) => state.wishlist);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const isAdmin = isAuthenticated && user && (user.role === 'admin' || user.email?.toLowerCase() === 'admin@gmail.com');

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    onClose();
    try {
      await logout();
      navigate('/');
    } catch (err) {
      navigate('/');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-12 right-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#ECE6DD] overflow-hidden z-50 flex flex-col"
        >
          {isAuthenticated && user ? (
            <>
              {/* Authenticated User Header */}
              <div className="p-4 border-b border-[#ECE6DD]/50 bg-[#FAF7F2]/50">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#2C2C2C] text-sm">{user?.firstName} {user?.lastName}</p>
                  {isAdmin && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C89A3D] text-white rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#777777] truncate">{user?.email}</p>
              </div>

              <div className="flex flex-col py-2">
                {/* Admin Dashboard link (Only for Admin) */}
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    onClick={onClose} 
                    className="px-4 py-2.5 text-xs font-bold text-[#C89A3D] bg-[#C89A3D]/10 hover:bg-[#C89A3D] hover:text-white transition-all flex items-center gap-2 border-b border-[#ECE6DD]/50"
                  >
                    <ShieldCheck size={16} />
                    Admin Dashboard
                  </Link>
                )}

                <Link to="/account" onClick={onClose} className="px-4 py-2.5 text-xs text-[#3D2B0E] hover:bg-[#FAF7F2] hover:text-[#C89A3D] transition-colors">My Account</Link>
                <Link to="/account/orders" onClick={onClose} className="px-4 py-2.5 text-xs text-[#3D2B0E] hover:bg-[#FAF7F2] hover:text-[#C89A3D] transition-colors">My Orders</Link>
                <Link to="/account/wishlist" onClick={onClose} className="px-4 py-2.5 text-xs text-[#3D2B0E] hover:bg-[#FAF7F2] hover:text-[#C89A3D] transition-colors flex items-center justify-between">
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#C89A3D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link to="/account/notifications" onClick={onClose} className="px-4 py-2.5 text-xs text-[#3D2B0E] hover:bg-[#FAF7F2] hover:text-[#FF1F3D] transition-colors flex items-center justify-between">
                  <span>Notifications</span>
                  {(() => {
                    try {
                      const userKey = `MIXO_user_notifications_${user?.phone || user?.email || "default"}`;
                      const stored = localStorage.getItem(userKey);
                      if (stored) {
                        const count = JSON.parse(stored).filter((n) => !n.isRead).length;
                        if (count > 0) {
                          return (
                            <span className="w-4 h-4 rounded-full bg-[#FF1F3D] text-white text-[9px] font-bold flex items-center justify-center">
                              {count}
                            </span>
                          );
                        }
                      }
                    } catch (e) {}
                    return null;
                  })()}
                </Link>
                <Link to="/account/settings" onClick={onClose} className="px-4 py-2.5 text-xs text-[#3D2B0E] hover:bg-[#FAF7F2] hover:text-[#C89A3D] transition-colors">Settings</Link>
                <div className="h-px bg-[#ECE6DD]/50 my-1"></div>
                <button onClick={handleLogout} className="text-left px-4 py-2.5 text-xs text-[#3D2B0E] hover:bg-[#FAF7F2] hover:text-red-500 transition-colors">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest Menu */}
              <div className="p-5 flex flex-col gap-3">
                <Link 
                  to="/login" 
                  onClick={onClose} 
                  className="flex items-center justify-center w-full py-2.5 !bg-[#FFFFFF] !text-[#B8924A] !border !border-[#B8924A] hover:!bg-[#B8924A] hover:!text-[#FFFFFF] text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-300 ease-in-out"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  onClick={onClose} 
                  className="flex items-center justify-center w-full py-2.5 !bg-[#B8924A] !text-[#FFFFFF] !border !border-[#B8924A] hover:!bg-[#FFFFFF] hover:!text-[#B8924A] text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-300 ease-in-out"
                >
                  Create Account
                </Link>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
