import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <main className="bg-surface min-h-screen pt-32 pb-24 px-6 md:px-12 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 border border-[#f1f1ec] shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)]">
        <header className="mb-12">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-4 block">Legal</span>
          <h1 className="font-headline font-black text-4xl text-on-surface uppercase tracking-tight">Política de Privacidad</h1>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 mt-4">
            Última actualización: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
          </p>
        </header>

        <div className="prose prose-sm md:prose-base font-body text-on-surface-variant leading-relaxed opacity-80 max-w-none">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">1. Recopilación de Datos</h2>
          <p>
            Curabitur vulputate, ligula lacinia scelerisque tempor, sanguis orci ex, vitae viverra orci tortor a orci. Aenean nec pretium odio. Vestibulum suscipit mi neque, id euismod justo eleifend non. 
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">2. Uso de la Información</h2>
          <p>
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus magna mi, consectetur eget sollicitudin sed, finibus in eros. Nullam feugiat mauris vel massa viverra, id semper sapien cursus.
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">3. Compartición de Datos (Mercado Pago)</h2>
          <p>
            Integer scelerisque enim vitae suscipit sollicitudin. Maecenas iaculis neque in eros pretium, ac lobortis felis cursus. Aliquam quis velit ut elit imperdiet dignissim in vitae elit.
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">4. Derechos del Usuario</h2>
          <p>
            Proin convallis justo velit, et imperdiet nunc iaculis sed. Praesent auctor libero id magna bibendum tempus. Suspendisse potenti. Morbi scelerisque, sapien eget rhoncus interdum, justo urna commodo ligula, sed convallis neque magna id lorem.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/10">
          <Link to="/" className="font-label text-xs uppercase tracking-widest font-bold text-primary hover:text-on-surface transition-colors">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
