import type { Request, Response } from 'express';
import { z } from 'zod';
import employee from '../../repositories/employee';

const employeeCreateSchema = z.object({
  name: z.string().trim(),
  surname: z.string().trim(),
});

const employeeCreate = async (req: Request, res: Response) => {
  try {
    const requestData = employeeCreateSchema.parse(req.body);
    const request = await employee.create(requestData);
    if (request.isErr) {
      res.status(404).send({ error: request.error });
    } else {
      res.status(201).send({ data: request.unwrap() });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error });
    } else {
      res.status(500).send({ error });
    }
  }
};

export default employeeCreate;
