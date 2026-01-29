import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signUp, signIn, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setLocalError('Por favor, preencha email e senha');
      return;
    }

    if (password.length < 6) {
      setLocalError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccessMessage('Conta criada com sucesso! Verifique seu email para confirmar.');
        setEmail('');
        setPassword('');
        setTimeout(() => setIsSignUp(false), 2000);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Matriz Eisenhower <span className="text-indigo-200">AI</span>
          </h1>
          <p className="text-indigo-100">Organize suas tarefas com inteligência</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setIsSignUp(false);
                setLocalError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-4 font-bold transition-all ${
                !isSignUp ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setLocalError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-4 font-bold transition-all ${
                isSignUp ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <i className="fas fa-check-circle text-emerald-600 mt-0.5"></i>
                <p className="text-sm text-emerald-700">{successMessage}</p>
              </div>
            )}

            {displayError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-600 mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700">{displayError}</p>
                  {displayError.includes('confirmar') && (
                    <p className="text-xs text-red-600 mt-1">
                      Verifique seu email para o link de confirmação.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? 'Mínimo 6 caracteres' : 'Sua senha'}
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              />
              {isSignUp && (
                <p className="text-xs text-slate-500 mt-1">Mínimo 6 caracteres recomendado</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition-all text-white ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </span>
              ) : isSignUp ? (
                'Criar Conta'
              ) : (
                'Entrar'
              )}
            </button>

            {!isSignUp && (
              <p className="text-center text-sm text-slate-600">
                Não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setLocalError(null);
                  }}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Criar agora
                </button>
              </p>
            )}
          </form>

          {/* Footer Info */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
            <p className="flex items-center gap-2">
              <i className="fas fa-lock text-indigo-600"></i>
              Seus dados são protegidos com Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
