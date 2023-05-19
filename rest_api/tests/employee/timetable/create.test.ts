/* eslint-disable @typescript-eslint/no-shadow */
import request from 'supertest';
import {
  it, expect, describe, vi,
} from 'vitest';
import app from '../../../src';
import prisma from '../../../src/repositories/client';

vi.mock('../../../src/repositories/client');

describe('POST /employee/:id/timetable', () => {
  it('should create a timetable entry', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const type = 'Working';
    await prisma.attendanceType.create({
      data: {
        type,
      },
    });

    const from = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
    const to = new Date().toISOString();

    const timetableEntry1 = {
      from,
      to,
      type,
    };

    await request(app)
      .post(`/employee/${createdEmployee.id}/timetable`)
      .send(timetableEntry1).expect(201);
  });

  it('should return a correct body', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };
    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const type = 'Holiday';
    await prisma.attendanceType.create({
      data: {
        type,
      },
    });

    const from = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
    const to = new Date().toISOString();

    const timetableEntry1 = {
      from,
      to,
      type,
    };

    const response = await request(app)
      .post(`/employee/${createdEmployee.id}/timetable`)
      .send(timetableEntry1)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining(timetableEntry1),
      }),
    );
  });

  it('should return an error if employee does not exist', async () => {
    const sumRandoId = 'c11bef07-08b5-49cd-a4ef-c7e1005f9b6c';

    const type = 'Working';

    const from = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
    const to = new Date().toISOString();

    const timetableEntry = {
      from,
      to,
      type,
    };

    const response = await request(app)
      .post(`/employee/${sumRandoId}/timetable`)
      .send(timetableEntry)
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.anything(),
      }),
    );
  });

  it('should fail if the body is invalid', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const type = 'Working';
    await prisma.attendanceType.create({
      data: {
        type,
      },
    });

    {
      // Too short of a time
      const from = new Date().toISOString();
      const to = new Date().toISOString();

      const timetableEntry = {
        from,
        to,
        type,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    {
      // From is after to
      const to = new Date().toISOString();
      vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
      const from = new Date().toISOString();

      const timetableEntry = {
        from,
        to,
        type,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    {
      // Invalid dates
      const from = 'not a date';
      const to = 69;

      const timetableEntry = {
        from,
        to,
        type,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    {
      // Missing fields
      const from = new Date().toISOString();
      vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
      const to = new Date().toISOString();

      const timetableEntry = {
        from,
        to,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    {
      // Invalid type

      const from = new Date().toISOString();
      vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
      const to = new Date().toISOString();

      const timetableEntry = {
        from,
        to,
        type: '💀',
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    {
      // More than 24 hours in the past

      const from = new Date().toISOString();
      vi.advanceTimersByTime(1000 * 60 * 60 * 25); // 25 hours
      const to = new Date().toISOString();

      const timetableEntry = {
        from,
        to,
        type,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }
  });

  it('should fail on conflicting entries', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const type = 'Working';
    await prisma.attendanceType.create({
      data: {
        type,
      },
    });

    const initial = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 20); // 20 minutes
    const twentyMinutesLater = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 20); // 20 minutes
    const fortyMinutesLater = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 20); // 20 minutes
    const sixtyMinutesLater = new Date().toISOString();

    const timetableEntry = {
      from: twentyMinutesLater,
      to: fortyMinutesLater,
      type,
    };

    await prisma.attendance.create({
      data: {
        ...timetableEntry,
        employeeId: createdEmployee.id,
      },
    });

    {
      // Overlapping from
      const timetableEntry = {
        from: initial,
        to: fortyMinutesLater,
        type,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    {
      // Overlapping to
      const timetableEntry = {
        from: twentyMinutesLater,
        to: sixtyMinutesLater,
        type,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    {
      // Overlapping both
      const timetableEntry = {
        from: initial,
        to: sixtyMinutesLater,
        type,
      };

      await request(app)
        .post(`/employee/${createdEmployee.id}/timetable`)
        .send(timetableEntry)
        .expect(400);
    }

    // Duplicate
    await request(app)
      .post(`/employee/${createdEmployee.id}/timetable`)
      .send(timetableEntry)
      .expect(400);
  });
});
