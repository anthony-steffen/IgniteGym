import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Criar nova conta</h1>
        <Link to="/login" className="link link-primary block mt-4">Já tenho conta</Link>
      </div>
    </div>
  );
}