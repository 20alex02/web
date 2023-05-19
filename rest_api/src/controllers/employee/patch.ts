import type { Request, Response } from 'express';
import { z } from 'zod';
import employee from '../../repositories/employee';

const employeeUpdateSchema = z.object({
  id: z.string().uuid().trim(),
}).and(z.object({
  name: z.string().trim(),
  surname: z.string().trim(),
}).or(z.object({
  name: z.string().trim(),
})).or(z.object({
  surname: z.string().trim(),
})));

const employeeUpdate = async (req: Request, res: Response) => {
  try {
    const requestData = employeeUpdateSchema.parse({ ...req.params, ...req.body });
    const request = await employee.update(requestData);
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

export default employeeUpdate;
