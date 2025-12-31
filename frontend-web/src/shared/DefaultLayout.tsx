import { Outlet } from 'react-router-dom';

export function DefaultLayout() {
  return (
    <div className="flex h-screen bg-base-100 overflow-hidden">
      {/* Placeholder da Sidebar */}
      <aside className="w-64 bg-neutral text-white p-4 hidden md:block">
        Sidebar (Em breve)
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Placeholder do Header */}
        <header className="h-16 bg-base-200 border-b border-base-300 flex items-center px-6">
          Header (Em breve)
        </header>

        {/* Conteúdo Dinâmico das Páginas */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}