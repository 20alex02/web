import request from 'supertest';
import {
  it, expect, describe, vi,
} from 'vitest';
import app from '../../../src';
import prisma from '../../../src/repositories/client';

vi.mock('../../../src/repositories/client');

describe('PATCH /employee/:id/timetable/:id', () => {
  it('should update a timetable entry', async () => {
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
    const updatedType = 'Holiday';
    await prisma.attendanceType.create({
      data: {
        type: updatedType,
      },
    });

    const from = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
    const to = new Date().toISOString();

    const timetableEntry1 = {
      from,
      to,
      type: initialType,
    };

    const createdTimetableEntry = await prisma.attendance.create({
      data: {
        ...timetableEntry1,
        employeeId: createdEmployee.id,
      },
    });

    const updatedTimetableEntry = {
      ...timetableEntry1,
      type: updatedType,
    };

    await request(app)
      .patch(
        `/employee/${createdEmployee.id}/timetable/${createdTimetableEntry.id}`,
      )
      .send(updatedTimetableEntry)
      .expect(200);

    const updatedTimetableEntryFromDb = await prisma.attendance.findUnique({
      where: {
        id: createdTimetableEntry.id,
      },
    });

    const isoUpdatedTimetableEntryFromDb = {
      ...updatedTimetableEntryFromDb,
      from: updatedTimetableEntryFromDb?.from.toISOString(),
      to: updatedTimetableEntryFromDb?.to.toISOString(),
    };

    expect(isoUpdatedTimetableEntryFromDb).toEqual(
      expect.objectContaining(updatedTimetableEntry),
    );
  });

  it('should fail on conflicting timetable entries', async () => {
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

    const createdTimetableEntry = await prisma.attendance.create({
      data: {
        ...timetableEntry,
        employeeId: createdEmployee.id,
      },
    });

    await prisma.attendance.create({
      data: {
        from: initial,
        to: twentyMinutesLater,
        type,
        employeeId: createdEmployee.id,
      },
    });

    await prisma.attendance.create({
      data: {
        from: fortyMinutesLater,
        to: sixtyMinutesLater,
        type,
        employeeId: createdEmployee.id,
      },
    });

    {
      // Overlapping from
      const updatedTimetableEntry = {
        from: initial,
        to: fortyMinutesLater,
        type,
      };

      await request(app)
        .patch(
          `/employee/${createdEmployee.id}/timetable/${createdTimetableEntry.id}`,
        )
        .send(updatedTimetableEntry)
        .expect(400);
    }

    {
      // Overlapping to
      const updatedTimetableEntry = {
        from: twentyMinutesLater,
        to: sixtyMinutesLater,
        type,
      };

      await request(app)
        .patch(
          `/employee/${createdEmployee.id}/timetable/${createdTimetableEntry.id}`,
        )
        .send(updatedTimetableEntry)
        .expect(400);
    }

    {
      // Overlapping from and to
      const updatedTimetableEntry = {
        from: initial,
        to: sixtyMinutesLater,
        type,
      };

      await request(app)
        .patch(
          `/employee/${createdEmployee.id}/timetable/${createdTimetableEntry.id}`,
        )
        .send(updatedTimetableEntry)
        .expect(400);
    }

    // Overlapping from and to (identical)
    await request(app)
      .patch(
        `/employee/${createdEmployee.id}/timetable/${createdTimetableEntry.id}`,
      )
      .send(timetableEntry)
      .expect(200);
  });

  it('should fail if the employee and/or entry does not exist', async () => {
    const sumRandoId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

    const from = new Date().toISOString();
    vi.advanceTimersByTime(1000 * 60 * 60 * 2); // Two hours
    const to = new Date().toISOString();

    const timetableEntry = {
      from,
      to,
      type: 'Working',
    };

    const result = await request(app)
      .patch(`/employee/${sumRandoId}/timetable/${sumRandoId}`)
      .send(timetableEntry)
      .expect(404);

    expect(result.body).toEqual(
      expect.objectContaining({
        error: expect.anything(),
      }),
    );
  });
});
