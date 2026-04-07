import { useState } from 'react';
import { BrainCircuit, LogIn, Mail, KeyRound, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';

export const Login = () => {
  const { signInWithGoogle, signInWithPassword, signUpWithEmail, verifySignupOtp, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'initial' | 'login_signup' | 'otp_verify'>('initial');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMsg('');
    
    if (isLoginMode) {
      const { error } = await signInWithPassword(email, password);
      setIsLoading(false);
      if (error) setErrorMsg("Sai địa chỉ email hoặc mật khẩu.");
    } else {
      const { error } = await signUpWithEmail(email, password);
      setIsLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setStep('otp_verify');
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) return;
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await verifySignupOtp(email, token);
    setIsLoading(false);
    if (error) setErrorMsg('Mã OTP không hợp lệ, vui lòng kiểm tra lại!');
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 md:p-10 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-700 text-center relative overflow-hidden">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
        <BrainCircuit className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Vocab<span className="text-indigo-600 dark:text-indigo-400">AI</span> Studio</h1>
      
      {step === 'initial' && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            Đăng nhập để bắt đầu tạo và lưu trữ các bộ Flashcard thông minh.
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 dark:bg-white dark:border-zinc-200 text-white dark:text-zinc-900 py-4 px-6 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <LogIn className="w-5 h-5" />
              Tiếp tục với Google
            </button>
            <div className="flex items-center gap-4 text-zinc-400 my-1">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
              <span className="text-xs uppercase tracking-widest font-semibold">Hoặc</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            <button
              onClick={() => { setStep('login_signup'); setIsLoginMode(true); setErrorMsg(''); }}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white py-4 px-6 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <Mail className="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
              Sử dụng Email & Mật khẩu
            </button>
          </div>
        </div>
      )}

      {step === 'login_signup' && (
        <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col items-center">
          <button 
            type="button" 
            onClick={() => setStep('initial')}
            className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 w-full mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          
          <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 mb-6 w-full relative">
            <div 
               className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-700 rounded-lg shadow-sm transition-all duration-300 ${isLoginMode ? 'left-1' : 'left-[50%]'}`}
            ></div>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-semibold z-10 transition-colors ${isLoginMode ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
            >Đăng nhập</button>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-semibold z-10 transition-colors ${!isLoginMode ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
            >Đăng ký mới</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left w-full">
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium shadow-inner"
              />
            </div>
            
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu (Thêm số và ký tự trên 6 chữ)"
                minLength={6}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium shadow-inner"
              />
            </div>

            {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
            
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="mt-2 w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLoginMode ? "Đăng nhập" : "Đăng ký bảo mật")}
            </button>
          </form>
        </div>
      )}

      {step === 'otp_verify' && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 text-left animate-in slide-in-from-right-4 duration-300">
          <button 
            type="button" 
            onClick={() => setStep('login_signup')}
            className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 w-fit mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Trở lại
          </button>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-1 leading-relaxed">
            Chúng tôi vừa gửi 6 số OTP xác thực vào hòm thư <b>{email}</b>. Vui lòng kiểm tra (cả Spam) để kích hoạt tài khoản.
          </p>
          <div className="relative mt-2">
            <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white tracking-[0.5em] font-mono text-center text-lg shadow-inner uppercase"
            />
          </div>
          {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
          <button
            type="submit"
            disabled={isLoading || !token}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-green-600/20"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác thực OTP & Hoàn tất"}
          </button>
        </form>
      )}
    </div>
  );
};
