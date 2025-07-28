import React, { useState } from 'react';
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';

interface Candidatura {
  id: string;
  nome: string;
  idade: number;
  email: string;
  whatsapp: string;
  provincia: string;
  foto: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  dataSubmissao: string;
  experiencia?: boolean;
  motivacao?: string;
  disponibilidade?: string;
}

interface CandidaturasListProps {
  candidaturas: Candidatura[];
  onViewCandidatura: (candidatura: Candidatura) => void;
}

export const CandidaturasList: React.FC<CandidaturasListProps> = ({ 
  candidaturas, 
  onViewCandidatura 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinciaFilter, setProvinciaFilter] = useState<string>('all');

  const filteredCandidaturas = candidaturas.filter(candidatura => {
    const matchesSearch = candidatura.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidatura.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidatura.status === statusFilter;
    const matchesProvincia = provinciaFilter === 'all' || candidatura.provincia === provinciaFilter;
    
    return matchesSearch && matchesStatus && matchesProvincia;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200',
        icon: Clock
      },
      aprovada: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: CheckCircle
      },
      rejeitada: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: XCircle
      }
    };

    const style = styles[status as keyof typeof styles];
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
        <Icon className="w-3 h-3 mr-1" />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const uniqueProvincias = [...new Set(candidaturas.map(c => c.provincia))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Candidaturas</h2>
        <p className="text-gray-600">Gerencie todas as candidaturas recebidas</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="rejeitada">Rejeitada</option>
            </select>
          </div>

          {/* Province Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={provinciaFilter}
              onChange={(e) => setProvinciaFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todas as Províncias</option>
              {uniqueProvincias.map(provincia => (
                <option key={provincia} value={provincia}>
                  {getProvinciaName(provincia)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Mostrando {filteredCandidaturas.length} de {candidaturas.length} candidaturas
        </p>
      </div>

      {/* Candidaturas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidaturas.map((candidatura) => (
          <div key={candidatura.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img
                src={candidatura.foto}
                alt={candidatura.nome}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                {getStatusBadge(candidatura.status)}
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {candidatura.nome}
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {candidatura.idade} anos • {getProvinciaName(candidatura.provincia)}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {candidatura.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>WhatsApp:</strong> {candidatura.whatsapp}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Submetida em:</strong> {formatDate(candidatura.dataSubmissao)}
                </p>
              </div>

              <button
                onClick={() => onViewCandidatura(candidatura)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Detalhes</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCandidaturas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma candidatura encontrada</h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou termos de busca para encontrar candidaturas.
          </p>
        </div>
      )}
    </div>
  );
};