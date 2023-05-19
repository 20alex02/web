/*
  This file contains common functionality shared between different repository
  calls. It exists to reduce redundant code. within repository calls.
  Repeating parts of transactions were identified
  and extracted to be defined here.
*/
import { Result } from '@badrap/result';
import type { PrismaTransactionHandle } from '../types';
import type {
  CheckConflictingTimetableRecordsData,
  CheckEmployeeData,
  CheckTimetableRecordData,
} from './types/data';
import {
  ConflictingRecordError,
  DeletedRecordError,
  NonexistentRecordError,
  WrongOwnershipError,
} from './types/errors';
import type { TransactionCheckOperationResult } from './types/return';

/*

  NOTE: all these common functionalities don't require throwing an error.

  Not throwing error does not trigger the transaction rollback.
  All of these common functionalities are "read" heavy,
  meaning we don't actually need to throw an error, we can simply terminate
  the transaction succesfully even if we did not complete the full transaction.
  (Like creating, updating, or deleting an employee, as
  the only modifying functionality is after the common functionality "checks"
  business logic conditions)

  IF these common functions were modifying the data, then
  returning a `Result` would not be enough - you would need to actually
  **throw** an error for the transaction to roll back.

*/

/**
 * Write a function which checks if the employee exists and is not deleted.
 *
 * Use this function within transactions in repository calls
 * to reduce repeating code. The `Ok` return value of this function is
 * never used, it only indicates that the operation was successful.
 *
 * Do not use try-catch in this function, as it is meant to be used within
 * a transaction and throwing needs to result in transaction rollback.
 *
 * Cases for an error:
 * - NonexistentRecordError('The specified employee does not exist!')
 * - DeletedRecordError('The specified employee has already been deleted!')
 *
 * Usage in code (within a transaction):
 *
 * ```ts
 * // employeeId is the employee id you'll need to instanciate the object
 * // tx is the transaction handle
 * const employeeCheck = await checkEmployee({ employeeId }, tx);
 *
 * // We don't care for the return result if the operation is successful.
 * // If the operation is not succesful, return the error from this call
 * if (employeeCheck.isErr) {
 *   return Result.err(employeeCheck.error);
 * }
 * ```
 *
 * @param data - object containing id of the employee
 * @param tx transaction handle
 * @throws on Prisma errors
 * @returns - `Result.ok({})` on success
 *          - `Result.err(_)` on failure (_ == aforementioned errors ^)
 */
export const checkEmployee = async (
  data: CheckEmployeeData,
  tx: PrismaTransactionHandle,
): TransactionCheckOperationResult => {
  const employee = await tx.employee.findUnique({
    where: {
      id: data.id,
    },
  });
  if (employee == null) {
    return Result.err(new NonexistentRecordError('The specified employee does not exist!'));
  }
  if (employee.deletedAt != null) {
    return Result.err(new DeletedRecordError('The specified employee has already been deleted!'));
  }
  return Result.ok({});
};

/**
 * Write a function which checks if the timetable record exists
 * and is not deleted. Also checks if the timetable record belongs to the user.
 *
 * Use this function within transactions in repository
 * calls to reduce repeating code. The `Ok` return value of this function is
 * never used, it only indicates that the operation was succesful.
 *
 * Do not use try-catch in this function, as it is meant to be used within
 * a transaction and throwing needs to result in transaction rollback.
 *
 * Cases for an error:
 * - NonexistentRecordError('The specified timetable record does not exist!')
 * - DeletedRecordError('The specified timetable has already been deleted!')
 * - WrongOwnershipError(
 * 'The specified timetable record does not belong to the specified user!')
 *
 * Usage in code (within a transaction):
 *
 * ```ts
 * // id is the timetable id you'll need to instanciate the object
 * // employeeId is the employee id you'll need to instanciate the object
 * // tx is the transaction handle
 * const timetableCheck = await checkTimetableRecord({ id, employeeId }, tx);
 *
 * // We don't care for the return result if the operation is successful.
 * // If the operation is not succesful, return the error from this call
 * if (timetableCheck.isErr) {
 *   return Result.err(timetableCheck.error);
 * }
 * ```
 *
 * @param data - object containing id of the timetable record and an id of
 *               the employee
 * @param tx transaction handle
 * @throws on Prisma errors
 * @returns - `Result.ok({})` on success
 *          - `Result.err(_)` on failure (_ == aforementioned errors ^)
 */
export const checkTimetableRecord = async (
  data: CheckTimetableRecordData,
  tx: PrismaTransactionHandle,
): TransactionCheckOperationResult => {
  const timetable = await tx.attendance.findUnique({
    where: {
      id: data.id,
    },
  });
  if (timetable == null) {
    return Result.err(new NonexistentRecordError('The specified timetable record does not exist!'));
  }
  if (timetable.deletedAt != null) {
    return Result.err(new DeletedRecordError('The specified timetable has already been deleted!'));
  }
  if (timetable.employeeId !== data.employeeId) {
    return Result.err(new WrongOwnershipError('The specified timetable record does not belong to the specified user!'));
  }
  return Result.ok({});
};

/**
 * Finish the function which checks whether there are conflicting timetable
 * records. Returns a ConflictingRecordError if there are.
 *
 * Use this function within transactions in repository
 * calls to reduce repeating code. The `Ok` return value of this function is
 * never used, it only indicates that the operation was succesful.
 *
 * This function also serves as the ideological template for you to help to
 * finish the two functions defined in this file.
 *
 * Usage in code (within a transaction):
 *
 * ```ts
 * // employeeId is the employee id you'll need to instanciate the object
 * // interval is an object containing `from` and `to` dates
 * // tx is the transaction handle
 * const conflictsCheck = await checkConflictingTimetableRecords(
 *   { employeeId, interval },
 *   tx,
 * );
 *
 * // We don't care for the return result if the operation is successful.
 * // If the operation is not succesful, return the error from this call
 * if (conflictsCheck.isErr) {
 *   return Result.err(conflictsCheck.error);
 * }
 * ```
 *
 * @param data object containing the `id` of the employee and the time interval
 *             we want to check the conflicts for
 * @param tx transaction handle
 * @throws on Prisma errors
 * @returns - `Result.ok({})` on success
 *          - `Result.err(
 * ConflictingRecordError(
 * 'Cannot create a timetable record due to time conflict with another record'
 * ))` on failure
 */
export const checkConflictingTimetableRecords = async (
  data: CheckConflictingTimetableRecordsData,
  tx: PrismaTransactionHandle,
): TransactionCheckOperationResult => {
  const checkExisting = data.timetableId !== undefined ? {
    AND: {
      NOT: {
        id: data.timetableId,
      },
    },
  } : {};

  /**
   * Write a search query that you will need to use in create and update
   * repository calls to check if there are clashing timetable records already
   * in the database.
   *
   * Remember, the interval of the timetable records is half closed - `from`
   * belongs to the interval, `to` does not. This changes whether we use
   * `gte`/`lte` or `gt`/`lt`
   *
   * The interval:
   * ```
   * <from, to)
   * ```
   */
  const conflictingRecords = await tx.attendance.findMany({
    where: {
      employeeId: data.employeeId,
      deletedAt: null,
      NOT: {
        to: {
          lte: data.from,
        },
        from: {
          gte: data.to,
        },
        /*
          we want to filter out situations when another timetable record
          ends *sooner* (mind the interval inclusion) than the one we wish to
          create/update starts; or when another timetable record
          starts *later* (mind the interval inclusion) than
          the one we wish to create/update finishes.
        */
      },
      ...checkExisting,
    },
  });

  /*
    if the query returned some data, it means that
    there is a time scheduling conflict.
  */
  if (conflictingRecords.length !== 0) {
    return Result.err(
      new ConflictingRecordError('Cannot create / update a timetable record due to time conflict with another record.'),
    );
  }

  return Result.ok({});
};
