import request from 'supertest';
import {
  it, expect, describe, vi,
} from 'vitest';
import app from '../../../src';
import prisma from '../../../src/repositories/client';

vi.mock('../../../src/repositories/client');

describe('DELETE /employee/:id/timetable/:id', () => {
  it('should delete a timetable entry', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const initialType = 'Working';
    await prisma.attendanceType.create({
      data: {
        type: initialType,
      },
    });

    const from = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
    const to = new Date().toISOString();

    const timetableEntry = {
      from,
      to,
      type: initialType,
    };

    const createdTimetableEntry = await prisma.attendance.create({
      data: {
        ...timetableEntry,
        employeeId: createdEmployee.id,
      },
    });

    await request(app)
      .delete(
        `/employee/${createdEmployee.id}/timetable/${createdTimetableEntry.id}`,
      )
      .expect(200);

    //! Here we cannot use the prisma client to query the database
    //! prisma middlewares might be interfering with the query (such as soft delete)
    const result = await request(app)
      .get(`/employee/${createdEmployee.id}`)
      .expect(200);

    expect(result.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          timetable: expect.not.arrayContaining([
            expect.objectContaining({
              id: createdTimetableEntry.id,
            }),
          ]),
        }),
      }),
    );
  });

  it('should return fail if the employee and/or entry does not exist', async () => {
    const sumRandoId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

    const result = await request(app)
      .delete(`/employee/${sumRandoId}/timetable/${sumRandoId}`)
      .expect(404);

    expect(result.body).toEqual(
      expect.objectContaining({
        error: expect.anything(),
      }),
    );
  });
});
