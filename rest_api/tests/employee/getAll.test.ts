import request from 'supertest';
import {
  it, expect, describe, vi,
} from 'vitest';
import app from '../../src';
import prisma from '../../src/repositories/client';

vi.mock('../../src/repositories/client');

describe('GET /employee', () => {
  it('should return empty employee list', async () => {
    const response = await request(app).get('/employee').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: [],
      }),
    );
  });

  it('should return employee list', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    await prisma.employee.create({
      data: employee,
    });

    const response = await request(app).get('/employee').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: [expect.objectContaining(employee)],
      }),
    );
  });

  it('should return employee list sorted alphabetically by their surname and name', async () => {
    const employee1 = {
      name: 'John',
      surname: 'Doe',
    };

    const employee2 = {
      name: 'Jane',
      surname: 'Doe',
    };

    const employee3 = {
      name: 'John',
      surname: 'Smith',
    };

    const { create } = prisma.employee;

    await Promise.all([
      create({ data: employee1 }),
      create({ data: employee2 }),
      create({ data: employee3 }),
    ]);

    const response = await request(app).get('/employee').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining(employee2),
          expect.objectContaining(employee1),
          expect.objectContaining(employee3),
        ],
      }),
    );
  });

  it('should NOT contain timetable data', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    await prisma.employee.create({
      data: employee,
    });

    const response = await request(app).get('/employee').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: [expect.not.objectContaining({ timetable: expect.anything() })],
      }),
    );
  });
});
