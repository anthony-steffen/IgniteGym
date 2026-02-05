import { Request, Response } from 'express';
import { StudentService } from './student.service';
import { AppError } from '../../errors/AppError';

export class StudentController {
  static async create(req: Request, res: Response) {
    try {
      // 1. Extraímos o slug da URL (ex: /students/academia-exemplo)
      const { slug } = req.params; 
      
      // 2. Extraímos os dados do corpo
      const studentData = req.body;

      // 3. Chamamos o service com DOIS parâmetros como definido no student.service.ts
      const result = await StudentService.create(slug, studentData);

      return res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { slug } = req.params; 
      const students = await StudentService.list(slug);
      return res.json(students);
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { slug, id } = req.params; // URL: /students/:slug/:id

      const result = await StudentService.update(id, slug, req.body);
      return res.json(result);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }

  static async deactivate(req: Request, res: Response) {
    try {
      const { slug, id } = req.params; // URL: /students/:slug/:id/deactivate

      const student = await StudentService.deactivate(id, slug);
      return res.json(student);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }
}