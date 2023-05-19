import type { Request, Response } from 'express';
import { z } from 'zod';
import { differenceInMinutes } from 'date-fns';
import employee from '../../repositories/employee';

const employeeGetSchema = z.object({
  id: z.string().uuid().trim(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const employeeGet = async (req: Request, res: Response) => {
  try {
    const requestData = employeeGetSchema.parse({ ...req.params, ...req.query });
    const request = await employee.read.one(requestData);
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

const employeeGetAllSchema = z.object({
  hours: z.number().positive(),
  interval: z.object({
    from: z.string().datetime().transform((val) => new Date(val)),
    to: z.string().datetime().transform((val) => new Date(val)),
  }).optional(),
}).refine((schema) => (
  !schema.interval || differenceInMinutes(schema.interval.to, schema.interval.from) >= 0
));

export const employeeGetAll = async (req: Request, res: Response) => {
  try {
    const requestData = Object.keys(req.query).length === 0
      ? undefined : employeeGetAllSchema.parse(req.query);
    const request = await employee.read.all(requestData);
    if (request.isErr) {
      res.status(404).send({ error: request.error });
    } else {
      res.status(200).send({ data: request.unwrap().map(({ timetable, ...rest }) => rest) });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error });
    } else {
      res.status(500).send({ error });
    }
  }
};
