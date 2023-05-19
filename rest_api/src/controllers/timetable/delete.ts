import type { Request, Response } from 'express';
import { z } from 'zod';
import timetable from '../../repositories/employee/timetable';

const timetableDeleteSchema = z.object({
  id: z.string().uuid().trim(),
  employeeId: z.string().uuid().trim(),
});

const timetableDelete = async (req: Request, res: Response) => {
  try {
    const requestData = timetableDeleteSchema.parse(req.params);
    const request = await timetable.delete(requestData);
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

export default timetableDelete;
