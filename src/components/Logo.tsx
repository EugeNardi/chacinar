export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: '180px',   // Aumentado para headers
    md: '320px',   // Aumentado para login/registro
    lg: '420px',   // Aumentado para bienvenida
  };

  return (
    <div className="flex items-center">
      <img 
        src="/logo.png" 
        alt="Chacinar - Chacinados y embutidos artesanales Monte Buey" 
        style={{ 
          width: sizes[size], 
          height: 'auto',
          maxHeight: size === 'sm' ? '90px' : '160px',
          objectFit: 'contain',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}
