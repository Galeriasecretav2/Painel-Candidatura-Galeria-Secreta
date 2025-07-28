import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Candidatura = Database['public']['Tables']['candidaturas']['Row'];
type CandidaturaInsert = Database['public']['Tables']['candidaturas']['Insert'];
type CandidaturaUpdate = Database['public']['Tables']['candidaturas']['Update'];

export const useCandidaturas = () => {
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidaturas = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('candidaturas')
        .select('*')
        .order('data_submissao', { ascending: false });

      if (error) {
        throw error;
      }

      setCandidaturas(data || []);
    } catch (err) {
      console.error('Erro ao buscar candidaturas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createCandidatura = async (candidatura: CandidaturaInsert) => {
    try {
      const { data, error } = await supabase
        .from('candidaturas')
        .insert([candidatura])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCandidaturas(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Erro ao criar candidatura:', err);
      throw err;
    }
  };

  const updateCandidatura = async (id: string, updates: CandidaturaUpdate) => {
    try {
      const { data, error } = await supabase
        .from('candidaturas')
        .update({
          ...updates,
          data_atualizacao: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCandidaturas(prev =>
        prev.map(candidatura =>
          candidatura.id === id ? data : candidatura
        )
      );

      return data;
    } catch (err) {
      console.error('Erro ao atualizar candidatura:', err);
      throw err;
    }
  };

  const updateCandidaturaStatus = async (
    id: string, 
    status: 'aprovada' | 'rejeitada'
  ) => {
    return updateCandidatura(id, { status });
  };

  const deleteCandidatura = async (id: string) => {
    try {
      const { error } = await supabase
        .from('candidaturas')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCandidaturas(prev =>
        prev.filter(candidatura => candidatura.id !== id)
      );
    } catch (err) {
      console.error('Erro ao deletar candidatura:', err);
      throw err;
    }
  };

  const getCandidaturaById = (id: string) => {
    return candidaturas.find(candidatura => candidatura.id === id);
  };

  const getCandidaturasByStatus = (status: 'pendente' | 'aprovada' | 'rejeitada') => {
    return candidaturas.filter(candidatura => candidatura.status === status);
  };

  const getCandidaturasByProvincia = (provincia: string) => {
    return candidaturas.filter(candidatura => candidatura.provincia === provincia);
  };

  const getStats = () => {
    const total = candidaturas.length;
    const pendentes = candidaturas.filter(c => c.status === 'pendente').length;
    const aprovadas = candidaturas.filter(c => c.status === 'aprovada').length;
    const rejeitadas = candidaturas.filter(c => c.status === 'rejeitada').length;

    return {
      total,
      pendentes,
      aprovadas,
      rejeitadas,
      taxaAprovacao: total > 0 ? Math.round((aprovadas / total) * 100) : 0,
    };
  };

  useEffect(() => {
    fetchCandidaturas();

    // Escutar mudanças em tempo real
    const subscription = supabase
      .channel('candidaturas_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'candidaturas',
        },
        (payload) => {
          console.log('Candidatura changed:', payload);
          fetchCandidaturas(); // Recarregar dados quando houver mudanças
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    candidaturas,
    loading,
    error,
    fetchCandidaturas,
    createCandidatura,
    updateCandidatura,
    updateCandidaturaStatus,
    deleteCandidatura,
    getCandidaturaById,
    getCandidaturasByStatus,
    getCandidaturasByProvincia,
    getStats,
  };
};