"use client";

import React, { useState } from "react";
import { X, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setErrorMessage(null);
    setSignupSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error);
        } else {
          onClose();
        }
      } else {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          setErrorMessage(error);
        } else {
          setSignupSuccess(true);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao conectar com o Google.");
    }
  };

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-300">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        {signupSuccess ? (
          /* Tela de Sucesso no Cadastro */
          <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-[#44FF00]/10 rounded-full flex items-center justify-center text-[#171717] mx-auto">
              <Sparkles size={24} className="text-[#44FF00]" />
            </div>
            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
              Cadastro Realizado! 🎉
            </h3>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-left">
              <p className="text-xs text-green-800 font-bold leading-relaxed">
                Quase lá! Enviamos um link de confirmação para o seu e-mail: <strong className="text-gray-900">{email}</strong>.
              </p>
              <p className="text-[11px] text-green-700 font-medium leading-relaxed mt-2">
                Por favor, clique no link enviado para ativar sua conta e liberar o acesso.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Entendi 👍
            </button>
          </div>
        ) : (
          /* Formulário de Login / Cadastro */
          <div className="space-y-5">
            <div className="text-center space-y-1.5 mt-2">
              <div 
                style={textureLaranjaStyle}
                className="w-full py-1.5 px-3 shadow-sm rounded-xl text-center border border-gray-100 mb-2"
              >
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white m-0">
                  {mode === "login" ? "Entrar no AmiguMundo" : "Criar Conta Grátis"}
                </h2>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {mode === "login" 
                  ? "Acesse suas receitas e favoritos de qualquer dispositivo!" 
                  : "Guarde seus favoritos e acompanhe suas novidades!"}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
                <p className="text-red-600 font-bold text-xs uppercase leading-tight">
                  ❌ {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium text-sm"
                  />
                </div>
                {mode === "signup" && (
                  <span className="text-[9px] text-gray-400 mt-0.5 block ml-1">Mínimo de 6 caracteres</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {isSubmitting 
                  ? (mode === "login" ? "Entrando..." : "Criando conta...") 
                  : (mode === "login" ? "Entrar →" : "Criar Conta →")}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-gray-400 text-[9px] font-bold uppercase tracking-wider">ou</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Botão Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 border border-gray-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.4-4.51 6.76-4.51z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.97 3.7-8.62z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.24 14.55c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.39 6.96C.5 8.74 0 10.74 0 12.8s.5 4.06 1.39 5.84l3.85-3.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.73-2.89c-1.1.74-2.51 1.18-4.23 1.18-3.36 0-5.86-1.81-6.76-4.51L1.39 16.86C3.37 20.75 7.35 23 12 23z"
                />
              </svg>
              Continuar com o Google
            </button>

            {/* Alternar Modo */}
            <div className="text-center">
              <button
                onClick={handleToggleMode}
                disabled={isSubmitting}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors underline"
              >
                {mode === "login" 
                  ? "Não tem conta? Criar conta" 
                  : "Já tem conta? Entrar"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};