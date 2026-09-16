import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '../../api/auth';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export default function ForgotPassword() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setStatus('loading');
    try {
      await authService.forgotPassword(data.email);
      setStatus('success');
    } catch (err) {
      // Even on error, we often show success to not leak email existence
      setStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ECE6DD]"
      >
        <Link to="/login" className="inline-flex items-center text-xs text-[#777777] hover:text-[#C89A3D] mb-8 transition-colors">
          <ArrowLeft size={14} className="mr-1" /> Back to Sign In
        </Link>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-2">Reset Password</h2>
          <p className="text-sm text-[#777777]">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {status === 'success' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">Check your email</h3>
            <p className="text-sm text-[#777777] mb-6">If an account exists with this email, a password reset link has been sent.</p>
            <Link to="/login" className="text-[#C89A3D] text-sm font-medium hover:underline">Return to Sign In</Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#2C2C2C] tracking-wider uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full h-12 px-4 rounded-xl border bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-colors ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#ECE6DD] focus:border-[#C89A3D] focus:ring-[#C89A3D]'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-12 bg-[#2C2C2C] hover:bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
