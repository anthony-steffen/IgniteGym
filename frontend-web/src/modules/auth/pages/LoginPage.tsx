import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamada real ao backend
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // Chama o signIn do contexto para salvar no localStorage e no estado
      signIn(token, user);

      navigate('/home');
      
    } catch (err) {
      console.error(err);
      alert('Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">

      {/* Lógica de Imagem Limpa e Eficaz */}
      <picture className="absolute inset-0 w-full h-full">
        {/* Se a tela for maior que 768px, carrega a Wide */}
        <source media="(min-width: 768px)" srcSet="/photo-1.jpg" />
        {/* Caso contrário (mobile), carrega a Vertical */}
        <img 
          src="/photo-1.jpg" 
          alt="Background" 
          className="w-full h-full object-cover object-[center_5%]" 
        />
      </picture>

      {/* Camada de escurecimento e desfoque */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="card bg-black/40  border border-white/20 shadow-2xl"> 
          <form onSubmit={handleSubmit} className="card-body p-8">

            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-primary tracking-tighter italic">IGNITE<span className="text-white font-bold">GYM</span></h1>
              <p className="text-gray-200 text-sm mt-2">Treine sua mente, transforme seu corpo.</p>
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

            <button type="submit" className={`btn btn-primary w-full mt-6 font-bold uppercase ${loading ? 'loading' : ''}`}>
              Entrar na conta
            </button>

            <div className="mt-2 text-center">
              <p className="divider text-gray-400 text-sm">Não tem acesso?</p>
              <Link to="/register" className="text-blue-800 font-bold hover:underline transition-all">
                Crie uma conta para sua academia
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}