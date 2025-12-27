# 🏢 Sistema de Gestión de Cuentas Corrientes - Chacinar

Sistema profesional de gestión de cuentas corrientes con integración de MercadoPago para empresas.

## 🚀 Características Principales

### Para Clientes
- ✅ Dashboard intuitivo con saldo actual
- ✅ Visualización de últimas boletas
- ✅ Pago integrado con MercadoPago (QR + Link directo)
- ✅ Notificación de pagos realizados
- ✅ Historial completo de movimientos con saldos antes/después
- ✅ Envío de comprobantes por WhatsApp
- ✅ Notificaciones en tiempo real

### Para Administradores
- ✅ Panel de control completo
- ✅ Gestión de clientes y cuentas
- ✅ Aprobación/rechazo de solicitudes de pago
- ✅ Creación de cargos y boletas
- ✅ Configuración de alias de MercadoPago por cliente
- ✅ Generación automática de PDFs con QR
- ✅ Historial global de transacciones
- ✅ Estadísticas en tiempo real
- ✅ Sistema de auditoría completo

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS con diseño Apple-inspired
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Pagos**: MercadoPago (Transferencias P2P)
- **PDFs**: jsPDF + QRCode
- **Notificaciones**: Sistema integrado con Supabase

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [tu-repo]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Configuración

### 1. Supabase

Crear las siguientes tablas en Supabase:

#### Tabla `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `accounts`
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  mercadopago_wallet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `transactions`
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cargo', 'pago')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('aprobado', 'pendiente', 'rechazado')),
  balance_before DECIMAL(10,2),
  balance_after DECIMAL(10,2),
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE
);
```

#### Tabla `modification_requests`
```sql
CREATE TABLE modification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cargo', 'pago')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado')),
  requested_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);
```

#### Tabla `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'info', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Configurar MercadoPago

1. Ir al panel de administrador
2. Para cada cliente, configurar el alias de MercadoPago
3. El alias debe ser válido (6-20 caracteres, solo letras, números, puntos y guiones)

## 📱 Uso

### Flujo Completo de Pago

1. **Cliente ve su saldo** en el dashboard
2. **Cliente realiza transferencia** usando:
   - Código QR (escanear con MercadoPago)
   - Botón "Abrir en Mercado Pago"
   - Transferencia manual con alias
3. **Cliente notifica el pago** en el sistema
4. **Admin recibe notificación** de solicitud pendiente
5. **Admin verifica** el pago en MercadoPago
6. **Admin aprueba** la solicitud
7. **Sistema actualiza** automáticamente:
   - Saldo del cliente
   - Historial de transacciones
   - Notifica al cliente
8. **Cliente recibe notificación** con nuevo saldo

### Registro de Auditoría

Cada transacción registra:
- ✅ Saldo antes de la operación
- ✅ Saldo después de la operación
- ✅ Usuario que creó la transacción
- ✅ Usuario que aprobó la transacción
- ✅ Fecha y hora de creación
- ✅ Fecha y hora de aprobación

## 🎨 Diseño

El sistema utiliza un diseño inspirado en Apple con:
- Bordes redondeados (`rounded-apple`)
- Gradientes sutiles
- Animaciones suaves
- Tipografía clara y legible
- Paleta de colores profesional
- Responsive design para móviles

## 📊 Estructura del Proyecto

```
chacinar/
├── src/
│   ├── app/
│   │   ├── admin/          # Panel de administrador
│   │   ├── cliente/        # Dashboard del cliente
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/             # Componentes reutilizables
│   │   └── MercadoPagoQR.tsx
│   ├── lib/
│   │   ├── supabase.ts     # Cliente de Supabase
│   │   ├── mercadoPagoQR.ts # Generación de links MP
│   │   ├── pdfGenerator.ts  # Generación de PDFs
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── hooks/
│       └── useToast.ts     # Hook para notificaciones
├── public/
├── GUIA_SISTEMA_PAGOS.md   # Guía completa del sistema
└── README_PROFESIONAL.md   # Este archivo
```

## 🔐 Seguridad

- ✅ Autenticación con Supabase Auth
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Validación de roles (admin/cliente)
- ✅ Validación de montos y formatos
- ✅ Registro completo de auditoría
- ✅ Transacciones atómicas

## 📈 Métricas y Reportes

### Dashboard de Admin
- Total de clientes
- Deuda total acumulada
- Solicitudes pendientes

### Historial Global
- Total de transacciones
- Total de cargos
- Total de pagos
- Filtrado por cliente
- Exportación a PDF

## 🐛 Solución de Problemas

### El QR de MercadoPago no funciona
**Causa**: MercadoPago no soporta QR dinámicos para transferencias P2P.  
**Solución**: Usar el botón "Abrir en Mercado Pago" o copiar el alias manualmente.

### El saldo no se actualiza
**Causa**: El cliente no notificó el pago o el admin no lo aprobó.  
**Solución**: Verificar en "Solicitudes Pendientes" y aprobar.

### Error al generar PDF
**Causa**: Falta configurar métodos de pago o datos del cliente.  
**Solución**: Completar la información en "Configurar Métodos de Pago".

## 📞 Soporte

Para consultas o problemas:
- **WhatsApp**: +54 9 3467 49 4443 (Sebastián)
- **WhatsApp**: +54 9 3467 44 1282 (Claudia)

## 📄 Licencia

Uso privado para Chacinar.

## 🙏 Créditos

Desarrollado con ❤️ para Chacinar.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024
