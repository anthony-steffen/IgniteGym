import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [gymName, setGymName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/staff', { 
        name, 
        email, 
        password, 
        gymName,
        roleTitle: 'Proprietário'
      });
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Erro ao realizar cadastro');
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
            
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-primary tracking-tighter italic">IGNITE<span className="text-white">GYM</span></h1>
              <p className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-wider">Registro de Unidade</p>
            </div>

            <div className="form-control flex flex-col gap-2">
              {/* CAMPO: NOME DA ACADEMIA */}
              <label className="input input-bordered bg-white/90 border-white/10 focus-within:border-primary flex items-center gap-2 text-black font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v8h8V4H4zM5 5h2v2H5V5zm4 0h2v2H9V5zm-4 4h2v2H5V9zm4 0h2v2H9V9z"/></svg>
                <input type="text" className="grow" placeholder="Nome da Academia" value={gymName} onChange={e => setGymName(e.target.value)} required />
              </label>

              {/* CAMPO: NOME DO USUÁRIO */}
              <label className="input input-bordered bg-white/90 border-white/10 focus-within:border-primary flex items-center gap-2 text-black font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664h10Z"/></svg>
                <input type="text" className="grow" placeholder="Seu Nome Completo" value={name} onChange={e => setName(e.target.value)} required />
              </label>

              {/* CAMPO: E-MAIL */}
              <label className="input input-bordered bg-white/90 border-white/10 focus-within:border-primary flex items-center gap-2 text-black font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                <input type="email" className="grow" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>

              {/* CAMPO: SENHA */}
              <label className="input input-bordered bg-white/90 border-white/10 focus-within:border-primary flex items-center gap-2 text-black font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                <input type="password" className="grow" placeholder="Senha (mín. 8)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
              </label>
            </div>

            <button type="submit" className={`btn btn-primary w-full mt-8 font-bold uppercase ${loading ? 'loading' : ''}`}>
              Criar Academia
            </button>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-gray-400 text-sm hover:text-white transition-all">
                Já possui conta? <span className="text-blue-800 font-bold">Acesse aqui</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}