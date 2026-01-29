import React, { useState } from 'react';
import { Quadrant } from './types';
import { categorizeTask } from './geminiService';
import { EisenhowerMatrix } from './components/EisenhowerMatrix';
import { ActivityInput } from './components/ActivityInput';
import { Login } from './components/Auth/Login';
import { useAuth } from './contexts/AuthContext';
import { useTasks } from './hooks/useTasks';
import { useUserConfig } from './hooks/useUserConfig';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
  visible: boolean;
}

const App: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { tasks, addTask, deleteTask, clearAllTasks, updateTask } = useTasks();
  const { config, updateConfig } = useUserConfig();

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [apiLastError, setApiLastError] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'online' | 'offline'>(
    'unknown'
  );
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', visible: false });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const handleAddTask = async (activity: string) => {
    if (!activity.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const quadrant = await categorizeTask(activity);
      await addTask(activity, quadrant);

      const quadrantNames: Record<Quadrant, string> = {
        [Quadrant.DO]: 'Fazer Agora',
        [Quadrant.SCHEDULE]: 'Agendar',
        [Quadrant.DELEGATE]: 'Delegar',
        [Quadrant.ELIMINATE]: 'Eliminar',
      };
      showToast(`✨ Tarefa classificada como "${quadrantNames[quadrant]}" e adicionada!`);
    } catch (_err) {
      setError('Falha ao categorizar a tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      showToast('🗑️ Tarefa removida com sucesso.', 'info');
    } catch (_err) {
      showToast('Erro ao remover tarefa', 'error');
    }
  };

  const _handleClearAll = async () => {
    if (window.confirm('Tem certeza que deseja limpar todas as tarefas?')) {
      try {
        await clearAllTasks();
        showToast('🧹 Todas as tarefas foram removidas.', 'info');
      } catch (_err) {
        showToast('Erro ao limpar tarefas', 'error');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showToast('Logout realizado com sucesso', 'success');
    } catch (_err) {
      showToast('Erro ao fazer logout', 'error');
    }
  };

  const handleMoveTask = async (id: string, newQuadrant: Quadrant) => {
    try {
      await updateTask(id, newQuadrant);
      const quadrantNames: Record<Quadrant, string> = {
        [Quadrant.DO]: 'Fazer Agora',
        [Quadrant.SCHEDULE]: 'Agendar',
        [Quadrant.DELEGATE]: 'Delegar',
        [Quadrant.ELIMINATE]: 'Eliminar',
      };
      showToast(`✨ Tarefa movida para "${quadrantNames[newQuadrant]}"!`, 'success');
    } catch (_err) {
      showToast('Erro ao mover tarefa', 'error');
    }
  };

  const formatMatrixForWhatsApp = () => {
    const quadrants = [
      { q: Quadrant.DO, label: '🔥 *FAZER AGORA (Urgente & Importante)*' },
      { q: Quadrant.SCHEDULE, label: '📅 *AGENDAR (Importante, não Urgente)*' },
      { q: Quadrant.DELEGATE, label: '👤 *DELEGAR (Urgente, não Importante)*' },
      { q: Quadrant.ELIMINATE, label: '🗑️ *ELIMINAR (Não Urgente & Não Importante)*' },
    ];
    let message = `*Minha Matriz Eisenhower (AI)*\n\n`;
    quadrants.forEach(({ q, label }) => {
      const qTasks = tasks.filter((t) => t.quadrant === q);
      message += `${label}:\n${qTasks.length > 0 ? qTasks.map((t) => `• ${t.text}`).join('\n') : '_Vazio_'}\n\n`;
    });
    return message.trim();
  };

  const sendToWhatsApp = async () => {
    if (!config.uazapi_token) {
      setIsSettingsOpen(true);
      return;
    }
    if (tasks.length === 0) {
      showToast('Adicione tarefas antes de enviar!', 'error');
      return;
    }
    setSending(true);
    setApiLastError(null);
    setError(null);
    try {
      const response = await fetch(config.uazapi_url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: config.uazapi_token,
        },
        body: JSON.stringify({ number: config.uazapi_number, text: formatMatrixForWhatsApp() }),
      });
      if (response.ok) {
        setConnectionStatus('online');
        showToast('🚀 Matriz enviada com sucesso para o WhatsApp!');
      } else {
        setApiLastError(response.status);
        setConnectionStatus('offline');
        throw new Error(
          response.status === 401
            ? 'Token Inválido (401)'
            : response.status === 503
              ? 'WhatsApp Desconectado (503)'
              : 'Erro ao enviar'
        );
      }
    } catch (err: any) {
      showToast(err.message, 'error');
      setIsSettingsOpen(true);
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-white mb-4"></i>
          <p className="text-white font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
      {/* Toast Notification */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}
      >
        <div
          className={`px-6 py-3 rounded-full shadow-2xl border flex items-center gap-3 font-semibold text-sm ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white border-emerald-400'
              : toast.type === 'error'
                ? 'bg-red-500 text-white border-red-400'
                : 'bg-slate-800 text-white border-slate-700'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
            className="hover:opacity-70"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <header className="mb-10 text-center relative">
        <div className="absolute left-0 top-0 hidden md:flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Olá, <span className="font-bold text-slate-700">{user.email?.split('@')[0]}</span>
          </span>
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
        <div className="absolute right-0 top-0 hidden md:flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border transition-colors ${
              connectionStatus === 'online'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : connectionStatus === 'offline'
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-500 animate-pulse' : connectionStatus === 'offline' ? 'bg-red-500' : 'bg-slate-300'}`}
            ></span>
            {connectionStatus === 'online'
              ? 'Conectado'
              : connectionStatus === 'offline'
                ? 'Desconectado'
                : 'Pronto'}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
          Matriz Eisenhower <span className="text-indigo-600">AI</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Categorize tarefas com inteligência e organize seu WhatsApp.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center sticky top-4 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100">
          <ActivityInput onAdd={handleAddTask} isLoading={loading} />
          <div className="flex gap-2">
            <button
              onClick={sendToWhatsApp}
              disabled={sending || tasks.length === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${sending || tasks.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'}`}
            >
              {sending ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fab fa-whatsapp text-lg"></i>
              )}
              Enviar
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-3 rounded-xl transition-all ${isSettingsOpen ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              title="Configurações"
            >
              <i className="fas fa-cog"></i>
            </button>
            <button
              onClick={() => setShowTips(!showTips)}
              className={`p-3 rounded-xl transition-all ${showTips ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
              title="Dicas de Uso"
            >
              <i className="fas fa-lightbulb"></i>
            </button>
          </div>
        </div>

        {showTips && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
              <i className="fas fa-graduation-cap"></i> Como obter melhores resultados?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-bold text-red-600 uppercase">🔥 DO (Fazer)</p>
                <p className="text-slate-600">
                  &quot;Finalizar relatório do cliente que vence em 1 hora&quot;
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-blue-600 uppercase">📅 SCHEDULE (Agendar)</p>
                <p className="text-slate-600">
                  &quot;Planejar as metas de marketing para o próximo semestre&quot;
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-amber-600 uppercase">👤 DELEGATE (Delegar)</p>
                <p className="text-slate-600 italic">
                  &quot;Comprar cartuchos de tinta urgente para a reunião de hoje&quot;
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-slate-500 uppercase">🗑️ ELIMINATE (Eliminar)</p>
                <p className="text-slate-600">
                  &quot;Ficar olhando o feed do Instagram sem objetivo&quot;
                </p>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-amber-700 italic border-t border-amber-200 pt-2">
              Dica: Seja específico. Em vez de &quot;Comprar coisas&quot;, use &quot;Comprar
              suprimentos de escritório urgentes&quot;.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <EisenhowerMatrix tasks={tasks} onDelete={handleDeleteTask} onMove={handleMoveTask} />
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-plug text-indigo-500"></i> Configuração UAZAPI
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {apiLastError === 503 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600 mt-1">
                      <i className="fas fa-mobile-screen-button"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-red-800 text-sm">
                        WhatsApp Desconectado (503)
                      </h3>
                      <p className="text-xs text-red-700 mt-1">
                        Sua instância perdeu a conexão. Siga os passos no painel:
                      </p>
                    </div>
                  </div>
                  <ol className="text-xs text-red-800 space-y-2 ml-10 list-decimal font-medium">
                    <li>
                      Acesse <b>uazapi.com</b>
                    </li>
                    <li>
                      Clique em <b>Excluir Sessão</b>.
                    </li>
                    <li>
                      Clique em <b>Gerar QR Code</b> e escaneie.
                    </li>
                  </ol>
                  <a
                    href="https://uazapi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Abrir Painel <i className="fas fa-external-link-alt text-[10px]"></i>
                  </a>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Token UAZAPI
                  </label>
                  <input
                    type="text"
                    value={config.uazapi_token || ''}
                    onChange={(e) => {
                      updateConfig({ uazapi_token: e.target.value });
                      setApiLastError(null);
                    }}
                    placeholder="Seu token..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono ${apiLastError === 401 ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    WhatsApp Destino
                  </label>
                  <input
                    type="text"
                    value={config.uazapi_number}
                    onChange={(e) => updateConfig({ uazapi_number: e.target.value })}
                    placeholder="Ex: 5531994718445"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setApiLastError(null);
                    setConnectionStatus('unknown');
                    showToast('Configurações resetadas.', 'info');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Restaurar
                </button>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    showToast('Configurações salvas!', 'success');
                  }}
                  className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>
          Inteligência Artificial por <b>Gemini 3 Flash</b>
        </p>
        <p>
          Inteligência Artificial por <b>Gemini 4 Flash</b>
        </p>
      </footer>
    </div>
  );
};

export default App;
