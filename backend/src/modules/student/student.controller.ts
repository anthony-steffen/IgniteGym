import { Request, Response } from 'express';
import { StudentService } from './student.service';

export class StudentController {
  static async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Se for Admin, ele precisa enviar o tenantId no body ou query
    const tenantId = req.user.tenantId || (req.body.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID é obrigatório para cadastrar aluno.' });
    }

    const { name, email, phone, birth_date } = req.body;

    const result = await StudentService.create({
      tenantId: tenantId as string, // Garantimos que é string para o DTO
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

    // Se for Admin, pode filtrar por ?tenantId=... ou listar todos (depende do seu service)
    const tenantId = req.user.tenantId || (req.query.tenantId as string);

    // Se o seu Service.list exige uma string e o Admin quer ver todos, 
    // passamos o tenantId ou tratamos conforme a regra de negócio do Service.
    const students = await StudentService.list(tenantId as string);
    return res.json(students);
  }

  static async deactivate(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const tenantId = req.user.tenantId || (req.query.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID é necessário.' });
    }

    const student = await StudentService.deactivate(
      id,
      tenantId as string
    );

    return res.json(student);
  }

  static async update(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const tenantId = req.user.tenantId || (req.body.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID não identificado.' });
    }

    console.log('=== [DEBUG CONTROLLER] ===');
    console.log('ID do Aluno (Params):', id);
    console.log('Tenant ID:', tenantId);

    try {
      const result = await StudentService.update(id, tenantId as string, req.body);
      return res.json(result);
    } catch (error) {
      console.error('=== [ERRO NO CONTROLLER] ===', error);
      throw error; 
    }
  }
}