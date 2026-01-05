'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { User, Building2, Shield } from 'lucide-react';
import Logo from '@/components/Logo';

type AuthMode = 'welcome' | 'login-admin' | 'login-cliente' | 'register' | 'forgot-password';
type UserType = 'cliente' | 'admin' | null;

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [linkCode, setLinkCode] = useState('');

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!userError && userData) {
          if (userData.role === 'admin') {
            router.push('/admin');
            return;
          } else if (userData.role === 'cliente') {
            router.push('/cliente');
            return;
          }
        }
      }
    } catch (err) {
      console.error('Error checking session:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Email o contraseña incorrectos');
        } else if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirma tu email antes de iniciar sesión');
        }
        throw signInError;
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, full_name, approved')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error obteniendo datos del usuario:', userError);
          throw new Error('No se pudo obtener la información del usuario. Por favor, contacta al administrador.');
        }

        if (!userData) {
          throw new Error('Usuario no encontrado en la base de datos. Por favor, contacta al administrador.');
        }

        console.log('Usuario autenticado:', userData.full_name, 'Rol:', userData.role);

        // Verificar si el administrador está aprobado
        if (userData.role === 'admin' && !userData.approved) {
          await supabase.auth.signOut();
          throw new Error('Tu cuenta de administrador aún no ha sido aprobada. Por favor, espera a que un administrador existente apruebe tu solicitud.');
        }

        if (userData.role === 'admin') {
          router.push('/admin');
        } else if (userData.role === 'cliente') {
          router.push('/cliente');
        } else {
          throw new Error(`Rol de usuario inválido: ${userData.role}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setSuccess('Se ha enviado un email con instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y carpeta de spam.');
      setEmail('');
      
      setTimeout(() => {
        setMode('welcome');
        setSuccess('');
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el email de recuperación');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      // Crear usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (signUpError) {
        // Traducir errores comunes de Supabase
        if (signUpError.message.includes('User already registered') || 
            signUpError.message.includes('already been registered')) {
          throw new Error('Este email ya está registrado. Por favor, inicia sesión.');
        } else if (signUpError.message.includes('Password should be')) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        } else if (signUpError.message.includes('duplicate key value violates unique constraint')) {
          throw new Error('Este email ya está registrado. Por favor, usa otro email o inicia sesión.');
        } else if (signUpError.message.includes('Invalid email')) {
          throw new Error('El formato del email no es válido');
        }
        // Error genérico en español
        throw new Error('Error al crear la cuenta: ' + signUpError.message);
      }

      if (data.user) {
        console.log('Registrando usuario con rol:', userType);
        
        // Crear registro en tabla users
        // Si es admin, marcar como no aprobado (requiere autorización)
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role: userType,
            approved: userType === 'cliente' ? true : false,
            approved_at: userType === 'cliente' ? new Date().toISOString() : null,
          });

        if (userError) {
          console.error('Error al crear usuario en BD:', userError);
          // Traducir error de email duplicado
          if (userError.message.includes('duplicate key value violates unique constraint')) {
            throw new Error('Este email ya está registrado. Por favor, usa otro email o inicia sesión.');
          }
          throw new Error('Error al guardar los datos: ' + userError.message);
        }

        console.log('Usuario creado exitosamente con rol:', userType);

        // Si es admin, crear solicitud de aprobación
        if (userType === 'admin') {
          const { error: requestError } = await supabase
            .from('admin_approval_requests')
            .insert({
              user_id: data.user.id,
              email,
              full_name: fullName,
              status: 'pendiente',
            });

          if (requestError) {
            console.error('Error al crear solicitud de aprobación:', requestError);
          }
        }

        // Si es cliente, crear cuenta corriente o vincular con código
        if (userType === 'cliente') {
          // Si tiene código de vinculación, buscar cuenta existente
          if (linkCode.trim()) {
            const { data: existingAccount, error: findError } = await supabase
              .from('accounts')
              .select('*')
              .eq('link_code', linkCode.trim())
              .single();

            if (findError || !existingAccount) {
              throw new Error('Código de vinculación inválido. Verifica el código e intenta de nuevo.');
            }

            // Vincular cuenta existente con el nuevo usuario
            const { error: linkError } = await supabase
              .from('accounts')
              .update({ user_id: data.user.id })
              .eq('link_code', linkCode.trim());

            if (linkError) {
              throw new Error('Error al vincular la cuenta: ' + linkError.message);
            }

            // Actualizar el registro en users con el nuevo ID de auth
            const oldUserId = existingAccount.user_id;
            if (oldUserId) {
              // Eliminar el registro temporal
              await supabase
                .from('users')
                .delete()
                .eq('id', oldUserId);
            }

            setSuccess(`¡Cuenta vinculada exitosamente! Tu saldo de $${existingAccount.balance.toFixed(2)} ha sido sincronizado. \n\n📧 IMPORTANTE: Hemos enviado un email de confirmación a ${email}. Por favor, revisa tu bandeja de entrada (y carpeta de spam) y confirma tu cuenta antes de iniciar sesión.`);
          } else {
            // Crear nueva cuenta corriente
            const { error: accountError } = await supabase
              .from('accounts')
              .insert({
                user_id: data.user.id,
                balance: 0,
              });

            if (accountError) {
              throw new Error('Error al crear la cuenta corriente: ' + accountError.message);
            }

            setSuccess(`¡Registro exitoso! \n\n📧 IMPORTANTE: Hemos enviado un email de confirmación a ${email}. \n\nPor favor, revisa tu bandeja de entrada (y carpeta de spam) y haz click en el enlace de confirmación antes de iniciar sesión. \n\nSi no recibes el email en 5 minutos, revisa tu carpeta de spam.`);
          }
        } else {
          // Para admin, mostrar mensaje de aprobación pendiente
          setSuccess(`¡Registro exitoso! \n\n📧 IMPORTANTE: Hemos enviado un email de confirmación a ${email}. Por favor, confirma tu cuenta. \n\n⏳ APROBACIÓN REQUERIDA: Tu cuenta de administrador debe ser aprobada por un administrador existente antes de poder acceder al sistema. Recibirás una notificación cuando tu cuenta sea aprobada.`);
        }
        
        // Limpiar formulario
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setLinkCode('');
        
        // Volver a welcome después de 5 segundos
        setTimeout(() => {
          setMode('welcome');
          setSuccess('');
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Pantalla de bienvenida - Selección de tipo de login
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xl">
                <Logo size="lg" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-2 sm:mb-3 px-4">
              Bienvenido a Chacinar
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 px-4">
              Sistema de gestión de cuentas corrientes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 px-2 sm:px-0">
            {/* Login Admin */}
            <Card 
              className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-red-600 active:scale-95"
              onClick={() => {
                setUserType('admin');
                setMode('login-admin');
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Administrador</h3>
                <p className="text-sm text-neutral-600">Gestiona clientes y cuentas</p>
              </div>
            </Card>

            {/* Login Cliente */}
            <Card 
              className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-red-600 active:scale-95"
              onClick={() => {
                setUserType('cliente');
                setMode('login-cliente');
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">Cliente</h3>
                <p className="text-xs sm:text-sm text-neutral-600">Consulta tu cuenta corriente</p>
              </div>
            </Card>
          </div>

          <div className="px-2 sm:px-0">
            <Button
              variant="outline"
              onClick={() => setMode('register')}
              className="w-full py-3 text-sm sm:text-base"
            >
              ¿No tienes cuenta? Registrarse
            </Button>

            <p className="text-center text-sm text-neutral-500 mt-4">
              Chacinados y embutidos artesanales Monte Buey
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de login admin
  if (mode === 'login-admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4 sm:p-6">
        <Card className="max-w-md w-full p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-2 shadow-xl">
              <Logo size="md" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 text-center mb-2">
            Iniciar Sesión - Administrador
          </h2>
          <p className="text-sm sm:text-base text-center text-neutral-600 mb-6">
            Accede al panel de administración
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-apple mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="w-full text-sm text-red-600 hover:text-red-700 underline"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode('welcome')}
              className="w-full"
            >
              Volver
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Pantalla de login cliente
  if (mode === 'login-cliente') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-2 shadow-xl">
              <Logo size="md" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">
            Iniciar Sesión - Cliente
          </h2>
          <p className="text-center text-neutral-600 mb-6">
            Consulta tu cuenta corriente
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-apple mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="w-full text-sm text-red-600 hover:text-red-700 underline"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode('welcome')}
              className="w-full"
            >
              Volver
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Pantalla de recuperación de contraseña
  if (mode === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-2 shadow-xl">
              <Logo size="md" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">
            Recuperar Contraseña
          </h2>
          <p className="text-center text-neutral-600 mb-6">
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-apple mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-apple mb-4 whitespace-pre-line">
              {success}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode('welcome')}
              className="w-full"
            >
              Volver
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Pantalla de registro
  if (mode === 'register' && !userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              ¿Cómo te registrarás?
            </h2>
            <p className="text-neutral-600">
              Selecciona el tipo de cuenta que deseas crear
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card
              className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-red-600"
              onClick={() => setUserType('cliente')}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Cliente</h3>
              <p className="text-neutral-600 text-sm">
                Accede a tu cuenta corriente, visualiza saldos y solicita modificaciones
              </p>
            </Card>

            <Card
              className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-red-600"
              onClick={() => setUserType('admin')}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Building2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Administrador</h3>
              <p className="text-neutral-600 text-sm">
                Gestiona clientes, aprueba solicitudes y administra cuentas corrientes
              </p>
            </Card>
          </div>

          <Button
            variant="ghost"
            onClick={() => setMode('welcome')}
            className="w-full"
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Formulario de registro
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <Logo size="md" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">
          Registro como {userType === 'admin' ? 'Administrador' : 'Cliente'}
        </h2>
        <p className="text-center text-neutral-600 mb-6">
          Completa tus datos para crear tu cuenta
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-apple mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-apple mb-4">
            <div className="whitespace-pre-line">
              <p className="font-medium">✅ {success.split('\n\n')[0]}</p>
              {success.includes('📧') && (
                <div className="mt-3 text-sm space-y-1">
                  {success.split('\n\n').slice(1).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm mt-3 font-medium">Serás redirigido al login en unos segundos...</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {userType === 'cliente' && (
            <div className="bg-blue-50 border border-blue-200 rounded-apple p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 ¿Tienes un código de vinculación?</strong><br />
                Si el administrador ya creó tu cuenta, ingresa el código de 4 dígitos para vincularla y sincronizar tu saldo.
              </p>
            </div>
          )}

          <Input
            type="text"
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            type="email"
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <Input
            type="password"
            label="Confirmar contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className={confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}
          />

          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-600 -mt-2">
              ⚠️ Las contraseñas no coinciden
            </p>
          )}

          {userType === 'cliente' && (
            <Input
              type="text"
              label="Código de vinculación (opcional)"
              placeholder="1234"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value)}
              maxLength={4}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setUserType(null);
              setError('');
            }}
            className="w-full"
          >
            Volver
          </Button>
        </form>
      </Card>
    </div>
  );
}
