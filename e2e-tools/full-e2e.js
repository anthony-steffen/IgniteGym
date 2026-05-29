const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const EDGE_PATH = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const runId = `e2e-${Date.now()}`;
const slug = `ignite-e2e-${Date.now().toString().slice(-6)}`;
const adminEmail = `owner+${Date.now()}@ignitegym.test`;
const adminPassword = 'Ignite123!';
const studentName = `Aluno E2E ${Date.now().toString().slice(-4)}`;
const supplierName = `Fornecedor E2E ${Date.now().toString().slice(-4)}`;
const planName = `Plano E2E ${Date.now().toString().slice(-4)}`;
const productName = `Produto E2E ${Date.now().toString().slice(-4)}`;

const artifactsDir = path.resolve(__dirname, 'artifacts', runId);
fs.mkdirSync(artifactsDir, { recursive: true });

const results = [];

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
}

function parsePtBrCurrency(text) {
  const normalized = text
    .replace(/\s/g, '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

async function screenshot(page, name) {
  const file = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

async function dismissOpenModalIfAny(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const modal = page.locator('.modal.modal-open').first();
    if ((await modal.count()) === 0) return;

    const closeButton = modal.getByRole('button', { name: /cancelar|descartar|fechar/i }).first();
    if (await closeButton.isVisible()) {
      await closeButton.click({ force: true });
      await page.waitForTimeout(200);
      continue;
    }

    const backdrop = page.locator('.modal.modal-open .modal-backdrop').first();
    if (await backdrop.isVisible()) {
      await backdrop.click({ force: true });
      await page.waitForTimeout(200);
      continue;
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
  }
}

async function selectOptionByTextContains(selectLocator, expectedText) {
  const normalized = expectedText.toLowerCase();
  const timeoutMs = 15000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const options = await selectLocator.locator('option').all();

    for (const option of options) {
      const label = ((await option.innerText()) || '').trim();
      const value = (await option.getAttribute('value')) || '';
      if (!value) continue;
      if (label.toLowerCase().includes(normalized)) {
        await selectLocator.selectOption(value);
        return;
      }
    }

    await selectLocator.page().waitForTimeout(250);
  }

  throw new Error(`Nao foi possivel encontrar opcao contendo: ${expectedText}`);
}

async function recordStep(page, name, fn) {
  log(`STEP START: ${name}`);
  const startedAt = Date.now();
  try {
    await dismissOpenModalIfAny(page);
    await fn();
    const elapsedMs = Date.now() - startedAt;
    results.push({ name, status: 'PASS', elapsedMs });
    log(`STEP PASS: ${name} (${elapsedMs}ms)`);
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    const shot = await screenshot(page, `fail-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);
    results.push({
      name,
      status: 'FAIL',
      elapsedMs,
      error: error instanceof Error ? error.message : String(error),
      screenshot: shot,
    });
    log(`STEP FAIL: ${name} (${elapsedMs}ms)`);
    log(`ERROR: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    await dismissOpenModalIfAny(page);
  }
}

async function clickMenu(page, labelRegex) {
  const link = page.getByRole('link', { name: labelRegex });
  await link.first().click();
}

async function waitForRoute(page, routePart) {
  await page.waitForURL((url) => url.pathname.includes(routePart), { timeout: 15000 });
}

async function ensureNoBlockingAlert(page) {
  const errorAlert = page.locator('.alert-error');
  if (await errorAlert.count()) {
    const text = (await errorAlert.first().innerText()).trim();
    if (text) {
      throw new Error(`Alerta de erro detectado: ${text}`);
    }
  }
}

async function run() {
  if (!fs.existsSync(EDGE_PATH)) {
    throw new Error(`Navegador nao encontrado em: ${EDGE_PATH}`);
  }

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();
  page.on('dialog', async (dialog) => {
    log(`Dialog intercepted: ${dialog.type()} -> ${dialog.message()}`);
    await dialog.accept();
  });

  try {
    await recordStep(page, 'open-register-page', async () => {
      await page.goto(`${FRONTEND_URL}/register`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: /Finalizar e Criar Unidade/i }).waitFor({ timeout: 10000 });
      await screenshot(page, 'register-page');
    });

    await recordStep(page, 'register-tenant', async () => {
      await page.getByPlaceholder(/NOME DA ACADEMIA/i).fill('IgniteGym E2E');
      await page.getByPlaceholder(/slug-da-unidade/i).fill(slug);
      await page.getByPlaceholder(/ENDERE/i).fill('Rua Teste, 123 - Fortaleza');
      await page.getByPlaceholder(/NOME COMPLETO DO GESTOR/i).fill('Gestor E2E');
      await page.getByPlaceholder(/E-MAIL@EXEMPLO.COM/i).fill(adminEmail);
      await page.getByPlaceholder(/SENHA DE ACESSO/i).fill(adminPassword);
      await page.getByRole('button', { name: /Finalizar e Criar Unidade/i }).click();
      await page.waitForURL((url) => url.pathname === '/login', { timeout: 15000 });
      await screenshot(page, 'register-success');
    });

    await recordStep(page, 'login', async () => {
      await page.getByPlaceholder(/^E-mail$/i).fill(adminEmail);
      await page.getByPlaceholder(/^Senha$/i).fill(adminPassword);
      await page.getByRole('button', { name: /Entrar na conta/i }).click();
      await page.waitForURL((url) => url.pathname.includes(`/${slug}/home`), { timeout: 15000 });
      await screenshot(page, 'login-success');
    });

    await recordStep(page, 'create-plan', async () => {
      await clickMenu(page, /Planos/i);
      await waitForRoute(page, `/${slug}/plans`);
      await page.getByRole('button', { name: /Novo Plano/i }).click();
      const modal = page.locator('.modal-box').first();
      await modal.getByPlaceholder(/Ex: Mensal VIP/i).fill(planName);
      await modal.locator('input[type="number"]').nth(0).fill('30');
      await modal.locator('input[type="number"]').nth(1).fill('149.9');
      await modal.getByRole('button', { name: /Confirmar/i }).click();
      await page.getByRole('cell', { name: planName }).waitFor({ timeout: 15000 });
      await ensureNoBlockingAlert(page);
      await screenshot(page, 'plan-created');
    });

    await recordStep(page, 'create-student', async () => {
      await clickMenu(page, /Alunos/i);
      await waitForRoute(page, `/${slug}/students`);
      await page.getByRole('button', { name: /Novo Aluno/i }).click();
      const modal = page.locator('.modal-box').first();
      await modal.locator('input').nth(0).fill(studentName);
      await modal.locator('input').nth(1).fill(`aluno+${Date.now()}@ignitegym.test`);
      await modal.locator('input').nth(2).fill('(85) 99999-1111');
      await modal.getByRole('button', { name: /Salvar Aluno/i }).click();
      await page.getByRole('cell', { name: studentName }).waitFor({ timeout: 15000 });
      await screenshot(page, 'student-created');
    });

    await recordStep(page, 'create-subscription', async () => {
      await clickMenu(page, /Inscricoes/i);
      await waitForRoute(page, `/${slug}/subscriptions`);
      const form = page.locator('form').first();
      await selectOptionByTextContains(form.locator('select').nth(0), studentName);
      await selectOptionByTextContains(form.locator('select').nth(1), planName);
      await form.locator('select').nth(2).selectOption('PAID');
      await form.getByRole('button', { name: /Matricular/i }).click();
      await page.getByText(/Matricula criada com sucesso/i).waitFor({ timeout: 15000 });
      await page.getByRole('cell', { name: studentName }).waitFor({ timeout: 15000 });
      await screenshot(page, 'subscription-created');
    });

    await recordStep(page, 'validate-dashboard-revenue', async () => {
      await clickMenu(page, /Geral/i);
      await waitForRoute(page, `/${slug}/home`);

      const revenueCard = page.locator('.stat').filter({ hasText: /RECEITA DO MES/i }).first();
      await revenueCard.waitFor({ timeout: 15000 });

      let revenueText = '';
      let revenueValue = 0;
      const startedAt = Date.now();
      const timeoutMs = 8000;

      while (Date.now() - startedAt < timeoutMs) {
        revenueText = (await revenueCard.locator('.stat-value').innerText()).trim();
        revenueValue = parsePtBrCurrency(revenueText);
        if (revenueValue > 0) break;
        await page.waitForTimeout(250);
      }

      if (revenueValue <= 0) {
        throw new Error(`Receita do mes invalida apos matricula paga: ${revenueText}`);
      }

      await screenshot(page, 'dashboard-revenue-validated');
    });

    await recordStep(page, 'create-supplier', async () => {
      await clickMenu(page, /Fornecedores/i);
      await waitForRoute(page, `/${slug}/suppliers`);
      await page.getByRole('button', { name: /Fornecedor/i }).click();
      const modal = page.locator('.modal-box').first();
      await modal.getByPlaceholder(/Max Titanium/i).fill(supplierName);
      await modal.getByPlaceholder(/contato@marca\.com/i).fill('fornecedor@ignitegym.test');
      await modal.getByPlaceholder(/\(00\)/i).fill('(85) 3333-4444');
      await modal.getByRole('button', { name: /^SALVAR$/i }).click();
      await page.getByText(new RegExp(supplierName, 'i')).first().waitFor({ timeout: 15000 });
      await screenshot(page, 'supplier-created');
    });

    await recordStep(page, 'create-product', async () => {
      await clickMenu(page, /Produtos\/Estoque/i);
      await waitForRoute(page, `/${slug}/products`);
      await page.getByRole('button', { name: /Novo Produto/i }).click();
      const modal = page.locator('.modal-box').first();

      const categorySelect = modal.locator('select').nth(0);
      const supplierSelect = modal.locator('select').nth(1);
      const categoryOptions = await categorySelect.locator('option').count();
      const supplierOptions = await supplierSelect.locator('option').count();

      if (categoryOptions <= 1) {
        throw new Error('Nao existem categorias disponiveis para cadastro de produto.');
      }
      if (supplierOptions <= 1) {
        throw new Error('Nao existem fornecedores disponiveis para cadastro de produto.');
      }

      await modal.getByPlaceholder(/Whey Protein 900g/i).fill(productName);
      await modal.locator('input[type="number"]').nth(0).fill('19.9');
      await modal.locator('input[type="number"]').nth(1).fill('10');
      await categorySelect.selectOption({ index: 1 });
      await selectOptionByTextContains(supplierSelect, supplierName);
      await modal.getByPlaceholder(/https:\/\/exemplo\.com\/imagem\.jpg/i).fill('https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800');
      await modal.getByRole('button', { name: /SALVAR PRODUTO/i }).click();
      await page.getByRole('cell', { name: productName }).waitFor({ timeout: 15000 });
      await screenshot(page, 'product-created');
    });

    await recordStep(page, 'student-checkin', async () => {
      await clickMenu(page, /Check-Ins/i);
      await waitForRoute(page, `/${slug}/checkin`);
      const input = page.getByPlaceholder(/NOME DO ALUNO/i);
      await input.fill(studentName.slice(0, 6));
      await page.getByRole('button', { name: new RegExp(studentName, 'i') }).first().click();
      await page.getByText(/ACESSO LIBERADO/i).waitFor({ timeout: 15000 });
      await screenshot(page, 'checkin-success');
    });

    await recordStep(page, 'sale-product', async () => {
      await clickMenu(page, /Vendas/i);
      await waitForRoute(page, `/${slug}/sales`);
      const search = page.getByPlaceholder(/Buscar produtos/i);
      await search.fill(productName);
      await page.getByRole('button', { name: /Adicionar/i }).first().click();

      const openCart = page.getByRole('button', { name: /ITENS/i });
      if (await openCart.isVisible()) {
        await openCart.click();
      }

      const paymentSelect = page.locator('aside select, .drawer-side select').nth(1);
      await paymentSelect.selectOption('PIX');

      const finalize = page.getByRole('button', { name: /Finalizar Venda/i });
      await finalize.click();

      const success = page.getByText(/Venda finalizada com sucesso/i);
      const error = page.locator('.alert-error span').first();

      await Promise.race([
        success.waitFor({ timeout: 15000 }),
        error.waitFor({ timeout: 15000 }),
      ]);

      if (await error.isVisible()) {
        const text = (await error.innerText()).trim();
        throw new Error(`Venda falhou: ${text}`);
      }

      await screenshot(page, 'sale-success');
    });

    await recordStep(page, 'logout', async () => {
      await page.getByRole('button', { name: /Sair/i }).click();
      await page.waitForURL((url) => url.pathname === '/login', { timeout: 10000 });
      await screenshot(page, 'logout-success');
    });
  } finally {
    await context.close();
    await browser.close();
  }
}

async function main() {
  let fatalError = null;

  try {
    await run();
  } catch (error) {
    fatalError = error instanceof Error ? error : new Error(String(error));
    log(`FATAL: ${fatalError.message}`);
  }

  const report = {
    runId,
    frontendUrl: FRONTEND_URL,
    slug,
    adminEmail,
    results,
    fatalError: fatalError ? fatalError.message : null,
  };

  const reportFile = path.join(artifactsDir, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n=== E2E REPORT ===');
  for (const item of results) {
    console.log(`${item.status} - ${item.name} (${item.elapsedMs}ms)`);
    if (item.status === 'FAIL') {
      console.log(`  -> ${item.error}`);
      if (item.screenshot) console.log(`  -> screenshot: ${item.screenshot}`);
    }
  }
  console.log(`Report: ${reportFile}`);

  const hasFailure = fatalError || results.some((item) => item.status === 'FAIL');
  process.exit(hasFailure ? 1 : 0);
}

main();
