import { Link } from 'react-router-dom';

export function SellersLandingPage() {
  return (
    <main className="bg-surface min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-12 animate-fade-in">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Hero Section */}
        <section className="max-w-4xl mb-24 md:mb-40">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-6 block animate-slide-up">
            Vende y monetiza
          </span>
          <h1 className="font-headline font-black text-5xl md:text-7xl lg:text-8xl text-on-surface uppercase tracking-tighter leading-[0.9] mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Tu conocimiento<br />
            <span className="text-primary">tiene valor.</span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed opacity-80 max-w-2xl mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            KODA es el ecosistema editorial más elegante para vender tus e-books y escalar tus ingresos a través de una red de afiliados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/login"
              className="bg-primary text-on-primary font-label text-xs uppercase tracking-[0.2em] font-bold px-10 py-5 text-center hover:brightness-110 transition-all active:scale-95"
            >
              Comenzar a vender
            </Link>
            <a 
              href="#como-funciona"
              className="bg-surface-container-low text-on-surface font-label text-xs uppercase tracking-[0.2em] font-bold px-10 py-5 text-center hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/10"
            >
              Cómo funciona
            </a>
          </div>
        </section>

        {/* Roles Section */}
        <section id="como-funciona" className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32">
          
          {/* Creator Role */}
          <div className="group border border-[#f1f1ec] bg-white p-12 md:p-16 hover:border-primary/30 transition-all duration-500">
            <span className="material-symbols-outlined text-5xl text-primary mb-8 block">menu_book</span>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-on-surface uppercase tracking-tight mb-6">
              Para Creadores
            </h2>
            <p className="font-body text-on-surface-variant leading-relaxed mb-8 opacity-80">
              Sube tus libros digitales en formato PDF o ePub y véndelos directamente a tu audiencia. Nuestro checkout optimizado maximiza la conversión y la integración nativa con Mercado Pago deposita las ventas directamente en tu cuenta.
            </p>
            <ul className="space-y-4 mb-12 font-label text-[10px] uppercase tracking-widest text-on-surface font-bold">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> 91.5% de ganancia neta</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Pagos automáticos via Mercado Pago</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Acceso a la red de afiliados KODA</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Sin suscripciones mensuales</li>
            </ul>
          </div>

          {/* Affiliate Role */}
          <div className="group border border-[#f1f1ec] bg-white p-12 md:p-16 hover:border-primary/30 transition-all duration-500">
            <span className="material-symbols-outlined text-5xl text-primary mb-8 block">campaign</span>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-on-surface uppercase tracking-tight mb-6">
              Para Afiliados
            </h2>
            <p className="font-body text-on-surface-variant leading-relaxed mb-8 opacity-80">
              No necesitas crear contenido para generar ingresos. Recomienda los mejores libros de nuestro catálogo utilizando tus enlaces únicos. Cuando alguien compra a través de ti, recibes automáticamente tu comisión.
            </p>
            <ul className="space-y-4 mb-12 font-label text-[10px] uppercase tracking-widest text-on-surface font-bold">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Comisiones de hasta el 80%</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Split Payments instantáneos</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Panel de analíticas en tiempo real</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-lg">check_circle</span> Cookies de rastreo de 30 días</li>
            </ul>
          </div>

        </section>

        {/* Split Payments Feature */}
        <section className="bg-surface-container-low rounded-3xl p-12 md:p-24 border border-outline-variant/10 text-center mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-primary mb-6">call_split</span>
            <h2 className="font-headline font-black text-4xl md:text-5xl text-on-surface uppercase tracking-tight mb-8">
              La revolución del Split Payment
            </h2>
            <p className="font-body text-xl text-on-surface-variant leading-relaxed opacity-80 mb-12">
              KODA utiliza la tecnología de Marketplace de Mercado Pago. Esto significa que en el momento exacto en que un cliente realiza una compra, el dinero se divide y se envía automáticamente a la cuenta del Creador y a la del Afiliado de forma instantánea. Sin esperas de 30 días, sin retiros manuales.
            </p>
            <Link 
              to="/login"
              className="inline-block bg-primary text-on-primary font-label text-xs uppercase tracking-[0.2em] font-bold px-12 py-5 hover:brightness-110 transition-all active:scale-95"
            >
              Crear mi cuenta gratis
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
