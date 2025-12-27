export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'cliente';
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  balance: number;
  mercadopago_wallet?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  type: 'cargo' | 'pago';
  amount: number;
  description: string | null;
  status: 'aprobado' | 'pendiente' | 'rechazado';
  created_by: string;
  approved_by: string | null;
  created_at: string;
  approved_at: string | null;
  balance_before: number | null;
  balance_after: number | null;
}

export interface ModificationRequest {
  id: string;
  account_id: string;
  type: 'cargo' | 'pago';
  amount: number;
  description: string | null;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  requested_by: string;
  reviewed_by: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface ClientNote {
  id: string;
  user_id: string;
  created_by: string;
  note_type: 'contact' | 'reminder' | 'general';
  subject: string;
  message: string;
  contact_method?: 'whatsapp' | 'phone' | 'email' | 'in_person' | 'other';
  created_at: string;
  updated_at: string;
}
