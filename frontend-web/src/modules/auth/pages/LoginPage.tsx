/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // 1. O signIn deve retornar os dados do usuário
      const response: any = await signIn(email, password);
      
      // Tente pegar o slug diretamente da resposta ou do localStorage atualizado
      const user = response?.user || JSON.parse(localStorage.getItem('@IgniteGym:user') || '{}');

      if (user?.slug) {
        // ✅ Agora esta rota EXISTE no AppRoutes: /academia-principal/home
        navigate(`/${user.slug}/home`, { replace: true });
      } else if (user?.role === 'ADMIN' && !user?.tenant_id) {
        // Se for Super Admin
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Fallback caso algo dê errado no vínculo
        navigate('/login');
        alert("Usuário sem unidade vinculada. Verifique com o administrador.");
      }
    } catch (err: any) {
      alert(err.message || "Erro ao realizar login");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width: 768px)" srcSet="/photo-1.jpg" />
        <img src="/photo-1.jpg" alt="Background" className="w-full h-full object-cover object-[center_5%]" />
      </picture>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="card bg-black/40 border border-white/20 shadow-2xl"> 
          <form onSubmit={handleSubmit} className="card-body p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-primary tracking-tighter italic">IGNITE<span className="text-white font-bold">GYM</span></h1>
            </div>
            <div className="form-control flex flex-col gap-2">
              <label className="input input-bordered bg-white/90 flex items-center gap-2 text-black font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                <input type="email" className="grow" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>

              <label className="input input-bordered bg-white/100 flex items-center gap-2 text-black font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                <input type="password" className="grow" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
              </label>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-6 font-bold uppercase">
              {loading ? 'Carregando...' : 'Entrar na conta'}
            </button>
            <div className="mt-2 text-center">
              <p className="divider text-gray-400 text-sm">Não tem acesso?</p>
              <Link to="/register" className="text-blue-800 font-bold hover:underline">Crie uma conta para sua academia</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}