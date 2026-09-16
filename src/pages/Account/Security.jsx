import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../api/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
  return strength;
};

const securitySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Security() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(securitySchema),
    mode: "onBlur"
  });

  const newPasswordValue = watch('newPassword', '');
  const strength = getPasswordStrength(newPasswordValue);

  const onSubmit = async (data) => {
    setStatus('loading');
    setMessage('');
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setStatus('success');
      setMessage('Password updated successfully.');
      reset();
    } catch (err) {
      setStatus('error');
      setMessage('Failed to update password. Please check your current password.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-bold text-[#2C2C2C] mb-6">Security & Password</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        {message && (
          <div className={`p-4 rounded-xl text-sm border ${status === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {message}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#2C2C2C] tracking-wider uppercase mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              {...register('currentPassword')}
              className={`w-full h-12 px-4 rounded-xl border bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-colors ${errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-[#ECE6DD] focus:border-[#C89A3D] focus:ring-[#C89A3D]'}`}
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777777]">
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C2C2C] tracking-wider uppercase mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              {...register('newPassword')}
              className={`w-full h-12 px-4 rounded-xl border bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-colors ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-[#ECE6DD] focus:border-[#C89A3D] focus:ring-[#C89A3D]'}`}
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777777]">
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {newPasswordValue && (
            <div className="mt-2 flex gap-1 h-1.5">
              <div className={`flex-1 rounded-full ${strength >= 25 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 rounded-full ${strength >= 50 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 rounded-full ${strength >= 75 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 rounded-full ${strength >= 100 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            </div>
          )}
          {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C2C2C] tracking-wider uppercase mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type="password"
              {...register('confirmPassword')}
              className={`w-full h-12 px-4 rounded-xl border bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-1 transition-colors ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-[#ECE6DD] focus:border-[#C89A3D] focus:ring-[#C89A3D]'}`}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-12 px-8 bg-[#2C2C2C] hover:bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
