import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '../../api/auth';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMessage("Reset token is missing from the URL.");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    try {
      await authService.resetPassword(token, data.password);
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to reset password. The link might be expired or invalid.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-10 rounded-2xl shadow-sm border border-[#ECE6DD] max-w-md w-full">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-2">Password Reset</h3>
          <p className="text-sm text-[#777777] mb-6">Your password has been successfully updated. Redirecting to login...</p>
          <Link to="/login" className="text-[#C89A3D] text-sm font-medium hover:underline">Go to Sign In manually</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ECE6DD]"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-2">Create New Password</h2>
          <p className="text-sm text-[#777777]">Please enter a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {errorMessage}
            </div>
          )}
          {!token && (
            <div className="p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-100 text-center">
              Warning: No reset token found in URL. Password reset will fail.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] tracking-wider uppercase mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`w-full h-12 px-4 rounded-xl border bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-colors ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#ECE6DD] focus:border-[#C89A3D] focus:ring-[#C89A3D]'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777777]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] tracking-wider uppercase mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={`w-full h-12 px-4 rounded-xl border bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-colors ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-[#ECE6DD] focus:border-[#C89A3D] focus:ring-[#C89A3D]'}`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777777]">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full h-12 bg-[#2C2C2C] hover:bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
          >
            {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
