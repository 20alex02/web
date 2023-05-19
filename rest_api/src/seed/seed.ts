import client from '../repositories/client';
import data from './data';

const seed = async () => {
  console.log(`[${new Date().toISOString()}] Seed started`);
  await client.$transaction([
    ...data.map((employee) => (
      client.employee.create({
        data: {
          ...{ ...employee, timetable: undefined },
          timetable: {
            create: employee.timetable,
          },
        },
      })
    )),
  ]);
};

seed().then(() => {
  console.log(`[${new Date().toISOString()}] Seed succeeded`);
}).catch((e) => {
  console.log(`[${new Date().toISOString()}] Seed failed`);
  console.log(e);
}).finally(async () => {
  await client.$disconnect();
});
