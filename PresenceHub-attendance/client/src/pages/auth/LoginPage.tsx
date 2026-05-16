// ============================================
// Login Page — Premium UI with Forgot Password
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, LogIn, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { authApi } from '../../api/auth.api';
import { getDashboardRoute } from '../../components/shared/RoleGate';
import { Role } from '@college-erp/shared';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authApi.login({ email, password });
      const { accessToken, user } = response.data;

      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.firstName}!`);

      const dashboardRoute = getDashboardRoute(user.role as Role);
      navigate(dashboardRoute, { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsResetting(true);
    try {
      await authApi.resetPassword({ identifier: resetIdentifier, newPassword });
      setResetSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetIdentifier('');
    setNewPassword('');
    setConfirmPassword('');
    setResetSuccess(false);
  };

  // Demo credential quick-fill
  const fillDemo = (role: 'admin' | 'faculty' | 'student') => {
    const creds = {
      admin: { email: 'admin@college.edu', password: 'college123' },
      faculty: { email: 'rajesh.sharma@college.edu', password: 'college123' },
      student: { email: 'aarav.sharma@student.college.edu', password: 'college123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* ---- Left Panel — Branding ---- */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">College ERP</h1>
            </div>

            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              Smart Campus<br />
              <span className="text-primary-200">Management System</span>
            </h2>

            <p className="text-lg text-primary-200/80 max-w-md leading-relaxed">
              Streamline your institution with integrated attendance tracking,
              grade management, fee processing, and real-time notifications.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { label: 'Attendance', desc: 'Real-time tracking' },
                { label: 'Grades', desc: 'Auto-calculated' },
                { label: 'Fees', desc: 'Online payments' },
                { label: 'Reports', desc: 'PDF export' },
              ].map((feat, i) => (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
                >
                  <div className="w-2 h-2 rounded-full bg-accent-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">{feat.label}</p>
                    <p className="text-xs text-primary-200/70">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---- Right Panel — Login Form ---- */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-surface-900">College ERP</h1>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 mb-1">Welcome back</h2>
          <p className="text-surface-700/60 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or User ID */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">
                Email, Employee ID, or Roll Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700/30" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@college.edu or ID"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder:text-surface-700/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-surface-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700/30" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder:text-surface-700/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-700/30 hover:text-surface-700/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all',
                isSubmitting
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'gradient-primary hover:shadow-lg hover:shadow-primary-500/25'
              )}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* ---- Demo Credentials ---- */}
          <div className="mt-8 pt-6 border-t border-surface-200">
            <p className="text-xs font-medium text-surface-700/40 uppercase tracking-wider mb-3">
              Quick Demo Login (password: college123)
            </p>
            <div className="flex gap-2">
              {[
                { role: 'admin' as const, label: 'Admin', color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' },
                { role: 'faculty' as const, label: 'Faculty', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
                { role: 'student' as const, label: 'Student', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
              ].map((btn) => (
                <button
                  key={btn.role}
                  type="button"
                  onClick={() => fillDemo(btn.role)}
                  className={cn(
                    'flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors',
                    btn.color
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---- Forgot Password Modal ---- */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={closeForgotPassword} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-elevated p-8 z-10"
            >
              {resetSuccess ? (
                /* Success State */
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 mb-2">Password Reset!</h3>
                  <p className="text-sm text-surface-500 mb-6">
                    Your password has been updated. You can now login with your new password.
                  </p>
                  <button
                    onClick={closeForgotPassword}
                    className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                /* Reset Form */
                <>
                  <button
                    onClick={closeForgotPassword}
                    className="flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700 mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <KeyRound className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-surface-900">Reset Password</h3>
                      <p className="text-sm text-surface-500">Enter your credentials to set a new password</p>
                    </div>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Email, Employee ID, or Roll Number
                      </label>
                      <input
                        type="text"
                        required
                        value={resetIdentifier}
                        onChange={(e) => setResetIdentifier(e.target.value)}
                        placeholder="Enter your identifier"
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isResetting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          Reset Password
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
