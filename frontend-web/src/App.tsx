import './App.css'
import  ThemeToggle  from './components/toggleTheme'

function App() {

  return (
      <div className="h-screen w-screen bg-base-200 flex flex-col items-center justify-center space-y-2">

        {/* Botão Toggle Theme */}
        <ThemeToggle />

        <div className= "card card-body bg-base-100 shadow-lg">
          <p className="text-primary">
            Texto primário
          </p>
          <h2 className="card-title">
            Botão primário
          </h2>
          <button className="btn btn-primary">
            Botão primário
          </button>
        </div>
        {/* Cores de botões */}
        <button className="btn btn-primary">
          Botão primário
        </button>
        <button className="btn btn-secondary">
          Botão secundário
        </button>
        <button className="btn btn-accent">
          Botão acentuado
        </button>
        <button className="btn btn-outline">
          Botão com contorno
        </button>
        <button className="btn btn-ghost">
          Botão sombra
        </button>
        <button className="btn btn-link">
          Botão link
        </button>
        <button className="btn btn-info">
          Botão info
        </button>
        <button className="btn btn-success">
          Botão sucesso
        </button>
        <button className="btn btn-warning">
          Botão aviso
        </button>
        <button className="btn btn-error">
          Botão erro
        </button>

        {/* Cores de texto */}
        <p className="text-primary">
          Texto primário
        </p>
        <p className="text-secondary">
          Texto secundário
        </p>
        <p className="text-accent">
          Texto acentuado
        </p>
        <p className="text-info">
          Texto info
        </p>
        <p className="text-success">
          Texto sucesso
        </p>
        <p className="text-warning">
          Texto aviso
        </p>
        <p className="text-error">
          Texto erro
        </p>
      </div>

  )
}

export default App
