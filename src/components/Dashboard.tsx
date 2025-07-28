import React from 'react';
import { Users, Clock, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Candidatura = Database['public']['Tables']['candidaturas']['Row'];

interface Stats {
  total: number;
  pendentes: number;
  aprovadas: number;
  rejeitadas: number;
  taxaAprovacao: number;
}
interface DashboardProps {
  candidaturas: Candidatura[];
  stats: Stats;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ candidaturas, stats, loading }) => {
  const { total: totalCandidaturas, pendentes, aprovadas, rejeitadas, taxaAprovacao } = stats;

  const recentCandidaturas = candidaturas
    .sort((a, b) => new Date(b.data_submissao).getTime() - new Date(a.data_submissao).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Total de Candidaturas',
      value: totalCandidaturas,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pendentes',
      value: pendentes,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Aprovadas',
      value: aprovadas,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Rejeitadas',
      value: rejeitadas,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: 'bg-amber-100 text-amber-800 border-amber-200',
      aprovada: 'bg-green-100 text-green-800 border-green-200',
      rejeitada: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getProvinciaName = (provincia: string) => {
    const provincias: { [key: string]: string } = {
      'cabo-delgado': 'Cabo Delgado',
      'gaza': 'Gaza',
      'inhambane': 'Inhambane',
      'manica': 'Manica',
      'maputo': 'Maputo',
      'maputo-cidade': 'Maputo (Cidade)',
      'nampula': 'Nampula',
      'niassa': 'Niassa',
      'sofala': 'Sofala',
      'tete': 'Tete',
      'zambezia': 'Zambézia'
    };
    return provincias[provincia] || provincia;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral das candidaturas e estatísticas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Candidaturas Recentes</h3>
            </div>
            <span className="text-sm text-gray-500">{recentCandidaturas.length} candidaturas</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentCandidaturas.map((candidatura) => (
            <div key={candidatura.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={candidatura.foto}
                    alt={candidatura.nome}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {candidatura.nome}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {candidatura.idade} anos • {getProvinciaName(candidatura.provincia)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(candidatura.status)}
                      <span className="text-xs text-gray-400">
                        {formatDate(candidatura.data_submissao)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg text-white overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Ações Pendentes</h3>
            <p className="text-amber-100 mb-4">
              Você tem {pendentes} candidaturas aguardando revisão
            </p>
            <button className="bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors duration-200">
              Revisar Agora
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg text-white overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Taxa de Aprovação</h3>
            <p className="text-green-100 mb-4">
              {taxaAprovacao}% das candidaturas foram aprovadas
            </p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200">
              Ver Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};