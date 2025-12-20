# Chacinar - Sistema de Cuenta Corriente

Sistema web responsive para gestión de cuentas corrientes de clientes de **Chacinar** (Chacinados y embutidos artesanales Monte Buey).

## ⚠️ ANTES DE EMPEZAR

**El proyecto requiere configuración de Supabase para funcionar.**

👉 **Lee el archivo [CONFIGURACION.md](CONFIGURACION.md) para instrucciones detalladas paso a paso.**

## 🚀 Características

- ✅ **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- ✅ **UI Moderna**: Inspirada en Notion y Apple con excelente UX
- ✅ **Autenticación Segura**: Sistema de roles (Admin/Cliente)
- ✅ **Panel de Administrador**: Gestión completa de clientes y aprobación de solicitudes
- ✅ **Panel de Cliente**: Visualización de saldo y solicitud de modificaciones
- ✅ **Base de Datos**: Supabase con Row Level Security

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: TailwindCSS con diseño personalizado
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Iconos**: Lucide React

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. En el SQL Editor, ejecutar el script `supabase/schema.sql`
3. Copiar las credenciales del proyecto

### 3. Configurar variables de entorno

Editar el archivo `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

### 5. Abrir en el navegador

```
http://localhost:3000
```

## 👥 Configuración Inicial

### Crear Usuario Administrador

1. En Supabase Dashboard → **Authentication** → **Users**
2. Crear nuevo usuario con email y contraseña
3. Copiar el UUID del usuario
4. En **SQL Editor**, ejecutar:

```sql
-- Insertar usuario admin en la tabla users
INSERT INTO users (id, email, full_name, role)
VALUES ('uuid-del-usuario-copiado', 'admin@chacinar.com', 'Administrador Chacinar', 'admin');
```

### Crear Usuarios Clientes

Para cada cliente:

1. Crear usuario en Supabase Authentication
2. Ejecutar en SQL Editor:

```sql
-- Insertar cliente
INSERT INTO users (id, email, full_name, role)
VALUES ('uuid-del-cliente', 'cliente@email.com', 'Nombre del Cliente', 'cliente');

-- Crear cuenta corriente para el cliente
INSERT INTO accounts (user_id, balance)
VALUES ('uuid-del-cliente', 0.00);
```

## 📱 Uso del Sistema

### Panel de Administrador

**URL**: `/admin`

**Funcionalidades**:
- ✅ Ver todos los clientes y sus saldos
- ✅ Ver estadísticas generales (total clientes, deuda total, solicitudes pendientes)
- ✅ Aprobar o rechazar solicitudes de modificación
- ✅ Gestionar cuenta corriente de todos los clientes

### Panel de Cliente

**URL**: `/cliente`

**Funcionalidades**:
- ✅ Ver saldo actual
- ✅ Solicitar cargos o pagos
- ✅ Ver historial de movimientos aprobados
- ✅ Seguimiento de solicitudes pendientes

## 🎨 Diseño

El sistema utiliza un diseño moderno inspirado en:
- **Notion**: Limpieza, minimalismo y jerarquía visual
- **Apple**: Tipografía clara, espaciado generoso y animaciones suaves

### Paleta de Colores

- **Primario**: Rojo (#dc2626) - Representa la marca Chacinar
- **Neutro**: Grises (#fafafa - #171717) - Para texto y fondos
- **Estados**: Verde (éxito), Amarillo (advertencia), Rojo (error)

## 🔒 Seguridad

- ✅ **Row Level Security (RLS)** habilitado en todas las tablas
- ✅ Políticas de acceso basadas en roles
- ✅ Autenticación segura con Supabase Auth
- ✅ Validación de permisos en cada operación
- ✅ Separación de roles admin/cliente

## 📂 Estructura del Proyecto

```
chacinar/
├── src/
│   ├── app/                    # Páginas Next.js
│   │   ├── admin/             # Panel de administrador
│   │   ├── cliente/           # Panel de cliente
│   │   ├── login/             # Página de login
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página de inicio
│   │   └── globals.css        # Estilos globales
│   ├── components/
│   │   └── ui/                # Componentes UI reutilizables
│   ├── lib/
│   │   ├── supabase.ts        # Cliente Supabase
│   │   └── utils.ts           # Utilidades
│   └── types/
│       └── index.ts           # Tipos TypeScript
├── supabase/
│   └── schema.sql             # Esquema de base de datos
├── public/                     # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Otras plataformas

Compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
```

## 📝 Flujo de Trabajo

### Cliente solicita modificación

1. Cliente inicia sesión
2. Ve su saldo actual
3. Crea solicitud (cargo o pago)
4. Solicitud queda en estado "pendiente"

### Admin aprueba solicitud

1. Admin ve solicitudes pendientes
2. Revisa detalles de la solicitud
3. Aprueba o rechaza
4. Si aprueba:
   - Se crea transacción
   - Se actualiza saldo
   - Cliente ve el cambio reflejado

## 🐛 Solución de Problemas

### Error de conexión a Supabase

Verificar que las variables de entorno estén correctamente configuradas en `.env.local`

### Usuario no puede iniciar sesión

1. Verificar que el usuario existe en Supabase Authentication
2. Verificar que existe en la tabla `users`
3. Verificar que tiene una cuenta en la tabla `accounts` (solo clientes)

### Errores de permisos

Verificar que las políticas RLS estén correctamente configuradas ejecutando el script `supabase/schema.sql`

## 📞 Soporte

Para consultas o soporte técnico, contactar al administrador del sistema.

## 📄 Licencia

Uso privado para Chacinar - Monte Buey

---

**Desarrollado con ❤️ para Chacinar**
"# chacinar" 
