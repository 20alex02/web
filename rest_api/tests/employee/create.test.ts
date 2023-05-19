import request from 'supertest';
import {
  it, expect, describe, vi,
} from 'vitest';
import app from '../../src';
import prisma from '../../src/repositories/client';

vi.mock('../../src/repositories/client');

describe('POST /employee', () => {
  it('should create an employee', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    await request(app).post('/employee').send(employee).expect(201);

    const dbEmployees = await prisma.employee.findMany();

    expect(dbEmployees).toHaveLength(1);
    expect(dbEmployees[0]).toEqual(expect.objectContaining(employee));
  });

  it('should return a correct body', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const response = await request(app)
      .post('/employee')
      .send(employee)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining(employee),
      }),
    );
  });

  it('should fail on invalid body', async () => {
    const employee = {
      name: 'John',
    };

    const response = await request(app)
      .post('/employee')
      .send(employee)
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.anything(),
      }),
    );
  });
});
