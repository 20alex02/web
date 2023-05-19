import { Result } from '@badrap/result';
import client from '../../client';
import { genericError } from '../../types';
import type { TimetableUpdateData } from '../types/data';
import type { TimetableUpdateResult } from '../types/return';
import {
  checkConflictingTimetableRecords,
  checkEmployee,
  checkTimetableRecord,
} from '../common';

/**
 * Create a repository call that updates an already existing timetable record.
 *
 * Timetable record can only be updated if:
 * - specified employee exists and is not deleted
 * - the specified timetable record exists and is not deleted
 * - the specified employee is the author of the timetable record
 * - there are no clashing timetable records from this employee with the
 *   new interval
 *
 * Use the `checkEmployee` function from `../common` file to check
 * if the employee exists and was not deleted.
 *
 * Use the `checkTimetableRecord` function from `../common` file to check
 * if the timetable record exists and was not deleted, and that the
 * specified employee is the author of the timetable record
 *
 * Use the `checkConflictingTimetableRecords` function from `../common`
 * file to check whether there are timetable scheduling conflicts.
 *
 * @param data object containing the id of the employee, the id of a
 *             timetable record, (potentially new) interval, and optionally
 *             the new type of the timetable record
 * @returns - On success: The updated timetable record, together with its
 *            related employee
 *          - On failure: Either a special error
 *                        (handled by `checkEmployee`, `checkTimetableRecord`,
 *                        and `checkConflictingTimetableRecords` functions),
 *                        or a generic error.
 */
const update = async (data: TimetableUpdateData): TimetableUpdateResult => {
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

      const conflictsCheck = await checkConflictingTimetableRecords(
        {
          employeeId: data.employeeId,
          from: data.from,
          to: data.to,
          timetableId: data.id,
        },
        tx,
      );

      if (conflictsCheck.isErr) {
        return Result.err(conflictsCheck.error);
      }
      const { id, employeeId, ...dataToUpdate } = data;
      const updated = await tx.attendance.update({
        where: {
          id: data.id,
        },
        data: dataToUpdate,
        include: {
          employee: true,
        },
      });
      return Result.ok(updated);
    });
  } catch (e) {
    console.log(e);
    return genericError;
  }
};

export default update;
