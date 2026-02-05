// src/modules/staff/staff.controller.ts
import { Request, Response } from 'express';
import { StaffService } from './staff.service';
import { AppError } from '../../errors/AppError';

export class StaffController {
  /**
   * POST /staff
   * Registro Público: Cria Tenant + User Admin + Employee
   */
  static async create(req: Request, res: Response) {
    try {
      const result = await StaffService.create(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        message: error.message || "Erro inesperado ao processar o registro."
      });
    }
  }

  /**
   * GET /staff/:slug
   * Listagem de funcionários da academia específica
   */
  static async list(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId as string; // Injetado pelo tenantTranslate
      const staff = await StaffService.list(tenantId);
      return res.json(staff);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }

  /**
   * GET /staff/:slug/:id
   */
  static async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId as string;
      const staff = await StaffService.findOne(id, tenantId);
      return res.json(staff);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }

  /**
   * PUT /staff/:slug/:id
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId as string;
      const staff = await StaffService.update(id, tenantId, req.body);
      return res.json(staff);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }

  /**
   * DELETE /staff/:slug/:id
   */
  static async deactivate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId as string;
      await StaffService.deactivate(id, tenantId);
      return res.status(204).send();
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }
}