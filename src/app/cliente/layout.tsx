'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Notifications from '@/components/Notifications';
import Logo from '@/components/Logo';

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/auth');
      return;
    }

    const { data: user } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', session.user.id)
      .single();

    if (user?.role === 'admin') {
      router.push('/admin');
      return;
    }

    setUserName(user?.full_name || '');
    setUserId(session.user.id);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28">
            <div className="flex items-center space-x-4">
              <Logo size="sm" />
              <div className="border-l border-neutral-300 pl-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-brand" />
                  <h1 className="text-lg font-bold text-neutral-900">Mi Cuenta</h1>
                </div>
                <p className="text-xs text-neutral-600">{userName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Notifications userId={userId} />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
