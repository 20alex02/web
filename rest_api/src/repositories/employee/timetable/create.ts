import { Result } from '@badrap/result';
import client from '../../client';
import { checkConflictingTimetableRecords, checkEmployee } from '../common';
import { genericError } from '../../types';
import type { TimetableCreateData } from '../types/data';
import type { TimetableCreateResult } from '../types/return';

/**
 * Create a repository call that creates a timetable record.
 *
 * Timetable record can only be created if:
 * - specified employee exists and is not deleted
 * - there are no clashing timetable records from this employee
 *
 * Use the `checkEmployee` function from `../common` file to check
 * if the employee exists and was not deleted.
 *
 * Use the `checkConflictingTimetableRecords` function from `../common`
 * file to check whether there are timetable scheduling conflicts.
 *
 * @param data object containing the id of the employee, the interval
 *             of the new timetable record and the type of the record
 * @returns - On success: New timetable record, together with its
 *            related employee
 *          - On failure: Either a special error
 *                        (handled by `checkEmployee` and
 *                        `checkConflictingTimetableRecords` functions),
 *                        or a generic error.
 */
const create = async (data: TimetableCreateData): TimetableCreateResult => {
  try {
    return await client.$transaction(async (tx) => {
      const employeeCheck = await checkEmployee({ id: data.employeeId }, tx);

      if (employeeCheck.isErr) {
        return Result.err(employeeCheck.error);
      }

      const conflictsCheck = await checkConflictingTimetableRecords(
        {
          employeeId: data.employeeId,
          from: data.from,
          to: data.to,
        },
        tx,
      );

      if (conflictsCheck.isErr) {
        return Result.err(conflictsCheck.error);
      }

      const timetable = await tx.attendance.create({
        data: {
          ...data,
        },
        include: {
          employee: true,
        },
      });
      return Result.ok(timetable);
    });
  } catch (e) {
    return genericError;
  }
};

export default create;
