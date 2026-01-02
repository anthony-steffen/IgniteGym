import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Chamada real ao backend
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // Chama o signIn do contexto para salvar no localStorage e no estado
      signIn(token, user);
      
    } catch (err) {
      console.error(err);
      alert('Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center p-4 bg-base-200">
      <div className="card h-min w-full max-w-sm shadow-xl bg-base-100 border-2 border-base-300 my-10">
        <form onSubmit={handleSubmit} className="card-body">
          <h2 className="text-2xl font-bold text-center text-primary">Ignite Gym</h2>
          <p className="text-center text-base-content/60">Faça login para continuar</p>
          
          <label className="input validator my-2">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="mail@email.com" 
            required 
            />
          </label>
          <div className="validator-hint hidden">Enter valid email address</div>

          <label className="input validator">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                  ></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Password"
                minLength= {8}
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
            </p>
          {/* <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Senha</span>
            </label>
            <input 
              type="password" 
              placeholder="******" 
              className="input input-bordered" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div> */}

          <div className="form-control mt-6 m-auto">
            <button type="submit" className="btn btn-primary w-full" >Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}