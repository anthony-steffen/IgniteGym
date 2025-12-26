import { Request, Response } from 'express';
import { StudentService } from './student.service';

export class StudentController {
  static async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { tenantId } = req.user;
    const { name, email, phone, birth_date } = req.body;

    const result = await StudentService.create({
      tenantId,
      name,
      email,
      phone,
      birth_date,
    });

    return res.status(201).json(result);
  }

  static async list(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const students = await StudentService.list(req.user.tenantId);
    return res.json(students);
  }

  static async deactivate(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const student = await StudentService.deactivate(
      id,
      req.user.tenantId
    );

    return res.json(student);
  }
}
