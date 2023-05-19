import { Result } from '@badrap/result';
import client from '../../client';
import type { EmployeeDeleteData } from '../types/data';
import type { EmployeeDeleteResult } from '../types/return';
import { genericError } from '../../types';
import { checkEmployee } from '../common';

/**
 * Create a repository call that deletes the employee and their non-deleted
 * timetable records (the time of deletion for all records must equal),
 * ordered by their `from` property.
 *
 * Use the `checkEmployee` function from `../common` file to check
 * if the employee exists and was not deleted.
 *
 * @param data object containing an id (string)
 * @returns - On success: employee and their timetable records that were
 *                        deleted by this operation (do not include
 *                        previously deleted records), ordered by their `from`
 *                        property in the descending order.
 *          - On failure: Either a special error
 *                        (handled by `checkEmployee` function), or a
 *                        generic error
 */
const deleteEmployee = async (
  data: EmployeeDeleteData,
): EmployeeDeleteResult => {
  try {
    return await client.$transaction(async (tx) => {
      const employeeCheck = await checkEmployee({ id: data.id }, tx);

      if (employeeCheck.isErr) {
        return Result.err(employeeCheck.error);
      }

      const deletedAt = new Date();
      /*
        Finish the query - set deletedAt property where applicable (and
        only to records that have not been deleted yet; only those timetable
        records should be retrieved)
      */
      const deleted = await tx.employee.update({
        where: {
          id: data.id,
        },
        data: {
          deletedAt,
          timetable: {
            updateMany: {
              where: {
                deletedAt: null,
              },
              data: {
                deletedAt,
              },
            },
          },
        },
        include: {
          timetable: true,
        },
      });
      return Result.ok(deleted);
    });
  } catch (e) {
    return genericError;
  }
};

export default deleteEmployee;
