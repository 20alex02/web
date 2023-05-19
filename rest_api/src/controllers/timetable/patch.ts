import type { Request, Response } from 'express';
import { z } from 'zod';
import timetable from '../../repositories/employee/timetable';
import { ConflictingRecordError } from '../../repositories/employee/types/errors';

const timetableUpdateSchema = z.object({
  employeeId: z.string().uuid().trim(),
  from: z.string().datetime().transform((val) => new Date(val)),
  to: z.string().datetime().transform((val) => new Date(val)),
  id: z.string().uuid().trim(),
}).and(z.object({
  type: z.enum([
    'Working',
    'Holiday',
    'BusinessTrip',
    'MedicalCheckup',
    'UnpaidLeave',
    'ParentalLeave',
  ]),
}).or(z.object({})));

const timetableUpdate = async (req: Request, res: Response) => {
  try {
    const requestData = timetableUpdateSchema.parse({ ...req.params, ...req.body });
    const request = await timetable.update(requestData);
    if (request.isErr && request.error instanceof ConflictingRecordError) {
      res.status(400).send({ error: request.error });
    } else if (request.isErr) {
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

export default timetableUpdate;
