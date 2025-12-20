// Script para verificar las variables de entorno
console.log('='.repeat(60));
console.log('🔍 VERIFICACIÓN DE VARIABLES DE ENTORNO');
console.log('='.repeat(60));
console.log('');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📋 Variables encontradas:');
console.log('');
console.log('NEXT_PUBLIC_SUPABASE_URL:');
console.log(url ? `✅ ${url}` : '❌ NO ENCONTRADA');
console.log('');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:');
console.log(key ? `✅ ${key.substring(0, 50)}...` : '❌ NO ENCONTRADA');
console.log('');

if (!url || !key) {
  console.log('='.repeat(60));
  console.log('❌ ERROR: Variables de entorno no configuradas');
  console.log('='.repeat(60));
  console.log('');
  console.log('📝 SOLUCIÓN:');
  console.log('');
  console.log('1. Verifica que el archivo .env.local existe en la raíz del proyecto');
  console.log('2. Debe contener estas dos líneas:');
  console.log('');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui');
  console.log('');
  console.log('3. Guarda el archivo');
  console.log('4. REINICIA el servidor (Ctrl+C y luego npm run dev)');
  console.log('');
  process.exit(1);
} else {
  console.log('='.repeat(60));
  console.log('✅ Variables de entorno configuradas correctamente');
  console.log('='.repeat(60));
  console.log('');
  console.log('Si aún ves errores, asegúrate de:');
  console.log('1. Haber reiniciado el servidor después de editar .env.local');
  console.log('2. La URL debe empezar con https://');
  console.log('3. La clave debe ser la "anon public" key de Supabase');
  console.log('');
}
