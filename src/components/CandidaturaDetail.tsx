import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Candidatura = Database['public']['Tables']['candidaturas']['Row'];

interface CandidaturaDetailProps {
  candidatura: Candidatura;
  onBack: () => void;
  onUpdateStatus: (id: string, status: 'aprovada' | 'rejeitada') => void;
}

export const CandidaturaDetail: React.FC<CandidaturaDetailProps> = ({
  candidatura,
  onBack,
  onUpdateStatus
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status: 'aprovada' | 'rejeitada') => {
    setIsUpdating(true);
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    onUpdateStatus(candidatura.id, status);
    setIsUpdating(false);
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

  const getDisponibilidadeName = (disponibilidade: string) => {
    const options: { [key: string]: string } = {
      'tempo_integral': 'Tempo Integral',
      'meio_periodo': 'Meio Período',
      'fins_semana': 'Fins de Semana',
      'flexivel': 'Flexível'
    };
    return options[disponibilidade] || disponibilidade;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

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
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${style.bg} ${style.text} ${style.border}`}>
        <Icon className="w-4 h-4 mr-2" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Detalhes da Candidatura</h2>
            <p className="text-gray-600">Informações completas da candidata</p>
          </div>
        </div>
        {getStatusBadge(candidatura.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="relative">
              <img
                src={candidatura.foto}
                alt={candidatura.nome}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{candidatura.nome}</h3>
                <p className="text-sm opacity-90">{candidatura.idade} anos</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{candidatura.email}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span className="text-sm">{candidatura.whatsapp}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{getProvinciaName(candidatura.provincia)}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Submetida em {formatDate(candidatura.data_submissao)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-amber-600" />
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <p className="text-gray-900 font-medium">{candidatura.nome}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <p className="text-gray-900 font-medium">{candidatura.idade} anos</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
                <p className="text-gray-900 font-medium">{getProvinciaName(candidatura.provincia)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade</label>
                <p className="text-gray-900 font-medium">
                  {candidatura.disponibilidade ? getDisponibilidadeName(candidatura.disponibilidade) : 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Experiência Anterior</h3>
            <div className={`p-4 rounded-lg border-2 ${candidatura.experiencia ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-gray-900 font-medium">
                {candidatura.experiencia ? '✅ Possui experiência anterior' : '❌ Não possui experiência anterior'}
              </p>
            </div>
          </div>

          {/* Motivation */}
          {candidatura.motivacao && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-amber-600" />
                Motivação
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-800 leading-relaxed">{candidatura.motivacao}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {candidatura.status === 'pendente' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ações</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleStatusUpdate('aprovada')}
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Aprovar</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('rejeitada')}
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Rejeitar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};