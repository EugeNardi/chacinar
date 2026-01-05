'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Obtener rol del usuario
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, approved')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        // Verificar si el administrador está aprobado
        if (userData.role === 'admin' && !userData.approved) {
          await supabase.auth.signOut();
          throw new Error('Tu cuenta de administrador aún no ha sido aprobada. Por favor, espera a que un administrador existente apruebe tu solicitud.');
        }

        if (userData.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/cliente');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-apple mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Chacinar</h1>
          <p className="text-neutral-600">Chacinados y embutidos artesanales</p>
        </div>

        <Card>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-apple">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
