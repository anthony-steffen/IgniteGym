import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Por enquanto, simularemos o sucesso do login. 
    // No próximo passo faremos a chamada real com Axios ao seu backend.
    if (email && password) {
      const mockUser = {
        id: '1',
        name: 'Admin',
        email: email,
        tenant_id: 'tenant-123'
      };
      signIn('token-fake', mockUser);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSubmit} className="card-body">
          <h2 className="text-2xl font-bold text-center text-primary">Ignite Gym</h2>
          <p className="text-center text-base-content/60">Faça login para continuar</p>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">E-mail</span>
            </label>
            <input 
              type="email" 
              placeholder="exemplo@email.com" 
              className="input input-bordered" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-control">
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
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}