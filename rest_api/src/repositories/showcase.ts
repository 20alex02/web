import type { Result } from '@badrap/result';
import type { Attendance, Employee } from '@prisma/client';
import client from './client';
import employeeRepository from './employee';

/*
  This is a showcase of "manual" testing.
  This function also saves a lot of repetetive code
*/
const callRepository = <R, S extends Error>(
  header: string,
  shouldSucceed: boolean,
  repositoryReturn: Result<R, S>,
  optionalBranch?: (input: Result<R, S>) => boolean,
): boolean => {
  if (shouldSucceed) {
    console.log(`---[SHOULD SUCCEED] ${header}---`);
    if (repositoryReturn.isErr) {
      console.error(repositoryReturn.error);
      console.error('Call should have succeeded but failed. Aborting.');
      return false;
    }
    console.log(repositoryReturn.value);
  } else {
    console.log(`---[SHOULD FAIL] ${header}---`);
    if (repositoryReturn.isOk) {
      console.error('Call should have failed but succeeded. Aborting.');
      return false;
    }
    console.log(repositoryReturn.error);
  }

  if (optionalBranch) {
    return optionalBranch(repositoryReturn);
  }

  console.log('------\n');
  return true;
};

const showcase = async () => {
  const result = callRepository(
    'Find all non-deleted employees',
    true,
    await employeeRepository.read.all(),
    (input) => {
      if (input.isOk && Array.isArray(input.value)) {
        if (input.value.length !== 2) {
          console.error('This type should return 2 employees');
          return false;
        }
        console.log('Employees in detail:');
        input.value.forEach((employee) => console.log(employee));
        console.log('------\n');
        return true;
      }
      return false;
    },
  ) && callRepository(
    'Create a correct timetable record',
    true,
    await employeeRepository.timetable.create(
      {
        employeeId: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
        from: new Date('2023-03-08T08:00:00.000Z'),
        to: new Date('2023-03-08T16:00:00.000Z'),
        type: 'Working',
      },
    ),
  ) && callRepository(
    'Create an incorrect timetable record - `from` set within already existing timetable record',
    false,
    await employeeRepository.timetable.create(
      {
        employeeId: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
        from: new Date('2023-03-08T15:45:00.000Z'),
        to: new Date('2023-03-08T16:30:00.000Z'),
        type: 'MedicalCheckup',
      },
    ),
  ) && callRepository(
    'Create an incorrect timetable record - `to` set within already existing timetable record',
    false,
    await employeeRepository.timetable.create(
      {
        employeeId: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
        from: new Date('2023-03-08T06:00:00.000Z'),
        to: new Date('2023-03-08T08:30:00.000Z'),
        type: 'MedicalCheckup',
      },
    ),
  ) && callRepository(
    'Create an incorrect timetable record - `from` and `to` set within already existing timetable record',
    false,
    await employeeRepository.timetable.create(
      {
        employeeId: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
        from: new Date('2023-03-08T10:00:00.000Z'),
        to: new Date('2023-03-08T14:30:00.000Z'),
        type: 'MedicalCheckup',
      },
    ),
  ) && callRepository(
    'Create an incorrect timetable record - `from` and `to` encapsulate an existing timetable record',
    false,
    await employeeRepository.timetable.create(
      {
        employeeId: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
        from: new Date('2023-03-08T06:00:00.000Z'),
        to: new Date('2023-03-08T16:45:00.000Z'),
        type: 'MedicalCheckup',
      },
    ),
  ) && callRepository(
    'Create ANOTHER correct timetable record',
    true,
    await employeeRepository.timetable.create(
      {
        employeeId: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
        from: new Date('2023-03-08T16:00:00.000Z'),
        to: new Date('2023-03-08T18:00:00.000Z'),
        type: 'BusinessTrip',
      },
    ),
  ) && callRepository(
    'Create ANOTHER correct timetable record: on the verge of March.',
    true,
    await employeeRepository.timetable.create(
      {
        employeeId: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
        from: new Date('2023-02-28T08:00:00.000Z'),
        to: new Date('2023-02-28T16:00:00.000Z'),
        type: 'Working',
      },
    ),
  ) && callRepository(
    'Find employees that have worked more than or equal to 16 hours in the last month (this call only works during April)',
    true,
    await employeeRepository.read.all({ hours: 16 }),
    (input) => {
      if (input.isOk && Array.isArray(input.value)) {
        if (input.value.length !== 1) {
          console.error('This type should return 1 employee');
          return false;
        }

        const cast = (
          input.value[0] as (Employee & { timetable: Attendance[] })
        );

        if (cast.timetable.length !== 5) {
          console.error(`Incorrect number of timetable records retrieved. Expected 5 found ${cast.timetable.length}`);
          return false;
        }

        console.log('Employee in detail:');
        console.log(cast);
        console.log('------\n');
        return true;
      }
      return false;
    },
  );
  console.log('\n\nSUCCESS!!! Database showcase was executed successfully.');
  return result;
};

showcase().catch((e) => { console.error(e); }).finally(async () => {
  await client.$disconnect();
});
