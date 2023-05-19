import request from 'supertest';
import {
  it, describe, vi,
} from 'vitest';
import app from '../../src';
import prisma from '../../src/repositories/client';

vi.mock('../../src/repositories/client');

describe('DELETE /employee/:id', () => {
  it('should fail if employee does not exist', async () => {
    const sumRandoId = '02e451f0-eae7-420f-afc5-c09870a78e09';

    await request(app).delete(`/employee/${sumRandoId}`).expect(404);
  });

  it('should delete an employee', async () => {
    const employee = {
      name: 'John',
      surname: 'Doe',
    };

    const createdEmployee = await prisma.employee.create({
      data: employee,
    });

    await request(app).delete(`/employee/${createdEmployee.id}`).expect(200);

    //! Here we cannot use the prisma client to query the database
    //! prisma middlewares might be interfering with the query (such as soft delete)
    await request(app).get(`/employee/${createdEmployee.id}`).expect(404);
  });
});
