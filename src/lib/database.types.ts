export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      candidaturas: {
        Row: {
          id: string
          nome: string
          idade: number
          email: string
          whatsapp: string
          provincia: string
          foto_url: string | null
          status: 'pendente' | 'aprovada' | 'rejeitada'
          experiencia: boolean | null
          motivacao: string | null
          disponibilidade: 'tempo_integral' | 'meio_periodo' | 'fins_semana' | 'flexivel' | null
          data_submissao: string
          data_atualizacao: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          idade: number
          email: string
          whatsapp: string
          provincia: string
          foto_url?: string | null
          status?: 'pendente' | 'aprovada' | 'rejeitada'
          experiencia?: boolean | null
          motivacao?: string | null
          disponibilidade?: 'tempo_integral' | 'meio_periodo' | 'fins_semana' | 'flexivel' | null
          data_submissao?: string
          data_atualizacao?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          idade?: number
          email?: string
          whatsapp?: string
          provincia?: string
          foto_url?: string | null
          status?: 'pendente' | 'aprovada' | 'rejeitada'
          experiencia?: boolean | null
          motivacao?: string | null
          disponibilidade?: 'tempo_integral' | 'meio_periodo' | 'fins_semana' | 'flexivel' | null
          data_submissao?: string
          data_atualizacao?: string
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          username: string
          full_name: string
          role: 'admin' | 'super_admin'
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          role?: 'admin' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          role?: 'admin' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}