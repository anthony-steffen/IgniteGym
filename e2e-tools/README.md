# IgniteGym E2E

Suite E2E para validar o fluxo operacional do MVP:

1. Registro de unidade
2. Login
3. Planos
4. Alunos
5. Matriculas
6. Fornecedores
7. Produtos/estoque
8. Check-in
9. Vendas
10. Logout

## Requisitos

- Frontend em `http://localhost:5173`
- API em `http://localhost:3001`
- Microsoft Edge instalado no caminho padrao:
  `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

## Execucao

```bash
cd e2e-tools
npm run e2e
```

## Variaveis opcionais

- `FRONTEND_URL` (padrao: `http://localhost:5173`)
- `EDGE_PATH` (padrao: caminho padrao do Edge)

## Evidencias

Os arquivos de evidencias (screenshots + report JSON) sao salvos em:

`e2e-tools/artifacts/e2e-<timestamp>/`
