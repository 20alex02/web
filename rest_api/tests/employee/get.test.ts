import request from 'supertest';
import {
  it, expect, describe, vi,
} from 'vitest';
import app from '../../src';
import prisma from '../../src/repositories/client';

vi.mock('../../src/repositories/client');

describe('GET /employee/:id', () => {
  it('should return an employee', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const response = await request(app)
      .get(`/employee/${createdEmployee.id}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining(employee),
      }),
    );
  });

  it('should return an error if employee does not exist', async () => {
    const sumRandoId = 'c11bef07-08b5-49cd-a4ef-c7e1005f9b6c';
    const response = await request(app)
      .get(`/employee/${sumRandoId}`)
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.anything(),
      }),
    );
  });

  it('should return an employee with sorted timetable data', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const type = 'Holiday';
    await prisma.attendanceType.create({
      data: {
        type,
      },
    });

    const timetableEntry1 = {
      from: '2020-01-01T00:00:00.000Z',
      to: '2020-01-01T01:00:00.000Z',
      type,
    };

    const timetableEntry2 = {
      from: '2021-01-01T00:00:00.000Z',
      to: '2021-01-01T01:00:00.000Z',
      type,
    };

    const timetableEntry3 = {
      from: '2020-01-01T01:00:00.000Z',
      to: '2020-01-01T02:00:00.000Z',
      type,
    };

    const createdEmployee = await prisma.employee.create({
      data: {
        ...employee,
        timetable: {
          create: [timetableEntry1, timetableEntry2, timetableEntry3],
        },
      },
    });

    const response = await request(app)
      .get(`/employee/${createdEmployee.id}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          timetable: [
            expect.objectContaining(timetableEntry2),
            expect.objectContaining(timetableEntry3),
            expect.objectContaining(timetableEntry1),
          ],
        }),
      }),
    );
  });
});
