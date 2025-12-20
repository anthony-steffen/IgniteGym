// backend/src/database/seeders/seedAdmin.ts
import { sequelize } from "../sequelize";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

export async function seedAdmin() {
  console.log("🌱 Verificando seed admin...");

  // 🔍 1. Verificar se já existe admin
  const [existingAdmin] = await sequelize.query(
    `SELECT id FROM users WHERE email = :email LIMIT 1`,
    {
      replacements: { email: "admin@ignitegym.com" },
      type: "SELECT",
    }
  );

  if (existingAdmin) {
    console.log("ℹ️ Admin já existe, pulando seed");
    return;
  }

  const tenantId = uuidv4();
  const adminId = uuidv4();
  const passwordHash = await bcrypt.hash("admin123", 10);

  const transaction = await sequelize.transaction();

  try {
    // 2️⃣ Criar tenant
    await sequelize.query(
      `
      INSERT INTO tenants (
        id, name, slug, is_active, created_at, updated_at
      ) VALUES (
        :id, :name, :slug, true, NOW(), NOW()
      )
      `,
      {
        replacements: {
          id: tenantId,
          name: "Academia Principal",
          slug: "academia-principal",
        },
        transaction,
      }
    );

    // 3️⃣ Criar admin
    await sequelize.query(
      `
      INSERT INTO users (
        id, tenant_id, email, password_hash, role,
        name, phone, is_active, last_login_at,
        created_at, updated_at
      ) VALUES (
        :id, :tenant_id, :email, :password_hash, :role,
        :name, :phone, true, NULL,
        NOW(), NOW()
      )
      `,
      {
        replacements: {
          id: adminId,
          tenant_id: tenantId,
          email: "admin@ignitegym.com",
          password_hash: passwordHash,
          role: "ADMIN",
          name: "Administrador",
          phone: "11999999999",
        },
        transaction,
      }
    );

    await transaction.commit();
    console.log("✅ Seed admin aplicado com sucesso");
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Erro ao aplicar seed admin:", error);
    throw error;
  }
}
