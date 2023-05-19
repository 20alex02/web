import type { Request, Response } from 'express';
import { z } from 'zod';
import employee from '../../repositories/employee';

const employeeDeleteSchema = z.object({
  id: z.string().uuid().trim(),
});

const employeeDelete = async (req: Request, res: Response) => {
  try {
    const requestData = employeeDeleteSchema.parse(req.params);
    const request = await employee.delete(requestData);
    if (request.isErr) {
      res.status(404).send({ error: request.error });
    } else {
      res.status(200).send({ data: request.unwrap() });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error });
    } else {
      res.status(500).send({ error });
    }
  }
};

export default employeeDelete;
