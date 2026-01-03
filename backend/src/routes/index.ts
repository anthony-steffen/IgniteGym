// backend/src/routes/index.ts
import { Router } from "express";
import usersRoutes from "./users.routes";
import authRoutes  from "../modules/auth/auth.routes";
import staffRoutes from "../modules/staff/staff.routes";
import employeeRouter from "../modules/employee/employee.routes";
import studentsRoutes from "../modules/student/student.routes";
import subscriptionsRoutes from "../modules/subscription/subscription.routes";
import plansRoutes from "../modules/plan/plan.routes";
import checkinRoutes from "../modules/checkin/checkin.routes";
import inventoryRouter  from "../modules/inventory/inventory.routes";
import salesRouter from "../modules/sale/sales.routes";

const routes = Router();

routes.get("/health", (_, res) => res.status(200).json({ status: "ok" }));

// Rotas limpas: O arquivo de destino decide se é público ou privado
routes.use("/auth", authRoutes);     // O auth.routes deve ser público para login
routes.use("/staff", staffRoutes);   // O staff.routes agora tem o POST público
routes.use("/users", usersRoutes);
routes.use("/employees", employeeRouter);
routes.use("/students", studentsRoutes);
routes.use("/subscriptions", subscriptionsRoutes);
routes.use("/plans", plansRoutes);
routes.use("/checkins", checkinRoutes);
routes.use("/inventory", inventoryRouter);
routes.use("/sales", salesRouter);

export default routes;
