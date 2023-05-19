import { Result } from '@badrap/result';
import client from '../../client';
import { genericError } from '../../types';
import { checkEmployee, checkTimetableRecord } from '../common';
import type { TimetableDeleteData } from '../types/data';
import type { TimetableDeleteResult } from '../types/return';

/**
 * Create a repository call that "deletes" the timetable record
 * (sets the `deletedAt` property to the current date).
 *
 * Timetable record can only be deleted if:
 * - specified employee exists and is not deleted
 * - the specified timetable record exists and is not deleted
 * - the specified employee is the author of the timetable record
 *
 * Use the `checkEmployee` function from `../common` file to check
 * if the employee exists and was not deleted.
 *
 * Use the `checkTimetableRecord` function from `../common` file to check
 * if the timetable record exists and was not deleted, and that the
 * specified employee is the author of the timetable record
 *
 * @param data object containing the id of the employee and the id of a
 *             timetable record
 * @returns - On success: The "deleted" timetable record, together with its
 *            related employee
 *          - On failure: Either a special error
 *                        (handled by `checkEmployee` and
 *                        `checkTimetableRecord` functions),
 *                        or a generic error.
 */
const deleteTimetableRecord = async (
  data: TimetableDeleteData,
): TimetableDeleteResult => {
  try {
    return await client.$transaction(async (tx) => {
      const employeeCheck = await checkEmployee({ id: data.employeeId }, tx);

      if (employeeCheck.isErr) {
        return Result.err(employeeCheck.error);
      }

      const timetableCheck = await checkTimetableRecord(
        { id: data.id, employeeId: data.employeeId },
        tx,
      );

      if (timetableCheck.isErr) {
        return Result.err(timetableCheck.error);
      }
      const deleted = await tx.attendance.update({
        where: {
          id: data.id,
        },
        data: {
          deletedAt: new Date(),
        },
        include: {
          employee: true,
        },
      });
      return Result.ok(deleted);
    });
  } catch (e) {
    return genericError;
  }
};

export default deleteTimetableRecord;
