import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/login')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Espace privé' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: '/admin' });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError('Identifiants incorrects. Si c\'est votre première connexion, utilisez « Créer le compte ».');
      return;
    }
    navigate({ to: '/admin' });
  }

  async function onCreate() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    setLoading(false);
    if (error) {
      setError(error.message.includes('registered') ? 'Ce compte existe déjà, connectez-vous.' : 'Création impossible : ' + error.message);
      return;
    }
    const { error: e2 } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (e2) {
      setError('Compte créé — vous pouvez maintenant vous connecter.');
      return;
    }
    navigate({ to: '/admin' });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFE7D2] px-6 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-[#DDCCB2] p-8 sm:p-10">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B88F4D] font-semibold">Espace privé</p>
          <h1 className="mt-3 text-3xl font-serif text-[#2A241C]">Connexion</h1>
          <p className="mt-2 text-sm text-[#6E6455]">Accès réservé au patron de l'Atelier.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-[#6E6455] mb-2">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-[#DDCCB2] bg-white text-[#2A241C] focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-[#6E6455] mb-2">Mot de passe</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-[#DDCCB2] bg-white text-[#2A241C] focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
            />
          </div>
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#B88F4D] text-white font-semibold tracking-wide hover:bg-[#A17E60] transition-colors disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
          <button
            type="button"
            onClick={onCreate}
            disabled={loading || !email || password.length < 6}
            className="w-full h-11 rounded-xl border border-[#DDCCB2] bg-white text-[#2A241C] text-sm hover:bg-[#EFE7D2] transition-colors disabled:opacity-50"
          >
            Créer le compte (première connexion)
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#8B7F6E]">
          Accès strictement réservé. Toute tentative est enregistrée.
        </p>
      </div>
    </div>
  );
}
