import request from 'supertest';
import {
  it, expect, describe, vi,
} from 'vitest';
import app from '../../src';
import prisma from '../../src/repositories/client';

vi.mock('../../src/repositories/client');

describe('PATCH /employee/:id', () => {
  it('should update one field of an employee', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const updatedEmployee = {
      name: 'Jane',
    };

    await request(app)
      .patch(`/employee/${createdEmployee.id}`)
      .send(updatedEmployee)
      .expect(200);

    const dbEmployee = await prisma.employee.findFirst({
      where: {
        id: createdEmployee.id,
      },
    });

    expect(dbEmployee).toEqual(
      expect.objectContaining({
        ...employee,
        ...updatedEmployee,
      }),
    );
  });

  it('should update multiple fields of an employee', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const updatedEmployee = {
      name: 'Jane',
      surname: 'Smith',
    };

    await request(app)
      .patch(`/employee/${createdEmployee.id}`)
      .send(updatedEmployee)
      .expect(200);

    const dbEmployee = await prisma.employee.findFirst({
      where: {
        id: createdEmployee.id,
      },
    });

    expect(dbEmployee).toEqual(
      expect.objectContaining({
        ...employee,
        ...updatedEmployee,
      }),
    );
  });

  it('should return a correct body', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const updatedEmployee = {
      name: 'Jane',
    };

    const response = await request(app)
      .patch(`/employee/${createdEmployee.id}`)
      .send(updatedEmployee)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining(updatedEmployee),
      }),
    );
  });

  it('should fail on invalid body', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    const updatedEmployee = {
      name: 'Jane',
      surname: { randomStuff: 'Smith' },
    };

    const response = await request(app)
      .patch(`/employee/${createdEmployee.id}`)
      .send(updatedEmployee)
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.anything(),
      }),
    );
  });
});
