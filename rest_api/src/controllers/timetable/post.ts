import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  differenceInMinutes,
  differenceInHours,
} from 'date-fns';
import timetable from '../../repositories/employee/timetable';
import { ConflictingRecordError } from '../../repositories/employee/types/errors';

const checkInterval = (from: Date, to: Date): boolean => (
  differenceInHours(from, new Date()) >= -24 && differenceInMinutes(to, from) > 15
);

const timetableCreateSchema = z.object({
  employeeId: z.string().uuid().trim(),
  from: z.string().datetime().transform((val) => new Date(val)),
  to: z.string().datetime().transform((val) => new Date(val)),
  type: z.enum([
    'Working',
    'Holiday',
    'BusinessTrip',
    'MedicalCheckup',
    'UnpaidLeave',
    'ParentalLeave',
  ]),
}).refine((schema) => checkInterval(schema.from, schema.to));

const timetableCreate = async (req: Request, res: Response) => {
  try {
    const requestData = timetableCreateSchema.parse({ ...req.params, ...req.body });
    const request = await timetable.create(requestData);
    if (request.isErr) {
      if (request.error instanceof ConflictingRecordError) {
        res.status(400).send({ error: request.error });
      } else {
        res.status(404).send({ error: request.error });
      }
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

export default timetableCreate;
