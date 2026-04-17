import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setTimeout(() => setSent(true), 1000);
  };

  return (
    <main className="bg-surface min-h-screen pt-32 pb-24 px-6 md:px-12 animate-fade-in">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
        
        <div className="animate-slide-up">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-4 block">Contacto</span>
          <h1 className="font-headline font-black text-4xl md:text-6xl text-on-surface uppercase tracking-tight mb-8">Estamos aquí<br/>para ayudarte</h1>
          <p className="font-body text-on-surface-variant leading-relaxed opacity-80 max-w-md mb-12">
            Si tienes dudas sobre una adquisición, necesitas asistencia con tu cuenta de afiliado o deseas publicar en KODA, no dudes en escribirnos.
          </p>
          
          <div className="space-y-6">
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 border border-[#f1f1ec] bg-white hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <div>
                <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Mensaje Directo</span>
                <span className="block font-headline font-bold text-lg text-on-surface">WhatsApp Support</span>
              </div>
            </a>
            
            <a href="mailto:soporte@koda.com" className="flex items-center gap-6 p-6 border border-[#f1f1ec] bg-white hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Vía Email</span>
                <span className="block font-headline font-bold text-lg text-on-surface">soporte@koda.com</span>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)] border border-[#f1f1ec] animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {sent ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-primary mb-6">check_circle</span>
              <h3 className="font-headline font-bold text-2xl text-on-surface uppercase tracking-tight mb-4">Mensaje Recibido</h3>
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 mb-8 leading-relaxed">
                Gracias por contactarnos. Nuestro equipo te responderá a la brevedad.
              </p>
              <button 
                onClick={() => setSent(false)} 
                className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:text-on-surface transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-8">Envíanos un correo</h3>
              
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Nombre Completo</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Email de Contacto</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Mensaje</label>
                <textarea 
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors min-h-[120px] resize-none" 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary py-5 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95"
              >
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}
