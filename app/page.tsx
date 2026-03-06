import React from "react";
import { Landmark, AtSign, Lock, Eye, ArrowRight, UserSquare2, ChevronDown } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      {/* Left Pane - Cover Photo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1B5CC9] overflow-hidden flex-col justify-between">
         {/* Background Image with Overlay */}
         <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop" 
             alt="University Building" 
             className="w-full h-full object-cover mix-blend-overlay opacity-60"
           />
           {/* Gradient overlay for text legibility */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#1853B8]/90 to-[#124296]/90 mix-blend-multiply"></div>
           <div className="absolute inset-0 bg-[#0044CC] opacity-60 mix-blend-color"></div>
         </div>
         
         <div className="relative z-10 p-12 pr-24 flex flex-col h-full justify-between">
           {/* Logo */}
           <div className="flex items-center gap-3 text-white font-bold text-2xl tracking-tight">
             <div className="bg-white text-[#1B5CC9] p-1.5 rounded-lg">
               <Landmark className="w-6 h-6" />
             </div>
             <span>UniLink</span>
           </div>

           {/* Hero Text */}
           <div className="mt-auto mb-32">
             <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
               Centralized<br/>Campus Resource<br/>Hub
             </h1>
             <p className="text-white/90 text-lg max-w-md leading-relaxed font-medium">
               Efficiently manage lecture halls, specialized laboratories, and high-end equipment across all university faculties in one seamless interface.
             </p>
           </div>

           {/* Footer Links */}
           <div className="flex items-center gap-6 text-white/90 text-sm font-semibold">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-white transition-colors">Help Center</a>
           </div>
         </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-[28px] font-bold text-[#111827] tracking-tight">Welcome back</h2>
            <p className="text-[#6B7280] text-[15px] font-medium">
              Please enter your credentials to access the management portal.
            </p>
          </div>

          <form className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#374151]">
                University Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5CC9]/20 focus:border-[#1B5CC9] transition-colors"
                  placeholder="student_name@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#374151]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5CC9]/20 focus:border-[#1B5CC9] transition-colors"
                  placeholder="Enter your password"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#374151]">
                Account Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserSquare2 className="h-5 w-5 text-gray-400" />
                </div>
                <select className="block w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#1B5CC9]/20 focus:border-[#1B5CC9] transition-colors">
                  <option>Student</option>
                  <option>Faculty</option>
                  <option>Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#1B5CC9] focus:ring-[#1B5CC9] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[13px] text-gray-700 font-semibold">
                  Remember me
                </label>
              </div>

              <div className="text-[13px]">
                <a href="#" className="font-bold text-[#1B5CC9] hover:text-[#1447a1] transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#1B5CC9] hover:bg-[#1447a1] focus:outline-none focus:ring-4 focus:ring-[#1B5CC9]/20 transition-all shadow-sm"
              >
                Sign In to UniLink
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-3 bg-white text-gray-400 font-bold tracking-[0.1em] uppercase">
                  Institutional Access
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-[13px] font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1B5CC9] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.69 17.53V20.24H19.26C21.35 18.32 22.56 15.54 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 22.02 19.26 20.24L15.69 17.53C14.72 18.18 13.47 18.57 12 18.57C9.15 18.57 6.74 16.65 5.88 14.07H2.21V16.92C4.01 20.49 7.7 23 12 23Z" fill="#34A853"/>
                  <path d="M5.88 14.07C5.66 13.42 5.53 12.72 5.53 12C5.53 11.28 5.66 10.58 5.88 9.93V7.08H2.21C1.48 8.53 1.06 10.22 1.06 12C1.06 13.78 1.48 15.47 2.21 16.92L5.88 14.07Z" fill="#FBBC05"/>
                  <path d="M12 5.43C13.62 5.43 15.06 5.99 16.21 7.08L19.34 3.95C17.46 2.19 14.97 1.13 12 1.13C7.7 1.13 4.01 3.51 2.21 7.08L5.88 9.93C6.74 7.35 9.15 5.43 12 5.43Z" fill="#EA4335"/>
                </svg>
                Google SSO
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-[13px] font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1B5CC9] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="#0A66C2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn SSO
              </button>
            </div>
            
            <p className="mt-8 text-center text-[13px] text-gray-600 font-medium">
              New to UniLink?{' '}
              <a href="#" className="font-bold text-[#1B5CC9] hover:text-[#1447a1] transition-colors">
                Register your account
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
