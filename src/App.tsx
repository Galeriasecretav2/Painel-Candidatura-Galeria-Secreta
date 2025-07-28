import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCandidaturas } from './hooks/useCandidaturas';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { CandidaturasList } from './components/CandidaturasList';
import { CandidaturaDetail } from './components/CandidaturaDetail';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { User, FileText, BarChart3 } from 'lucide-react';
import type { Database } from './lib/database.types';

type Candidatura = Database['public']['Tables']['candidaturas']['Row'];

type CurrentView = 'dashboard' | 'candidaturas' | 'candidatura-detail';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    candidaturas, 
    loading: candidaturasLoading, 
    updateCandidaturaStatus,
    getStats 
  } = useCandidaturas();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');
  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (user && !authLoading) {
      setIsAuthenticated(true);
    } else if (!user && !authLoading) {
      setIsAuthenticated(false);
    }
  }, [user, authLoading]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedCandidatura(null);
  };

  const handleViewCandidatura = (candidatura: Candidatura) => {
    setSelectedCandidatura(candidatura);
    setCurrentView('candidatura-detail');
  };

  const handleUpdateCandidatura = async (id: string, status: 'aprovada' | 'rejeitada') => {
    try {
      await updateCandidaturaStatus(id, status);
      
      // Atualizar candidatura selecionada se for a mesma
      if (selectedCandidatura?.id === id) {
        setSelectedCandidatura(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error('Erro ao atualizar candidatura:', error);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    {
      icon: BarChart3,
      label: 'Dashboard',
      active: currentView === 'dashboard',
      onClick: () => setCurrentView('dashboard')
    },
    {
      icon: FileText,
      label: 'Candidaturas',
      active: currentView === 'candidaturas',
      onClick: () => setCurrentView('candidaturas')
    }
  ];

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard candidaturas={candidaturas} stats={getStats()} loading={candidaturasLoading} />;
      case 'candidaturas':
        return (
          <CandidaturasList 
            candidaturas={candidaturas}
            onViewCandidatura={handleViewCandidatura}
          />
        );
      case 'candidatura-detail':
        return selectedCandidatura ? (
          <CandidaturaDetail 
            candidatura={selectedCandidatura}
            onBack={() => setCurrentView('candidaturas')}
            onUpdateStatus={handleUpdateCandidatura}
          />
        ) : null;
      default:
        return <Dashboard candidaturas={candidaturas} stats={getStats()} loading={candidaturasLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <div className="flex-1 ml-64">
          <Header onLogout={handleLogout} />
          <main className="p-8">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;